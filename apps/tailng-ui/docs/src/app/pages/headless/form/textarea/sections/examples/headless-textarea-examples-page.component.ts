import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
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
  const editableStateCode =
    stateName !== undefined && initialValue !== undefined && handlerName !== undefined
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
    "import { Component, signal } from '@angular/core';",
    "import { TngInputGroup, TngSuffix, TngTextarea } from '@tailng-ui/primitives';",
    '',
    '@Component({',
    `  selector: '${selector}',`,
    '  imports: [TngInputGroup, TngTextarea, TngSuffix],',
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
  imports: [DocsExampleTabsSectionComponent, DocsExampleVariantDirective, TngInputGroup, TngTextarea, TngSuffix],
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
      '  <label class="textarea-example-label" for="release-notes-textarea">Release notes</label>',
      '  <div tngInputGroup class="textarea-example-field-shell">',
      '    <textarea',
      '      id="release-notes-textarea"',
      '      tngTextarea',
      '      rows="5"',
      '      aria-label="Release notes"',
      '      [value]="releaseNotes()"',
      '      (input)="onReleaseNotesInput($event)"',
      '    ></textarea>',
      '    <span tngSuffix aria-hidden="true">Autosaves</span>',
      '  </div>',
      '  <p class="textarea-example-meta">Shared draft used by support and engineering.</p>',
      '</section>',
      '',
    ].join('\n'),
    cssCode: [
      '.textarea-example-field-shell[data-slot="input-group"] {',
      '  align-items: flex-start;',
      '  min-height: 8.25rem;',
      '}',
      '',
      '.textarea-example-field-shell [data-slot="input"] {',
      '  min-height: 6.75rem;',
      '  resize: vertical;',
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
      '  <label class="text-xs font-semibold text-[var(--tng-semantic-foreground-secondary)]" for="release-notes-textarea-tailwind">Release notes</label>',
      '  <div',
      '    tngInputGroup',
      '    class="min-h-[8.25rem] items-start gap-3 rounded-xl border border-[var(--tng-semantic-border-strong)] bg-[var(--tng-semantic-background-base)] px-3 py-3 shadow-none transition [&[data-focused]]:border-[var(--tng-semantic-accent-brand)] [&[data-focused]]:ring-2 [&[data-focused]]:ring-blue-400/20"',
      '  >',
      '    <textarea',
      '      id="release-notes-textarea-tailwind"',
      '      tngTextarea',
      '      rows="5"',
      '      aria-label="Release notes"',
      '      class="min-h-[6.75rem] min-w-0 flex-1 resize-y appearance-none border-0 bg-transparent p-0 text-[var(--tng-semantic-foreground-primary)] outline-none placeholder:text-[var(--tng-semantic-foreground-muted)] focus:outline-none focus:ring-0"',
      '      [value]="releaseNotes()"',
      '      (input)="onReleaseNotesInput($event)"',
      '    ></textarea>',
      '    <span tngSuffix class="pt-1 text-xs font-semibold text-[var(--tng-semantic-foreground-secondary)]">Autosaves</span>',
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
      '.textarea-example-field-shell[data-slot="input-group"] {',
      '  align-items: flex-start;',
      '  min-height: 8rem;',
      '}',
      '',
      '.textarea-example-field-shell [data-slot="input"] {',
      '  min-height: 6.5rem;',
      '  resize: vertical;',
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
      '.textarea-example-field-shell--danger[data-slot="input-group"] {',
      '  border-color: var(--tng-semantic-accent-danger);',
      '}',
      '',
      '.textarea-example-helper--danger {',
      '  color: var(--tng-semantic-accent-danger);',
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
      '    class="min-h-[8rem] items-start rounded-xl border border-red-400 bg-red-50/70 px-3 py-3 shadow-none transition [&[data-focused]]:border-red-500 [&[data-focused]]:ring-2 [&[data-focused]]:ring-red-200"',
      '  >',
      '    <textarea',
      '      id="validation-textarea-tailwind"',
      '      tngTextarea',
      '      rows="5"',
      '      aria-invalid="true"',
      '      aria-label="Postmortem summary"',
      '      class="min-h-[6.5rem] min-w-0 flex-1 resize-y appearance-none border-0 bg-transparent p-0 text-[var(--tng-semantic-foreground-primary)] outline-none focus:outline-none focus:ring-0"',
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
      '    class="min-h-[7rem] items-start rounded-xl border border-[var(--tng-semantic-border-strong)] bg-[var(--tng-semantic-background-base)] px-3 py-3 shadow-none"',
      '  >',
      '    <textarea',
      '      tngTextarea',
      '      rows="4"',
      '      readonly',
      '      aria-label="Readonly release notes"',
      '      class="min-h-[5.5rem] min-w-0 flex-1 resize-none appearance-none border-0 bg-transparent p-0 text-[var(--tng-semantic-foreground-primary)] outline-none"',
      '    >Readonly release notes are locked during approval.</textarea>',
      '  </div>',
      '  <div',
      '    tngInputGroup',
      '    class="min-h-[7rem] items-start rounded-xl border border-[var(--tng-semantic-border-strong)] bg-[var(--tng-semantic-background-base)] px-3 py-3 opacity-60 shadow-none"',
      '  >',
      '    <textarea',
      '      tngTextarea',
      '      rows="4"',
      '      disabled',
      '      aria-label="Disabled sync summary"',
      '      class="min-h-[5.5rem] min-w-0 flex-1 resize-none appearance-none border-0 bg-transparent p-0 text-[var(--tng-semantic-foreground-muted)] outline-none disabled:cursor-not-allowed"',
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
