import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent, TngFormFieldComponent } from '@tailng-ui/components';
import { TngIcon } from '@tailng-ui/icons';
import { TngInput, TngPrefix, TngSuffix } from '@tailng-ui/primitives';
import { type DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';

@Component({
  selector: 'app-form-field-overview-page',
  imports: [
    TngCodeBlockComponent,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
    TngFormFieldComponent,
    TngInput,
    TngPrefix,
    TngSuffix,
    TngIcon,
  ],
  templateUrl: './form-field-overview-page.component.html',
  styleUrls: ['../../../../../../shared/form/input/input-styles.css'],
})
export class FormFieldOverviewPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    this.resolveCodeBlockTheme(),
  );
  private readonly colorSchemeObserver = this.observeCodeThemeChanges();

  protected readonly importsCode = [
    "import { TngFormFieldComponent } from '@tailng-ui/components';",
    "import { TngInput, TngPrefix, TngSuffix } from '@tailng-ui/primitives';",
    '',
  ].join('\n');

  protected readonly basicCompositionCode = [
    '<tng-form-field>',
    '  <input tngInput type="text" placeholder="Search" />',
    '</tng-form-field>',
    '',
  ].join('\n');

  protected readonly searchCompositionCode = [
    '<tng-form-field>',
    '  <span tngPrefix aria-hidden="true">Search</span>',
    '  <input tngInput type="search" placeholder="Search components" />',
    '  <span tngSuffix aria-hidden="true">Ctrl+K</span>',
    '</tng-form-field>',
    '',
  ].join('\n');

  protected readonly relationshipCode = [
    '<tng-input type="search" placeholder="Search" ariaLabel="Search"></tng-input>',
    '',
    '<!-- Use tng-form-field when you need projected adornments -->',
    '<tng-form-field>',
    '  <span tngPrefix aria-hidden="true">Search</span>',
    '  <input tngInput type="search" placeholder="Search components" />',
    '</tng-form-field>',
    '',
  ].join('\n');

  protected readonly accessibilityCode = [
    '<tng-form-field>',
    '  <span tngPrefix aria-hidden="true">Search</span>',
    '  <input tngInput aria-label="Search docs" />',
    '  <button tngSuffix type="button" aria-label="Clear search">Clear</button>',
    '</tng-form-field>',
    '',
  ].join('\n');

  private readonly plainCssExampleHtmlCode = [
    '<label class="plain-field">',
    '  <span class="plain-field-label">Search docs</span>',
    '  <tng-form-field class="plain-form-field">',
    '    <span tngPrefix aria-hidden="true">',
    '      <tng-icon icon="search"></tng-icon>',
    '    </span>',
    '    <input tngInput type="search" placeholder="Search components..." />',
    '    <span tngSuffix class="plain-field-meta">Ctrl+K</span>',
    '  </tng-form-field>',
    '</label>',
    '',
  ].join('\n');

  private readonly plainCssExampleTsCode = [
    "import { Component } from '@angular/core';",
    "import { TngFormFieldComponent } from '@tailng-ui/components';",
    "import { TngInput, TngPrefix, TngSuffix } from '@tailng-ui/primitives';",
    "import { TngIcon } from '@tailng-ui/icons';",
    '',
    '@Component({',
    "  selector: 'app-form-field-plain-example',",
    '  imports: [TngFormFieldComponent, TngInput, TngPrefix, TngSuffix, TngIcon],',
    "  templateUrl: './form-field-plain-example.component.html',",
    "  styleUrl: './form-field-plain-example.component.css',",
    '})',
    'export class FormFieldPlainExampleComponent {}',
    '',
  ].join('\n');

  private readonly plainCssExampleCssCode = [
    '.plain-field { display: grid; gap: 0.45rem; width: min(100%, 32rem); }',
    '.plain-field-label { font-size: 0.82rem; font-weight: 600; color: var(--tng-semantic-foreground-secondary); }',
    '.plain-form-field [data-slot="input-group"] {',
    '  min-height: 2.65rem;',
    '  border-radius: 0.78rem;',
    '}',
    '.plain-field-meta { font-size: 0.8rem; font-weight: 600; }',
    '',
  ].join('\n');

  private readonly tailwindExampleHtmlCode = [
    '<label class="grid w-full max-w-[32rem] gap-2">',
    '  <span class="text-xs font-semibold text-slate-500">Search docs</span>',
    '  <tng-form-field',
    '    class="block',
    "           [&_[data-slot='input-group']]:min-h-11",
    "           [&_[data-slot='input-group']]:items-center",
    "           [&_[data-slot='input-group']]:rounded-xl",
    "           [&_[data-slot='input-group']]:border",
    "           [&_[data-slot='input-group']]:border-slate-300",
    "           [&_[data-slot='input-group']]:bg-white",
    "           [&_[data-slot='input-group']]:px-3",
    "           [&_[data-slot='input-group']]:shadow-sm",
    "           [&_[data-slot='input-group'][data-focused]]:border-blue-500",
    "           [&_[data-slot='input-group'][data-focused]]:ring-2",
    "           [&_[data-slot='input-group'][data-focused]]:ring-blue-200",
    "           [&_[data-slot='input']]:w-full",
    "           [&_[data-slot='input']]:border-0",
    "           [&_[data-slot='input']]:bg-transparent",
    "           [&_[data-slot='input']]:p-0",
    '           [&_[data-slot=\'input\']]:outline-none">',
    '    <span tngPrefix aria-hidden="true">',
    '      <tng-icon icon="search" class="h-4 w-4"></tng-icon>',
    '    </span>',
    '    <input tngInput type="search" placeholder="Search components..." />',
    '    <span tngSuffix class="text-xs font-semibold text-slate-500">Ctrl+K</span>',
    '  </tng-form-field>',
    '</label>',
    '',
  ].join('\n');

  private readonly tailwindExampleTsCode = [
    "import { Component } from '@angular/core';",
    "import { TngFormFieldComponent } from '@tailng-ui/components';",
    "import { TngInput, TngPrefix, TngSuffix } from '@tailng-ui/primitives';",
    "import { TngIcon } from '@tailng-ui/icons';",
    '',
    '@Component({',
    "  selector: 'app-form-field-tailwind-example',",
    '  imports: [TngFormFieldComponent, TngInput, TngPrefix, TngSuffix, TngIcon],',
    "  templateUrl: './form-field-tailwind-example.component.html',",
    "  styleUrl: './form-field-tailwind-example.component.css',",
    '})',
    'export class FormFieldTailwindExampleComponent {}',
    '',
  ].join('\n');

  private readonly tailwindExampleCssCode =
    '/* Tailwind utilities are applied directly in the template. */';

  protected readonly plainCssExampleCodeTabs = this.createCodeTabs(
    'form-field-plain-example',
    this.plainCssExampleTsCode,
    this.plainCssExampleHtmlCode,
    this.plainCssExampleCssCode,
  );

  protected readonly tailwindExampleCodeTabs = this.createCodeTabs(
    'form-field-tailwind-example',
    this.tailwindExampleTsCode,
    this.tailwindExampleHtmlCode,
    this.tailwindExampleCssCode,
  );

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }

  protected focusProjectedInput(event: MouseEvent): void {
    const currentTarget = event.currentTarget;
    if (!(currentTarget instanceof HTMLElement)) {
      return;
    }

    const input = currentTarget.querySelector('input');
    if (input instanceof HTMLInputElement) {
      input.focus();
    }
  }

  private createCodeTabs(
    baseName: string,
    tsCode: string,
    htmlCode: string,
    cssCode: string,
  ): readonly DocsExampleCodeTab[] {
    return Object.freeze([
      { value: 'ts', label: 'TS', language: 'ts', title: `${baseName}.component.ts`, code: tsCode },
      { value: 'html', label: 'HTML', language: 'html', title: `${baseName}.component.html`, code: htmlCode },
      { value: 'css', label: 'CSS', language: 'css', title: `${baseName}.component.css`, code: cssCode },
    ]);
  }

  private observeCodeThemeChanges(): MutationObserver | null {
    const mutationObserverCtor = this.documentRef.defaultView?.MutationObserver;
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
