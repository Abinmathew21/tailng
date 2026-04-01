import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { TngSwitch } from '@tailng-ui/primitives';
import type { DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';
import {
  observeDocsCodeThemeChanges,
  resolveDocsCodeBlockTheme,
} from '../../../../../../shared/util';
import { stackblitzTailwindUrl, stackblitzVanillaUrl } from '../../switch.util';

function createCodeTabs(
  baseName: string,
  tsCode: string,
  htmlCode: string,
  cssCode: string,
): readonly DocsExampleCodeTab[] {
  return Object.freeze([
    { value: 'ts', label: 'TS', language: 'ts', title: `${baseName}.component.ts`, code: tsCode },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: `${baseName}.component.html`,
      code: htmlCode,
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: `${baseName}.component.css`,
      code: cssCode,
    },
  ]);
}

@Component({
  selector: 'app-headless-switch-styling-page',
  imports: [TngCodeBlockComponent, DocsExampleTabsSectionComponent, DocsExampleVariantDirective, TngSwitch],
  templateUrl: './headless-switch-styling-page.component.html',
  styleUrl: './headless-switch-styling-page.component.css',
})
export class HeadlessSwitchStylingPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly stackblitzVanillaUrl = stackblitzVanillaUrl;
  protected readonly stackblitzTailwindUrl = stackblitzTailwindUrl;

  protected readonly plainCssStatus = signal(true);
  protected readonly tailwindStatus = signal(true);

  protected readonly stateSelectorSnippet = [
    'button[tngSwitch][data-slot="switch"] {',
    '  background: var(--tng-semantic-border-subtle, #cbd5e1);',
    '}',
    '',
    'button[tngSwitch][data-state="checked"] {',
    '  background: var(--tng-semantic-accent-brand, #2563eb);',
    '}',
    '',
    'button[tngSwitch][data-disabled] {',
    '  cursor: not-allowed;',
    '  opacity: 0.55;',
    '}',
    '',
    'button[tngSwitch]:focus-visible {',
    '  outline: 2px solid color-mix(',
    '    in srgb,',
    '    var(--tng-semantic-accent-brand, #2563eb) 25%,',
    '    white',
    '  );',
    '  outline-offset: 2px;',
    '}',
    '',
  ].join('\n');

  protected readonly shellSnippet = [
    '.headless-switch-shell {',
    '  display: grid;',
    '  gap: 0.85rem;',
    '  inline-size: min(100%, 30rem);',
    '  margin-inline: auto;',
    '  padding: 1rem;',
    '  border: 1px solid #cbd5e1;',
    '  border-radius: 1rem;',
    '  background: #ffffff;',
    '}',
    '',
    '.headless-switch-shell__row {',
    '  display: inline-flex;',
    '  align-items: center;',
    '  justify-content: space-between;',
    '  gap: 1rem;',
    '}',
    '',
  ].join('\n');

  protected readonly plainCssCodeTabs = createCodeTabs(
    'headless-switch-styling-plain',
    [
      "import { Component, signal } from '@angular/core';",
      "import { TngSwitch } from '@tailng-ui/primitives';",
      '',
      '@Component({',
      "  selector: 'app-headless-switch-styling-plain',",
      '  standalone: true,',
      '  imports: [TngSwitch],',
      "  templateUrl: './headless-switch-styling-plain.component.html',",
      "  styleUrl: './headless-switch-styling-plain.component.css',",
      '})',
      'export class HeadlessSwitchStylingPlainComponent {',
      '  readonly requireReview = signal(true);',
      '',
      '  onRequireReviewToggle(): void {',
      '    this.requireReview.update((value) => !value);',
      '  }',
      '}',
      '',
    ].join('\n'),
    [
      '<section class="headless-switch-status-shell">',
      '  <div class="headless-switch-status-shell__row">',
      '    <div class="headless-switch-status-shell__copy">',
      '      <span class="headless-switch-status-shell__title">Require review</span>',
      '      <span class="headless-switch-status-shell__meta">Hold publishing until an approver signs off.</span>',
      '    </div>',
      '    <button',
      '      tngSwitch',
      '      class="headless-switch-status-shell__control"',
      '      [checked]="requireReview()"',
      '      ariaLabel="Require review"',
      '      (click)="onRequireReviewToggle()"',
      '    >',
      '      <span class="headless-switch-status-shell__thumb" aria-hidden="true"></span>',
      '    </button>',
      '  </div>',
      '</section>',
      '',
    ].join('\n'),
    [
      '.headless-switch-status-shell {',
      '  display: grid;',
      '  gap: 0.85rem;',
      '  inline-size: min(100%, 30rem);',
      '  margin-inline: auto;',
      '  padding: 1rem;',
      '  border: 1px solid #cbd5e1;',
      '  border-radius: 1rem;',
      '  background: #ffffff;',
      '  color: #0f172a;',
      '  color-scheme: light;',
      '}',
      '',
      '.headless-switch-status-shell__row {',
      '  display: inline-flex;',
      '  align-items: center;',
      '  justify-content: space-between;',
      '  gap: 1rem;',
      '}',
      '',
      '.headless-switch-status-shell__copy {',
      '  display: grid;',
      '  gap: 0.2rem;',
      '}',
      '',
      '.headless-switch-status-shell__title {',
      '  font-size: 0.95rem;',
      '  font-weight: 700;',
      '  color: #0f172a;',
      '}',
      '',
      '.headless-switch-status-shell__meta {',
      '  font-size: 0.82rem;',
      '  color: #64748b;',
      '}',
      '',
      '.headless-switch-status-shell__control {',
      '  align-items: center;',
      '  display: inline-flex;',
      '  justify-content: flex-start;',
      '  inline-size: 2.75rem;',
      '  block-size: 1.55rem;',
      '  padding: 0.125rem;',
      '  border: 0;',
      '  border-radius: 999px;',
      '  background: #cbd5e1;',
      '  cursor: pointer;',
      '  transition: background-color 150ms ease;',
      '}',
      '',
      '.headless-switch-status-shell__control[data-state="checked"] {',
      '  background: #2563eb;',
      '}',
      '',
      '.headless-switch-status-shell__control:focus-visible {',
      '  outline: 2px solid rgba(37, 99, 235, 0.32);',
      '  outline-offset: 2px;',
      '}',
      '',
      '.headless-switch-status-shell__thumb {',
      '  display: block;',
      '  inline-size: 1.25rem;',
      '  block-size: 1.25rem;',
      '  border-radius: 999px;',
      '  background: #ffffff;',
      '  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.16);',
      '  transform: translateX(0);',
      '  transition: transform 150ms ease;',
      '}',
      '',
      '.headless-switch-status-shell__control[data-state="checked"] .headless-switch-status-shell__thumb {',
      '  transform: translateX(1.18rem);',
      '}',
      '',
    ].join('\n'),
  );

  protected readonly tailwindCodeTabs = createCodeTabs(
    'headless-switch-styling-tailwind',
    [
      "import { Component, signal } from '@angular/core';",
      "import { TngSwitch } from '@tailng-ui/primitives';",
      '',
      '@Component({',
      "  selector: 'app-headless-switch-styling-tailwind',",
      '  standalone: true,',
      '  imports: [TngSwitch],',
      "  templateUrl: './headless-switch-styling-tailwind.component.html',",
      '})',
      'export class HeadlessSwitchStylingTailwindComponent {',
      '  readonly requireReview = signal(true);',
      '',
      '  onRequireReviewToggle(): void {',
      '    this.requireReview.update((value) => !value);',
      '  }',
      '}',
      '',
    ].join('\n'),
    [
      '<section class="grid w-full max-w-[30rem] gap-4 rounded-2xl border border-slate-300 bg-white p-4 text-slate-900 shadow-sm [color-scheme:light]">',
      '  <div class="inline-flex items-center justify-between gap-4">',
      '    <div class="grid gap-0.5">',
      '      <span class="text-sm font-semibold text-slate-900">Require review</span>',
      '      <span class="text-xs text-slate-500">Hold publishing until an approver signs off.</span>',
      '    </div>',
      '    <button',
      '      tngSwitch',
      '      class="inline-flex h-6 w-11 items-center rounded-full border-0 bg-slate-300 p-0.5 transition data-[state=checked]:bg-blue-600 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-100"',
      '      [checked]="requireReview()"',
      '      ariaLabel="Require review"',
      '      (click)="onRequireReviewToggle()"',
      '    >',
      '      <span',
      '        aria-hidden="true"',
      '        class="block h-5 w-5 rounded-full bg-white shadow-sm transition-transform"',
      '        [class.translate-x-5]="requireReview()"',
      '      ></span>',
      '    </button>',
      '  </div>',
      '</section>',
      '',
    ].join('\n'),
    '/* Tailwind utilities are applied directly in the template. */',
  );

  public onPlainCssStatusToggle(): void {
    this.plainCssStatus.update((value) => !value);
  }

  public onTailwindStatusToggle(): void {
    this.tailwindStatus.update((value) => !value);
  }

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
