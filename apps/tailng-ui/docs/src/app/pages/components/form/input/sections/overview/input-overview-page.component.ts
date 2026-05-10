import { DOCUMENT, NgTemplateOutlet } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent, TngInputComponent } from '@tailng-ui/components';
import type { DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';
import {
  observeDocsCodeThemeChanges,
  resolveDocsCodeBlockTheme,
} from '../../../../../../shared/util';
import { stackblitzTailwindUrl, stackblitzVanillaUrl } from '../../input.util';

@Component({
  selector: 'app-input-overview-page',
  imports: [
    NgTemplateOutlet,
    TngCodeBlockComponent,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
    TngInputComponent,
  ],
  templateUrl: './input-overview-page.component.html',
  styleUrls: ['../../../../../../shared/form/input/input-styles.css', './input-overview-page.component.css'],
})
export class InputOverviewPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(this.documentRef, this.codeBlockTheme);

  protected readonly stackblitzVanillaUrl = stackblitzVanillaUrl;
  protected readonly stackblitzTailwindUrl = stackblitzTailwindUrl;

  protected readonly installationCode = [
    "import { TngInputFieldComponent, TngInputComponent } from '@tailng-ui/components';",
    "import { TngInput, TngInputFieldPrefix, TngInputFieldSuffix } from '@tailng-ui/primitives';",
    '',
  ].join('\n');

  protected readonly wrapperUsageCode = [
    '<tng-input type="email" placeholder="team@tailng.dev" ariaLabel="Email"></tng-input>',
    '',
  ].join('\n');

  protected readonly formFieldUsageCode = [
    '<tng-input-field>',
    '  <span tngInputFieldPrefix aria-hidden="true">Search</span>',
    '  <input tngInput type="search" placeholder="Search docs" aria-label="Search docs" />',
    '  <span tngInputFieldSuffix aria-hidden="true">Ctrl+K</span>',
    '</tng-input-field>',
    '',
  ].join('\n');

  protected readonly directAttachmentCode = [
    '<input tngInput type="email" placeholder="team@tailng.dev" aria-label="Email" />',
    '',
  ].join('\n');

  protected readonly validationStableCode = [
    '<tng-input type="email" ariaLabel="Email" [ariaInvalid]="true"></tng-input>',
    '',
  ].join('\n');

  protected readonly nativeValidationCode = [
    '<tng-input',
    '  type="email"',
    '  ariaLabel="Email"',
    '  ariaErrormessage="email-error"',
    '  pattern="[^@]+@example\\.com"',
    '  required',
    '></tng-input>',
    '<p id="email-error">Use your example.com email address.</p>',
    '',
  ].join('\n');

  protected readonly nativeHintsCode = [
    '<tng-input',
    '  type="email"',
    '  ariaLabel="Work email"',
    '  placeholder="team@example.com"',
    '  inputmode="email"',
    '  enterkeyhint="next"',
    '  autocapitalize="none"',
    '  autocomplete="email"',
    '  [maxlength]="64"',
    '  [spellcheck]="false"',
    '></tng-input>',
    '',
  ].join('\n');

  protected readonly eventFacadeCode = [
    '<tng-input',
    '  type="number"',
    '  ariaLabel="Seats"',
    '  [min]="1"',
    '  [max]="50"',
    '  [step]="1"',
    '  (input)="onInput($event)"',
    '  (change)="onCommit($event)"',
    '  (keydown)="onKeydown($event)"',
    '></tng-input>',
    '',
  ].join('\n');

  protected readonly searchExampleCode = [
    '<tng-input',
    '  type="search"',
    '  placeholder="Search docs"',
    '  ariaLabel="Search docs"',
    '  inputmode="search"',
    '  enterkeyhint="search"',
    '></tng-input>',
    '',
  ].join('\n');

  protected readonly formFieldReferenceCode = [
    '<!-- Move to tng-input-field when the field needs projected content -->',
    '<tng-input-field>',
    '  <span tngInputFieldPrefix aria-hidden="true">Search</span>',
    '  <input tngInput type="search" placeholder="Search docs" aria-label="Search docs" />',
    '</tng-input-field>',
    '',
  ].join('\n');

  protected readonly pitfallCorrectCode = [
    '<tng-input-field>',
    '  <input tngInput />',
    '</tng-input-field>',
    '',
  ].join('\n');

  protected readonly pitfallIncorrectCode = [
    '<tng-input-field>',
    '  <input />',
    '</tng-input-field>',
    '',
  ].join('\n');

  protected readonly testingNotesCode = [
    "const input = fixture.nativeElement.querySelector('[data-slot=\"input\"]');",
    "const shell = fixture.nativeElement.querySelector('[data-slot=\"input-group\"]');",
    '',
    "expect(input).not.toBeNull();",
    "expect(shell?.hasAttribute('data-focused')).toBe(false);",
    '',
  ].join('\n');

  private readonly plainCssExampleHtmlCode = [
    '<label class="doc-cmp-input-overview-simple-surface">',
    '  <span class="doc-cmp-input-overview-simple-label">Email</span>',
    '  <tng-input',
    '    type="email"',
    '    placeholder="team@tailng.dev"',
    '    ariaLabel="Email"',
    '  ></tng-input>',
    '</label>',
    '',
  ].join('\n');

  private readonly plainCssExampleTsCode = [
    "import { Component } from '@angular/core';",
    "import { TngInputComponent } from '@tailng-ui/components';",
    '',
    '@Component({',
    "  selector: 'app-doc-cmp-input-overview-plain',",
    '  standalone: true,',
    '  imports: [TngInputComponent],',
    "  templateUrl: './doc-cmp-input-overview-plain.component.html',",
    "  styleUrl: './doc-cmp-input-overview-plain.component.css',",
    '})',
    'export class DocCmpInputOverviewPlainComponent {}',
    '',
  ].join('\n');

  private readonly plainCssExampleCssCode = [
    '/* Label chrome only; tng-input needs no local CSS. */',
    '',
    '.doc-cmp-input-overview-simple-surface {',
    '  display: grid;',
    '  gap: 0.5rem;',
    '  padding: 0.9rem;',
    '  border: 1px solid var(--tng-semantic-border-subtle);',
    '  border-radius: 0.95rem;',
    '  background: color-mix(in srgb, var(--tng-semantic-background-surface) 88%, transparent);',
    '}',
    '',
    '.doc-cmp-input-overview-simple-label {',
    '  color: var(--tng-semantic-foreground-secondary);',
    '  font-size: 0.78rem;',
    '  font-weight: 600;',
    '}',
    '',
  ].join('\n');

  private readonly tailwindExampleHtmlCode = [
    '<label class="doc-cmp-input-overview-simple-tw-field grid gap-2 rounded-xl border border-[var(--tng-semantic-border-subtle)] bg-[color-mix(in_srgb,var(--tng-semantic-background-surface)_88%,transparent)] p-3">',
    '  <span class="doc-cmp-input-overview-simple-tw-caption text-xs font-semibold text-[var(--tng-semantic-foreground-secondary)]">Email</span>',
    '  <tng-input',
    '    type="email"',
    '    placeholder="team@tailng.dev"',
    '    ariaLabel="Email"',
    '  ></tng-input>',
    '</label>',
    '',
  ].join('\n');

  private readonly tailwindExampleTsCode = [
    "import { Component } from '@angular/core';",
    "import { TngInputComponent } from '@tailng-ui/components';",
    '',
    '@Component({',
    "  selector: 'app-doc-cmp-input-overview-tailwind',",
    '  standalone: true,',
    '  imports: [TngInputComponent],',
    "  templateUrl: './doc-cmp-input-overview-tailwind.component.html',",
    '})',
    'export class DocCmpInputOverviewTailwindComponent {}',
    '',
  ].join('\n');

  private readonly tailwindExampleCssCode =
    '/* tng-input needs no CSS; optional utilities stay on the label wrapper only. */';

  protected readonly plainCssExampleCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'doc-cmp-input-overview-plain.component.ts',
      code: this.plainCssExampleTsCode,
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'doc-cmp-input-overview-plain.component.html',
      code: this.plainCssExampleHtmlCode,
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'doc-cmp-input-overview-plain.component.css',
      code: this.plainCssExampleCssCode,
    },
  ]);

  protected readonly tailwindExampleCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'doc-cmp-input-overview-tailwind.component.ts',
      code: this.tailwindExampleTsCode,
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'doc-cmp-input-overview-tailwind.component.html',
      code: this.tailwindExampleHtmlCode,
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'doc-cmp-input-overview-tailwind.component.css',
      code: this.tailwindExampleCssCode,
    },
  ]);

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }

  protected focusProjectedInput(event: MouseEvent): void {
    const hostElement = event.currentTarget;
    if (!(hostElement instanceof HTMLElement)) {
      return;
    }

    const inputElement = hostElement.querySelector('[data-slot="input"]');
    if (
      !(inputElement instanceof HTMLInputElement || inputElement instanceof HTMLTextAreaElement) ||
      inputElement.disabled
    ) {
      return;
    }

    inputElement.focus({ preventScroll: true });
  }

}
