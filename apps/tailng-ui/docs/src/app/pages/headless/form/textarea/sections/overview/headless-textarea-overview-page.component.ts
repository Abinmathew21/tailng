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
  codes: { tsCode: string; htmlCode: string; cssCode: string },
): readonly DocsExampleCodeTab[] {
  return Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: `${baseName}.component.ts`,
      code: codes.tsCode,
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: `${baseName}.component.html`,
      code: codes.htmlCode,
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: `${baseName}.component.css`,
      code: codes.cssCode,
    },
  ]);
}

@Component({
  selector: 'app-headless-textarea-overview-page',
  imports: [
    TngCodeBlockComponent,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
    TngInputGroup,
    TngTextarea,
  ],
  templateUrl: './headless-textarea-overview-page.component.html',
  styleUrls: ['./headless-textarea-overview-page.component.css'],
})
export class HeadlessTextareaOverviewPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);
  protected readonly plainCssExampleValue = signal(
    'Ship notes should highlight API stability and migration steps.',
  );
  protected readonly tailwindExampleValue = signal(
    'Ship notes should highlight API stability and migration steps.',
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

  protected readonly primitiveImportCode = [
    "import { TngTextarea, TngInputGroup, TngInputFieldSuffix } from '@tailng-ui/primitives';",
    '',
  ].join('\n');

  protected readonly directAttachmentCode = [
    '<textarea tngTextarea rows="4" placeholder="Write release notes"></textarea>',
    '',
  ].join('\n');

  protected readonly groupedTextareaCode = [
    '<div tngInputGroup class="release-notes-shell">',
    '  <textarea tngTextarea rows="5" placeholder="Summarize the rollout"></textarea>',
    '  <span tngInputFieldSuffix aria-hidden="true">Autosaves</span>',
    '</div>',
    '',
  ].join('\n');

  protected readonly releaseNotesCode = [
    '<div tngInputGroup class="release-notes-shell">',
    '  <textarea',
    '    tngTextarea',
    '    rows="5"',
    '    aria-label="Release notes"',
    '    [value]="releaseNotes()"',
    '    (input)="onReleaseNotesInput($event)"',
    '  ></textarea>',
    '  <span tngInputFieldSuffix aria-hidden="true">Autosaves</span>',
    '</div>',
    '',
  ].join('\n');

  protected readonly readonlyExampleCode = [
    '<textarea',
    '  tngTextarea',
    '  rows="4"',
    '  readonly',
    '  aria-label="Readonly incident summary"',
    '>Incident summary is locked while the review is pending.</textarea>',
    '',
  ].join('\n');

  protected readonly correctPitfallCode = [
    '<div tngInputGroup>',
    '  <textarea tngTextarea rows="4"></textarea>',
    '</div>',
    '',
  ].join('\n');

  protected readonly incorrectPitfallCode = [
    '<div tngInputGroup>',
    '  <textarea rows="4"></textarea>',
    '</div>',
    '',
  ].join('\n');

  protected readonly ariaInvalidTestCode = [
    '<textarea tngTextarea rows="4" aria-invalid="true"></textarea>',
    '',
  ].join('\n');

  protected readonly nativeValidationCode = [
    '<textarea tngTextarea rows="4" required></textarea>',
    '',
  ].join('\n');

  private readonly plainCssExampleTsCode = [
    "import { Component, signal } from '@angular/core';",
    "import { TngInputGroup, TngTextarea } from '@tailng-ui/primitives';",
    '',
    '@Component({',
    "  selector: 'app-plain-css-headless-textarea-example',",
    '  imports: [TngInputGroup, TngTextarea],',
    "  templateUrl: './plain-css-headless-textarea-example.component.html',",
    "  styleUrl: './plain-css-headless-textarea-example.component.css',",
    '})',
    'export class PlainCssHeadlessTextareaExampleComponent {',
    "  readonly releaseNotes = signal('Ship notes should highlight API stability and migration steps.');",
    '',
    '  onReleaseNotesInput(event: Event): void {',
    '    const target = event.target;',
    '    if (!(target instanceof HTMLTextAreaElement)) return;',
    '    this.releaseNotes.set(target.value);',
    '  }',
    '}',
    '',
  ].join('\n');

  private readonly tailwindExampleTsCode = [
    "import { Component, signal } from '@angular/core';",
    "import { TngInputGroup, TngTextarea } from '@tailng-ui/primitives';",
    '',
    '@Component({',
    "  selector: 'app-tailwind-headless-textarea-example',",
    '  imports: [TngInputGroup, TngTextarea],',
    "  templateUrl: './tailwind-headless-textarea-example.component.html',",
    "  styleUrl: './tailwind-headless-textarea-example.component.css',",
    '})',
    'export class TailwindHeadlessTextareaExampleComponent {',
    "  readonly releaseNotes = signal('Ship notes should highlight API stability and migration steps.');",
    '',
    '  onReleaseNotesInput(event: Event): void {',
    '    const target = event.target;',
    '    if (!(target instanceof HTMLTextAreaElement)) return;',
    '    this.releaseNotes.set(target.value);',
    '  }',
    '}',
    '',
  ].join('\n');

  private readonly plainCssExampleHtmlCode = [
    '<section class="textarea-preview-shell">',
    '  <div class="textarea-preview-header">',
    '    <label class="textarea-preview-label" for="release-notes-textarea">Release notes</label>',
    '    <button type="button" class="textarea-preview-status-button">Auto-save</button>',
    '  </div>',
    '  <div class="textarea-preview-frame">',
    '    <div tngInputGroup class="textarea-preview-field-shell">',
    '      <textarea',
    '        id="release-notes-textarea"',
    '        tngTextarea',
    '        rows="4"',
    '        aria-label="Release notes"',
    '        [value]="releaseNotes()"',
    '        (input)="onReleaseNotesInput($event)"',
    '      ></textarea>',
    '    </div>',
    '  </div>',
    '</section>',
    '',
  ].join('\n');

  private readonly plainCssExampleCssCode = [
    '.textarea-preview-shell {',
    '  display: grid;',
    '  gap: 0.65rem;',
    '  inline-size: min(100%, 32rem);',
    '  margin-inline: auto;',
    '}',
    '',
    '.textarea-preview-header {',
    '  align-items: center;',
    '  display: flex;',
    '  gap: 0.75rem;',
    '  justify-content: space-between;',
    '}',
    '',
    '.textarea-preview-frame {',
    '  min-inline-size: 0;',
    '}',
    '',
    '.textarea-preview-label {',
    '  color: var(--tng-semantic-foreground-secondary, #64748b);',
    '  font-size: 0.82rem;',
    '  font-weight: 700;',
    '  letter-spacing: 0.01em;',
    '}',
    '',
    '.textarea-preview-field-shell[data-slot="input-group"] {',
    '  align-items: flex-start;',
    '  background: var(--tng-semantic-background-base, #ffffff);',
    '  border: 1px solid var(--tng-semantic-border-strong, #94a3b8);',
    '  border-radius: 0.75rem;',
    '  min-height: 7.8rem;',
    '  padding: 0.65rem 0.8rem;',
    '}',
    '',
    '.textarea-preview-field-shell[data-slot="input-group"][data-focused] {',
    '  border-color: color-mix(',
    '    in srgb,',
    '    var(--tng-semantic-accent-brand, #2563eb) 55%,',
    '    var(--tng-semantic-border-strong, #94a3b8)',
    '  );',
    '  box-shadow: 0 0 0 3px',
    '    color-mix(in srgb, var(--tng-semantic-accent-brand, #2563eb) 18%, transparent);',
    '}',
    '',
    '.textarea-preview-field-shell [data-slot="input"] {',
    '  background: transparent;',
    '  border: 0;',
    '  box-shadow: none;',
    '  color: var(--tng-semantic-foreground-primary, #0f172a);',
    '  inline-size: 100%;',
    '  min-height: 6.2rem;',
    '  min-inline-size: 0;',
    '  outline: none;',
    '  padding: 0;',
    '  resize: vertical;',
    '}',
    '',
    '.textarea-preview-status-button {',
    '  background: var(--tng-semantic-background-base, #ffffff);',
    '  border: 1px solid var(--tng-semantic-border-subtle, #cbd5e1);',
    '  border-radius: 9999px;',
    '  color: var(--tng-semantic-foreground-secondary, #64748b);',
    '  cursor: pointer;',
    '  flex: 0 0 auto;',
    '  font-size: 0.75rem;',
    '  font-weight: 700;',
    '  padding: 0.35rem 0.7rem;',
    '  transition:',
    '    border-color 140ms ease,',
    '    color 140ms ease,',
    '    transform 140ms ease;',
    '}',
    '',
    '.textarea-preview-status-button:hover {',
    '  border-color: var(--tng-semantic-border-strong, #94a3b8);',
    '  color: var(--tng-semantic-foreground-primary, #0f172a);',
    '}',
    '',
    '.textarea-preview-status-button:focus-visible {',
    '  outline: 2px solid color-mix(in srgb, var(--tng-semantic-accent-brand, #2563eb) 80%, white);',
    '  outline-offset: 2px;',
    '}',
    '',
  ].join('\n');

  private readonly tailwindExampleHtmlCode = [
    '<section class="grid w-full max-w-[32rem] gap-3">',
    '  <div class="flex items-center justify-between gap-3">',
    '    <label class="text-xs font-semibold text-[var(--tng-semantic-foreground-secondary)]" for="release-notes-textarea-tailwind">',
    '      Release notes',
    '    </label>',
    '    <button',
    '      type="button"',
    '      class="rounded-full border border-[var(--tng-semantic-border-subtle)] bg-[var(--tng-semantic-background-base)] px-3 py-1 text-xs font-semibold text-[var(--tng-semantic-foreground-secondary)] transition hover:border-[var(--tng-semantic-border-strong)] hover:text-[var(--tng-semantic-foreground-primary)]"',
    '    >',
    '      Auto-save',
    '    </button>',
    '  </div>',
    '  <div',
    '    tngInputGroup',
    '    class="min-h-[7.5rem] items-start rounded-xl border border-[var(--tng-semantic-border-strong)] bg-[var(--tng-semantic-background-base)] px-3 py-3 shadow-none transition',
    '           [&[data-focused]]:border-[var(--tng-semantic-accent-brand)] [&[data-focused]]:ring-2 [&[data-focused]]:ring-blue-400/20"',
    '  >',
    '    <textarea',
    '      id="release-notes-textarea-tailwind"',
    '      tngTextarea',
    '      rows="4"',
    '      aria-label="Release notes"',
    '      class="min-h-[6rem] w-full min-w-0 resize-y appearance-none border-0 bg-transparent p-0 text-[var(--tng-semantic-foreground-primary)] outline-none placeholder:text-[var(--tng-semantic-foreground-muted)] focus:outline-none focus:ring-0"',
    '      [value]="releaseNotes()"',
    '      (input)="onReleaseNotesInput($event)"',
    '    ></textarea>',
    '  </div>',
    '</section>',
    '',
  ].join('\n');

  private readonly tailwindExampleCssCode =
    '/* Tailwind utilities are applied directly in the template. */';

  protected readonly plainCssExampleCodeTabs = createCodeTabs(
    'plain-css-headless-textarea-example',
    {
      tsCode: this.plainCssExampleTsCode,
      htmlCode: this.plainCssExampleHtmlCode,
      cssCode: this.plainCssExampleCssCode,
    },
  );

  protected readonly tailwindExampleCodeTabs = createCodeTabs(
    'tailwind-headless-textarea-example',
    {
      tsCode: this.tailwindExampleTsCode,
      htmlCode: this.tailwindExampleHtmlCode,
      cssCode: this.tailwindExampleCssCode,
    },
  );

  protected onPlainCssExampleInput(event: Event): void {
    const target = event.target;
    if (!(target instanceof HTMLTextAreaElement)) return;
    this.plainCssExampleValue.set(target.value);
  }

  protected onTailwindExampleInput(event: Event): void {
    const target = event.target;
    if (!(target instanceof HTMLTextAreaElement)) return;
    this.tailwindExampleValue.set(target.value);
  }

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
