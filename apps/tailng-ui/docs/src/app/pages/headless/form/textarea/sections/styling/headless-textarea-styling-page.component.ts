import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { TngInputGroup, TngTextarea } from '@tailng-ui/primitives';
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
    '  background: var(--tng-semantic-background-base, #ffffff);',
    '  border: 1px solid var(--tng-semantic-border-strong, #94a3b8);',
    '  border-radius: 0.85rem;',
    '  min-height: 8rem;',
    '  padding: 0.7rem 0.85rem;',
    '}',
    '',
    '.support-reply-shell[data-slot="input-group"][data-focused] {',
    '  border-color: var(--tng-semantic-accent-brand, #2563eb);',
    '  box-shadow: 0 0 0 3px',
    '    color-mix(in srgb, var(--tng-semantic-accent-brand, #2563eb) 18%, transparent);',
    '}',
    '',
    '.support-reply-shell [data-slot="input"] {',
    '  background: transparent;',
    '  border: 0;',
    '  box-shadow: none;',
    '  color: var(--tng-semantic-foreground-primary, #0f172a);',
    '  inline-size: 100%;',
    '  min-height: 6.5rem;',
    '  min-inline-size: 0;',
    '  outline: none;',
    '  padding: 0;',
    '  resize: vertical;',
    '}',
    '',
    '.support-reply-shell [data-slot="input"]:focus,',
    '.support-reply-shell [data-slot="input"]:focus-visible {',
    '  box-shadow: none;',
    '  outline: none;',
    '}',
    '',
  ].join('\n');

  private readonly scenarioPlainTsCode = [
    "import { Component, signal } from '@angular/core';",
    "import { TngInputGroup, TngTextarea } from '@tailng-ui/primitives';",
    '',
    '@Component({',
    "  selector: 'app-support-reply-textarea-plain',",
    '  imports: [TngInputGroup, TngTextarea],',
    "  templateUrl: './support-reply-textarea-plain.component.html',",
    "  styleUrl: './support-reply-textarea-plain.component.css',",
    '})',
    'export class SupportReplyTextareaPlainComponent {',
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

  private readonly scenarioTailwindTsCode = [
    "import { Component, signal } from '@angular/core';",
    "import { TngInputGroup, TngTextarea } from '@tailng-ui/primitives';",
    '',
    '@Component({',
    "  selector: 'app-support-reply-textarea-tailwind',",
    '  imports: [TngInputGroup, TngTextarea],',
    "  templateUrl: './support-reply-textarea-tailwind.component.html',",
    "  styleUrl: './support-reply-textarea-tailwind.component.css',",
    '})',
    'export class SupportReplyTextareaTailwindComponent {',
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
    '<section class="support-reply-demo-shell">',
    '  <div class="support-reply-demo-header">',
    '    <label class="support-reply-demo-label" for="support-reply-textarea">Support reply</label>',
    '    <span class="support-reply-demo-status" aria-hidden="true">Markdown enabled</span>',
    '  </div>',
    '  <div tngInputGroup class="support-reply-shell">',
    '    <textarea',
    '      id="support-reply-textarea"',
    '      tngTextarea',
    '      rows="5"',
    '      aria-label="Support reply"',
    '      [value]="supportReply()"',
    '      (input)="onSupportReplyInput($event)"',
    '    ></textarea>',
    '  </div>',
    '</section>',
    '',
  ].join('\n');

  private readonly scenarioPlainCssCode = [
    '.support-reply-demo-shell {',
    '  display: grid;',
    '  gap: 0.65rem;',
    '  inline-size: min(100%, 32rem);',
    '  margin-inline: auto;',
    '}',
    '',
    '.support-reply-demo-header {',
    '  align-items: center;',
    '  display: flex;',
    '  gap: 0.75rem;',
    '  justify-content: space-between;',
    '}',
    '',
    '.support-reply-demo-label {',
    '  color: var(--tng-semantic-foreground-secondary, #64748b);',
    '  font-size: 0.82rem;',
    '  font-weight: 700;',
    '  letter-spacing: 0.01em;',
    '}',
    '',
    '.support-reply-demo-status {',
    '  background: var(--tng-semantic-background-base, #ffffff);',
    '  border: 1px solid var(--tng-semantic-border-subtle, #cbd5e1);',
    '  border-radius: 9999px;',
    '  color: var(--tng-semantic-foreground-secondary, #64748b);',
    '  font-size: 0.75rem;',
    '  font-weight: 700;',
    '  padding: 0.35rem 0.7rem;',
    '}',
    '',
    '.support-reply-shell[data-slot="input-group"] {',
    '  align-items: flex-start;',
    '  background: var(--tng-semantic-background-base, #ffffff);',
    '  border: 1px solid var(--tng-semantic-border-strong, #94a3b8);',
    '  border-radius: 0.85rem;',
    '  min-height: 8rem;',
    '  padding: 0.7rem 0.85rem;',
    '}',
    '',
    '.support-reply-shell[data-slot="input-group"][data-focused] {',
    '  border-color: var(--tng-semantic-accent-brand, #2563eb);',
    '  box-shadow: 0 0 0 3px',
    '    color-mix(in srgb, var(--tng-semantic-accent-brand, #2563eb) 18%, transparent);',
    '}',
    '',
    '.support-reply-shell [data-slot="input"] {',
    '  background: transparent;',
    '  border: 0;',
    '  box-shadow: none;',
    '  color: var(--tng-semantic-foreground-primary, #0f172a);',
    '  inline-size: 100%;',
    '  min-height: 6.5rem;',
    '  min-inline-size: 0;',
    '  outline: none;',
    '  padding: 0;',
    '  resize: vertical;',
    '}',
    '',
    '.support-reply-shell [data-slot="input"]:focus,',
    '.support-reply-shell [data-slot="input"]:focus-visible {',
    '  box-shadow: none;',
    '  outline: none;',
    '}',
    '',
  ].join('\n');

  private readonly scenarioTailwindHtmlCode = [
    '<section class="grid w-full max-w-[32rem] gap-3">',
    '  <div class="flex items-center justify-between gap-3">',
    '    <label class="text-xs font-semibold tracking-[0.01em] text-slate-600 dark:text-slate-400" for="support-reply-textarea-tailwind">',
    '      Support reply',
    '    </label>',
    '    <span',
    '      aria-hidden="true"',
    '      class="rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-semibold tracking-[0.01em] text-slate-500 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-400"',
    '    >',
    '      Markdown enabled',
    '    </span>',
    '  </div>',
    '  <div',
    '    tngInputGroup',
    '    class="min-h-[8rem] items-start rounded-xl border border-slate-300 bg-white px-3 py-3 shadow-sm transition dark:border-slate-600 dark:bg-slate-950 [&[data-focused]]:border-blue-500 [&[data-focused]]:ring-4 [&[data-focused]]:ring-blue-500/15"',
    '  >',
    '    <textarea',
    '      id="support-reply-textarea-tailwind"',
    '      tngTextarea',
    '      rows="5"',
    '      aria-label="Support reply"',
    '      class="min-h-[6.5rem] w-full min-w-0 flex-1 resize-y appearance-none border-0 bg-transparent p-0 text-slate-900 outline-none shadow-none dark:text-slate-50 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0"',
    '      [value]="supportReply()"',
    '      (input)="onSupportReplyInput($event)"',
    '    ></textarea>',
    '  </div>',
    '</section>',
    '',
  ].join('\n');

  protected readonly plainScenarioCodeTabs = createCodeTabs(
    'support-reply-textarea-plain',
    this.scenarioPlainTsCode,
    this.scenarioPlainHtmlCode,
    this.scenarioPlainCssCode,
  );

  protected readonly tailwindScenarioCodeTabs = createCodeTabs(
    'support-reply-textarea-tailwind',
    this.scenarioTailwindTsCode,
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
