import { DOCUMENT } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import {
  TngBreadcrumbComponent,
  TngBreadcrumbItemComponent,
  TngMenuComponent,
  TngMenuTriggerFor,
} from '@tailng-ui/components';
import { TngIcon } from '@tailng-ui/icons';
import { TngMenuItem, type TngMenuSelectEvent } from '@tailng-ui/primitives';
import {
  applyTailngTheme,
  atlasDarkThemePreset,
  atlasThemePreset,
  defaultDarkThemePreset,
  defaultThemePreset,
  minimalDarkThemePreset,
  minimalThemePreset,
  nexusDarkThemePreset,
  nexusThemePreset,
  prismDarkThemePreset,
  prismThemePreset,
  slateDarkThemePreset,
  slateThemePreset,
  sterlingDarkThemePreset,
  sterlingThemePreset,
  type ThemeDefinition,
} from '@tailng-ui/theme';
import { filter } from 'rxjs/operators';

type ThemePresetId =
  | 'default'
  | 'minimal'
  | 'slate'
  | 'nexus'
  | 'prism'
  | 'atlas'
  | 'sterling';

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
  {
    id: 'slate',
    icon: 'square',
    label: 'Slate',
    description: 'Clean and understated, ideal for a polished interface with timeless neutral character.',
  },
  {
    id: 'nexus',
    icon: 'palette',
    label: 'Nexus',
    description: 'Modern and dynamic, perfect for a connected design language across product experiences.',
  },
  {
    id: 'prism',
    icon: 'swatch-book',
    label: 'Prism',
    description: 'Crisp and expressive, suited for a theme that balances clarity with visual sophistication.',
  },
  {
    id: 'atlas',
    icon: 'square',
    label: 'Atlas',
    description: 'Solid and confident, fitting for a reliable theme with strong product presence.',
  },
  {
    id: 'sterling',
    icon: 'palette',
    label: 'Sterling',
    description: 'Sophisticated and premium, great for a theme that emphasizes excellence and trust.',
  },
];

const primaryNavigation: readonly NavItem[] = [
  { label: 'Components', route: '/components' },
  { label: 'Ownable', route: '/ownable' },
  { label: 'Headless', route: '/headless' },
  { label: 'CDK', route: '/cdk' },
  { label: 'Theme', route: '/theme' },
  { label: 'Icons', route: '/icons' },
];

const npmPackageLinks: readonly LinkItem[] = [
  { label: '@tailng-ui/cdk', href: 'https://www.npmjs.com/package/@tailng-ui/cdk' },
  { label: '@tailng-ui/primitives', href: 'https://www.npmjs.com/package/@tailng-ui/primitives' },
  { label: '@tailng-ui/components', href: 'https://www.npmjs.com/package/@tailng-ui/components' },
  { label: '@tailng-ui/registry', href: 'https://www.npmjs.com/package/@tailng-ui/registry' },
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

@Component({
  imports: [
    RouterOutlet,
    TngBreadcrumbComponent,
    TngBreadcrumbItemComponent,
    TngMenuComponent,
    TngMenuTriggerFor,
    TngMenuItem,
    TngIcon,
  ],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private readonly documentRef = inject(DOCUMENT);
  private readonly router = inject(Router);

  public readonly darkMode = signal(true);
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
    this.currentUrl().startsWith('/components') ||
    this.currentUrl().startsWith('/ownable') ||
    this.currentUrl().startsWith('/headless') ||
    this.currentUrl().startsWith('/theme'),
  );

  public readonly effectiveMode = computed<'light' | 'dark'>(() =>
    this.darkMode() ? 'dark' : 'light',
  );

  private readonly activeTheme = computed<ThemeDefinition>(() => {
    return this.getPresetByMode(this.selectedPreset(), this.effectiveMode());
  });

  public constructor() {
    effect((): void => {
      applyTailngTheme(this.activeTheme());
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
    if (
      value === 'default' ||
      value === 'minimal' ||
      value === 'slate' ||
      value === 'nexus' ||
      value === 'prism' ||
      value === 'atlas' ||
      value === 'sterling'
    ) {
      this.onPresetSelect(value);
    }
  }

  public toggleMode(): void {
    this.darkMode.update((current) => !current);
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

  private getPresetByMode(
    preset: ThemePresetId,
    mode: 'light' | 'dark',
  ): ThemeDefinition {
    const presets: Partial<
      Record<ThemePresetId, { light: ThemeDefinition; dark: ThemeDefinition }>
    > = {
      minimal: {
        light: minimalThemePreset,
        dark: minimalDarkThemePreset,
      },
      slate: {
        light: slateThemePreset,
        dark: slateDarkThemePreset,
      },
      nexus: {
        light: nexusThemePreset,
        dark: nexusDarkThemePreset,
      },
      prism: {
        light: prismThemePreset,
        dark: prismDarkThemePreset,
      },
      atlas: {
        light: atlasThemePreset,
        dark: atlasDarkThemePreset,
      },
      sterling: {
        light: sterlingThemePreset,
        dark: sterlingDarkThemePreset,
      },
    };
  
    return presets[preset]?.[mode]
      ?? (mode === 'dark' ? defaultDarkThemePreset : defaultThemePreset);
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
