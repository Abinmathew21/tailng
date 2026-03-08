import { DOCUMENT } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { TngMenuComponent, TngMenuTriggerFor, TngSwitchComponent } from '@tailng-ui/components';
import { TngIcon } from '@tailng-ui/icons';
import {
  createTheme,
  darkSemanticTokens,
  defaultThemePreset,
  minimalThemePreset,
  resolveToken,
  toCssVars,
} from '@tailng-ui/theme';
import type { ThemeDefinition, ThemeSemanticTokens } from '@tailng-ui/theme';

type ThemePresetId = 'default' | 'minimal';

type ThemePresetOption = Readonly<{
  id: ThemePresetId;
  icon: string;
  label: string;
  description: string;
}>;

type LinkItem = Readonly<{
  label: string;
  href: string;
}>;

type ContentCard = Readonly<{
  title: string;
  description: string;
  href?: string;
}>;

const presetOptions: readonly ThemePresetOption[] = [
  {
    id: 'default',
    icon: 'palette',
    label: 'Default',
    description: 'Balanced spacing and expressive accents.',
  },
  {
    id: 'minimal',
    icon: 'swatch-book',
    label: 'Minimal',
    description: 'Low-contrast, compact, content-first.',
  },
];

const primaryNavigation: readonly LinkItem[] = [
  { label: 'Components', href: '#packages' },
  { label: 'Primitives', href: '#packages' },
  { label: 'CDK', href: '#packages' },
  { label: 'Theme', href: '#theme' },
  { label: 'Icons', href: '#explore' },
];

const packageCards: readonly ContentCard[] = [
  {
    title: 'CDK',
    description:
      'Low-level utilities for interaction, behavior, structure, focus management, overlays, and shared UI mechanics.',
    href: '#packages',
  },
  {
    title: 'Primitives',
    description:
      'Headless accessible foundations for menus, popovers, dialogs, tabs, switches, drawers, and more.',
    href: '#packages',
  },
  {
    title: 'Components',
    description:
      'Reusable UI components with sensible structure and minimal styling, ready for real product development.',
    href: '#packages',
  },
  {
    title: 'Icons',
    description: 'A consistent icon set designed to fit naturally into TailNG apps and docs.',
    href: '#explore',
  },
  {
    title: 'Theme',
    description: 'Tokens, visual foundations, presets, and mode-aware styling for product interfaces.',
    href: '#theme',
  },
  {
    title: 'Install',
    description:
      'Selective adoption inspired by shadcn-like workflows, so teams can own exactly what they ship.',
    href: '#install',
  },
];

const principles: readonly ContentCard[] = [
  {
    title: 'Accessibility first',
    description:
      'Strong interaction patterns, semantics, keyboard support, and ARIA behavior are the baseline.',
  },
  {
    title: 'Ownable by teams',
    description:
      'UI code stays understandable, adaptable, and maintainable for product teams over time.',
  },
  {
    title: 'Layered architecture',
    description:
      'Adopt CDK, primitives, components, icons, and themes at the level that fits your project.',
  },
  {
    title: 'Angular-native',
    description: 'Built for modern Angular patterns with a signal-first mindset and predictable APIs.',
  },
  {
    title: 'Styling flexibility',
    description:
      'TailNG supports branding and custom design systems without forcing one rigid visual identity.',
  },
  {
    title: 'Practical by default',
    description: 'Designed for real dashboards, forms, overlays, tables, and product workflows.',
  },
];

const whyTailng: readonly ContentCard[] = [
  {
    title: 'Modular adoption',
    description:
      'Start with components, go lower with primitives, and build deeper with CDK only when needed.',
  },
  {
    title: 'Better ownership',
    description:
      'The architecture encourages clarity so teams can understand and evolve the UI they ship.',
  },
  {
    title: 'Accessibility that matters',
    description:
      'Focus behavior, keyboard interactions, and semantics are treated as core product quality.',
  },
  {
    title: 'Design-system friendly',
    description:
      'TailNG fits branded ecosystems instead of forcing a fixed visual identity on every product.',
  },
  {
    title: 'Flexible install path',
    description:
      'Choose package installation or selective ownership patterns based on how your team works.',
  },
];

const installOptions: readonly ContentCard[] = [
  {
    title: 'Use components',
    description: 'Start with ready-to-use building blocks for forms, overlays, navigation, and data UI.',
  },
  {
    title: 'Use primitives',
    description: 'Build your own presentation layer on top of accessible behavior contracts.',
  },
  {
    title: 'Use CDK',
    description: 'Compose advanced product patterns with lower-level behavior foundations.',
  },
  {
    title: 'Use selective install',
    description: 'Adopt only the modules your team wants to own and evolve.',
  },
];

const themeHighlights: readonly ContentCard[] = [
  {
    title: 'Theme tokens',
    description:
      'Define reusable values for color, spacing, typography, borders, and surfaces across the product.',
  },
  {
    title: 'Presets and customization',
    description: 'Start from a preset, then adapt TailNG to match your internal system language.',
  },
  {
    title: 'Dark and light support',
    description: 'Support modern UI expectations with clean mode-aware visual behavior.',
  },
  {
    title: 'Styling without lock-in',
    description: 'Works with vanilla CSS, utility workflows, and design-system conventions.',
  },
];

const exploreLinks: readonly ContentCard[] = [
  {
    title: 'Docs',
    description: 'Read usage guides, architecture decisions, and package-level documentation.',
  },
  {
    title: 'Components',
    description: 'Browse ready-made UI building blocks for common product needs.',
  },
  {
    title: 'Primitives',
    description: 'Explore accessible headless interaction patterns for custom UI development.',
  },
  {
    title: 'CDK',
    description: 'See the low-level behavioral foundations that power the system.',
  },
  {
    title: 'Theme',
    description: 'Understand tokens, presets, and mode-aware styling foundations.',
  },
  {
    title: 'Icons',
    description: 'Browse icon usage patterns for interface consistency.',
  },
  {
    title: 'Install',
    description: 'Choose the best adoption path for your application or design system.',
  },
];

const footerProductLinks: readonly LinkItem[] = [
  { label: 'Docs', href: '#explore' },
  { label: 'Components', href: '#packages' },
  { label: 'Primitives', href: '#packages' },
  { label: 'CDK', href: '#packages' },
  { label: 'Theme', href: '#theme' },
  { label: 'Icons', href: '#explore' },
];

const footerResourceLinks: readonly LinkItem[] = [
  { label: 'Install', href: '#install' },
  { label: 'GitHub', href: 'https://github.com' },
  { label: 'npm', href: 'https://www.npmjs.com' },
  { label: 'Changelog', href: '#explore' },
  { label: 'News', href: '#explore' },
];

const npmPackageLinks: readonly LinkItem[] = [
  { label: '@tailng-ui/cdk', href: 'https://www.npmjs.com/package/@tailng-ui/cdk' },
  { label: '@tailng-ui/primitives', href: 'https://www.npmjs.com/package/@tailng-ui/primitives' },
  { label: '@tailng-ui/components', href: 'https://www.npmjs.com/package/@tailng-ui/components' },
  { label: '@tailng-ui/theme', href: 'https://www.npmjs.com/package/@tailng-ui/theme' },
  { label: '@tailng-ui/icons', href: 'https://www.npmjs.com/package/@tailng-ui/icons' },
  { label: 'tailng', href: 'https://www.npmjs.com/package/tailng' },
];

const footerCommunityLinks: readonly LinkItem[] = [
  { label: 'Contributing', href: '#explore' },
  { label: 'License', href: '#explore' },
  { label: 'Accessibility', href: '#principles' },
  { label: 'Discussions', href: 'https://github.com' },
];

const semanticCollections: readonly (keyof ThemeSemanticTokens)[] = [
  'background',
  'foreground',
  'border',
  'accent',
  'focus',
];

@Component({
  imports: [TngMenuComponent, TngMenuTriggerFor, TngSwitchComponent, TngIcon],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private readonly documentRef = inject(DOCUMENT);
  public readonly currentYear = new Date().getFullYear();

  public readonly darkMode = signal(false);
  public readonly presetOptions = presetOptions;
  public readonly selectedPreset = signal<ThemePresetId>('default');
  public readonly primaryNavigation = primaryNavigation;
  public readonly packageCards = packageCards;
  public readonly principles = principles;
  public readonly whyTailng = whyTailng;
  public readonly installOptions = installOptions;
  public readonly themeHighlights = themeHighlights;
  public readonly exploreLinks = exploreLinks;
  public readonly npmPackageLinks = npmPackageLinks;
  public readonly footerProductLinks = footerProductLinks;
  public readonly footerResourceLinks = footerResourceLinks;
  public readonly footerCommunityLinks = footerCommunityLinks;

  public readonly effectiveMode = computed<'light' | 'dark'>(() =>
    this.darkMode() ? 'dark' : 'light',
  );

  public readonly effectiveModeLabel = computed((): string =>
    this.effectiveMode() === 'dark' ? 'Dark' : 'Light',
  );

  public readonly selectedPresetLabel = computed((): string =>
    this.getPresetOption(this.selectedPreset()).label,
  );

  public readonly selectedPresetIcon = computed((): string =>
    this.getPresetOption(this.selectedPreset()).icon,
  );

  private readonly activeTheme = computed<ThemeDefinition>(() => {
    const mode = this.effectiveMode();
    const basePreset = this.getBasePreset(this.selectedPreset());
    const semanticTokens = mode === 'dark' ? darkSemanticTokens : basePreset.tokens.semantic;
    return createTheme(basePreset, {
      meta: { mode },
      tokens: { semantic: semanticTokens },
    });
  });

  public constructor() {
    effect((): void => {
      this.applyThemeVariables(this.activeTheme());
    });
  }

  public onPresetSelect(preset: ThemePresetId): void {
    this.selectedPreset.set(preset);
  }

  public onModeSwitchChange(checked: boolean): void {
    this.darkMode.set(checked);
  }

  public isPresetSelected(preset: ThemePresetId): boolean {
    return this.selectedPreset() === preset;
  }

  private getBasePreset(preset: ThemePresetId): ThemeDefinition {
    return preset === 'minimal' ? minimalThemePreset : defaultThemePreset;
  }

  private getPresetOption(preset: ThemePresetId): ThemePresetOption {
    const resolved = presetOptions.find((option) => option.id === preset);
    if (resolved !== undefined) {
      return resolved;
    }

    return {
      id: 'default',
      icon: 'palette',
      label: 'Default',
      description: 'Balanced spacing and expressive accents.',
    };
  }

  private applyThemeVariables(theme: ThemeDefinition): void {
    const style = this.documentRef.documentElement.style;
    const cssVars = this.toResolvedCssVars(theme);
    for (const [name, value] of Object.entries(cssVars)) {
      style.setProperty(name, value);
    }
    style.setProperty('color-scheme', theme.meta.mode);
  }

  private toResolvedCssVars(theme: ThemeDefinition): Record<string, string> {
    const primitiveVars = toCssVars(theme, {
      includePrimitives: true,
      includeSemantic: false,
    });

    const semanticVars: Record<string, string> = {};
    for (const collection of semanticCollections) {
      const scale = theme.tokens.semantic[collection];
      for (const key of Object.keys(scale)) {
        semanticVars[`--tng-semantic-${collection}-${key}`] = this.resolveTokenValue(theme, scale[key]);
      }
    }

    return { ...primitiveVars, ...semanticVars };
  }

  private resolveTokenValue(theme: ThemeDefinition, tokenExpression: string): string {
    if (!tokenExpression.startsWith('{') || !tokenExpression.endsWith('}')) {
      return tokenExpression;
    }

    return resolveToken(theme, tokenExpression) ?? tokenExpression;
  }
}
