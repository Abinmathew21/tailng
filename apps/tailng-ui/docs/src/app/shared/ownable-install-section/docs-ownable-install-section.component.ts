import { DOCUMENT, NgFor, NgIf } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { ActivatedRoute, type Data } from '@angular/router';
import { TngCodeBlockComponent, TngTabsComponent } from '@tailng-ui/components';
import { getRegistryGeneratedFilePaths, getRegistryInstallMetadata } from '@tailng-ui/registry';
import { TngTab, TngTabList, TngTabPanel } from '@tailng-ui/primitives';

interface OwnableInstallRouteData {
  registrySlug: string;
  usageCode: string;
}

const fallbackData: OwnableInstallRouteData = {
  registrySlug: 'component',
  usageCode: '<!-- Usage example -->',
};

@Component({
  selector: 'app-docs-ownable-install-section',
  imports: [
    NgFor,
    NgIf,
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
  private readonly docsItem = this.route.parent?.snapshot.data['item'] as
    | { title?: string }
    | undefined;
  private readonly routeData: OwnableInstallRouteData = this.resolveRouteData(
    this.route.snapshot.data,
  );

  protected readonly registrySlug = this.routeData.registrySlug;
  protected readonly componentName = this.docsItem?.title ?? this.formatRegistryName(this.registrySlug);
  protected readonly installMetadata = getRegistryInstallMetadata(this.registrySlug);
  protected readonly hasRegistryItem = this.installMetadata !== undefined;

  protected readonly generatedFiles = getRegistryGeneratedFilePaths(this.registrySlug);
  protected readonly installPnpmCode = `pnpm dlx tailng add ${this.registrySlug}`;
  protected readonly installNpxCode = `npx tailng add ${this.registrySlug}`;
  protected readonly importCode = this.buildImportCode(this.registrySlug);
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
      registrySlug:
        typeof data['registrySlug'] === 'string' ? data['registrySlug'] : fallbackData.registrySlug,
      usageCode: typeof data['usageCode'] === 'string' ? data['usageCode'] : fallbackData.usageCode,
    };
  }

  private buildImportCode(registrySlug: string): string {
    const symbols = this.installMetadata?.importSymbols ?? [];
    const importPath = this.installMetadata?.importPath ?? `./tailng-ui/${registrySlug}`;

    if (symbols.length === 0) {
      return `import '${importPath}';\n`;
    }

    return `import { ${symbols.join(', ')} } from '${importPath}';\n`;
  }

  private formatRegistryName(registrySlug: string): string {
    return registrySlug
      .split('-')
      .filter((segment) => segment.length > 0)
      .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
      .join(' ');
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
