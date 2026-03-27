import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { observeDocsCodeThemeChanges, resolveDocsCodeBlockTheme } from '../../../../../../shared/util';
import { TngSwitchComponent } from '@tailng-ui/components';
import { TngSwitch as TngSwitchPrimitive } from '@tailng-ui/primitives';
import { type DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';

function createCodeTabs(
  baseName: string,
  tsCode: string,
  htmlCode: string,
  cssCode: string,
): readonly DocsExampleCodeTab[] {
  return Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: `${baseName}.component.ts`,
      code: tsCode,
    },
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
  selector: 'app-switch-examples-page',
  imports: [
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
    TngSwitchComponent,
    TngSwitchPrimitive,
  ],
  templateUrl: './switch-examples-page.component.html',
  styleUrl: './switch-examples-page.component.css',
})
export class SwitchExamplesPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(this.documentRef, this.codeBlockTheme);

  public readonly headlessNotifications = signal(true);
  public readonly headlessDarkMode = signal(false);
  public readonly plainCssNotifications = signal(true);
  public readonly plainCssDarkMode = signal(false);
  public readonly tailwindNotifications = signal(true);
  public readonly tailwindDarkMode = signal(false);

  protected readonly settingsHeadlessCodeTabs = createCodeTabs(
    'switch-settings-headless',
    [
      "import { Component, signal } from '@angular/core';",
      "import { TngSwitch } from '@tailng-ui/primitives';",
      '',
      '@Component({',
      '  imports: [TngSwitch],',
      "  templateUrl: './switch-settings-headless.component.html',",
      "  styleUrl: './switch-settings-headless.component.css',",
      '})',
      'export class SwitchSettingsHeadlessComponent {',
      '  readonly notifications = signal(true);',
      '  readonly darkMode = signal(false);',
      '}',
      '',
    ].join('\n'),
    [
      '<div class="switch-settings">',
      '  <div class="switch-row">',
      '    <button tngSwitch class="switch-track" [checked]="notifications()" ariaLabel="Notifications" (click)="notifications.update(v => !v)">',
      '      <span class="switch-thumb"></span>',
      '    </button>',
      '    <span>Push notifications</span>',
      '  </div>',
      '  <div class="switch-row">',
      '    <button tngSwitch class="switch-track" [checked]="darkMode()" ariaLabel="Dark mode" (click)="darkMode.update(v => !v)">',
      '      <span class="switch-thumb"></span>',
      '    </button>',
      '    <span>Dark mode</span>',
      '  </div>',
      '</div>',
      '',
    ].join('\n'),
    [
      '.switch-settings { display: grid; gap: 0.75rem; }',
      '.switch-row { align-items: center; display: inline-flex; gap: 0.65rem; }',
      '.switch-track {',
      '  background: var(--tng-semantic-border-subtle); border: 0; border-radius: 999px;',
      '  height: 1.5rem; width: 2.65rem; padding: 0.125rem; cursor: pointer;',
      '}',
      '.switch-track[data-state="checked"] { background: var(--tng-semantic-accent-brand); }',
      '.switch-thumb {',
      '  background: white; border-radius: 999px;',
      '  height: 1.25rem; width: 1.25rem;',
      '  transform: translateX(0); transition: transform 150ms ease;',
      '}',
      '.switch-track[data-state="checked"] .switch-thumb { transform: translateX(1.15rem); }',
      '',
    ].join('\n'),
  );

  protected readonly settingsPlainCssCodeTabs = createCodeTabs(
    'switch-settings-plain-css',
    [
      "import { Component, signal } from '@angular/core';",
      "import { TngSwitchComponent } from '@tailng-ui/components';",
      '',
      '@Component({',
      '  imports: [TngSwitchComponent],',
      "  templateUrl: './switch-settings-plain-css.component.html',",
      "  styleUrl: './switch-settings-plain-css.component.css',",
      '})',
      'export class SwitchSettingsPlainCssComponent {',
      '  readonly notifications = signal(true);',
      '  readonly darkMode = signal(false);',
      '}',
      '',
    ].join('\n'),
    [
      '<div class="switch-settings switch-settings--plain">',
      '  <tng-switch [checked]="notifications()" (checkedChange)="notifications.set($event)">Push notifications</tng-switch>',
      '  <tng-switch [checked]="darkMode()" (checkedChange)="darkMode.set($event)">Dark mode</tng-switch>',
      '</div>',
      '',
    ].join('\n'),
    [
      '.switch-settings--plain {',
      '  background: var(--tng-semantic-background-surface);',
      '  border: 1px solid var(--tng-semantic-border-subtle);',
      '  border-radius: 0.75rem;',
      '  padding: 0.75rem 0.9rem;',
      '}',
      '',
    ].join('\n'),
  );

  protected readonly settingsTailwindCodeTabs = createCodeTabs(
    'switch-settings-tailwind',
    [
      "import { Component, signal } from '@angular/core';",
      "import { TngSwitchComponent } from '@tailng-ui/components';",
      '',
      '@Component({',
      '  imports: [TngSwitchComponent],',
      "  templateUrl: './switch-settings-tailwind.component.html',",
      '})',
      'export class SwitchSettingsTailwindComponent {',
      '  readonly notifications = signal(true);',
      '  readonly darkMode = signal(false);',
      '}',
      '',
    ].join('\n'),
    [
      '<div class="grid gap-3 rounded-xl border border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">',
      '  <tng-switch [checked]="notifications()" (checkedChange)="notifications.set($event)">Push notifications</tng-switch>',
      '  <tng-switch [checked]="darkMode()" (checkedChange)="darkMode.set($event)">Dark mode</tng-switch>',
      '</div>',
      '',
    ].join('\n'),
    '/* Tailwind utilities are applied directly in the template. */',
  );

  protected readonly disabledHeadlessCodeTabs = createCodeTabs(
    'switch-disabled-headless',
    [
      "import { Component } from '@angular/core';",
      "import { TngSwitch } from '@tailng-ui/primitives';",
      '',
      '@Component({',
      '  imports: [TngSwitch],',
      "  templateUrl: './switch-disabled-headless.component.html',",
      "  styleUrl: './switch-disabled-headless.component.css',",
      '})',
      'export class SwitchDisabledHeadlessComponent {}',
      '',
    ].join('\n'),
    [
      '<div class="switch-row">',
      '  <button tngSwitch class="switch-track" [checked]="true" [disabled]="true" ariaLabel="Locked on">',
      '    <span class="switch-thumb"></span>',
      '  </button>',
      '  <span>Locked on (disabled)</span>',
      '</div>',
      '',
    ].join('\n'),
    [
      '.switch-track[data-disabled] { opacity: 0.5; cursor: not-allowed; }',
      '',
    ].join('\n'),
  );

  protected readonly disabledPlainCssCodeTabs = createCodeTabs(
    'switch-disabled-plain-css',
    [
      "import { Component } from '@angular/core';",
      "import { TngSwitchComponent } from '@tailng-ui/components';",
      '',
      '@Component({',
      '  imports: [TngSwitchComponent],',
      "  templateUrl: './switch-disabled-plain-css.component.html',",
      '})',
      'export class SwitchDisabledPlainCssComponent {}',
      '',
    ].join('\n'),
    [
      '<tng-switch [checked]="true" [disabled]="true">Locked on (disabled)</tng-switch>',
      '',
    ].join('\n'),
    '',
  );

  protected readonly disabledTailwindCodeTabs = createCodeTabs(
    'switch-disabled-tailwind',
    [
      "import { Component } from '@angular/core';",
      "import { TngSwitchComponent } from '@tailng-ui/components';",
      '',
      '@Component({',
      '  imports: [TngSwitchComponent],',
      "  templateUrl: './switch-disabled-tailwind.component.html',",
      '})',
      'export class SwitchDisabledTailwindComponent {}',
      '',
    ].join('\n'),
    [
      '<tng-switch [checked]="true" [disabled]="true" class="opacity-50">',
      '  Locked on (disabled)',
      '</tng-switch>',
      '',
    ].join('\n'),
    '/* Tailwind utilities are applied directly in the template. */',
  );

  public onToggleHeadlessNotifications(): void {
    this.headlessNotifications.update((v) => !v);
  }

  public onToggleHeadlessDarkMode(): void {
    this.headlessDarkMode.update((v) => !v);
  }

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }

}
