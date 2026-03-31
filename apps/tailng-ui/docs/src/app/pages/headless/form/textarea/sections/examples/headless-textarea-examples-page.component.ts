import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
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

type CreateCodeTabsArgs = {
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
}: CreateCodeTabsArgs): readonly DocsExampleCodeTab[] {
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

type CreateTextareaExampleTsCodeArgs = {
  selector: string;
  className: string;
  stateName?: string;
  initialValue?: string;
  handlerName?: string;
};

function createTextareaExampleTsCode({
  selector,
  className,
  stateName,
  initialValue,
  handlerName,
}: CreateTextareaExampleTsCodeArgs): string {
  const usesSignal =
    stateName !== undefined && initialValue !== undefined && handlerName !== undefined;
  const editableStateCode =
    usesSignal
      ? [
          `  readonly ${stateName} = signal('${initialValue}');`,
          '',
          `  ${handlerName}(event: Event): void {`,
          '    const target = event.target;',
          '    if (!(target instanceof HTMLTextAreaElement)) return;',
          `    this.${stateName}.set(target.value);`,
          '  }',
        ]
      : [];

  return [
    usesSignal
      ? "import { Component, signal } from '@angular/core';"
      : "import { Component } from '@angular/core';",
    "import { TngInputGroup, TngTextarea } from '@tailng-ui/primitives';",
    '',
    '@Component({',
    `  selector: '${selector}',`,
    '  imports: [TngInputGroup, TngTextarea],',
    `  templateUrl: './${selector}.component.html',`,
    `  styleUrl: './${selector}.component.css',`,
    '})',
    `export class ${className} {`,
    ...editableStateCode,
    '}',
    '',
  ].join('\n');
}

@Component({
  selector: 'app-headless-textarea-examples-page',
  imports: [DocsExampleTabsSectionComponent, DocsExampleVariantDirective, TngInputGroup, TngTextarea],
  templateUrl: './headless-textarea-examples-page.component.html',
  styleUrls: ['./headless-textarea-examples-page.component.css'],
})
export class HeadlessTextareaExamplesPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);
  protected readonly releaseNotesPlainValue = signal(
    'Ship the router update with migration notes and compatibility guidance.',
  );
  protected readonly releaseNotesTailwindValue = signal(
    'Ship the router update with migration notes and compatibility guidance.',
  );
  protected readonly incidentSummaryPlainValue = signal(
    'The retry queue drained successfully after the cache flush completed.',
  );
  protected readonly incidentSummaryTailwindValue = signal(
    'The retry queue drained successfully after the cache flush completed.',
  );
  protected readonly validationPlainValue = signal(
    'Need more detail about impact and mitigation steps.',
  );
  protected readonly validationTailwindValue = signal(
    'Need more detail about impact and mitigation steps.',
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

  protected readonly releaseNotesPlainCodeTabs = createCodeTabs({
    baseName: 'release-notes-textarea-plain',
    tsCode: createTextareaExampleTsCode({
      selector: 'app-release-notes-textarea-plain',
      className: 'ReleaseNotesTextareaPlainComponent',
      stateName: 'releaseNotes',
      initialValue: 'Ship the router update with migration notes and compatibility guidance.',
      handlerName: 'onReleaseNotesInput',
    }),
    htmlCode: [
      '<section class="textarea-example-shell">',
      '  <div class="textarea-example-header">',
      '    <label class="textarea-example-label" for="release-notes-textarea">Release notes</label>',
      '    <span class="textarea-example-status" aria-hidden="true">Autosaves</span>',
      '  </div>',
      '  <div tngInputGroup class="textarea-example-field-shell">',
      '    <textarea',
      '      id="release-notes-textarea"',
      '      tngTextarea',
      '      rows="5"',
      '      aria-label="Release notes"',
      '      [value]="releaseNotes()"',
      '      (input)="onReleaseNotesInput($event)"',
      '    ></textarea>',
      '  </div>',
      '  <p class="textarea-example-meta">Shared draft used by support and engineering.</p>',
      '</section>',
      '',
    ].join('\n'),
    cssCode: [
      '.textarea-example-shell {',
      '  display: grid;',
      '  gap: 0.65rem;',
      '  inline-size: min(100%, 36rem);',
      '  margin-inline: auto;',
      '}',
      '',
      '.textarea-example-header {',
      '  align-items: center;',
      '  display: flex;',
      '  gap: 0.75rem;',
      '  justify-content: space-between;',
      '}',
      '',
      '.textarea-example-label {',
      '  color: var(--tng-semantic-foreground-secondary, #64748b);',
      '  font-size: 0.82rem;',
      '  font-weight: 700;',
      '  letter-spacing: 0.01em;',
      '}',
      '',
      '.textarea-example-status {',
      '  background: var(--tng-semantic-background-base, #ffffff);',
      '  border: 1px solid var(--tng-semantic-border-subtle, #cbd5e1);',
      '  border-radius: 9999px;',
      '  color: var(--tng-semantic-foreground-secondary, #64748b);',
      '  font-size: 0.75rem;',
      '  font-weight: 700;',
      '  padding: 0.35rem 0.7rem;',
      '}',
      '',
      '.textarea-example-field-shell[data-slot="input-group"] {',
      '  align-items: flex-start;',
      '  background: var(--tng-semantic-background-base, #ffffff);',
      '  border: 1px solid var(--tng-semantic-border-strong, #94a3b8);',
      '  border-radius: 0.75rem;',
      '  min-height: 8.25rem;',
      '  padding: 0.7rem 0.85rem;',
      '}',
      '',
      '.textarea-example-field-shell[data-slot="input-group"][data-focused] {',
      '  border-color: var(--tng-semantic-accent-brand, #2563eb);',
      '  box-shadow: 0 0 0 3px',
      '    color-mix(in srgb, var(--tng-semantic-accent-brand, #2563eb) 18%, transparent);',
      '}',
      '',
      '.textarea-example-field-shell [data-slot="input"] {',
      '  background: transparent;',
      '  border: 0;',
      '  box-shadow: none;',
      '  color: var(--tng-semantic-foreground-primary, #0f172a);',
      '  inline-size: 100%;',
      '  min-height: 6.75rem;',
      '  min-inline-size: 0;',
      '  outline: none;',
      '  padding: 0;',
      '  resize: vertical;',
      '}',
      '',
      '.textarea-example-field-shell [data-slot="input"]:focus,',
      '.textarea-example-field-shell [data-slot="input"]:focus-visible {',
      '  box-shadow: none;',
      '  outline: none;',
      '}',
      '',
      '.textarea-example-meta {',
      '  color: var(--tng-semantic-foreground-secondary, #64748b);',
      '  font-size: 0.78rem;',
      '  margin: 0;',
      '}',
      '',
    ].join('\n'),
  });

  protected readonly releaseNotesTailwindCodeTabs = createCodeTabs({
    baseName: 'release-notes-textarea-tailwind',
    tsCode: createTextareaExampleTsCode({
      selector: 'app-release-notes-textarea-tailwind',
      className: 'ReleaseNotesTextareaTailwindComponent',
      stateName: 'releaseNotes',
      initialValue: 'Ship the router update with migration notes and compatibility guidance.',
      handlerName: 'onReleaseNotesInput',
    }),
    htmlCode: [
      '<section class="grid w-full max-w-[36rem] gap-3">',
      '  <div class="flex items-center justify-between gap-3">',
      '    <label class="text-xs font-semibold tracking-[0.01em] text-slate-600 dark:text-slate-400" for="release-notes-textarea-tailwind">Release notes</label>',
      '    <span aria-hidden="true" class="rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-semibold tracking-[0.01em] text-slate-500 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-400">Autosaves</span>',
      '  </div>',
      '  <div',
      '    tngInputGroup',
      '    class="min-h-[8.25rem] items-start rounded-xl border border-slate-300 bg-white px-3 py-3 shadow-sm transition dark:border-slate-600 dark:bg-slate-950 [&[data-focused]]:border-blue-500 [&[data-focused]]:ring-4 [&[data-focused]]:ring-blue-500/15"',
      '  >',
      '    <textarea',
      '      id="release-notes-textarea-tailwind"',
      '      tngTextarea',
      '      rows="5"',
      '      aria-label="Release notes"',
      '      class="min-h-[6.75rem] w-full min-w-0 flex-1 resize-y appearance-none border-0 bg-transparent p-0 text-slate-900 outline-none shadow-none placeholder:text-slate-400 dark:text-slate-50 dark:placeholder:text-slate-500 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0"',
      '      [value]="releaseNotes()"',
      '      (input)="onReleaseNotesInput($event)"',
      '    ></textarea>',
      '  </div>',
      '</section>',
      '',
    ].join('\n'),
    cssCode: '/* Tailwind utilities are applied directly in the template. */',
  });

  protected readonly incidentSummaryPlainCodeTabs = createCodeTabs({
    baseName: 'incident-summary-textarea-plain',
    tsCode: createTextareaExampleTsCode({
      selector: 'app-incident-summary-textarea-plain',
      className: 'IncidentSummaryTextareaPlainComponent',
      stateName: 'incidentSummary',
      initialValue: 'The retry queue drained successfully after the cache flush completed.',
      handlerName: 'onIncidentSummaryInput',
    }),
    htmlCode: [
      '<section class="textarea-example-shell">',
      '  <label class="textarea-example-label" for="incident-summary-textarea">Incident summary</label>',
      '  <div tngInputGroup class="textarea-example-field-shell">',
      '    <textarea',
      '      id="incident-summary-textarea"',
      '      tngTextarea',
      '      rows="5"',
      '      aria-label="Incident summary"',
      '      [value]="incidentSummary()"',
      '      (input)="onIncidentSummaryInput($event)"',
      '    ></textarea>',
      '  </div>',
      '  <p class="textarea-example-meta">Use a grouped shell even without suffix content when you want consistent container styling.</p>',
      '</section>',
      '',
    ].join('\n'),
    cssCode: [
      '.textarea-example-shell {',
      '  display: grid;',
      '  gap: 0.65rem;',
      '  inline-size: min(100%, 36rem);',
      '  margin-inline: auto;',
      '}',
      '',
      '.textarea-example-label {',
      '  color: var(--tng-semantic-foreground-secondary, #64748b);',
      '  font-size: 0.82rem;',
      '  font-weight: 700;',
      '  letter-spacing: 0.01em;',
      '}',
      '',
      '.textarea-example-field-shell[data-slot="input-group"] {',
      '  align-items: flex-start;',
      '  background: var(--tng-semantic-background-base, #ffffff);',
      '  border: 1px solid var(--tng-semantic-border-strong, #94a3b8);',
      '  border-radius: 0.75rem;',
      '  min-height: 8rem;',
      '  padding: 0.7rem 0.85rem;',
      '}',
      '',
      '.textarea-example-field-shell[data-slot="input-group"][data-focused] {',
      '  border-color: var(--tng-semantic-accent-brand, #2563eb);',
      '  box-shadow: 0 0 0 3px',
      '    color-mix(in srgb, var(--tng-semantic-accent-brand, #2563eb) 18%, transparent);',
      '}',
      '',
      '.textarea-example-field-shell [data-slot="input"] {',
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
      '.textarea-example-field-shell [data-slot="input"]:focus,',
      '.textarea-example-field-shell [data-slot="input"]:focus-visible {',
      '  box-shadow: none;',
      '  outline: none;',
      '}',
      '',
      '.textarea-example-meta {',
      '  color: var(--tng-semantic-foreground-secondary, #64748b);',
      '  font-size: 0.78rem;',
      '  margin: 0;',
      '}',
      '',
    ].join('\n'),
  });

  protected readonly incidentSummaryTailwindCodeTabs = createCodeTabs({
    baseName: 'incident-summary-textarea-tailwind',
    tsCode: createTextareaExampleTsCode({
      selector: 'app-incident-summary-textarea-tailwind',
      className: 'IncidentSummaryTextareaTailwindComponent',
      stateName: 'incidentSummary',
      initialValue: 'The retry queue drained successfully after the cache flush completed.',
      handlerName: 'onIncidentSummaryInput',
    }),
    htmlCode: [
      '<section class="grid w-full max-w-[36rem] gap-3">',
      '  <label class="text-xs font-semibold text-[var(--tng-semantic-foreground-secondary)]" for="incident-summary-textarea-tailwind">Incident summary</label>',
      '  <div',
      '    tngInputGroup',
      '    class="min-h-[8rem] items-start rounded-xl border border-[var(--tng-semantic-border-strong)] bg-[var(--tng-semantic-background-base)] px-3 py-3 shadow-none transition [&[data-focused]]:border-[var(--tng-semantic-accent-brand)] [&[data-focused]]:ring-2 [&[data-focused]]:ring-blue-400/20"',
      '  >',
      '    <textarea',
      '      id="incident-summary-textarea-tailwind"',
      '      tngTextarea',
      '      rows="5"',
      '      aria-label="Incident summary"',
      '      class="min-h-[6.5rem] min-w-0 flex-1 resize-y appearance-none border-0 bg-transparent p-0 text-[var(--tng-semantic-foreground-primary)] outline-none focus:outline-none focus:ring-0"',
      '      [value]="incidentSummary()"',
      '      (input)="onIncidentSummaryInput($event)"',
      '    ></textarea>',
      '  </div>',
      '</section>',
      '',
    ].join('\n'),
    cssCode: '/* Tailwind utilities are applied directly in the template. */',
  });

  protected readonly validationPlainCodeTabs = createCodeTabs({
    baseName: 'validation-textarea-plain',
    tsCode: createTextareaExampleTsCode({
      selector: 'app-validation-textarea-plain',
      className: 'ValidationTextareaPlainComponent',
      stateName: 'postmortemSummary',
      initialValue: 'Need more detail about impact and mitigation steps.',
      handlerName: 'onPostmortemSummaryInput',
    }),
    htmlCode: [
      '<section class="textarea-example-shell textarea-example-stack">',
      '  <label class="textarea-example-label" for="validation-textarea">Postmortem summary</label>',
      '  <div tngInputGroup class="textarea-example-field-shell textarea-example-field-shell--danger">',
      '    <textarea',
      '      id="validation-textarea"',
      '      tngTextarea',
      '      rows="5"',
      '      aria-invalid="true"',
      '      aria-label="Postmortem summary"',
      '      [value]="postmortemSummary()"',
      '      (input)="onPostmortemSummaryInput($event)"',
      '    ></textarea>',
      '  </div>',
      '  <p class="textarea-example-helper textarea-example-helper--danger">Add impact, root cause, and mitigation before publishing.</p>',
      '</section>',
      '',
    ].join('\n'),
    cssCode: [
      '.textarea-example-shell {',
      '  display: grid;',
      '  gap: 0.65rem;',
      '  inline-size: min(100%, 36rem);',
      '  margin-inline: auto;',
      '}',
      '',
      '.textarea-example-stack {',
      '  gap: 0.5rem;',
      '}',
      '',
      '.textarea-example-label {',
      '  color: var(--tng-semantic-foreground-secondary, #64748b);',
      '  font-size: 0.82rem;',
      '  font-weight: 700;',
      '  letter-spacing: 0.01em;',
      '}',
      '',
      '.textarea-example-field-shell--danger[data-slot="input-group"] {',
      '  background: var(--tng-semantic-background-base, #ffffff);',
      '  border: 1px solid var(--tng-semantic-accent-danger, #dc2626);',
      '  border-radius: 0.75rem;',
      '  min-height: 8rem;',
      '  padding: 0.7rem 0.85rem;',
      '}',
      '',
      '.textarea-example-field-shell--danger[data-slot="input-group"][data-focused] {',
      '  box-shadow: 0 0 0 3px',
      '    color-mix(in srgb, var(--tng-semantic-accent-danger, #dc2626) 16%, transparent);',
      '}',
      '',
      '.textarea-example-field-shell--danger [data-slot="input"] {',
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
      '.textarea-example-field-shell--danger [data-slot="input"]:focus,',
      '.textarea-example-field-shell--danger [data-slot="input"]:focus-visible {',
      '  box-shadow: none;',
      '  outline: none;',
      '}',
      '',
      '.textarea-example-helper--danger {',
      '  color: var(--tng-semantic-accent-danger, #dc2626);',
      '  font-size: 0.8rem;',
      '  font-weight: 600;',
      '  margin: 0;',
      '}',
      '',
    ].join('\n'),
  });

  protected readonly validationTailwindCodeTabs = createCodeTabs({
    baseName: 'validation-textarea-tailwind',
    tsCode: createTextareaExampleTsCode({
      selector: 'app-validation-textarea-tailwind',
      className: 'ValidationTextareaTailwindComponent',
      stateName: 'postmortemSummary',
      initialValue: 'Need more detail about impact and mitigation steps.',
      handlerName: 'onPostmortemSummaryInput',
    }),
    htmlCode: [
      '<section class="grid w-full max-w-[36rem] gap-3">',
      '  <label class="text-xs font-semibold text-[var(--tng-semantic-foreground-secondary)]" for="validation-textarea-tailwind">Postmortem summary</label>',
      '  <div',
      '    tngInputGroup',
      '    class="min-h-[8rem] items-start rounded-xl border border-red-400 bg-red-50/70 px-3 py-3 shadow-sm transition [&[data-focused]]:border-red-500 [&[data-focused]]:ring-4 [&[data-focused]]:ring-red-200/70 dark:border-red-500/70 dark:bg-red-950/30"',
      '  >',
      '    <textarea',
      '      id="validation-textarea-tailwind"',
      '      tngTextarea',
      '      rows="5"',
      '      aria-invalid="true"',
      '      aria-label="Postmortem summary"',
      '      class="min-h-[6.5rem] w-full min-w-0 flex-1 resize-y appearance-none border-0 bg-transparent p-0 text-slate-900 outline-none shadow-none dark:text-slate-50 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0"',
      '      [value]="postmortemSummary()"',
      '      (input)="onPostmortemSummaryInput($event)"',
      '    ></textarea>',
      '  </div>',
      '  <p class="text-xs font-medium text-red-600">Add impact, root cause, and mitigation before publishing.</p>',
      '</section>',
      '',
    ].join('\n'),
    cssCode: '/* Tailwind utilities are applied directly in the template. */',
  });

  protected readonly statesPlainCodeTabs = createCodeTabs({
    baseName: 'textarea-states-plain',
    tsCode: createTextareaExampleTsCode({
      selector: 'app-textarea-states-plain',
      className: 'TextareaStatesPlainComponent',
    }),
    htmlCode: [
      '<section class="textarea-example-shell textarea-example-stacked">',
      '  <div tngInputGroup class="textarea-example-field-shell">',
      '    <textarea tngTextarea rows="4" readonly aria-label="Readonly release notes">Readonly release notes are locked during approval.</textarea>',
      '  </div>',
      '  <div tngInputGroup class="textarea-example-field-shell textarea-example-field-shell--disabled">',
      '    <textarea tngTextarea rows="4" disabled aria-label="Disabled sync summary">Disabled while the sync is running.</textarea>',
      '  </div>',
      '</section>',
      '',
    ].join('\n'),
    cssCode: [
      '.textarea-example-stacked {',
      '  display: grid;',
      '  gap: 0.9rem;',
      '  inline-size: min(100%, 36rem);',
      '  margin-inline: auto;',
      '}',
      '',
      '.textarea-example-field-shell[data-slot="input-group"] {',
      '  align-items: flex-start;',
      '  background: var(--tng-semantic-background-base, #ffffff);',
      '  border: 1px solid var(--tng-semantic-border-strong, #94a3b8);',
      '  border-radius: 0.75rem;',
      '  min-height: 7rem;',
      '  padding: 0.7rem 0.85rem;',
      '}',
      '',
      '.textarea-example-field-shell [data-slot="input"] {',
      '  background: transparent;',
      '  border: 0;',
      '  box-shadow: none;',
      '  color: var(--tng-semantic-foreground-primary, #0f172a);',
      '  inline-size: 100%;',
      '  min-height: 5.5rem;',
      '  min-inline-size: 0;',
      '  outline: none;',
      '  padding: 0;',
      '  resize: none;',
      '}',
      '',
      '.textarea-example-field-shell [data-slot="input"]:focus,',
      '.textarea-example-field-shell [data-slot="input"]:focus-visible {',
      '  box-shadow: none;',
      '  outline: none;',
      '}',
      '',
      '.textarea-example-stacked {',
      '  display: grid;',
      '  gap: 0.85rem;',
      '}',
      '',
      '.textarea-example-field-shell--disabled[data-slot="input-group"] {',
      '  opacity: 0.6;',
      '}',
      '',
    ].join('\n'),
  });

  protected readonly statesTailwindCodeTabs = createCodeTabs({
    baseName: 'textarea-states-tailwind',
    tsCode: createTextareaExampleTsCode({
      selector: 'app-textarea-states-tailwind',
      className: 'TextareaStatesTailwindComponent',
    }),
    htmlCode: [
      '<section class="grid w-full max-w-[36rem] gap-3">',
      '  <div',
      '    tngInputGroup',
      '    class="min-h-[7rem] items-start rounded-xl border border-slate-300 bg-white px-3 py-3 shadow-sm dark:border-slate-600 dark:bg-slate-950"',
      '  >',
      '    <textarea',
      '      tngTextarea',
      '      rows="4"',
      '      readonly',
      '      aria-label="Readonly release notes"',
      '      class="min-h-[5.5rem] w-full min-w-0 flex-1 resize-none appearance-none border-0 bg-transparent p-0 text-slate-900 outline-none shadow-none dark:text-slate-50 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0"',
      '    >Readonly release notes are locked during approval.</textarea>',
      '  </div>',
      '  <div',
      '    tngInputGroup',
      '    class="min-h-[7rem] items-start rounded-xl border border-slate-300 bg-white px-3 py-3 opacity-60 shadow-sm dark:border-slate-600 dark:bg-slate-950"',
      '  >',
      '    <textarea',
      '      tngTextarea',
      '      rows="4"',
      '      disabled',
      '      aria-label="Disabled sync summary"',
      '      class="min-h-[5.5rem] w-full min-w-0 flex-1 resize-none appearance-none border-0 bg-transparent p-0 text-slate-400 outline-none shadow-none dark:text-slate-500 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed"',
      '    >Disabled while the sync is running.</textarea>',
      '  </div>',
      '</section>',
      '',
    ].join('\n'),
    cssCode: '/* Tailwind utilities are applied directly in the template. */',
  });

  protected onReleaseNotesPlainInput(event: Event): void {
    const target = event.target;
    if (!(target instanceof HTMLTextAreaElement)) return;
    this.releaseNotesPlainValue.set(target.value);
  }

  protected onReleaseNotesTailwindInput(event: Event): void {
    const target = event.target;
    if (!(target instanceof HTMLTextAreaElement)) return;
    this.releaseNotesTailwindValue.set(target.value);
  }

  protected onIncidentSummaryPlainInput(event: Event): void {
    const target = event.target;
    if (!(target instanceof HTMLTextAreaElement)) return;
    this.incidentSummaryPlainValue.set(target.value);
  }

  protected onIncidentSummaryTailwindInput(event: Event): void {
    const target = event.target;
    if (!(target instanceof HTMLTextAreaElement)) return;
    this.incidentSummaryTailwindValue.set(target.value);
  }

  protected onValidationPlainInput(event: Event): void {
    const target = event.target;
    if (!(target instanceof HTMLTextAreaElement)) return;
    this.validationPlainValue.set(target.value);
  }

  protected onValidationTailwindInput(event: Event): void {
    const target = event.target;
    if (!(target instanceof HTMLTextAreaElement)) return;
    this.validationTailwindValue.set(target.value);
  }

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
