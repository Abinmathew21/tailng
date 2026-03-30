import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { TngInput } from '@tailng-ui/primitives';
import type { DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';
import { observeDocsCodeThemeChanges, resolveDocsCodeBlockTheme } from '../../../../../../shared/util';
import { stackblitzTailwindUrl, stackblitzVanillaUrl } from '../../input.util';

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
  selector: 'app-headless-input-overview-page',
  imports: [
    TngCodeBlockComponent,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
    TngInput,
  ],
  templateUrl: './headless-input-overview-page.component.html',
  styleUrls: [
    './headless-input-overview-page.component.css',
    '../../../../../../shared/form/input/input-styles.css',
  ],
})
export class HeadlessInputOverviewPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(this.documentRef, this.codeBlockTheme);

  protected readonly stackblitzVanillaUrl = stackblitzVanillaUrl;
  protected readonly stackblitzTailwindUrl = stackblitzTailwindUrl;

  protected readonly directAttachmentCode = [
    '<input tngInput type="email" placeholder="team@tailng.dev" />',
    '',
  ].join('\n');

  protected readonly primitivesImportCode = [
    "import { TngInput, TngInputGroup, TngPrefix, TngSuffix } from '@tailng-ui/primitives';",
    '',
  ].join('\n');

  protected readonly groupedInputCode = [
    '<tng-input-group>',
    '  <span tngPrefix aria-hidden="true">Search</span>',
    '  <input tngInput type="search" placeholder="Search..." />',
    '  <span tngSuffix aria-hidden="true">Ctrl+K</span>',
    '</tng-input-group>',
    '',
  ].join('\n');

  protected readonly searchWithHintCode = [
    '<tng-input-group class="demo-group">',
    '  <span tngPrefix aria-hidden="true">Search</span>',
    '  <input tngInput type="search" placeholder="Search primitives" />',
    '  <span tngSuffix aria-hidden="true">Ctrl+K</span>',
    '</tng-input-group>',
    '',
  ].join('\n');

  protected readonly searchWithClearButtonCode = [
    '<tng-input-group class="demo-group">',
    '  <input tngInput type="search" placeholder="Search..." />',
    '  <button tngSuffix type="button" aria-label="Clear">X</button>',
    '</tng-input-group>',
    '',
  ].join('\n');

  protected readonly pitfallCorrectCode = [
    '<tng-input-group>',
    '  <input tngInput />',
    '</tng-input-group>',
    '',
  ].join('\n');

  protected readonly pitfallIncorrectCode = [
    '<tng-input-group>',
    '  <input />',
    '</tng-input-group>',
    '',
  ].join('\n');

  protected readonly ariaInvalidTestCode = [
    '<input tngInput type="email" aria-invalid="true" />',
    '',
  ].join('\n');

  protected readonly nativeValidationCode = [
    '<input tngInput type="email" required />',
    '',
  ].join('\n');

  protected readonly headlessExampleTsCode = [
    "import { Component } from '@angular/core';",
    "import { TngInput } from '@tailng-ui/primitives';",
    '',
    '@Component({',
    "  selector: 'app-plain-css-headless-input-example',",
    '  imports: [TngInput],',
    "  templateUrl: './plain-css-headless-input-example.component.html',",
    "  styleUrl: './plain-css-headless-input-example.component.css',",
    '})',
    'export class PlainCssHeadlessInputExampleComponent {}',
    '',
  ].join('\n');

  protected readonly headlessExampleHtmlCode = [
    '<input',
    '  tngInput',
    '  type="text"',
    '  value="Nitrogen"',
    '  aria-label="What is the most abundant gas in air?"',
    '  class="demo-normal-input"',
    '/>',
    '',
  ].join('\n');

  protected readonly headlessExampleCssCode = [
    '.demo-normal-input {',
    '  width: 100%;',
    '  max-width: 30rem;',
    '  font: inherit;',
    '  color: rgba(28, 25, 23, 0.95);',
    '  background: #ffffff;',
    '  border: 1px solid rgba(28, 25, 23, 0.22);',
    '  border-radius: 0.85rem;',
    '  padding: 0.75rem 0.8rem;',
    '  box-shadow: 0 1px 2px rgba(28, 25, 23, 0.04);',
    '}',
    '',
    '.demo-normal-input:focus-visible {',
    '  outline: none;',
    '  border-color: rgba(15, 118, 110, 0.65);',
    '  box-shadow:',
    '    0 0 0 4px rgba(15, 118, 110, 0.18),',
    '    0 1px 2px rgba(28, 25, 23, 0.04);',
    '}',
    '',
    ".demo-normal-input:hover:not(:disabled):not([aria-disabled='true']) {",
    '  border-color: rgba(28, 25, 23, 0.26);',
    '}',
    '',
  ].join('\n');

  protected readonly tailwindHeadlessExampleHtmlCode = [
    '<input',
    '  tngInput',
    '  type="text"',
    '  value="Oxygen"',
    '  class="w-full max-w-[30rem] rounded-[0.85rem] border border-[rgba(28,25,23,0.22)] bg-white px-[0.8rem] py-[0.75rem] font-inherit text-[rgba(28,25,23,0.95)] shadow-[0_1px_2px_rgba(28,25,23,0.04)] outline-none hover:border-[rgba(28,25,23,0.26)] focus-visible:border-[rgba(15,118,110,0.65)] focus-visible:shadow-[0_0_0_4px_rgba(15,118,110,0.18),0_1px_2px_rgba(28,25,23,0.04)]"',
    '/>',
    '',
  ].join('\n');

  protected readonly tailwindHeadlessExampleCssCode =
    '/* No custom CSS required. Styles are applied with Tailwind utility classes in the template. */';

  protected readonly plainCssHeadlessExampleCodeTabs = createCodeTabs(
    'plain-css-headless-input-example',
    {
      tsCode: this.headlessExampleTsCode,
      htmlCode: this.headlessExampleHtmlCode,
      cssCode: this.headlessExampleCssCode,
    },
  );

  protected readonly tailwindHeadlessExampleCodeTabs = createCodeTabs(
    'tailwind-headless-input-example',
    {
      tsCode: this.headlessExampleTsCode,
      htmlCode: this.tailwindHeadlessExampleHtmlCode,
      cssCode: this.tailwindHeadlessExampleCssCode,
    },
  );

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }

}
