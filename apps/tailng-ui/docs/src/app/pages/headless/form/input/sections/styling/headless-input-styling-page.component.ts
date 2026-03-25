import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { TngInput, TngInputGroup } from '@tailng-ui/primitives';
import type { DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';
import { InputStylingPageComponent } from '../../../../../components/form/input/sections/styling/input-styling-page.component';

@Component({
  selector: 'app-headless-input-styling-page',
  imports: [
    TngCodeBlockComponent,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
    TngInputGroup,
    TngInput,
  ],
  templateUrl: './headless-input-styling-page.component.html',
  styleUrls: [
    '../../../../../components/form/input/sections/styling/input-styling-page.component.css',
  ],
})
export class HeadlessInputStylingPageComponent extends InputStylingPageComponent {
  protected readonly tailwindHeadlessScenarioHtmlCode = [
    '<form class="grid w-full max-w-[31rem] gap-4">',
    '  <label class="grid gap-2 rounded-xl border border-slate-300 bg-white/80 p-3">',
    '    <span class="text-xs font-semibold uppercase tracking-[0.01em] text-slate-500">Display name</span>',
    '    <div',
    '      tngInputGroup',
    '      class="min-h-10 rounded-lg border border-slate-300 bg-white px-3 shadow-sm transition [&[data-focused]]:border-cyan-500 [&[data-focused]]:ring-2 [&[data-focused]]:ring-cyan-200/70"',
    '    >',
    '      <input',
    '        tngInput',
    '        type="text"',
    '        value="Ada Lovelace"',
    '        class="w-full border-0 bg-transparent p-0 text-[0.98rem] font-medium leading-5 outline-none"',
    '      />',
    '    </div>',
    '  </label>',
    '</form>',
    '',
  ].join('\n');

  protected readonly tailwindHeadlessScenarioCssCode =
    '/* Tailwind strategy: no custom CSS required. Styling stays in utility classes. */';

  protected readonly plainCssHeadlessScenarioCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'plain-css-headless-account-form.component.html',
      code: this.headlessScenarioHtmlCode,
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'plain-css-headless-account-form.component.css',
      code: this.headlessScenarioCssCode,
    },
  ]);

  protected readonly tailwindHeadlessScenarioCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'tailwind-headless-account-form.component.html',
      code: this.tailwindHeadlessScenarioHtmlCode,
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'tailwind-headless-account-form.component.css',
      code: this.tailwindHeadlessScenarioCssCode,
    },
  ]);
}
