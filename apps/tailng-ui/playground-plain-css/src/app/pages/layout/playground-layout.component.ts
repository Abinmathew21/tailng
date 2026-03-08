import { DOCUMENT } from '@angular/common';
import {
  Component,
  HostListener,
  computed,
  effect,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import type { ElementRef } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import {
  TngAccordionComponent,
  TngAccordionItemComponent,
  TngAccordionPanelComponent,
  TngAccordionTriggerComponent,
  TngToggleComponent,
} from '@tailng-ui/components';
import { TngIcon } from '@tailng-ui/icons';
import {
  TngBreadcrumb,
  TngBreadcrumbItem,
  TngBreadcrumbLink,
  TngBreadcrumbList,
  TngBreadcrumbSeparator,
  TngMenu,
} from '@tailng-ui/primitives';
import {
  ALL_PLAYGROUND_ITEMS,
  CATEGORY_LABELS,
  CATEGORY_ORDER,
  type TngCategoryGroup,
  type TngPlaygroundCategory,
  type TngPlaygroundItem,
} from '@tailng-ui/registry';
import {
  createTheme,
  darkSemanticTokens,
  defaultThemePreset,
  minimalThemePreset,
  resolveToken,
  toCssVars,
} from '@tailng-ui/theme';
import type { ThemeDefinition, ThemeSemanticTokens } from '@tailng-ui/theme';
import { filter, map, startWith } from 'rxjs';

type PresetId = 'default' | 'minimal';

const PRESET_OPTIONS: readonly { id: PresetId; label: string }[] = [
  { id: 'default', label: 'Default' },
  { id: 'minimal', label: 'Minimal' },
];

const SEMANTIC_COLLECTIONS: readonly (keyof ThemeSemanticTokens)[] = [
  'background',
  'foreground',
  'border',
  'accent',
  'focus',
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
    TngAccordionComponent,
    TngAccordionItemComponent,
    TngAccordionTriggerComponent,
    TngAccordionPanelComponent,
    TngToggleComponent,
    TngIcon,
    TngBreadcrumb,
    TngBreadcrumbList,
    TngBreadcrumbItem,
    TngBreadcrumbLink,
    TngBreadcrumbSeparator,
    TngMenu,
  ],
  templateUrl: './playground-layout.component.html',
  styleUrl: './playground-layout.component.css',
})
export class PlaygroundLayoutComponent {
  private readonly documentRef = inject(DOCUMENT);
  private readonly router = inject(Router);

  protected readonly presetOptions = PRESET_OPTIONS;
  protected readonly searchQuery = signal('');
  protected readonly darkMode = signal(false);
  protected readonly selectedPreset = signal<PresetId>('default');
  protected readonly themeMenuOpen = signal(false);
  private readonly themeMenuRef = viewChild<ElementRef<HTMLElement>>('themeMenuRef');

  protected readonly activeTheme = computed<ThemeDefinition>(() => {
    const basePreset = this.getBasePreset(this.selectedPreset());
    const mode = this.darkMode() ? 'dark' : 'light';
    const semantic =
      mode === 'dark' ? darkSemanticTokens : basePreset.tokens.semantic;
    return createTheme(basePreset, {
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

  protected toggleThemeMenu(): void {
    this.themeMenuOpen.update((open) => !open);
  }

  protected onPresetSelect(presetId: PresetId): void {
    this.selectedPreset.set(presetId);
    this.themeMenuOpen.set(false);
  }

  @HostListener('document:click', ['$event'])
  protected onDocumentClick(event: Event): void {
    if (!this.themeMenuOpen()) return;
    const target = event.target;
    if (!(target instanceof Node)) return;
    const menuEl = this.themeMenuRef()?.nativeElement;
    if (menuEl?.contains(target)) return;
    this.themeMenuOpen.set(false);
  }

  @HostListener('document:keydown.escape')
  protected onEscapeKeydown(): void {
    if (this.themeMenuOpen()) {
      this.themeMenuOpen.set(false);
    }
  }

  private getBasePreset(preset: PresetId): ThemeDefinition {
    return preset === 'minimal' ? minimalThemePreset : defaultThemePreset;
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
    const item = ALL_PLAYGROUND_ITEMS.find((i) => i.path === path);
    return item?.title ?? path.slice(1).replace(/-/g, ' ');
  });

  protected readonly breadcrumbs = computed((): readonly { label: string; path: string | null }[] => {
    const path = this.urlPath();
    if (path === '' || path === '/') {
      return [{ label: 'Home', path: null }];
    }
    const item = ALL_PLAYGROUND_ITEMS.find((i) => i.path === path);
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
        ? ALL_PLAYGROUND_ITEMS
        : ALL_PLAYGROUND_ITEMS.filter(
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
    void this.router.navigateByUrl(path);
  }

  protected onMenuKeydown(path: string, event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.onOptionSelect(path);
    }
  }

  protected isActive(path: string): boolean {
    return this.urlPath() === path;
  }
}
