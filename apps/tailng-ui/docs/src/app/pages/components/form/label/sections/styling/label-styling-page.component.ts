import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngInputComponent, TngLabelComponent } from '@tailng-ui/components';
import type { DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';
import { observeDocsCodeThemeChanges, resolveDocsCodeBlockTheme } from '../../../../../../shared/util';
import { stackblitzTailwindUrl, stackblitzVanillaUrl } from '../../label.util';

function createCodeTabs(
  baseName: string,
  tsCode: string,
  htmlCode: string,
  cssCode: string,
): readonly DocsExampleCodeTab[] {
  return Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: `${baseName}.component.ts`,
      code: tsCode,
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: `${baseName}.component.html`,
      code: htmlCode,
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: `${baseName}.component.css`,
      code: cssCode,
    },
  ]);
}

@Component({
  selector: 'app-label-styling-page',
  imports: [DocsExampleTabsSectionComponent, DocsExampleVariantDirective, TngInputComponent, TngLabelComponent],
  templateUrl: './label-styling-page.component.html',
  styleUrl: './label-styling-page.component.css',
})
export class LabelStylingPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);
  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(this.documentRef, this.codeBlockTheme);

  protected readonly stackblitzVanillaUrl = stackblitzVanillaUrl;
  protected readonly stackblitzTailwindUrl = stackblitzTailwindUrl;

  protected readonly plainCssCodeTabs = createCodeTabs(
    'doc-cmp-label-styling-plain',
    [
      "import { Component } from '@angular/core';",
      "import { TngInputComponent, TngLabelComponent } from '@tailng-ui/components';",
      '',
      '@Component({',
      "  selector: 'app-doc-cmp-label-styling-plain',",
      '  standalone: true,',
      '  imports: [TngInputComponent, TngLabelComponent],',
      "  templateUrl: './doc-cmp-label-styling-plain.component.html',",
      "  styleUrl: './doc-cmp-label-styling-plain.component.css',",
      '})',
      'export class DocCmpLabelStylingPlainComponent {}',
      '',
    ].join('\n'),
    [
      '<section class="doc-cmp-label-styling-card">',
      '  <div class="doc-cmp-label-styling-card__field">',
      '    <tng-label forId="doc-cmp-label-styling-owner" [required]="true">',
      '      Release owner',
      '    </tng-label>',
      '    <tng-input [id]="\'doc-cmp-label-styling-owner\'" type="text"></tng-input>',
      '  </div>',
      '  <div class="doc-cmp-label-styling-card__field doc-cmp-label-styling-card__field--muted">',
      '    <tng-label forId="doc-cmp-label-styling-archive" [disabled]="true">',
      '      Archived environment',
      '    </tng-label>',
      '    <tng-input [id]="\'doc-cmp-label-styling-archive\'" type="text" [disabled]="true"></tng-input>',
      '  </div>',
      '</section>',
      '',
    ].join('\n'),
    [
      '.doc-cmp-label-styling-card {',
      '  display: grid;',
      '  gap: 1rem;',
      '  inline-size: min(100%, 34rem);',
      '  margin-inline: auto;',
      '  padding: 1rem;',
      '  border: 1px solid var(--tng-semantic-border-subtle);',
      '  border-radius: 1rem;',
      '  background: var(--tng-semantic-background-surface);',
      '  color: var(--tng-semantic-foreground-primary);',
      '}',
      '',
      '.doc-cmp-label-styling-card__field {',
      '  display: grid;',
      '  gap: 0.55rem;',
      '}',
      '',
      '.doc-cmp-label-styling-card__field tng-label {',
      '  --tng-semantic-foreground-primary: #0f172a;',
      '  --tng-semantic-accent-danger: #dc2626;',
      '}',
      '',
      '.doc-cmp-label-styling-card__field--muted tng-label {',
      '  --tng-semantic-foreground-primary: #64748b;',
      '}',
      '',
      '.doc-cmp-label-styling-card tng-input {',
      '  inline-size: 100%;',
      '}',
      '',
    ].join('\n'),
  );

  protected readonly tailwindCodeTabs = createCodeTabs(
    'doc-cmp-label-styling-tailwind',
    [
      "import { Component } from '@angular/core';",
      "import { TngInputComponent, TngLabelComponent } from '@tailng-ui/components';",
      '',
      '@Component({',
      "  selector: 'app-doc-cmp-label-styling-tailwind',",
      '  standalone: true,',
      '  imports: [TngInputComponent, TngLabelComponent],',
      "  templateUrl: './doc-cmp-label-styling-tailwind.component.html',",
      '})',
      'export class DocCmpLabelStylingTailwindComponent {}',
      '',
    ].join('\n'),
    [
      '<section class="grid w-full max-w-[34rem] gap-4 rounded-2xl border border-[var(--tng-semantic-border-subtle)] bg-[var(--tng-semantic-background-surface)] p-4 text-[var(--tng-semantic-foreground-primary)] shadow-sm">',
      '  <div class="grid gap-2">',
      '    <tng-label',
      '      forId="doc-cmp-label-styling-tailwind-owner"',
      '      [required]="true"',
      '    >',
      '      Release owner',
      '    </tng-label>',
      '    <tng-input [id]="\'doc-cmp-label-styling-tailwind-owner\'" type="text"></tng-input>',
      '  </div>',
      '  <div class="grid gap-2 [--tng-semantic-foreground-primary:#64748b]">',
      '    <tng-label',
      '      forId="doc-cmp-label-styling-tailwind-archive"',
      '      [disabled]="true"',
      '    >',
      '      Archived environment',
      '    </tng-label>',
      '    <tng-input [id]="\'doc-cmp-label-styling-tailwind-archive\'" type="text" [disabled]="true"></tng-input>',
      '  </div>',
      '</section>',
      '',
    ].join('\n'),
    '/* tng-input and tng-label use default component styles; optional utilities stay on wrappers. */',
  );

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
