import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { observeDocsCodeThemeChanges, resolveDocsCodeBlockTheme } from '../../../../../../shared/util';
import { TngCodeBlockComponent, TngInputComponent } from '@tailng-ui/components';
import type { DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
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
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(this.documentRef, this.codeBlockTheme);

  protected readonly slotSelectorsCode = [
    '[data-slot="input-group"]',
    '[data-slot="input-group-leading"]',
    '[data-slot="input-group-control"]',
    '[data-slot="input-group-trailing"]',
    '[data-slot="input"]',
    '[data-focused]',
    '[data-invalid]',
    '[data-disabled]',
    '[data-readonly]',
    '',
  ].join('\n');

  protected readonly themeTokensCode = [
    '--tng-input-gap',
    '--tng-input-bg',
    '--tng-input-border',
    '--tng-input-radius',
    '--tng-input-fg',
    '--tng-input-min-height',
    '--tng-input-px',
    '--tng-input-py',
    '--tng-input-focus-ring',
    '',
  ].join('\n');

  protected readonly stateHooksCode = [
    '.settings-input {',
    '  --tng-input-border: color-mix(in srgb, var(--tng-semantic-border-strong) 82%, transparent);',
    '  --tng-input-focus-ring: color-mix(in srgb, var(--tng-semantic-accent-brand) 20%, transparent);',
    '}',
    '',
    '.settings-input [data-slot="input-group"][data-invalid] {',
    '  border-color: var(--tng-semantic-accent-danger);',
    '}',
    '',
    '.settings-input [data-slot="input-group"][data-disabled] {',
    '  opacity: 0.58;',
    '  cursor: not-allowed;',
    '}',
    '',
  ].join('\n');

  private readonly plainCssScenarioHtmlCode = [
    '<label class="account-field">',
    '  <span class="account-label">Display name</span>',
    '  <tng-input',
    '    class="input-styling-example-shell input-styling-example-shell--plain"',
    '    type="text"',
    '    value="Ada Lovelace"',
    '    ariaLabel="Display name"',
    '  ></tng-input>',
    '</label>',
    '',
  ].join('\n');

  private readonly plainCssScenarioCssCode = [
    '.input-styling-example-shell--plain {',
    '  --tng-input-min-height: 2.45rem;',
    '  --tng-input-radius: 0.75rem;',
    '  --tng-input-px: 0.78rem;',
    '  --tng-input-border: color-mix(in srgb, var(--tng-semantic-border-strong) 76%, transparent);',
    '  --tng-input-bg: var(--tng-semantic-background-base);',
    '  --tng-input-focus-ring: color-mix(in srgb, var(--tng-semantic-accent-brand) 18%, transparent);',
    '  font-size: 0.98rem;',
    '  font-weight: 500;',
    '}',
    '',
  ].join('\n');

  private readonly tailwindScenarioHtmlCode = [
    '<label class="grid w-full max-w-[31rem] gap-2 rounded-xl border border-slate-300 bg-white/80 p-3">',
    '  <span class="text-xs font-semibold uppercase tracking-[0.01em] text-slate-500">Display name</span>',
    '  <tng-input',
    '    class="block',
    "           [&_[data-slot='input-group']]:min-h-10",
    "           [&_[data-slot='input-group']]:rounded-lg",
    "           [&_[data-slot='input-group']]:border",
    "           [&_[data-slot='input-group']]:border-slate-300",
    "           [&_[data-slot='input-group']]:bg-white",
    "           [&_[data-slot='input-group']]:px-3",
    "           [&_[data-slot='input-group']]:shadow-sm",
    "           [&_[data-slot='input-group'][data-focused]]:border-cyan-500",
    "           [&_[data-slot='input-group'][data-focused]]:ring-2",
    "           [&_[data-slot='input-group'][data-focused]]:ring-cyan-200/70",
    "           [&_[data-slot='input']]:w-full",
    "           [&_[data-slot='input']]:border-0",
    "           [&_[data-slot='input']]:bg-transparent",
    "           [&_[data-slot='input']]:p-0",
    "           [&_[data-slot='input']]:text-[0.98rem]",
    "           [&_[data-slot='input']]:font-medium",
    "           [&_[data-slot='input']]:leading-5",
    "           [&_[data-slot='input']]:outline-none\"",
    '    type="text"',
    '    value="Ada Lovelace"',
    '    ariaLabel="Display name"',
    '  ></tng-input>',
    '</label>',
    '',
  ].join('\n');

  private readonly tailwindScenarioCssCode =
    '/* Tailwind strategy: utilities are applied directly in the template. */';

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

  protected readonly stylePatternExamples = [
    {
      title: 'Theme token override',
      description:
        'Prefer overriding the public input tokens on the host instead of reaching into internal DOM for routine visual changes.',
      language: 'css',
      code: [
        '.settings-input {',
        '  --tng-input-bg: var(--tng-semantic-background-base);',
        '  --tng-input-border: color-mix(in srgb, var(--tng-semantic-border-strong) 82%, transparent);',
        '  --tng-input-radius: 0.75rem;',
        '  --tng-input-min-height: 2.5rem;',
        '  --tng-input-px: 0.8rem;',
        '  --tng-input-focus-ring: color-mix(in srgb, var(--tng-semantic-accent-brand) 20%, transparent);',
        '}',
        '',
      ].join('\n'),
    },
    {
      title: 'Density control',
      description:
        'Tune field density through the token surface instead of replacing the shell layout.',
      language: 'css',
      code: [
        '.compact-input {',
        '  --tng-input-min-height: 2.2rem;',
        '  --tng-input-px: 0.68rem;',
        '  --tng-input-gap: 0.45rem;',
        '  --tng-input-radius: 0.65rem;',
        '}',
        '',
      ].join('\n'),
    },
    {
      title: 'State-aware shell',
      description:
        'Use the emitted state attrs when the visual treatment must react to focus, invalid, or disabled state.',
      language: 'css',
      code: this.stateHooksCode,
    },
  ] as const;

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
