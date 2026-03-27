import { DOCUMENT, NgTemplateOutlet } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent, TngInputComponent } from '@tailng-ui/components';
import type { DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';
import { observeDocsCodeThemeChanges, resolveDocsCodeBlockTheme } from '../../../../../../shared/util';

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
  styleUrl: '../../../../../../shared/form/input/input-styles.css',
})
export class InputOverviewPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(this.documentRef, this.codeBlockTheme);

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
    '<label class="input-overview-example-field-surface">',
    '  <span class="input-overview-example-field-label">Email</span>',
    '  <tng-input',
    '    class="input-overview-example-shell input-overview-example-shell--plain"',
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
    "  selector: 'app-plain-css-input-example',",
    '  standalone: true,',
    '  imports: [TngInputComponent],',
    "  templateUrl: './plain-css-input-example.component.html',",
    "  styleUrl: './plain-css-input-example.component.css',",
    '})',
    'export class PlainCssInputExampleComponent {}',
    '',
  ].join('\n');

  private readonly plainCssExampleCssCode = [
    '.input-overview-example-shell--plain {',
    '  --tng-input-min-height: 2.5rem;',
    '  --tng-input-radius: 0.72rem;',
    '  --tng-input-border: color-mix(in srgb, var(--tng-semantic-border-strong) 78%, transparent);',
    '  --tng-input-focus-ring: color-mix(in srgb, var(--tng-semantic-accent-brand) 22%, transparent);',
    '  --tng-input-bg: var(--tng-semantic-background-base);',
    '  font-size: 0.98rem;',
    '  font-weight: 500;',
    '}',
    '',
  ].join('\n');

  private readonly tailwindExampleHtmlCode = [
    '<label class="grid gap-2 rounded-xl border border-slate-300 bg-white/80 p-3">',
    '  <span class="text-xs font-semibold text-slate-500">Email</span>',
    '  <tng-input',
    '    class="block',
    "           [&_[data-slot='input-group']]:min-h-10",
    "           [&_[data-slot='input-group']]:rounded-lg",
    "           [&_[data-slot='input-group']]:border",
    "           [&_[data-slot='input-group']]:border-slate-300",
    "           [&_[data-slot='input-group']]:bg-white",
    "           [&_[data-slot='input-group']]:px-3",
    "           [&_[data-slot='input-group']]:shadow-sm",
    "           [&_[data-slot='input-group'][data-focused]]:border-blue-500",
    "           [&_[data-slot='input-group'][data-focused]]:ring-2",
    "           [&_[data-slot='input-group'][data-focused]]:ring-blue-200/70",
    "           [&_[data-slot='input']]:min-w-0",
    "           [&_[data-slot='input']]:w-full",
    "           [&_[data-slot='input']]:appearance-none",
    "           [&_[data-slot='input']]:border-0",
    "           [&_[data-slot='input']]:bg-transparent",
    "           [&_[data-slot='input']]:p-0",
    "           [&_[data-slot='input']]:text-[0.98rem]",
    "           [&_[data-slot='input']]:text-slate-900",
    "           [&_[data-slot='input']]:font-medium",
    "           [&_[data-slot='input']]:leading-5",
    "           [&_[data-slot='input']]:placeholder:text-slate-400",
    "           [&_[data-slot='input']]:outline-none\"",
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
    "  selector: 'app-tailwind-input-example',",
    '  standalone: true,',
    '  imports: [TngInputComponent],',
    "  templateUrl: './tailwind-input-example.component.html',",
    '})',
    'export class TailwindInputExampleComponent {}',
    '',
  ].join('\n');

  private readonly tailwindExampleCssCode =
    '/* No custom CSS required. Tailwind utilities are applied directly in the template. */';

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

}
