import { DOCUMENT, NgFor } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { ActivatedRoute, type Data } from '@angular/router';
import { TngCodeBlockComponent, TngTabsComponent } from '@tailng-ui/components';
import { TngTab, TngTabList, TngTabPanel } from '@tailng-ui/primitives';

interface OwnableInstallRouteData {
  componentName: string;
  componentSymbol: string;
  primitiveSymbol?: string | null;
  registrySlug: string;
  usageCode: string;
}

const fallbackData: OwnableInstallRouteData = {
  componentName: 'Component',
  componentSymbol: 'TngComponent',
  primitiveSymbol: null,
  registrySlug: 'component',
  usageCode: '<!-- Usage example -->',
};

@Component({
  selector: 'app-docs-ownable-install-section',
  imports: [
    NgFor,
    TngCodeBlockComponent,
    TngTabsComponent,
    TngTabList,
    TngTab,
    TngTabPanel,
  ],
  templateUrl: './docs-ownable-install-section.component.html',
  styleUrl: './docs-ownable-install-section.component.css',
})
export class DocsOwnableInstallSectionComponent implements OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly documentRef = inject(DOCUMENT);
  private readonly routeData: OwnableInstallRouteData = this.resolveRouteData(
    this.route.snapshot.data,
  );

  protected readonly componentName = this.routeData.componentName;
  protected readonly registrySlug = this.routeData.registrySlug;

  protected readonly generatedFiles = this.buildGeneratedFiles(this.registrySlug);
  protected readonly installPnpmCode = `pnpm dlx tailng add ${this.registrySlug}`;
  protected readonly installNpxCode = `npx tailng add ${this.registrySlug}`;
  protected readonly importCode = this.buildImportCode(this.routeData);
  protected readonly usageCode = this.routeData.usageCode;

  protected readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    this.resolveCodeBlockTheme(),
  );
  private readonly colorSchemeObserver = this.observeCodeThemeChanges();

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }

  private resolveRouteData(data: Data): OwnableInstallRouteData {
    return {
      componentName:
        typeof data['componentName'] === 'string'
          ? data['componentName']
          : fallbackData.componentName,
      componentSymbol:
        typeof data['componentSymbol'] === 'string'
          ? data['componentSymbol']
          : fallbackData.componentSymbol,
      primitiveSymbol:
        typeof data['primitiveSymbol'] === 'string'
          ? data['primitiveSymbol']
          : fallbackData.primitiveSymbol,
      registrySlug:
        typeof data['registrySlug'] === 'string' ? data['registrySlug'] : fallbackData.registrySlug,
      usageCode: typeof data['usageCode'] === 'string' ? data['usageCode'] : fallbackData.usageCode,
    };
  }

  private buildGeneratedFiles(slug: string): readonly string[] {
    const fileBase = `tng-${slug}`;
    return [
      `src/app/tailng-ui/${slug}/${fileBase}-primitive.ts`,
      `src/app/tailng-ui/${slug}/${fileBase}.ts`,
      `src/app/tailng-ui/${slug}/${fileBase}.html`,
      `src/app/tailng-ui/${slug}/${fileBase}.css`,
      `src/app/tailng-ui/${slug}/index.ts`,
    ];
  }

  private buildImportCode(data: OwnableInstallRouteData): string {
    const symbols = [data.componentSymbol];
    if (typeof data.primitiveSymbol === 'string' && data.primitiveSymbol.length > 0) {
      symbols.push(data.primitiveSymbol);
    }

    return `import { ${symbols.join(', ')} } from './tailng-ui/${data.registrySlug}';\n`;
  }

  private observeCodeThemeChanges(): MutationObserver | null {
    const mutationObserverCtor = this.documentRef.defaultView?.MutationObserver;
    if (mutationObserverCtor === undefined) {
      return null;
    }

    const observer = new mutationObserverCtor(() => {
      this.codeBlockTheme.set(this.resolveCodeBlockTheme());
    });

    observer.observe(this.documentRef.documentElement, {
      attributeFilter: ['style', 'class'],
      attributes: true,
    });

    return observer;
  }

  private resolveCodeBlockTheme(): 'github-dark' | 'github-light' {
    const root = this.documentRef.documentElement;
    const inlineColorScheme = root.style.getPropertyValue('color-scheme').trim().toLowerCase();
    if (inlineColorScheme.includes('dark')) {
      return 'github-dark';
    }

    const computedColorScheme = this.documentRef.defaultView
      ?.getComputedStyle(root)
      .getPropertyValue('color-scheme')
      .trim()
      .toLowerCase();

    return computedColorScheme?.includes('dark') ? 'github-dark' : 'github-light';
  }
}
