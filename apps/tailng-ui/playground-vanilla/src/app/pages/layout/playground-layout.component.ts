import { DOCUMENT } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { filter, map, startWith } from 'rxjs';
import {
  TngBreadcrumb,
  TngBreadcrumbItem,
  TngBreadcrumbLink,
  TngBreadcrumbList,
  TngBreadcrumbSeparator,
} from '@tailng-ui/primitives';
import { TngAccordion, TngToggle } from '@tailng-ui/components';
import { TngIcon } from '@tailng-ui/icons';
import {
  createTheme,
  darkSemanticTokens,
  defaultThemePreset,
  resolveToken,
  toCssVars,
} from '@tailng-ui/theme';
import type { ThemeDefinition, ThemeSemanticTokens } from '@tailng-ui/theme';

const SEMANTIC_COLLECTIONS: readonly (keyof ThemeSemanticTokens)[] = [
  'background',
  'foreground',
  'border',
  'accent',
  'focus',
];

type TngPlaygroundItem = Readonly<{
  path: string;
  title: string;
  description: string;
  category: TngPlaygroundCategory;
}>;

type TngPlaygroundCategory =
  | 'navigation'
  | 'form'
  | 'layout'
  | 'overlay'
  | 'feedback'
  | 'utility'
  | 'other';

type TngCategoryGroup = Readonly<{
  category: TngPlaygroundCategory;
  label: string;
  items: readonly TngPlaygroundItem[];
}>;

const ALL_ITEMS: readonly TngPlaygroundItem[] = Object.freeze([
  { path: '/theme', title: 'Theme', description: 'Switch presets/modes and inspect semantic tokens.', category: 'other' },
  { path: '/button', title: 'Button', description: 'Test primitive behavior and owned component styles.', category: 'utility' },
  { path: '/copy', title: 'Copy', description: 'Copy payloads from direct text or DOM sources.', category: 'utility' },
  { path: '/code-block', title: 'Code Block', description: 'Adapter-ready syntax highlighting.', category: 'utility' },
  { path: '/accordion', title: 'Accordion', description: 'Expand/collapse panels.', category: 'layout' },
  { path: '/collapsible', title: 'Collapsible', description: 'Single disclosure panel.', category: 'layout' },
  { path: '/menu', title: 'Menu', description: 'Keyboard navigation for menuitem actions.', category: 'navigation' },
  { path: '/dropdown-menu', title: 'Dropdown Menu', description: 'Triggered menu panel.', category: 'navigation' },
  { path: '/avatar', title: 'Avatar', description: 'User identity display.', category: 'utility' },
  { path: '/card', title: 'Card', description: 'Validate card primitives.', category: 'layout' },
  { path: '/tag', title: 'Tag', description: 'Compact status/count labels.', category: 'utility' },
  { path: '/badge', title: 'Badge', description: 'Notification indicator.', category: 'utility' },
  { path: '/separator', title: 'Separator', description: 'Horizontal and vertical dividers.', category: 'layout' },
  { path: '/empty', title: 'Empty', description: 'Empty-state layout.', category: 'feedback' },
  { path: '/progress-bar', title: 'Progress Bar', description: 'Linear progress indicators.', category: 'feedback' },
  { path: '/progress-spinner', title: 'Progress Spinner', description: 'Circular loader.', category: 'feedback' },
  { path: '/skeleton', title: 'Skeleton', description: 'Loading placeholder blocks.', category: 'feedback' },
  { path: '/input', title: 'Input', description: 'Input primitive and wrapper.', category: 'form' },
  { path: '/label', title: 'Label', description: 'Accessible form labels.', category: 'form' },
  { path: '/input-otp', title: 'Input OTP', description: 'Segmented OTP entry.', category: 'form' },
  { path: '/radio', title: 'Radio', description: 'Grouped single-select behavior.', category: 'form' },
  { path: '/checkbox', title: 'Checkbox', description: 'Checked/unchecked/mixed tri-state.', category: 'form' },
  { path: '/textarea', title: 'Textarea', description: 'Multiline text input.', category: 'form' },
  { path: '/icons', title: 'Icon', description: 'Icon library with Lucide integration.', category: 'utility' },
  { path: '/charts-country-metrics', title: 'Charts', description: 'Country metrics with bar/line chart.', category: 'other' },
  { path: '/listbox', title: 'ListBox', description: 'CDK keyboard and multi-select.', category: 'form' },
  { path: '/dialog', title: 'Dialog', description: 'Backdrop, focus-trap.', category: 'overlay' },
  { path: '/popover', title: 'Popover', description: 'Trigger semantics and dismissal.', category: 'overlay' },
  { path: '/tooltip', title: 'Tooltip', description: 'Hover/focus helper text.', category: 'overlay' },
  { path: '/toast', title: 'Toast', description: 'Notification system.', category: 'feedback' },
  { path: '/context-menu', title: 'Context Menu', description: 'Context-triggered actions.', category: 'navigation' },
  { path: '/menubar', title: 'Menubar', description: 'Horizontal menu surface.', category: 'navigation' },
  { path: '/navigation-menu', title: 'Navigation Menu', description: 'Structured navigation list.', category: 'navigation' },
  { path: '/breadcrumb', title: 'Breadcrumb', description: 'Hierarchical navigation trail.', category: 'navigation' },
  { path: '/toolbar', title: 'Toolbar', description: 'Action controls grouping.', category: 'navigation' },
  { path: '/tabs', title: 'Tabs', description: 'Tabbed container surface.', category: 'navigation' },
  { path: '/stepper', title: 'Stepper', description: 'Multi-step flow surface.', category: 'layout' },
  { path: '/toggle-group', title: 'Toggle Group', description: 'Grouped toggle controls.', category: 'form' },
  { path: '/button-toggle', title: 'Button Toggle', description: 'Toggleable button options.', category: 'form' },
  { path: '/switch', title: 'Switch', description: 'Two-state on/off control.', category: 'form' },
  { path: '/toggle', title: 'Toggle', description: 'Icon-style pressed button.', category: 'form' },
  { path: '/slider', title: 'Slider', description: 'Range-based input.', category: 'form' },
  { path: '/chips', title: 'Chips', description: 'Compact item set.', category: 'form' },
  { path: '/combobox', title: 'Combobox', description: 'Text input with options popup.', category: 'form' },
  { path: '/select', title: 'Select', description: 'Single-choice dropdown.', category: 'form' },
  { path: '/autocomplete', title: 'Autocomplete', description: 'Dynamic suggestion list.', category: 'form' },
  { path: '/multiselect', title: 'Multiselect', description: 'Multiple-choice listbox.', category: 'form' },
  { path: '/grid', title: 'Grid', description: 'Keyboard-navigable grid.', category: 'layout' },
  { path: '/tree', title: 'Tree', description: 'Hierarchical expandable list.', category: 'layout' },
  { path: '/drawer', title: 'Drawer', description: 'Slide-in overlay panel.', category: 'layout' },
  { path: '/bottom-sheet', title: 'Bottom Sheet', description: 'Partial-height overlay sheet.', category: 'layout' },
]);

const CATEGORY_LABELS: Readonly<Record<TngPlaygroundCategory, string>> = {
  navigation: 'Navigation',
  form: 'Form',
  layout: 'Layout',
  overlay: 'Overlay',
  feedback: 'Feedback',
  utility: 'Utility',
  other: 'Other',
};

const CATEGORY_ORDER: readonly TngPlaygroundCategory[] = [
  'navigation',
  'form',
  'layout',
  'overlay',
  'feedback',
  'utility',
  'other',
];

function getUrlPath(url: string): string {
  return url.split('?')[0].split('#')[0];
}

@Component({
  selector: 'app-playground-layout',
  imports: [
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    TngAccordion,
    TngToggle,
    TngIcon,
    TngBreadcrumb,
    TngBreadcrumbList,
    TngBreadcrumbItem,
    TngBreadcrumbLink,
    TngBreadcrumbSeparator,
  ],
  templateUrl: './playground-layout.component.html',
  styleUrl: './playground-layout.component.css',
})
export class PlaygroundLayoutComponent {
  private readonly documentRef = inject(DOCUMENT);
  private readonly router = inject(Router);

  protected readonly searchQuery = signal('');
  protected readonly darkMode = signal(false);

  protected readonly activeTheme = computed<ThemeDefinition>(() => {
    const mode = this.darkMode() ? 'dark' : 'light';
    const semantic =
      mode === 'dark' ? darkSemanticTokens : defaultThemePreset.tokens.semantic;
    return createTheme(defaultThemePreset, {
      meta: { mode },
      tokens: { semantic },
    });
  });

  public constructor() {
    effect(() => {
      this.applyThemeVariables(this.activeTheme());
    });
  }

  protected onThemeModeChange(pressed: boolean): void {
    this.darkMode.set(pressed);
  }

  private applyThemeVariables(theme: ThemeDefinition): void {
    const style = this.documentRef.documentElement.style;
    const cssVars = this.toResolvedCssVars(theme);
    for (const [name, value] of Object.entries(cssVars)) {
      style.setProperty(name, value);
    }
  }

  private toResolvedCssVars(theme: ThemeDefinition): Record<string, string> {
    const primitiveVars = toCssVars(theme, {
      includePrimitives: true,
      includeSemantic: false,
    });
    const semanticVars: Record<string, string> = {};
    for (const collection of SEMANTIC_COLLECTIONS) {
      const scale = theme.tokens.semantic[collection];
      for (const key of Object.keys(scale)) {
        semanticVars[`--tng-semantic-${collection}-${key}`] =
          this.resolveTokenValue(theme, scale[key]);
      }
    }
    return { ...primitiveVars, ...semanticVars };
  }

  private resolveTokenValue(
    theme: ThemeDefinition,
    tokenExpression: string,
  ): string {
    if (!tokenExpression.startsWith('{') || !tokenExpression.endsWith('}')) {
      return tokenExpression;
    }
    return resolveToken(theme, tokenExpression) ?? tokenExpression;
  }

  private readonly urlPath = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map(() => getUrlPath(this.router.url)),
      startWith(getUrlPath(this.router.url)),
    ),
    { initialValue: getUrlPath(this.router.url) },
  );

  protected readonly pageTitle = computed(() => {
    const path = this.urlPath();
    if (path === '' || path === '/') return 'Home';
    const item = ALL_ITEMS.find((i) => i.path === path);
    return item?.title ?? path.slice(1).replace(/-/g, ' ');
  });

  protected readonly breadcrumbs = computed((): readonly { label: string; path: string | null }[] => {
    const path = this.urlPath();
    if (path === '' || path === '/') {
      return [{ label: 'Home', path: null }];
    }
    const item = ALL_ITEMS.find((i) => i.path === path);
    const currentLabel = item?.title ?? path.slice(1).replace(/-/g, ' ');
    return [
      { label: 'Home', path: '/' },
      { label: currentLabel, path: null },
    ];
  });

  protected readonly groups = computed((): readonly TngCategoryGroup[] => {
    const q = this.searchQuery().toLowerCase().trim();
    const filtered =
      q.length === 0
        ? ALL_ITEMS
        : ALL_ITEMS.filter(
            (item) =>
              item.title.toLowerCase().includes(q) ||
              item.description.toLowerCase().includes(q) ||
              item.path.toLowerCase().includes(q),
          );

    const byCategory = new Map<TngPlaygroundCategory, TngPlaygroundItem[]>();
    for (const item of filtered) {
      const list = byCategory.get(item.category) ?? [];
      list.push(item);
      byCategory.set(item.category, list);
    }

    return CATEGORY_ORDER.filter((cat) => (byCategory.get(cat)?.length ?? 0) > 0).map((category) => ({
      category,
      label: CATEGORY_LABELS[category],
      items: Object.freeze(byCategory.get(category) ?? []),
    }));
  });

  protected onSearchInput(value: string): void {
    this.searchQuery.set(value);
  }

  protected onOptionSelect(path: string): void {
    this.router.navigateByUrl(path);
  }

  protected onOptionKeydown(path: string, event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.onOptionSelect(path);
    }
  }

  protected isActive(path: string): boolean {
    return this.urlPath() === path;
  }
}
