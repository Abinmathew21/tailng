import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { observeDocsCodeThemeChanges, resolveDocsCodeBlockTheme } from '../../../../../../shared/util';
import { TngRadioComponent } from '@tailng-ui/components';
import { TngRadio as TngRadioPrimitive } from '@tailng-ui/primitives';
import { type DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';

function createCodeTabs(
  baseName: string,
  htmlCode: string,
  cssCode: string,
): readonly DocsExampleCodeTab[] {
  return Object.freeze([
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
  selector: 'app-radio-styling-page',
  imports: [
    TngRadioComponent,
    TngRadioPrimitive,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './radio-styling-page.component.html',
  styleUrl: './radio-styling-page.component.css',
})
export class RadioStylingPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(this.documentRef, this.codeBlockTheme);

  protected readonly headlessCodeTabs = createCodeTabs(
    'radio-styles-headless',
    [
      '<label class="radio-row">',
      '  <input tngRadio [checked]="true" />',
      '  <span>Production release</span>',
      '</label>',
      '',
    ].join('\n'),
    [
      '.radio-row {',
      '  align-items: center;',
      '  color: var(--tng-semantic-foreground-primary);',
      '  display: inline-flex;',
      '  gap: 0.55rem;',
      '}',
      '.radio-row input[data-invalid] {',
      '  outline: 1px solid var(--tng-semantic-accent-danger);',
      '  outline-offset: 1px;',
      '}',
      '',
    ].join('\n'),
  );

  protected readonly plainCssCodeTabs = createCodeTabs(
    'radio-styles-plain-css',
    [
      '<div class="settings-panel">',
      '  <tng-radio [checked]="true">Production release</tng-radio>',
      '  <tng-radio [invalid]="true">Needs compliance approval</tng-radio>',
      '</div>',
      '',
    ].join('\n'),
    [
      '.settings-panel {',
      '  background: var(--tng-semantic-background-surface);',
      '  border: 1px solid var(--tng-semantic-border-subtle);',
      '  border-radius: 0.8rem;',
      '  display: grid;',
      '  gap: 0.75rem;',
      '  padding: 0.9rem 1rem;',
      '}',
      '',
    ].join('\n'),
  );

  protected readonly tailwindCodeTabs = createCodeTabs(
    'radio-styles-tailwind',
    [
      '<div class="grid gap-3 rounded-xl border border-slate-300 bg-white/80 p-4 dark:border-slate-700 dark:bg-slate-900/60">',
      '  <tng-radio [checked]="true" class="text-slate-900 dark:text-slate-100">Production release</tng-radio>',
      '  <tng-radio [invalid]="true" class="text-slate-900 dark:text-slate-100">Needs compliance approval</tng-radio>',
      '</div>',
      '',
    ].join('\n'),
    '/* Tailwind utilities are applied directly in the template. */',
  );

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }

}
