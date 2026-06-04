import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import {
  TngCardComponent,
  TngCardContentComponent,
  TngCardDescriptionComponent,
  TngCardHeaderComponent,
  TngCardTitleComponent,
  TngCodeBlockComponent,
  TngTabsComponent,
} from '@tailng-ui/components';
import { TngIcon } from '@tailng-ui/icons';
import { TngTab, TngTabList, TngTabPanel } from '@tailng-ui/primitives';
import { observeDocsCodeThemeChanges, resolveDocsCodeBlockTheme } from '../../../shared/util';

@Component({
  selector: 'app-icons-page',
  imports: [
    TngCardComponent,
    TngCardHeaderComponent,
    TngCardTitleComponent,
    TngCardDescriptionComponent,
    TngCardContentComponent,
    TngCodeBlockComponent,
    TngTabsComponent,
    TngTabList,
    TngTab,
    TngTabPanel,
    TngIcon,
  ],
  templateUrl: './icons-page.component.html',
  styleUrl: './icons-page.component.css',
})
export class IconsPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );

  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  // Installation
  protected readonly installPnpmCode =
    'pnpm add @tailng-ui/icons @ng-icons/core @ng-icons/lucide';
  protected readonly installNpmCode =
    'npm install @tailng-ui/icons @ng-icons/core @ng-icons/lucide';
  protected readonly installYarnCode =
    'yarn add @tailng-ui/icons @ng-icons/core @ng-icons/lucide';

  // Basic provider setup
  protected readonly basicProviderCode = `// app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideTngIcons } from '@tailng-ui/icons';

export const appConfig: ApplicationConfig = {
  providers: [
    provideTngIcons(), // uses Lucide by default
  ],
};`;

  // Basic usage
  protected readonly basicUsageCode = `<!-- decorative icon alongside text (aria-hidden by default) -->
<tng-icon icon="home" class="h-5 w-5" />

<!-- meaningful standalone icon with accessible label -->
<tng-icon icon="search" label="Search" class="h-5 w-5" />

<!-- kebab-case and camelCase icon names are both supported -->
<tng-icon icon="arrow-right" class="h-4 w-4" />
<tng-icon icon="arrowRight" class="h-4 w-4" />`;

  // Pack reference syntax
  protected readonly packRefSyntaxCode = `<!-- no prefix → uses the default pack (lucide) -->
<tng-icon icon="star" />

<!-- explicit pack:name syntax -->
<tng-icon icon="lucide:star" />
<tng-icon icon="bootstrap:star-fill" />
<tng-icon icon="flags:us" />`;

  // Bootstrap install
  protected readonly bootstrapInstallPnpmCode = 'pnpm add @ng-icons/bootstrap-icons';
  protected readonly bootstrapInstallNpmCode = 'npm install @ng-icons/bootstrap-icons';
  protected readonly bootstrapInstallYarnCode = 'yarn add @ng-icons/bootstrap-icons';

  // Bootstrap pack setup
  protected readonly bootstrapProviderCode = `// icons.provider.ts
import { createTngIconPack, provideTngIcons, type TngIconLoader } from '@tailng-ui/icons';

function createBootstrapLoader(exportName: string): TngIconLoader {
  return async () => {
    const mod = await import('@ng-icons/bootstrap-icons') as Record<string, unknown>;
    const svg = mod[exportName];
    if (typeof svg !== 'string') {
      throw new Error(\`Bootstrap icon "\${exportName}" not found.\`);
    }
    return svg;
  };
}

const bootstrapPack = createTngIconPack('bootstrap', {
  'star-fill': createBootstrapLoader('bootstrapStarFill'),
  'bell':      createBootstrapLoader('bootstrapBell'),
  'x-circle':  createBootstrapLoader('bootstrapXCircle'),
  // add more icons as needed
});

export const tngIconProviders = provideTngIcons({
  packs: [bootstrapPack],
});`;

  // Multiple packs + explicit default
  protected readonly multiplePacksCode = `export const tngIconProviders = provideTngIcons({
  defaultPack: 'lucide',          // default pack when no prefix is given
  packs: [bootstrapPack, brandPack],
});`;

  // Use bootstrap icons in template
  protected readonly bootstrapUsageCode = `<!-- explicit pack prefix -->
<tng-icon icon="bootstrap:star-fill" class="h-5 w-5" />
<tng-icon icon="bootstrap:bell" class="h-5 w-5" />

<!-- when bootstrap is set as defaultPack, prefix is optional -->
<tng-icon icon="star-fill" class="h-5 w-5" />`;

  // Static SVG custom pack
  protected readonly staticSvgPackCode = `import { createTngIconPack, provideTngIcons, type TngIconLoader } from '@tailng-ui/icons';

function staticSvg(svg: string): TngIconLoader {
  return () => Promise.resolve(svg);
}

const brandPack = createTngIconPack('brand', {
  logo: staticSvg(
    '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 22h20L12 2Z"/></svg>',
  ),
  wordmark: staticSvg(
    '<svg viewBox="0 0 80 24" fill="currentColor"><text y="18" font-size="16">MyApp</text></svg>',
  ),
});

export const tngIconProviders = provideTngIcons({ packs: [brandPack] });`;

  // URL-fetched SVG pack
  protected readonly urlFetchPackCode = `import { createTngIconPack, provideTngIcons, type TngIconLoader } from '@tailng-ui/icons';

const CDN = 'https://cdn.example.com/icons';

function remoteSvg(path: string): TngIconLoader {
  return async () => {
    const res = await fetch(\`\${CDN}/\${path}.svg\`);
    if (!res.ok) throw new Error(\`Failed to load icon: \${path}\`);
    return res.text();
  };
}

const remoteIconPack = createTngIconPack('remote', {
  avatar: remoteSvg('avatar'),
  dashboard: remoteSvg('dashboard'),
});

export const tngIconProviders = provideTngIcons({ packs: [remoteIconPack] });`;

  // Override builtin
  protected readonly overrideBuiltinCode = `provideTngIcons({
  allowBuiltinOverride: true,
  packs: [
    // Replace individual Lucide icons with your own SVGs
    createTngIconPack('lucide', {
      home: () => Promise.resolve('<svg viewBox="0 0 24 24"><!-- custom --></svg>'),
    }),
  ],
})`;

  // API types
  protected readonly apiProvideTngIconsCode = `interface TngProvideIconsOptions {
  /** Additional icon packs to register alongside the built-in Lucide pack. */
  packs?: TngIconPack[];

  /**
   * Pack used when no prefix is given in an icon ref.
   * Defaults to 'lucide'.
   */
  defaultPack?: string;

  /**
   * Allow a custom pack to shadow a built-in pack name (e.g. 'lucide').
   * Defaults to false.
   */
  allowBuiltinOverride?: boolean;
}`;

  protected readonly apiCreateTngIconPackCode = `function createTngIconPack(
  name: string,
  icons: Record<string, TngIconLoader>,
): TngIconPack;

// TngIconLoader: a function that returns the SVG markup as a string
type TngIconLoader = () => Promise<string>;`;

  protected readonly apiTngIconInputsCode = `// <tng-icon> component inputs
icon: string;          // required — icon name or "pack:name" ref
label?: string | null; // accessible label; omit for decorative icons`;

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
