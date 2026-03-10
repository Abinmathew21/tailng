import { DOCUMENT } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import {
  TngBreadcrumbComponent,
  TngBreadcrumbItemComponent,
  TngMenuComponent,
  TngMenuTriggerFor,
  TngSwitchComponent,
} from '@tailng-ui/components';
import { TngIcon } from '@tailng-ui/icons';
import { TngMenuItem, type TngMenuSelectEvent } from '@tailng-ui/primitives';
import {
  createTheme,
  darkSemanticTokens,
  defaultThemePreset,
  minimalThemePreset,
  resolveToken,
  type ThemeDefinition,
  type ThemeSemanticTokens,
  toCssVars,
} from '@tailng-ui/theme';
import { filter } from 'rxjs/operators';

type ThemePresetId = 'default' | 'minimal';

type ThemePresetOption = Readonly<{
  id: ThemePresetId;
  icon: string;
  label: string;
  description: string;
}>;

type NavItem = Readonly<{
  label: string;
  route: string;
}>;

type LinkItem = Readonly<{
  label: string;
  href: string;
}>;

type BreadcrumbItem = Readonly<{
  current: boolean;
  label: string;
  url: string | null;
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

const primaryNavigation: readonly NavItem[] = [
  { label: 'Components', route: '/components' },
  { label: 'Primitives', route: '/primitives' },
  { label: 'CDK', route: '/cdk' },
  { label: 'Theme', route: '/theme' },
  { label: 'Icons', route: '/icons' },
];

const npmPackageLinks: readonly LinkItem[] = [
  { label: '@tailng-ui/cdk', href: 'https://www.npmjs.com/package/@tailng-ui/cdk' },
  { label: '@tailng-ui/primitives', href: 'https://www.npmjs.com/package/@tailng-ui/primitives' },
  { label: '@tailng-ui/components', href: 'https://www.npmjs.com/package/@tailng-ui/components' },
  { label: '@tailng-ui/theme', href: 'https://www.npmjs.com/package/@tailng-ui/theme' },
  { label: '@tailng-ui/icons', href: 'https://www.npmjs.com/package/@tailng-ui/icons' },
  { label: 'tailng', href: 'https://www.npmjs.com/package/tailng' },
];

const footerResourceLinks: readonly LinkItem[] = [
  { label: 'GitHub Repository', href: 'https://github.com/tailng/tailng-ui' },
  { label: 'Issue Tracker', href: 'https://github.com/tailng/tailng-ui/issues' },
  { label: 'Project README', href: 'https://github.com/tailng/tailng-ui/blob/main/README.md' },
  { label: 'MIT License', href: 'https://opensource.org/license/mit' },
];

const semanticCollections: readonly (keyof ThemeSemanticTokens)[] = [
  'background',
  'foreground',
  'border',
  'accent',
  'focus',
];

@Component({
  imports: [
    RouterOutlet,
    RouterLink,
    TngBreadcrumbComponent,
    TngBreadcrumbItemComponent,
    TngMenuComponent,
    TngMenuTriggerFor,
    TngMenuItem,
    TngSwitchComponent,
    TngIcon,
  ],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private readonly documentRef = inject(DOCUMENT);
  private readonly router = inject(Router);

  public readonly darkMode = signal(false);
  public readonly presetOptions = presetOptions;
  public readonly selectedPreset = signal<ThemePresetId>('default');
  public readonly primaryNavigation = primaryNavigation;
  public readonly npmPackageLinks = npmPackageLinks;
  public readonly footerResourceLinks = footerResourceLinks;
  public readonly currentYear = new Date().getFullYear();
  public readonly currentUrl = signal<string>(this.router.url);
  public readonly breadcrumbs = signal<readonly BreadcrumbItem[]>(
    this.buildBreadcrumbs(this.router.url),
  );
  public readonly componentsDocsLayout = computed<boolean>(() =>
    this.currentUrl().startsWith('/components'),
  );

  public readonly effectiveMode = computed<'light' | 'dark'>(() =>
    this.darkMode() ? 'dark' : 'light',
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

    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe((event) => {
        this.currentUrl.set(event.urlAfterRedirects);
        this.breadcrumbs.set(this.buildBreadcrumbs(event.urlAfterRedirects));
      });
  }

  public onPresetSelect(preset: ThemePresetId): void {
    this.selectedPreset.set(preset);
  }

  public onThemePresetMenuSelect(event: TngMenuSelectEvent): void {
    const value = event.value;
    if (value === 'default' || value === 'minimal') {
      this.onPresetSelect(value);
    }
  }

  public onModeSwitchChange(checked: boolean): void {
    this.darkMode.set(checked);
  }

  public onNpmMenuSelect(event: TngMenuSelectEvent): void {
    if (event.trigger !== 'keyboard') {
      return;
    }

    if (typeof event.value !== 'string') {
      return;
    }

    const selectedPackage = this.npmPackageLinks.find((pkg) => pkg.label === event.value);
    if (selectedPackage === undefined) {
      return;
    }

    this.documentRef.defaultView?.open(selectedPackage.href, '_blank', 'noopener,noreferrer');
  }

  public isPresetSelected(preset: ThemePresetId): boolean {
    return this.selectedPreset() === preset;
  }

  private getBasePreset(preset: ThemePresetId): ThemeDefinition {
    return preset === 'minimal' ? minimalThemePreset : defaultThemePreset;
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
        semanticVars[`--tng-semantic-${collection}-${key}`] = this.resolveTokenValue(
          theme,
          scale[key],
        );
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

  private buildBreadcrumbs(rawUrl: string): readonly BreadcrumbItem[] {
    const urlTree = this.router.parseUrl(rawUrl);
    const primarySegments = urlTree.root.children['primary']?.segments ?? [];
    if (primarySegments.length === 0) {
      return [{ current: true, label: 'Home', url: null }];
    }

    const crumbs: BreadcrumbItem[] = [{ current: false, label: 'Home', url: '/' }];
    let currentPath = '';
    for (const segment of primarySegments) {
      if (segment.path.length === 0) {
        continue;
      }

      currentPath = `${currentPath}/${segment.path}`;
      crumbs.push({
        current: false,
        label: this.formatSegmentLabel(segment.path),
        url: currentPath,
      });
    }

    if (crumbs.length > 0) {
      const lastCrumb = crumbs[crumbs.length - 1];
      crumbs[crumbs.length - 1] = {
        ...lastCrumb,
        current: true,
        url: null,
      };
    }

    return crumbs;
  }

  private formatSegmentLabel(rawSegment: string): string {
    const decodedSegment = decodeURIComponent(rawSegment);
    const normalized = decodedSegment.replace(/[-_]+/g, ' ').trim();
    if (normalized.length === 0) {
      return decodedSegment;
    }

    return normalized
      .split(/\s+/g)
      .filter((word) => word.length > 0)
      .map((word) => this.toTitleWord(word))
      .join(' ');
  }

  private toTitleWord(word: string): string {
    const uppercaseTokenWords = new Set([
      'api',
      'cdk',
      'css',
      'html',
      'http',
      'id',
      'json',
      'ui',
      'url',
    ]);
    const lowerWord = word.toLowerCase();
    if (uppercaseTokenWords.has(lowerWord)) {
      return lowerWord.toUpperCase();
    }

    return `${word.charAt(0).toUpperCase()}${word.slice(1)}`;
  }
}
