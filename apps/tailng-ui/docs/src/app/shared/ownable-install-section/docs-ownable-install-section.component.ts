import { DOCUMENT } from '@angular/common';
import { Component, inject, input, signal, type OnDestroy } from '@angular/core';
import { observeDocsCodeThemeChanges, resolveDocsCodeBlockTheme } from '../util';
import { ActivatedRoute, type Data } from '@angular/router';
import { TngCodeBlockComponent, TngTabsComponent } from '@tailng-ui/components';
import { TngTab, TngTabList, TngTabPanel } from '@tailng-ui/primitives';
import { getRegistryGeneratedFilePaths, getRegistryInstallMetadata } from '@tailng-ui/registry';

type OwnableInstallRouteData = {
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

  public readonly registrySlugInput = input<string | null>(null, { alias: 'registrySlug' });
  public readonly componentNameInput = input<string | null>(null, { alias: 'componentName' });
  public readonly usageCodeInput = input<string | null>(null, { alias: 'usageCode' });

  protected get registrySlug(): string {
    return this.registrySlugInput() ?? this.routeData.registrySlug;
  }

  protected get componentName(): string {
    return (
      this.componentNameInput() ??
      this.docsItem?.title ??
      this.formatRegistryName(this.registrySlug)
    );
  }

  protected get installMetadata() {
    return getRegistryInstallMetadata(this.registrySlug);
  }

  protected get hasRegistryItem(): boolean {
    return this.installMetadata !== undefined;
  }

  protected get generatedFiles(): readonly string[] {
    return getRegistryGeneratedFilePaths(this.registrySlug);
  }

  protected get installPnpmCode(): string {
    return `pnpm dlx tailng add ${this.registrySlug}`;
  }

  protected get installNpxCode(): string {
    return `npx tailng add ${this.registrySlug}`;
  }

  protected get importCode(): string {
    return this.buildImportCode(this.registrySlug);
  }

  protected get usageCode(): string {
    return this.usageCodeInput() ?? this.routeData.usageCode;
  }

  protected readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(this.documentRef, this.codeBlockTheme);

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

}
