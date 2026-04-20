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
    "import { TngFormFieldComponent, TngInputComponent } from '@tailng-ui/components';",
    "import { TngInput, TngPrefix, TngSuffix } from '@tailng-ui/primitives';",
    '',
  ].join('\n');

  protected readonly wrapperUsageCode = [
    '<tng-input type="email" placeholder="team@tailng.dev" ariaLabel="Email"></tng-input>',
    '',
  ].join('\n');

  protected readonly formFieldUsageCode = [
    '<tng-form-field>',
    '  <span tngPrefix aria-hidden="true">Search</span>',
    '  <input tngInput type="search" placeholder="Search docs" aria-label="Search docs" />',
    '  <span tngSuffix aria-hidden="true">Ctrl+K</span>',
    '</tng-form-field>',
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
    '<tng-input type="email" ariaLabel="Email" required></tng-input>',
    '',
  ].join('\n');

  protected readonly searchExampleCode = [
    '<tng-input type="search" placeholder="Search docs" ariaLabel="Search docs"></tng-input>',
    '',
  ].join('\n');

  protected readonly formFieldReferenceCode = [
    '<!-- Move to tng-form-field when the field needs projected content -->',
    '<tng-form-field>',
    '  <span tngPrefix aria-hidden="true">Search</span>',
    '  <input tngInput type="search" placeholder="Search docs" aria-label="Search docs" />',
    '</tng-form-field>',
    '',
  ].join('\n');

  protected readonly pitfallCorrectCode = [
    '<tng-form-field>',
    '  <input tngInput />',
    '</tng-form-field>',
    '',
  ].join('\n');

  protected readonly pitfallIncorrectCode = [
    '<tng-form-field>',
    '  <input />',
    '</tng-form-field>',
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
    '  border: 1px solid #cbd5e1;',
    '  border-radius: 0.95rem;',
    '  background: rgba(255, 255, 255, 0.88);',
    '}',
    '',
    '.doc-cmp-input-overview-simple-label {',
    '  color: #64748b;',
    '  font-size: 0.78rem;',
    '  font-weight: 600;',
    '}',
    '',
  ].join('\n');

  private readonly tailwindExampleHtmlCode = [
    '<label class="doc-cmp-input-overview-simple-tw-field grid gap-2 rounded-xl border border-slate-300 bg-white/80 p-3">',
    '  <span class="doc-cmp-input-overview-simple-tw-caption text-xs font-semibold text-slate-500">Email</span>',
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
