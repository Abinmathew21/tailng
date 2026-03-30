import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { TngInputGroup, TngSuffix, TngTextarea } from '@tailng-ui/primitives';
import type { DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';
import {
  observeDocsCodeThemeChanges,
  resolveDocsCodeBlockTheme,
} from '../../../../../../shared/util';
import { stackblitzTailwindUrl, stackblitzVanillaUrl } from '../../textarea.util';

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
  selector: 'app-headless-textarea-styling-page',
  imports: [
    TngCodeBlockComponent,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
    TngInputGroup,
    TngTextarea,
    TngSuffix,
  ],
  templateUrl: './headless-textarea-styling-page.component.html',
  styleUrls: [
    './headless-textarea-styling-page.component.css',
    '../overview/headless-textarea-overview-page.component.css',
  ],
})
export class HeadlessTextareaStylingPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);
  protected readonly plainSupportReplyValue = signal(
    'We have identified the root cause and applied the mitigation.',
  );
  protected readonly tailwindSupportReplyValue = signal(
    'We have identified the root cause and applied the mitigation.',
  );

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly stackblitzVanillaUrl = stackblitzVanillaUrl;
  protected readonly stackblitzTailwindUrl = stackblitzTailwindUrl;

  protected readonly contractsCode = [
    '[data-slot="input-group"]',
    '[data-slot="input"]',
    '[data-slot="input-leading"]',
    '[data-slot="input-trailing"]',
    '[data-focused]',
    '[data-invalid]',
    '[data-disabled]',
    '[data-readonly]',
    '[data-resize="vertical" | "horizontal" | "both" | "none"]',
    '',
  ].join('\n');

  protected readonly stateHooksCode = [
    '.support-reply-shell[data-slot="input-group"] {',
    '  align-items: flex-start;',
    '  border: 1px solid var(--tng-semantic-border-strong);',
    '  border-radius: 0.85rem;',
    '  min-height: 8rem;',
    '  padding: 0.7rem 0.85rem;',
    '}',
    '',
    '.support-reply-shell[data-slot="input-group"][data-focused] {',
    '  border-color: var(--tng-semantic-accent-brand);',
    '  box-shadow: 0 0 0 3px color-mix(in srgb, var(--tng-semantic-accent-brand) 18%, transparent);',
    '}',
    '',
    '.support-reply-shell [data-slot="input"] {',
    '  border: 0;',
    '  box-shadow: none;',
    '  min-height: 6.5rem;',
    '  outline: none;',
    '  padding: 0;',
    '  resize: vertical;',
    '}',
    '',
  ].join('\n');

  private readonly scenarioTsCode = [
    "import { Component, signal } from '@angular/core';",
    "import { TngInputGroup, TngSuffix, TngTextarea } from '@tailng-ui/primitives';",
    '',
    '@Component({',
    "  selector: 'app-support-reply-textarea',",
    '  imports: [TngInputGroup, TngTextarea, TngSuffix],',
    "  templateUrl: './support-reply-textarea.component.html',",
    "  styleUrl: './support-reply-textarea.component.css',",
    '})',
    'export class SupportReplyTextareaComponent {',
    "  readonly supportReply = signal('We have identified the root cause and applied the mitigation.');",
    '',
    '  onSupportReplyInput(event: Event): void {',
    '    const target = event.target;',
    '    if (!(target instanceof HTMLTextAreaElement)) return;',
    '    this.supportReply.set(target.value);',
    '  }',
    '}',
    '',
  ].join('\n');

  private readonly scenarioPlainHtmlCode = [
    '<section class="textarea-preview-shell">',
    '  <label class="textarea-preview-label" for="support-reply-textarea">Support reply</label>',
    '  <div tngInputGroup class="support-reply-shell textarea-preview-field-shell">',
    '    <textarea',
    '      id="support-reply-textarea"',
    '      tngTextarea',
    '      rows="5"',
    '      aria-label="Support reply"',
    '      [value]="supportReply()"',
    '      (input)="onSupportReplyInput($event)"',
    '    ></textarea>',
    '    <span tngSuffix aria-hidden="true">Markdown enabled</span>',
    '  </div>',
    '</section>',
    '',
  ].join('\n');

  private readonly scenarioPlainCssCode = this.stateHooksCode;

  private readonly scenarioTailwindHtmlCode = [
    '<section class="grid w-full max-w-[32rem] gap-3">',
    '  <label class="text-xs font-semibold text-[var(--tng-semantic-foreground-secondary)]" for="support-reply-textarea-tailwind">Support reply</label>',
    '  <div',
    '    tngInputGroup',
    '    class="min-h-[8rem] items-start gap-3 rounded-xl border border-[var(--tng-semantic-border-strong)] bg-[var(--tng-semantic-background-base)] px-3 py-3 shadow-none transition [&[data-focused]]:border-[var(--tng-semantic-accent-brand)] [&[data-focused]]:ring-2 [&[data-focused]]:ring-blue-400/20"',
    '  >',
    '    <textarea',
    '      id="support-reply-textarea-tailwind"',
    '      tngTextarea',
    '      rows="5"',
    '      aria-label="Support reply"',
    '      class="min-h-[6.5rem] min-w-0 flex-1 resize-y appearance-none border-0 bg-transparent p-0 text-[var(--tng-semantic-foreground-primary)] outline-none placeholder:text-[var(--tng-semantic-foreground-muted)] focus:outline-none focus:ring-0"',
    '      [value]="supportReply()"',
    '      (input)="onSupportReplyInput($event)"',
    '    ></textarea>',
    '    <span tngSuffix class="pt-1 text-xs font-semibold text-[var(--tng-semantic-foreground-secondary)]">Markdown enabled</span>',
    '  </div>',
    '</section>',
    '',
  ].join('\n');

  protected readonly plainScenarioCodeTabs = createCodeTabs(
    'support-reply-textarea-plain',
    this.scenarioTsCode,
    this.scenarioPlainHtmlCode,
    this.scenarioPlainCssCode,
  );

  protected readonly tailwindScenarioCodeTabs = createCodeTabs(
    'support-reply-textarea-tailwind',
    this.scenarioTsCode,
    this.scenarioTailwindHtmlCode,
    '/* Tailwind utilities are applied directly in the template. */',
  );

  protected readonly resizePatternCode = [
    '[data-slot="input"][data-resize="none"] {',
    '  resize: none;',
    '}',
    '',
    '[data-slot="input"][data-resize="both"] {',
    '  resize: both;',
    '}',
    '',
  ].join('\n');

  protected readonly invalidPatternCode = [
    '[data-slot="input-group"][data-invalid] {',
    '  border-color: var(--tng-semantic-accent-danger);',
    '}',
    '',
    '[data-slot="input-group"][data-disabled] {',
    '  opacity: 0.6;',
    '  cursor: not-allowed;',
    '}',
    '',
  ].join('\n');

  protected onPlainSupportReplyInput(event: Event): void {
    const target = event.target;
    if (!(target instanceof HTMLTextAreaElement)) return;
    this.plainSupportReplyValue.set(target.value);
  }

  protected onTailwindSupportReplyInput(event: Event): void {
    const target = event.target;
    if (!(target instanceof HTMLTextAreaElement)) return;
    this.tailwindSupportReplyValue.set(target.value);
  }

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
