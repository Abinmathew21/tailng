import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent, TngInputComponent } from '@tailng-ui/components';
import { type DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';

@Component({
  selector: 'app-input-styling-page',
  imports: [
    TngCodeBlockComponent,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
    TngInputComponent,
  ],
  templateUrl: './input-styling-page.component.html',
  styleUrl: './input-styling-page.component.css',
})
export class InputStylingPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    this.resolveCodeBlockTheme(),
  );
  private readonly colorSchemeObserver = this.observeCodeThemeChanges();

  protected readonly headlessScenarioHtmlCode = [
    '<form class="profile-form">',
    '  <label class="profile-field">',
    '    <span class="profile-label">Display name</span>',
    '    <div tngInputGroup class="profile-shell">',
    '      <input tngInput type="text" value="Ada Lovelace" />',
    '    </div>',
    '  </label>',
    '</form>',
    '',
  ].join('\n');

  protected readonly headlessScenarioCssCode = [
    '.profile-form { display: grid; gap: 1rem; width: min(100%, 31rem); }',
    '.profile-field {',
    '  display: grid;',
    '  gap: 0.45rem;',
    '  padding: 0.8rem;',
    '  border-radius: 0.85rem;',
    '  border: 1px solid var(--tng-semantic-border-subtle);',
    '  background: color-mix(in srgb, var(--tng-semantic-background-surface) 92%, transparent);',
    '}',
    '.profile-label {',
    '  font-size: 0.82rem;',
    '  font-weight: 600;',
    '  color: var(--tng-semantic-foreground-secondary);',
    '}',
    '.profile-shell[data-slot="input-group"] {',
    '  min-height: 2.4rem;',
    '  padding: 0 0.7rem;',
    '  border-radius: 0.65rem;',
    '  border: 1px solid var(--tng-semantic-border-strong);',
    '  background: var(--tng-semantic-background-base);',
    '}',
    '.profile-shell[data-focused] {',
    '  border-color: color-mix(in srgb, var(--tng-semantic-accent-brand) 55%, var(--tng-semantic-border-strong));',
    '  box-shadow: 0 0 0 3px color-mix(in srgb, var(--tng-semantic-accent-brand) 20%, transparent);',
    '}',
    '.profile-shell [data-slot="input"] {',
    '  border: 0;',
    '  outline: 0;',
    '  padding: 0;',
    '  width: 100%;',
    '  background: transparent;',
    '}',
    '',
  ].join('\n');

  protected readonly plainCssScenarioHtmlCode = [
    '<form class="account-form">',
    '  <label class="account-field">',
    '    <span class="account-label">Display name</span>',
    '    <tng-input class="account-shell" type="text" value="Ada Lovelace"></tng-input>',
    '  </label>',
    '</form>',
    '',
  ].join('\n');

  protected readonly plainCssScenarioCssCode = [
    '.account-form { display: grid; gap: 1rem; width: min(100%, 31rem); }',
    '.account-field {',
    '  display: grid;',
    '  gap: 0.5rem;',
    '  padding: 0.8rem;',
    '  border-radius: 0.85rem;',
    '  border: 1px solid var(--tng-semantic-border-subtle);',
    '  background: var(--tng-semantic-background-surface);',
    '}',
    '.account-label {',
    '  font-size: 0.8rem;',
    '  font-weight: 600;',
    '  letter-spacing: 0.01em;',
    '  text-transform: uppercase;',
    '  color: var(--tng-semantic-foreground-muted);',
    '}',
    '.account-shell [data-slot="input-group"] {',
    '  min-height: 2.45rem;',
    '  border-radius: 0.65rem;',
    '  border: 1px solid var(--tng-semantic-border-strong);',
    '  background: var(--tng-semantic-background-base);',
    '  padding: 0 0.72rem;',
    '}',
    '.account-shell [data-slot="input-group"][data-focused] {',
    '  border-color: var(--tng-semantic-accent-brand);',
    '  box-shadow: 0 0 0 3px color-mix(in srgb, var(--tng-semantic-accent-brand) 18%, transparent);',
    '}',
    '.account-shell [data-slot="input-group"][data-invalid] {',
    '  border-color: var(--tng-semantic-accent-danger);',
    '}',
    '.account-shell [data-slot="input"] {',
    '  width: 100%;',
    '  border: 0;',
    '  outline: 0;',
    '  padding: 0;',
    '  background: transparent;',
    '}',
    '',
  ].join('\n');

  protected readonly tailwindScenarioHtmlCode = [
    '<form class="grid w-full max-w-[31rem] gap-4">',
    '  <label class="grid gap-2 rounded-xl border border-slate-300 bg-white/80 p-3">',
    '    <span class="text-xs font-semibold uppercase tracking-[0.01em] text-slate-500">Display name</span>',
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
    "             [&_[data-slot='input-group'][data-focused]]:border-cyan-500",
    "             [&_[data-slot='input-group'][data-focused]]:ring-2",
    "             [&_[data-slot='input-group'][data-focused]]:ring-cyan-200/70",
    "             [&_[data-slot='input']]:w-full",
    "             [&_[data-slot='input']]:border-0",
    "             [&_[data-slot='input']]:bg-transparent",
    "             [&_[data-slot='input']]:p-0",
    "             [&_[data-slot='input']]:text-[0.98rem]",
    "             [&_[data-slot='input']]:font-medium",
    "             [&_[data-slot='input']]:leading-5",
    "             [&_[data-slot='input']]:outline-none\"",
    '      type="text"',
    '      value="Ada Lovelace"',
    '    ></tng-input>',
    '  </label>',
    '</form>',
    '',
  ].join('\n');

  protected readonly tailwindScenarioCssCode =
    '/* Tailwind strategy: no custom CSS required. Styling stays in utility classes. */';

  protected readonly stylePatternExamples = [
    {
      title: 'Focus-first shell',
      description:
        'Use container-level focus styling so the shell owns the focus treatment instead of the projected control.',
      language: 'css',
      code: [
        '.profile-shell[data-slot="input-group"] {',
        '  border: 1px solid var(--tng-semantic-border-strong);',
        '  border-radius: 0.65rem;',
        '  background: var(--tng-semantic-background-base);',
        '  transition: border-color 0.15s ease, box-shadow 0.15s ease;',
        '}',
        '',
        '.profile-shell[data-focused] {',
        '  border-color: var(--tng-semantic-accent-brand);',
        '  box-shadow: 0 0 0 3px color-mix(in srgb, var(--tng-semantic-accent-brand) 20%, transparent);',
        '}',
        '',
      ].join('\n'),
    },
    {
      title: 'Leading and trailing content',
      description:
        'Compose search inputs with adornments while keeping native control semantics and keyboard behavior.',
      language: 'html',
      code: [
        '<tng-form-field class="search-shell">',
        '  <span tngPrefix aria-hidden="true">Search</span>',
        '  <input tngInput type="search" placeholder="Search components..." />',
        '  <button tngSuffix type="button" aria-label="Clear">Clear</button>',
        '</tng-form-field>',
        '',
      ].join('\n'),
    },
    {
      title: 'Invalid and disabled states',
      description:
        'Style error and disabled states through data hooks instead of custom class toggling logic.',
      language: 'css',
      code: [
        '.account-shell [data-slot="input-group"][data-invalid] {',
        '  border-color: var(--tng-semantic-accent-danger);',
        '}',
        '',
        '.account-shell [data-slot="input-group"][data-disabled] {',
        '  opacity: 0.55;',
        '  cursor: not-allowed;',
        '}',
        '',
      ].join('\n'),
    },
    {
      title: 'Scoped token override',
      description:
        'Theme a specific form section by overriding semantic tokens at container scope only.',
      language: 'css',
      code: [
        '.settings-form {',
        '  --tng-semantic-accent-brand: #0f766e;',
        '  --tng-semantic-focus-ring: rgba(15, 118, 110, 0.35);',
        '  --tng-semantic-border-subtle: #99f6e4;',
        '}',
        '',
      ].join('\n'),
    },
  ] as const;

  protected readonly headlessScenarioCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'headless-account-form.component.html',
      code: this.headlessScenarioHtmlCode,
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'headless-account-form.component.css',
      code: this.headlessScenarioCssCode,
    },
  ]);

  protected readonly plainCssScenarioCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'plain-css-account-form.component.html',
      code: this.plainCssScenarioHtmlCode,
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'plain-css-account-form.component.css',
      code: this.plainCssScenarioCssCode,
    },
  ]);

  protected readonly tailwindScenarioCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'tailwind-account-form.component.html',
      code: this.tailwindScenarioHtmlCode,
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'tailwind-account-form.component.css',
      code: this.tailwindScenarioCssCode,
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
