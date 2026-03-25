import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { TngInput, TngInputGroup } from '@tailng-ui/primitives';
import type { DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';
import { generateStackblitzTailwindUrl, generateStackblitzVanillaUrl } from '../../../../../../shared/util';
import { InputOverviewPageComponent } from '../../../../../components/form/input/sections/overview/input-overview-page.component';
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
    TngInputGroup,
    TngInput,
  ],
  templateUrl: './headless-input-overview-page.component.html',
  styleUrls: [
    './headless-input-overview-page.component.css',
    '../../../../../../shared/form/input/input-styles.css',
  ],
})
export class HeadlessInputOverviewPageComponent extends InputOverviewPageComponent {

  protected readonly stackblitzVanillaUrl = generateStackblitzVanillaUrl('input', 'src/app/playground/form/input/input-demo.component.html');
  protected readonly stackblitzTailwindUrl = generateStackblitzTailwindUrl(
    'input',
    'src/app/playground/form/input/input-demo.component.html',
  );

  protected override readonly groupedInputCode = [
    '<tng-input-group>',
    '  <span tngPrefix aria-hidden="true">Search</span>',
    '  <input tngInput type="search" placeholder="Search..." />',
    '  <span tngSuffix aria-hidden="true">Ctrl+K</span>',
    '</tng-input-group>',
    '',
  ].join('\n');

  protected override readonly searchWithHintCode = [
    '<tng-input-group class="demo-group">',
    '  <span tngPrefix aria-hidden="true">Search</span>',
    '  <input tngInput type="search" placeholder="Search primitives" />',
    '  <span tngSuffix aria-hidden="true">Ctrl+K</span>',
    '</tng-input-group>',
    '',
  ].join('\n');

  protected override readonly searchWithClearButtonCode = [
    '<tng-input-group class="demo-group">',
    '  <input tngInput type="search" placeholder="Search..." />',
    '  <button tngSuffix type="button" aria-label="Clear">X</button>',
    '</tng-input-group>',
    '',
  ].join('\n');

  protected override readonly pitfallCorrectCode = [
    '<tng-input-group>',
    '  <input tngInput />',
    '</tng-input-group>',
    '',
  ].join('\n');

  protected override readonly pitfallIncorrectCode = [
    '<tng-input-group>',
    '  <input />',
    '</tng-input-group>',
    '',
  ].join('\n');

  protected readonly tailwindHeadlessExampleHtmlCode = [
    '<form class="grid w-full max-w-[30rem] gap-4">',
    '  <label class="grid gap-2 rounded-xl border border-slate-300 bg-white/80 p-3">',
    '    <span class="text-xs font-semibold leading-5 text-slate-500">What is the most abundant gas in air?</span>',
    '    <div',
    '      tngInputGroup',
    '      class="min-h-10 rounded-lg border border-slate-300 bg-white px-3 shadow-sm transition [&[data-focused]]:border-blue-500 [&[data-focused]]:ring-2 [&[data-focused]]:ring-blue-200/70"',
    '    >',
    '      <input',
    '        tngInput',
    '        type="text"',
    '        value="Nitrogen"',
    '        class="w-full border-0 bg-transparent p-0 text-[0.98rem] font-medium leading-5 outline-none"',
    '      />',
    '    </div>',
    '  </label>',
    '</form>',
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
}
