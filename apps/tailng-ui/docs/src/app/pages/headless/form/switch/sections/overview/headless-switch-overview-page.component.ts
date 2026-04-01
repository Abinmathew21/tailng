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
  selector: 'app-headless-switch-overview-page',
  imports: [
    TngCodeBlockComponent,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
    TngSwitch,
  ],
  templateUrl: './headless-switch-overview-page.component.html',
  styleUrl: './headless-switch-overview-page.component.css',
})
export class HeadlessSwitchOverviewPageComponent implements OnDestroy {
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

  protected readonly plainCssReleaseReady = signal(true);
  protected readonly tailwindAutoPublish = signal(false);

  protected readonly primitiveImportCode =
    "import { TngSwitch } from '@tailng-ui/primitives';\n";

  protected readonly attachmentCode = [
    '<button',
    '  tngSwitch',
    '  [checked]="releaseReady()"',
    '  ariaLabel="Release ready"',
    '  (click)="releaseReady.update(value => !value)"',
    '>',
    '  <span class="switch-thumb" aria-hidden="true"></span>',
    '</button>',
    '',
  ].join('\n');

  protected readonly labeledUsageCode = [
    '<div class="headless-switch-row">',
    '  <button',
    '    tngSwitch',
    '    class="headless-switch-row__control"',
    '    [checked]="releaseReady()"',
    '    ariaLabel="Release ready"',
    '    (click)="releaseReady.update(value => !value)"',
    '  >',
    '    <span class="headless-switch-row__thumb" aria-hidden="true"></span>',
    '  </button>',
    '  <div class="headless-switch-row__copy">',
    '    <span class="headless-switch-row__title">Release ready</span>',
    '    <span class="headless-switch-row__meta">Ship after QA sign-off.</span>',
    '  </div>',
    '</div>',
    '',
  ].join('\n');

  protected readonly plainCssCodeTabs = createCodeTabs(
    'headless-switch-overview-plain',
    [
      "import { Component, signal } from '@angular/core';",
      "import { TngSwitch } from '@tailng-ui/primitives';",
      '',
      '@Component({',
      "  selector: 'app-headless-switch-overview-plain',",
      '  standalone: true,',
      '  imports: [TngSwitch],',
      "  templateUrl: './headless-switch-overview-plain.component.html',",
      "  styleUrl: './headless-switch-overview-plain.component.css',",
      '})',
      'export class HeadlessSwitchOverviewPlainComponent {',
      '  readonly releaseReady = signal(true);',
      '',
      '  onReleaseReadyToggle(): void {',
      '    this.releaseReady.update((value) => !value);',
      '  }',
      '}',
      '',
    ].join('\n'),
    [
      '<section class="headless-switch-release-shell">',
      '  <div class="headless-switch-release-shell__row">',
      '    <button',
      '      tngSwitch',
      '      class="headless-switch-release-shell__control"',
      '      [checked]="releaseReady()"',
      '      ariaLabel="Release ready"',
      '      (click)="onReleaseReadyToggle()"',
      '    >',
      '      <span class="headless-switch-release-shell__thumb" aria-hidden="true"></span>',
      '    </button>',
      '    <div class="headless-switch-release-shell__copy">',
      '      <span class="headless-switch-release-shell__title">Release ready</span>',
      '      <span class="headless-switch-release-shell__meta">Ship after QA sign-off.</span>',
      '    </div>',
      '  </div>',
      '</section>',
      '',
    ].join('\n'),
    [
      '.headless-switch-release-shell {',
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
      '  box-shadow: 0 20px 40px -32px rgba(15, 23, 42, 0.28);',
      '}',
      '',
      '.headless-switch-release-shell__row {',
      '  display: inline-flex;',
      '  align-items: center;',
      '  gap: 0.85rem;',
      '}',
      '',
      '.headless-switch-release-shell__control {',
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
      '.headless-switch-release-shell__control[data-state="checked"] {',
      '  background: #2563eb;',
      '}',
      '',
      '.headless-switch-release-shell__control:focus-visible {',
      '  outline: 2px solid rgba(37, 99, 235, 0.36);',
      '  outline-offset: 2px;',
      '}',
      '',
      '.headless-switch-release-shell__thumb {',
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
      '.headless-switch-release-shell__control[data-state="checked"] .headless-switch-release-shell__thumb {',
      '  transform: translateX(1.18rem);',
      '}',
      '',
      '.headless-switch-release-shell__copy {',
      '  display: grid;',
      '  gap: 0.15rem;',
      '}',
      '',
      '.headless-switch-release-shell__title {',
      '  font-size: 0.95rem;',
      '  font-weight: 700;',
      '  color: #0f172a;',
      '}',
      '',
      '.headless-switch-release-shell__meta {',
      '  font-size: 0.84rem;',
      '  color: #64748b;',
      '}',
      '',
    ].join('\n'),
  );

  protected readonly tailwindCodeTabs = createCodeTabs(
    'headless-switch-overview-tailwind',
    [
      "import { Component, signal } from '@angular/core';",
      "import { TngSwitch } from '@tailng-ui/primitives';",
      '',
      '@Component({',
      "  selector: 'app-headless-switch-overview-tailwind',",
      '  standalone: true,',
      '  imports: [TngSwitch],',
      "  templateUrl: './headless-switch-overview-tailwind.component.html',",
      '})',
      'export class HeadlessSwitchOverviewTailwindComponent {',
      '  readonly autoPublish = signal(false);',
      '',
      '  onAutoPublishToggle(): void {',
      '    this.autoPublish.update((value) => !value);',
      '  }',
      '}',
      '',
    ].join('\n'),
    [
      '<section class="grid w-full max-w-[30rem] gap-4 rounded-2xl border border-slate-300 bg-white p-4 text-slate-900 shadow-sm [color-scheme:light]">',
      '  <div class="inline-flex items-center gap-4">',
      '    <button',
      '      tngSwitch',
      '      class="inline-flex h-6 w-11 items-center rounded-full border-0 bg-slate-300 p-0.5 transition data-[state=checked]:bg-blue-600 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-100"',
      '      [checked]="autoPublish()"',
      '      ariaLabel="Auto publish after review"',
      '      (click)="onAutoPublishToggle()"',
      '    >',
      '      <span',
      '        aria-hidden="true"',
      '        class="block h-5 w-5 rounded-full bg-white shadow-sm transition-transform"',
      '        [class.translate-x-5]="autoPublish()"',
      '      ></span>',
      '    </button>',
      '    <div class="grid gap-0.5">',
      '      <span class="text-sm font-semibold text-slate-900">Auto publish</span>',
      '      <span class="text-xs text-slate-500">Ship after review approval.</span>',
      '    </div>',
      '  </div>',
      '</section>',
      '',
    ].join('\n'),
      '/* Tailwind utilities are applied directly in the template. */',
  );

  public onPlainCssReleaseReadyToggle(): void {
    this.plainCssReleaseReady.update((value) => !value);
  }

  public onTailwindAutoPublishToggle(): void {
    this.tailwindAutoPublish.update((value) => !value);
  }

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
