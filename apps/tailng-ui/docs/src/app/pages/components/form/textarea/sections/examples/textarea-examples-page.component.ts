import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngTextareaComponent } from '@tailng-ui/components';
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
  selector: 'app-textarea-examples-page',
  imports: [
    TngTextareaComponent,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './textarea-examples-page.component.html',
  styleUrl: './textarea-examples-page.component.css',
})
export class TextareaExamplesPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly plainValue = signal(
    'Block-level announcement draft for internal release channels.',
  );
  protected readonly tailwindValue = signal('Follow-up note with owner, ETA, and mitigation plan.');

  protected readonly stackblitzVanillaUrl = stackblitzVanillaUrl;
  protected readonly stackblitzTailwindUrl = stackblitzTailwindUrl;

  protected readonly plainCssCodeTabs = createCodeTabs({
    baseName: 'textarea-examples-plain-css',
    tsCode: [
      "import { Component, signal } from '@angular/core';",
      "import { TngTextareaComponent } from '@tailng-ui/components';",
      '',
      '@Component({',
      "  selector: 'app-textarea-examples-plain-css',",
      '  imports: [TngTextareaComponent],',
      "  templateUrl: './textarea-examples-plain-css.component.html',",
      "  styleUrl: './textarea-examples-plain-css.component.css',",
      '})',
      'export class TextareaExamplesPlainCssComponent {',
      '  readonly postmortemSummary = signal(',
      "    'Block-level announcement draft for internal release channels.',",
      '  );',
      '',
      '  onPostmortemSummaryChange(value: string): void {',
      '    this.postmortemSummary.set(value);',
      '  }',
      '}',
      '',
    ].join('\n'),
    htmlCode: [
      '<section class="textarea-postmortem-example">',
      '  <label class="textarea-postmortem-example__label" for="postmortem-summary-textarea">',
      '    Postmortem summary',
      '  </label>',
      '  <tng-textarea',
      '    [id]="\'postmortem-summary-textarea\'"',
      '    [rows]="5"',
      '    [resize]="\'none\'"',
      '    [placeholder]="\'Add postmortem summary\'"',
      '    [value]="postmortemSummary()"',
      '    (valueChange)="onPostmortemSummaryChange($event)"',
      '  ></tng-textarea>',
      '  <p class="textarea-postmortem-example__meta">{{ postmortemSummary().length }} characters</p>',
      '</section>',
      '',
    ].join('\n'),
    cssCode: [
      '.textarea-postmortem-example {',
      '  display: grid;',
      '  gap: 0.65rem;',
      '  inline-size: min(100%, 42rem);',
      '  margin-inline: auto;',
      '  border: 1px solid var(--tng-semantic-border-subtle, #cbd5e1);',
      '  border-radius: 0.9rem;',
      '  padding: 1rem;',
      '}',
      '',
      '.textarea-postmortem-example__label {',
      '  color: var(--tng-semantic-foreground-secondary, #64748b);',
      '  font-size: 0.82rem;',
      '  font-weight: 700;',
      '  letter-spacing: 0.01em;',
      '}',
      '',
      '.textarea-postmortem-example tng-textarea {',
      '  display: block;',
      '  inline-size: 100%;',
      '  max-inline-size: 100%;',
      '  min-inline-size: 0;',
      '}',
      '',
      '.textarea-postmortem-example__meta {',
      '  color: var(--tng-semantic-foreground-secondary, #64748b);',
      '  font-size: 0.78rem;',
      '  margin: 0;',
      '}',
      '',
    ].join('\n'),
  });

  protected readonly tailwindCodeTabs = createCodeTabs({
    baseName: 'textarea-examples-tailwind',
    tsCode: [
      "import { Component, signal } from '@angular/core';",
      "import { TngTextareaComponent } from '@tailng-ui/components';",
      '',
      '@Component({',
      "  selector: 'app-textarea-examples-tailwind',",
      '  imports: [TngTextareaComponent],',
      "  templateUrl: './textarea-examples-tailwind.component.html',",
      "  styleUrl: './textarea-examples-tailwind.component.css',",
      '})',
      'export class TextareaExamplesTailwindComponent {',
      "  readonly customerUpdate = signal('Follow-up note with owner, ETA, and mitigation plan.');",
      '',
      '  onCustomerUpdateChange(value: string): void {',
      '    this.customerUpdate.set(value);',
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
      '    [rows]="5"',
      '    [resize]="\'vertical\'"',
      '    [placeholder]="\'Write customer-facing notes\'"',
      '    [value]="customerUpdate()"',
      '    (valueChange)="onCustomerUpdateChange($event)"',
      '  ></tng-textarea>',
      '  <p class="text-xs text-slate-500 dark:text-slate-400">{{ customerUpdate().length }} characters</p>',
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
