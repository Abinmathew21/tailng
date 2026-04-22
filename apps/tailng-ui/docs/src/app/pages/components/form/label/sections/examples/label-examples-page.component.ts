import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngInputComponent, TngLabelComponent } from '@tailng-ui/components';
import type { DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';
import { DocsFormDemoShellComponent } from '../../../../../../shared/form-demo-shell/docs-form-demo-shell.component';
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
  selector: 'app-label-examples-page',
  imports: [
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
    DocsFormDemoShellComponent,
    TngInputComponent,
    TngLabelComponent,
  ],
  templateUrl: './label-examples-page.component.html',
  styleUrl: './label-examples-page.component.css',
})
export class LabelExamplesPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);
  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(this.documentRef, this.codeBlockTheme);

  protected readonly stackblitzVanillaUrl = stackblitzVanillaUrl;
  protected readonly stackblitzTailwindUrl = stackblitzTailwindUrl;
  protected readonly formDemoProjectName = signal('Nova');
  protected readonly formDemoAlerts = signal(true);

  protected readonly plainCssCodeTabs = createCodeTabs(
    'doc-cmp-label-examples-plain',
    [
      "import { Component } from '@angular/core';",
      "import { TngInputComponent, TngLabelComponent } from '@tailng-ui/components';",
      '',
      '@Component({',
      "  selector: 'app-doc-cmp-label-examples-plain',",
      '  standalone: true,',
      '  imports: [TngInputComponent, TngLabelComponent],',
      "  templateUrl: './doc-cmp-label-examples-plain.component.html',",
      "  styleUrl: './doc-cmp-label-examples-plain.component.css',",
      '})',
      'export class DocCmpLabelExamplesPlainComponent {}',
      '',
    ].join('\n'),
    [
      '<section class="doc-cmp-label-examples-card">',
      '  <div class="doc-cmp-label-examples-card__field">',
      '    <tng-label forId="doc-cmp-label-examples-project" [required]="true">Project name</tng-label>',
      '    <tng-input [id]="\'doc-cmp-label-examples-project\'" type="text" [ariaRequired]="true" placeholder="Nova"></tng-input>',
      '  </div>',
      '  <div class="doc-cmp-label-examples-card__row">',
      '    <input id="doc-cmp-label-examples-alerts" type="checkbox" class="doc-cmp-label-examples-card__checkbox" />',
      '    <tng-label forId="doc-cmp-label-examples-alerts">Send release alerts</tng-label>',
      '  </div>',
      '  <div class="doc-cmp-label-examples-card__field doc-cmp-label-examples-card__field--meta">',
      '    <tng-label forId="doc-cmp-label-examples-archive" [disabled]="true">Archive note</tng-label>',
      '    <tng-input [id]="\'doc-cmp-label-examples-archive\'" type="text" [disabled]="true" placeholder="Readonly metadata"></tng-input>',
      '  </div>',
      '</section>',
      '',
    ].join('\n'),
    [
      '.doc-cmp-label-examples-card {',
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
      '.doc-cmp-label-examples-card__field {',
      '  display: grid;',
      '  gap: 0.55rem;',
      '}',
      '',
      '.doc-cmp-label-examples-card__row {',
      '  display: inline-flex;',
      '  align-items: center;',
      '  gap: 0.75rem;',
      '}',
      '',
      '.doc-cmp-label-examples-card tng-input {',
      '  inline-size: 100%;',
      '}',
      '',
      '.doc-cmp-label-examples-card__checkbox {',
      '  accent-color: var(--tng-semantic-accent-brand);',
      '}',
      '',
      '.doc-cmp-label-examples-card__field--meta tng-label {',
      '  --tng-semantic-foreground-primary: var(--tng-semantic-foreground-secondary);',
      '}',
      '',
    ].join('\n'),
  );

  protected readonly tailwindCodeTabs = createCodeTabs(
    'doc-cmp-label-examples-tailwind',
    [
      "import { Component } from '@angular/core';",
      "import { TngInputComponent, TngLabelComponent } from '@tailng-ui/components';",
      '',
      '@Component({',
      "  selector: 'app-doc-cmp-label-examples-tailwind',",
      '  standalone: true,',
      '  imports: [TngInputComponent, TngLabelComponent],',
      "  templateUrl: './doc-cmp-label-examples-tailwind.component.html',",
      '})',
      'export class DocCmpLabelExamplesTailwindComponent {}',
      '',
    ].join('\n'),
    [
      '<section class="grid w-full max-w-[34rem] gap-4 rounded-2xl border border-[var(--tng-semantic-border-subtle)] bg-[var(--tng-semantic-background-surface)] p-4 text-[var(--tng-semantic-foreground-primary)] shadow-sm">',
      '  <div class="grid gap-2">',
      '    <tng-label forId="doc-cmp-label-examples-tailwind-project" [required]="true">Project name</tng-label>',
      '    <tng-input [id]="\'doc-cmp-label-examples-tailwind-project\'" type="text" [ariaRequired]="true" placeholder="Nova"></tng-input>',
      '  </div>',
      '  <div class="inline-flex items-center gap-3">',
      '    <input id="doc-cmp-label-examples-tailwind-alerts" type="checkbox" class="h-4 w-4 accent-blue-600" />',
      '    <tng-label forId="doc-cmp-label-examples-tailwind-alerts">Send release alerts</tng-label>',
      '  </div>',
      '  <div class="grid gap-2 [--tng-semantic-foreground-primary:var(--tng-semantic-foreground-secondary)]">',
      '    <tng-label forId="doc-cmp-label-examples-tailwind-archive" [disabled]="true">Archive note</tng-label>',
      '    <tng-input [id]="\'doc-cmp-label-examples-tailwind-archive\'" type="text" [disabled]="true" placeholder="Readonly metadata"></tng-input>',
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
