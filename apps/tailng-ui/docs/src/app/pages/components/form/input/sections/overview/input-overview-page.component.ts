import { DOCUMENT, NgTemplateOutlet } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent, TngInputComponent } from '@tailng-ui/components';
import { type DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';

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
  styleUrl: './input-overview-page.component.css',
})
export class InputOverviewPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    this.resolveCodeBlockTheme(),
  );
  private readonly colorSchemeObserver = this.observeCodeThemeChanges();

  protected readonly primitivesImportCode = [
    'import {',
    '  TngInput,',
    '  TngInputGroup,',
    '  TngPrefix,',
    '  TngSuffix,',
    "} from '@tailng-ui/primitives';",
    '',
  ].join('\n');

  protected readonly directAttachmentCode = [
    '<input tngInput type="email" placeholder="team@tailng.dev" />',
    '',
  ].join('\n');

  protected readonly wrapperUsageCode = [
    '<tng-input type="email" placeholder="team@tailng.dev"></tng-input>',
    '',
  ].join('\n');

  protected readonly groupedInputCode = [
    '<tng-form-field>',
    '  <span tngPrefix aria-hidden="true">Search</span>',
    '  <input tngInput type="search" placeholder="Search..." />',
    '  <span tngSuffix aria-hidden="true">Ctrl+K</span>',
    '</tng-form-field>',
    '',
  ].join('\n');

  protected readonly ariaInvalidTestCode = '<input tngInput [ariaInvalid]="true" />';

  protected readonly nativeValidationCode = '<input tngInput required />';

  protected readonly searchWithHintCode = [
    '<tng-form-field class="demo-group">',
    '  <span tngPrefix aria-hidden="true">Search</span>',
    '  <input tngInput type="search" placeholder="Search primitives" />',
    '  <span tngSuffix aria-hidden="true">Ctrl+K</span>',
    '</tng-form-field>',
    '',
  ].join('\n');

  protected readonly searchWithClearButtonCode = [
    '<tng-form-field class="demo-group">',
    '  <input tngInput type="search" placeholder="Search..." />',
    '  <button tngSuffix type="button" aria-label="Clear">X</button>',
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

  protected readonly headlessExampleHtmlCode = [
    '<form class="input-demo-form">',
    '  <label class="input-demo-field">',
    '    <span class="input-demo-label">What is the most abundant gas in air?</span>',
    '    <div tngInputGroup class="input-demo-shell">',
    '      <input tngInput type="text" value="Nitrogen" />',
    '    </div>',
    '  </label>',
    '</form>',
    '',
  ].join('\n');

  protected readonly headlessExampleTsCode = [
    "import { Component } from '@angular/core';",
    "import { TngInput, TngInputGroup } from '@tailng-ui/primitives';",
    '',
    '@Component({',
    "  selector: 'app-headless-input-example',",
    '  imports: [TngInputGroup, TngInput],',
    "  templateUrl: './headless-input-example.component.html',",
    "  styleUrl: './headless-input-example.component.css',",
    '})',
    'export class HeadlessInputExampleComponent {}',
    '',
  ].join('\n');

  protected readonly headlessExampleCssCode = [
    '.input-demo-form { display: grid; gap: 1rem; width: min(100%, 30rem); }',
    '.input-demo-field {',
    '  background: color-mix(in srgb, var(--tng-semantic-background-surface) 92%, transparent);',
    '  border: 1px solid var(--tng-semantic-border-subtle);',
    '  border-radius: 0.85rem;',
    '  display: grid;',
    '  gap: 0.45rem;',
    '  padding: 0.75rem 0.8rem;',
    '}',
    '.input-demo-label {',
    '  color: var(--tng-semantic-foreground-secondary);',
    '  font-size: 0.82rem;',
    '  font-weight: 600;',
    '  line-height: 1.2;',
    '}',
    '.input-demo-shell[data-slot="input-group"] {',
    '  background: var(--tng-semantic-background-base);',
    '  border: 1px solid var(--tng-semantic-border-strong);',
    '  border-radius: 0.65rem;',
    '  min-height: 2.4rem;',
    '  padding: 0 0.7rem;',
    '}',
    '.input-demo-shell [data-slot="input"] {',
    '  background: transparent;',
    '  border: 0;',
    '  box-shadow: none;',
    '  font-size: 0.98rem;',
    '  line-height: 1.35;',
    '  outline: none;',
    '  padding: 0;',
    '}',
    '.input-demo-shell[data-focused] {',
    '  border-color: color-mix(in srgb, var(--tng-semantic-accent-brand) 55%, var(--tng-semantic-border-strong));',
    '  box-shadow: 0 0 0 3px color-mix(in srgb, var(--tng-semantic-accent-brand) 20%, transparent);',
    '}',
    '',
  ].join('\n');

  protected readonly plainCssExampleHtmlCode = [
    '<form class="plain-input-form">',
    '  <label class="plain-input-field">',
    '    <span class="plain-input-label">What is the most abundant gas in air?</span>',
    '    <tng-input class="plain-input-shell" type="text" value="Nitrogen"></tng-input>',
    '  </label>',
    '</form>',
    '',
  ].join('\n');

  protected readonly plainCssExampleTsCode = [
    "import { Component } from '@angular/core';",
    "import { TngInputComponent } from '@tailng-ui/components';",
    '',
    '@Component({',
    "  selector: 'app-plain-css-input-example',",
    '  imports: [TngInputComponent],',
    "  templateUrl: './plain-css-input-example.component.html',",
    "  styleUrl: './plain-css-input-example.component.css',",
    '})',
    'export class PlainCssInputExampleComponent {}',
    '',
  ].join('\n');

  protected readonly plainCssExampleCssCode = [
    '.plain-input-form { display: grid; gap: 1rem; width: min(100%, 30rem); }',
    '.plain-input-field {',
    '  background: var(--tng-semantic-background-surface);',
    '  border: 1px solid var(--tng-semantic-border-subtle);',
    '  border-radius: 0.85rem;',
    '  display: grid;',
    '  gap: 0.45rem;',
    '  padding: 0.75rem 0.8rem;',
    '}',
    '.plain-input-label {',
    '  color: var(--tng-semantic-foreground-secondary);',
    '  font-size: 0.82rem;',
    '  font-weight: 600;',
    '}',
    '.plain-input-shell [data-slot="input-group"] {',
    '  background: var(--tng-semantic-background-base);',
    '  border: 1px solid var(--tng-semantic-border-strong);',
    '  border-radius: 0.65rem;',
    '  min-height: 2.4rem;',
    '  padding: 0 0.7rem;',
    '}',
    '.plain-input-shell [data-slot="input"] {',
    '  background: transparent;',
    '  border: 0;',
    '  box-shadow: none;',
    '  font-size: 0.98rem;',
    '  line-height: 1.35;',
    '  outline: none;',
    '  padding: 0;',
    '}',
    '',
  ].join('\n');

  protected readonly tailwindExampleHtmlCode = [
    '<form class="grid w-full max-w-[30rem] gap-4">',
    '  <label class="grid gap-2 rounded-xl border border-slate-300 bg-white/80 p-3">',
    '    <span class="text-xs font-semibold leading-5 text-slate-500">What is the most abundant gas in air?</span>',
    '    <tng-input',
    '      class="block',
    "             [&_[data-slot='input-group']]:min-h-10",
    "             [&_[data-slot='input-group']]:rounded-lg",
    "             [&_[data-slot='input-group']]:border",
    "             [&_[data-slot='input-group']]:border-slate-300",
    "             [&_[data-slot='input-group']]:bg-white",
    "             [&_[data-slot='input-group']]:px-3",
    "             [&_[data-slot='input-group']]:shadow-sm",
    "             [&_[data-slot='input-group']]:transition",
    "             [&_[data-slot='input-group'][data-focused]]:border-blue-500",
    "             [&_[data-slot='input-group'][data-focused]]:ring-2",
    "             [&_[data-slot='input-group'][data-focused]]:ring-blue-200/70",
    "             [&_[data-slot='input']]:w-full",
    "             [&_[data-slot='input']]:border-0",
    "             [&_[data-slot='input']]:bg-transparent",
    "             [&_[data-slot='input']]:p-0",
    "             [&_[data-slot='input']]:text-[0.98rem]",
    "             [&_[data-slot='input']]:font-medium",
    "             [&_[data-slot='input']]:leading-5",
    "             [&_[data-slot='input']]:outline-none\"",
    '      type="text"',
    '      value="Nitrogen"',
    '    ></tng-input>',
    '  </label>',
    '</form>',
    '',
  ].join('\n');

  protected readonly tailwindExampleTsCode = [
    "import { Component } from '@angular/core';",
    "import { TngInputComponent } from '@tailng-ui/components';",
    '',
    '@Component({',
    "  selector: 'app-tailwind-input-example',",
    '  imports: [TngInputComponent],',
    "  templateUrl: './tailwind-input-example.component.html',",
    '})',
    'export class TailwindInputExampleComponent {}',
    '',
  ].join('\n');

  protected readonly tailwindExampleCssCode =
    '/* No custom CSS required. Styles are applied with Tailwind utility classes in the template. */';
  protected readonly headlessExampleCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'headless-input-example.component.ts',
      code: this.headlessExampleTsCode,
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'headless-input-example.component.html',
      code: this.headlessExampleHtmlCode,
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'headless-input-example.component.css',
      code: this.headlessExampleCssCode,
    },
  ]);

  protected readonly plainCssExampleCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'plain-css-input-example.component.ts',
      code: this.plainCssExampleTsCode,
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'plain-css-input-example.component.html',
      code: this.plainCssExampleHtmlCode,
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'plain-css-input-example.component.css',
      code: this.plainCssExampleCssCode,
    },
  ]);

  protected readonly tailwindExampleCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'tailwind-input-example.component.ts',
      code: this.tailwindExampleTsCode,
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'tailwind-input-example.component.html',
      code: this.tailwindExampleHtmlCode,
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'tailwind-input-example.component.css',
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

  private observeCodeThemeChanges(): MutationObserver | null {
    const view = this.documentRef.defaultView;
    const mutationObserverCtor = view?.MutationObserver;
    if (mutationObserverCtor === undefined) {
      return null;
    }

    const observer = new mutationObserverCtor(() => {
      this.codeBlockTheme.set(this.resolveCodeBlockTheme());
    });

    observer.observe(this.documentRef.documentElement, {
      attributeFilter: ['style', 'class'],
      attributes: true,
    });

    return observer;
  }

  private resolveCodeBlockTheme(): 'github-dark' | 'github-light' {
    const root = this.documentRef.documentElement;
    const inlineColorScheme = root.style.getPropertyValue('color-scheme').trim().toLowerCase();
    if (inlineColorScheme.includes('dark')) {
      return 'github-dark';
    }

    const computedColorScheme = this.documentRef.defaultView
      ?.getComputedStyle(root)
      .getPropertyValue('color-scheme')
      .trim()
      .toLowerCase();

    return computedColorScheme?.includes('dark') ? 'github-dark' : 'github-light';
  }
}
