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
  selector: 'app-headless-textarea-api-page',
  imports: [
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
    TngCodeBlockComponent,
    TngInputGroup,
    TngTextarea,
  ],
  templateUrl: './headless-textarea-api-page.component.html',
  styleUrls: [
    './headless-textarea-api-page.component.css',
    '../overview/headless-textarea-overview-page.component.css',
  ],
})
export class HeadlessTextareaApiPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);
  protected readonly plainReviewNotesValue = signal(
    'Document the browser-safe fallback for the auth redirect flow.',
  );
  protected readonly tailwindReviewNotesValue = signal(
    'Document the browser-safe fallback for the auth redirect flow.',
  );

  protected readonly stackblitzVanillaUrl = stackblitzVanillaUrl;
  protected readonly stackblitzTailwindUrl = stackblitzTailwindUrl;

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly directiveAttachCode = [
    '<textarea tngTextarea rows="4"></textarea>',
    '',
  ].join('\n');

  protected readonly groupTemplateCode = [
    '<div tngInputGroup class="review-notes-shell">',
    '  <textarea',
    '    tngTextarea',
    '    rows="5"',
    '    placeholder="Add reviewer notes"',
    '    aria-label="Reviewer notes"',
    '  ></textarea>',
    '  <span tngInputFieldSuffix aria-hidden="true">Draft</span>',
    '</div>',
    '',
  ].join('\n');

  private readonly groupDemoPlainTsCode = [
    "import { Component, signal } from '@angular/core';",
    "import { TngInputGroup, TngTextarea } from '@tailng-ui/primitives';",
    '',
    '@Component({',
    "  selector: 'app-grouped-review-notes-plain',",
    '  imports: [TngInputGroup, TngTextarea],',
    "  templateUrl: './grouped-review-notes-plain.component.html',",
    "  styleUrl: './grouped-review-notes-plain.component.css',",
    '})',
    'export class GroupedReviewNotesPlainComponent {',
    "  readonly reviewNotes = signal('Document the browser-safe fallback for the auth redirect flow.');",
    '',
    '  onReviewNotesInput(event: Event): void {',
    '    const target = event.target;',
    '    if (!(target instanceof HTMLTextAreaElement)) return;',
    '    this.reviewNotes.set(target.value);',
    '  }',
    '}',
    '',
  ].join('\n');

  private readonly groupDemoTailwindTsCode = [
    "import { Component, signal } from '@angular/core';",
    "import { TngInputGroup, TngTextarea } from '@tailng-ui/primitives';",
    '',
    '@Component({',
    "  selector: 'app-grouped-review-notes-tailwind',",
    '  imports: [TngInputGroup, TngTextarea],',
    "  templateUrl: './grouped-review-notes-tailwind.component.html',",
    "  styleUrl: './grouped-review-notes-tailwind.component.css',",
    '})',
    'export class GroupedReviewNotesTailwindComponent {',
    "  readonly reviewNotes = signal('Document the browser-safe fallback for the auth redirect flow.');",
    '',
    '  onReviewNotesInput(event: Event): void {',
    '    const target = event.target;',
    '    if (!(target instanceof HTMLTextAreaElement)) return;',
    '    this.reviewNotes.set(target.value);',
    '  }',
    '}',
    '',
  ].join('\n');

  private readonly groupDemoPlainHtmlCode = [
    '<section class="textarea-review-demo-shell">',
    '  <div class="textarea-review-demo-header">',
    '    <label class="textarea-review-demo-label" for="review-notes-demo">Reviewer notes</label>',
    '    <span class="textarea-review-demo-status" aria-hidden="true">Draft</span>',
    '  </div>',
    '  <div tngInputGroup class="textarea-review-demo-field-shell">',
    '    <textarea',
    '      id="review-notes-demo"',
      '      tngTextarea',
    '      rows="5"',
    '      placeholder="Add reviewer notes"',
    '      aria-label="Reviewer notes"',
    '      [value]="reviewNotes()"',
    '      (input)="onReviewNotesInput($event)"',
    '    ></textarea>',
    '  </div>',
    '</section>',
    '',
  ].join('\n');

  private readonly groupDemoPlainCssCode = [
    '.textarea-review-demo-shell {',
    '  display: grid;',
    '  gap: 0.65rem;',
    '  inline-size: min(100%, 32rem);',
    '  margin-inline: auto;',
    '}',
    '',
    '.textarea-review-demo-header {',
    '  align-items: center;',
    '  display: flex;',
    '  gap: 0.75rem;',
    '  justify-content: space-between;',
    '}',
    '',
    '.textarea-review-demo-label {',
    '  color: var(--tng-semantic-foreground-secondary, #64748b);',
    '  font-size: 0.82rem;',
    '  font-weight: 700;',
    '  letter-spacing: 0.01em;',
    '}',
    '',
    '.textarea-review-demo-status {',
    '  background: var(--tng-semantic-background-base, #ffffff);',
    '  border: 1px solid var(--tng-semantic-border-subtle, #cbd5e1);',
    '  border-radius: 9999px;',
    '  color: var(--tng-semantic-foreground-secondary, #64748b);',
    '  font-size: 0.75rem;',
    '  font-weight: 700;',
    '  padding: 0.35rem 0.7rem;',
    '}',
    '',
    '.textarea-review-demo-field-shell[data-slot="input-group"] {',
    '  align-items: flex-start;',
    '  background: var(--tng-semantic-background-base, #ffffff);',
    '  border: 1px solid var(--tng-semantic-border-strong, #94a3b8);',
    '  border-radius: 0.8rem;',
    '  min-height: 8rem;',
    '  padding: 0.7rem 0.85rem;',
    '}',
    '',
    '.textarea-review-demo-field-shell[data-slot="input-group"][data-focused] {',
    '  border-color: color-mix(',
    '    in srgb,',
    '    var(--tng-semantic-accent-brand, #2563eb) 55%,',
    '    var(--tng-semantic-border-strong, #94a3b8)',
    '  );',
    '  box-shadow: 0 0 0 3px',
    '    color-mix(in srgb, var(--tng-semantic-accent-brand, #2563eb) 18%, transparent);',
    '}',
    '',
    '.textarea-review-demo-field-shell [data-slot="input"] {',
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
  ].join('\n');

  private readonly groupDemoTailwindHtmlCode = [
    '<section class="grid w-full max-w-[32rem] gap-3">',
    '  <div class="flex items-center justify-between gap-3">',
    '    <label class="text-xs font-semibold tracking-[0.01em] text-slate-600 dark:text-slate-400" for="review-notes-demo-tailwind">',
    '      Reviewer notes',
    '    </label>',
    '    <span',
    '      aria-hidden="true"',
    '      class="rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-semibold tracking-[0.01em] text-slate-500 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-400"',
    '    >',
    '      Draft',
    '    </span>',
    '  </div>',
    '  <div',
    '    tngInputGroup',
    '    class="min-h-[8rem] items-start rounded-xl border border-slate-300 bg-white px-3 py-3 shadow-sm transition dark:border-slate-600 dark:bg-slate-950 [&[data-focused]]:border-blue-500 [&[data-focused]]:ring-4 [&[data-focused]]:ring-blue-500/15"',
    '  >',
    '    <textarea',
    '      id="review-notes-demo-tailwind"',
    '      tngTextarea',
    '      rows="5"',
    '      placeholder="Add reviewer notes"',
    '      aria-label="Reviewer notes"',
    '      class="min-h-[6.5rem] w-full min-w-0 flex-1 resize-y appearance-none border-0 bg-transparent p-0 text-slate-900 outline-none placeholder:text-slate-400 dark:text-slate-50 dark:placeholder:text-slate-500 focus:outline-none focus:ring-0"',
    '      [value]="reviewNotes()"',
    '      (input)="onReviewNotesInput($event)"',
    '    ></textarea>',
    '  </div>',
    '</section>',
    '',
  ].join('\n');

  protected readonly groupDemoPlainCodeTabs = createCodeTabs(
    'grouped-review-notes-plain',
    this.groupDemoPlainTsCode,
    this.groupDemoPlainHtmlCode,
    this.groupDemoPlainCssCode,
  );

  protected readonly groupDemoTailwindCodeTabs = createCodeTabs(
    'grouped-review-notes-tailwind',
    this.groupDemoTailwindTsCode,
    this.groupDemoTailwindHtmlCode,
    '/* Tailwind utilities are applied directly in the template. */',
  );

  protected onPlainReviewNotesInput(event: Event): void {
    const target = event.target;
    if (!(target instanceof HTMLTextAreaElement)) return;
    this.plainReviewNotesValue.set(target.value);
  }

  protected onTailwindReviewNotesInput(event: Event): void {
    const target = event.target;
    if (!(target instanceof HTMLTextAreaElement)) return;
    this.tailwindReviewNotesValue.set(target.value);
  }

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
