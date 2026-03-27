import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { observeDocsCodeThemeChanges, resolveDocsCodeBlockTheme } from '../../../../../../shared/util';
import { TngLabelComponent } from '@tailng-ui/components';
import { TngLabel } from '@tailng-ui/primitives';
import { type DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';

@Component({
  selector: 'app-label-examples-page',
  imports: [TngLabel, TngLabelComponent, DocsExampleTabsSectionComponent, DocsExampleVariantDirective],
  templateUrl: './label-examples-page.component.html',
  styleUrl: './label-examples-page.component.css',
})
export class LabelExamplesPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);
  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(this.documentRef, this.codeBlockTheme);

  protected readonly headlessCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'label-examples-headless.component.ts',
      code: "import { TngLabel } from '@tailng-ui/primitives';\n",
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'label-examples-headless.component.html',
      code: [
        '<div class="label-example-grid">',
        '  <label tngLabel for="ex-email">Email</label>',
        '  <input id="ex-email" type="email" />',
        '',
        '  <label tngLabel>',
        '    <input type="checkbox" />',
        '    Notify me on release',
        '  </label>',
        '</div>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'label-examples-headless.component.css',
      code: [
        '.label-example-grid {',
        '  display: grid;',
        '  gap: 0.65rem;',
        '}',
        '',
      ].join('\n'),
    },
  ]);

  protected readonly plainCssCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'label-examples-plain-css.component.ts',
      code: "import { TngLabelComponent } from '@tailng-ui/components';\n",
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'label-examples-plain-css.component.html',
      code: [
        '<div class="label-example-grid">',
        '  <tng-label forId="plain-project-name" [required]="true">Project name</tng-label>',
        '  <input id="plain-project-name" type="text" aria-required="true" />',
        '</div>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'label-examples-plain-css.component.css',
      code: [
        '.label-example-grid {',
        '  border: 1px solid var(--tng-semantic-border-subtle);',
        '  border-radius: 0.8rem;',
        '  padding: 1rem;',
        '}',
        '',
      ].join('\n'),
    },
  ]);

  protected readonly tailwindCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'label-examples-tailwind.component.ts',
      code: "import { TngLabelComponent } from '@tailng-ui/components';\n",
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'label-examples-tailwind.component.html',
      code: [
        '<div class="rounded-xl border border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">',
        '  <div class="grid gap-2">',
        '    <tng-label forId="tailwind-env" [required]="true">Environment</tng-label>',
        '    <input',
        '      id="tailwind-env"',
        '      type="text"',
        '      aria-required="true"',
        '      class="rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"',
        '    />',
        '  </div>',
        '</div>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'label-examples-tailwind.component.css',
      code: '/* Tailwind utilities are applied directly in the template. */',
    },
  ]);

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }

}
