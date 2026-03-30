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
  selector: 'app-headless-textarea-api-page',
  imports: [
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
    TngCodeBlockComponent,
    TngInputGroup,
    TngTextarea,
    TngSuffix,
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
    '  <span tngSuffix aria-hidden="true">Draft</span>',
    '</div>',
    '',
  ].join('\n');

  private readonly groupDemoTsCode = [
    "import { Component, signal } from '@angular/core';",
    "import { TngInputGroup, TngSuffix, TngTextarea } from '@tailng-ui/primitives';",
    '',
    '@Component({',
    "  selector: 'app-grouped-review-notes',",
    '  imports: [TngInputGroup, TngTextarea, TngSuffix],',
    "  templateUrl: './grouped-review-notes.component.html',",
    "  styleUrl: './grouped-review-notes.component.css',",
    '})',
    'export class GroupedReviewNotesComponent {',
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
    '<section class="textarea-preview-shell">',
    '  <label class="textarea-preview-label" for="review-notes-demo">Reviewer notes</label>',
    '  <div tngInputGroup class="textarea-preview-field-shell">',
    '    <textarea',
    '      id="review-notes-demo"',
    '      tngTextarea',
    '      rows="5"',
    '      placeholder="Add reviewer notes"',
    '      aria-label="Reviewer notes"',
    '      [value]="reviewNotes()"',
    '      (input)="onReviewNotesInput($event)"',
    '    ></textarea>',
    '    <span tngSuffix aria-hidden="true">Draft</span>',
    '  </div>',
    '</section>',
    '',
  ].join('\n');

  private readonly groupDemoPlainCssCode = [
    '.textarea-preview-shell {',
    '  display: grid;',
    '  gap: 0.65rem;',
    '  width: min(100%, 32rem);',
    '}',
    '',
    '.textarea-preview-field-shell[data-slot="input-group"] {',
    '  align-items: flex-start;',
    '  border: 1px solid var(--tng-semantic-border-strong);',
    '  border-radius: 0.8rem;',
    '  min-height: 8rem;',
    '  padding: 0.7rem 0.85rem;',
    '}',
    '',
    '.textarea-preview-field-shell [data-slot="input"] {',
    '  border: 0;',
    '  box-shadow: none;',
    '  min-height: 6.5rem;',
    '  outline: none;',
    '  padding: 0;',
    '  resize: vertical;',
    '}',
    '',
  ].join('\n');

  private readonly groupDemoTailwindHtmlCode = [
    '<section class="grid w-full max-w-[32rem] gap-3">',
    '  <label class="text-xs font-semibold text-[var(--tng-semantic-foreground-secondary)]" for="review-notes-demo-tailwind">Reviewer notes</label>',
    '  <div',
    '    tngInputGroup',
    '    class="min-h-[8rem] items-start gap-3 rounded-xl border border-[var(--tng-semantic-border-strong)] bg-[var(--tng-semantic-background-base)] px-3 py-3 shadow-none transition [&[data-focused]]:border-[var(--tng-semantic-accent-brand)] [&[data-focused]]:ring-2 [&[data-focused]]:ring-blue-400/20"',
    '  >',
    '    <textarea',
    '      id="review-notes-demo-tailwind"',
    '      tngTextarea',
    '      rows="5"',
    '      placeholder="Add reviewer notes"',
    '      aria-label="Reviewer notes"',
    '      class="min-h-[6.5rem] min-w-0 flex-1 resize-y appearance-none border-0 bg-transparent p-0 text-[var(--tng-semantic-foreground-primary)] outline-none placeholder:text-[var(--tng-semantic-foreground-muted)] focus:outline-none focus:ring-0"',
    '      [value]="reviewNotes()"',
    '      (input)="onReviewNotesInput($event)"',
    '    ></textarea>',
    '    <span tngSuffix class="pt-1 text-xs font-semibold text-[var(--tng-semantic-foreground-secondary)]">Draft</span>',
    '  </div>',
    '</section>',
    '',
  ].join('\n');

  protected readonly groupDemoPlainCodeTabs = createCodeTabs(
    'grouped-review-notes-plain',
    this.groupDemoTsCode,
    this.groupDemoPlainHtmlCode,
    this.groupDemoPlainCssCode,
  );

  protected readonly groupDemoTailwindCodeTabs = createCodeTabs(
    'grouped-review-notes-tailwind',
    this.groupDemoTsCode,
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
