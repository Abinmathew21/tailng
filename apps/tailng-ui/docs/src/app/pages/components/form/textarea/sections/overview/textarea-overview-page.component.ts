import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent, TngTextareaComponent } from '@tailng-ui/components';
import type { DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';
import { observeDocsCodeThemeChanges, resolveDocsCodeBlockTheme } from '../../../../../../shared/util';
import { stackblitzTailwindUrl, stackblitzVanillaUrl } from '../../textarea.util';

type ExampleCodeTabsArgs = {
  baseName: string;
  tsCode: string;
  htmlCode: string;
  cssCode: string;
};

function createCodeTabs({
  baseName,
  tsCode,
  htmlCode,
  cssCode,
}: ExampleCodeTabsArgs): readonly DocsExampleCodeTab[] {
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
  selector: 'app-textarea-overview-page',
  imports: [
    TngCodeBlockComponent,
    TngTextareaComponent,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './textarea-overview-page.component.html',
  styleUrl: './textarea-overview-page.component.css',
})
export class TextareaOverviewPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly plainValue = signal('Add concise release highlights for the weekly digest.');
  protected readonly tailwindValue = signal('Ship notes in both plain language and changelog format.');

  protected readonly stackblitzVanillaUrl = stackblitzVanillaUrl;
  protected readonly stackblitzTailwindUrl = stackblitzTailwindUrl;

  protected readonly primitiveImportCode = [
    "import { TngInputGroup, TngTextarea } from '@tailng-ui/primitives';",
    '',
  ].join('\n');

  protected readonly componentImportCode =
    "import { TngTextareaComponent } from '@tailng-ui/components';\n";

  protected readonly plainCssCodeTabs = createCodeTabs({
    baseName: 'textarea-overview-plain-css',
    tsCode: [
      "import { Component, signal } from '@angular/core';",
      "import { TngTextareaComponent } from '@tailng-ui/components';",
      '',
      '@Component({',
      "  selector: 'app-textarea-overview-plain-css',",
      '  imports: [TngTextareaComponent],',
      "  templateUrl: './textarea-overview-plain-css.component.html',",
      "  styleUrl: './textarea-overview-plain-css.component.css',",
      '})',
      'export class TextareaOverviewPlainCssComponent {',
      "  readonly value = signal('Add concise release highlights for the weekly digest.');",
      '',
      '  onValueChange(value: string): void {',
      '    this.value.set(value);',
      '  }',
      '}',
      '',
    ].join('\n'),
    htmlCode: [
      '<section class="textarea-preview-shell textarea-preview-shell--plain">',
      '  <label class="textarea-preview-label" for="team-summary-textarea">Team summary</label>',
      '  <tng-textarea',
      '    [id]="\'team-summary-textarea\'"',
      '    [rows]="4"',
      '    [placeholder]="\'Summarize this sprint\'"',
      '    [value]="value()"',
      '    (valueChange)="onValueChange($event)"',
      '  ></tng-textarea>',
      '  <p class="textarea-preview-value">{{ value().length }} characters</p>',
      '</section>',
      '',
    ].join('\n'),
    cssCode: [
      '.textarea-preview-shell {',
      '  display: grid;',
      '  gap: 0.65rem;',
      '  inline-size: min(100%, 42rem);',
      '  margin-inline: auto;',
      '}',
      '',
      '.textarea-preview-label {',
      '  color: var(--tng-semantic-foreground-secondary, #64748b);',
      '  font-size: 0.82rem;',
      '  font-weight: 700;',
      '  letter-spacing: 0.01em;',
      '}',
      '',
      '.textarea-preview-shell--plain {',
      '  border: 1px solid var(--tng-semantic-border-subtle, #cbd5e1);',
      '  border-radius: 0.85rem;',
      '  padding: 0.9rem;',
      '}',
      '',
      '.textarea-preview-shell--plain tng-textarea {',
      '  inline-size: 100%;',
      '}',
      '',
      '.textarea-preview-value {',
      '  color: var(--tng-semantic-foreground-secondary, #64748b);',
      '  font-size: 0.78rem;',
      '  margin: 0;',
      '}',
      '',
    ].join('\n'),
  });

  protected readonly tailwindCodeTabs = createCodeTabs({
    baseName: 'textarea-overview-tailwind',
    tsCode: [
      "import { Component, signal } from '@angular/core';",
      "import { TngTextareaComponent } from '@tailng-ui/components';",
      '',
      '@Component({',
      "  selector: 'app-textarea-overview-tailwind',",
      '  imports: [TngTextareaComponent],',
      "  templateUrl: './textarea-overview-tailwind.component.html',",
      "  styleUrl: './textarea-overview-tailwind.component.css',",
      '})',
      'export class TextareaOverviewTailwindComponent {',
      "  readonly value = signal('Ship notes in both plain language and changelog format.');",
      '',
      '  onValueChange(value: string): void {',
      '    this.value.set(value);',
      '  }',
      '}',
      '',
    ].join('\n'),
    htmlCode: [
      '<section class="grid w-full max-w-[42rem] gap-3 rounded-xl border border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">',
      '  <label',
      '    class="text-xs font-semibold tracking-[0.01em] text-slate-600 dark:text-slate-400"',
      '    for="customer-update-textarea"',
      '  >',
      '    Customer update',
      '  </label>',
      '  <tng-textarea',
      '    [id]="\'customer-update-textarea\'"',
      '    [rows]="4"',
      '    [placeholder]="\'Write a customer-facing summary\'"',
      '    [value]="value()"',
      '    (valueChange)="onValueChange($event)"',
      '  ></tng-textarea>',
      '  <p class="text-xs text-slate-500 dark:text-slate-400">{{ value().length }} characters</p>',
      '</section>',
      '',
    ].join('\n'),
    cssCode:
      '/* tng-textarea needs no CSS; optional utilities stay on section/label wrappers only. */',
  });

  protected onPlainValueChange(value: string): void {
    this.plainValue.set(value);
  }

  protected onTailwindValueChange(value: string): void {
    this.tailwindValue.set(value);
  }

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
