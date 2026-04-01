import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngSwitchComponent } from '@tailng-ui/components';
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
  selector: 'app-switch-examples-page',
  imports: [DocsExampleTabsSectionComponent, DocsExampleVariantDirective, TngSwitchComponent],
  templateUrl: './switch-examples-page.component.html',
  styleUrl: './switch-examples-page.component.css',
})
export class SwitchExamplesPageComponent implements OnDestroy {
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

  protected readonly plainCssReleaseEmails = signal(true);
  protected readonly plainCssFreezeWindow = signal(false);
  protected readonly tailwindReleaseEmails = signal(true);
  protected readonly tailwindFreezeWindow = signal(false);

  protected readonly settingsPlainCodeTabs = createCodeTabs(
    'component-switch-settings-plain',
    [
      "import { Component, signal } from '@angular/core';",
      "import { TngSwitchComponent } from '@tailng-ui/components';",
      '',
      '@Component({',
      "  selector: 'app-component-switch-settings-plain',",
      '  standalone: true,',
      '  imports: [TngSwitchComponent],',
      "  templateUrl: './component-switch-settings-plain.component.html',",
      "  styleUrl: './component-switch-settings-plain.component.css',",
      '})',
      'export class ComponentSwitchSettingsPlainComponent {',
      '  readonly releaseEmails = signal(true);',
      '  readonly freezeWindow = signal(false);',
      '}',
      '',
    ].join('\n'),
    [
      '<section class="component-switch-settings-card">',
      '  <tng-switch',
      '    class="component-switch-settings-card__switch"',
      '    [checked]="releaseEmails()"',
      '    (checkedChange)="releaseEmails.set($event)"',
      '  >',
      '    Release summary email',
      '  </tng-switch>',
      '  <tng-switch',
      '    class="component-switch-settings-card__switch"',
      '    [checked]="freezeWindow()"',
      '    (checkedChange)="freezeWindow.set($event)"',
      '  >',
      '    Freeze deploy window',
      '  </tng-switch>',
      '</section>',
      '',
    ].join('\n'),
    [
      '.component-switch-settings-card {',
      '  display: grid;',
      '  gap: 0.8rem;',
      '  inline-size: min(100%, 32rem);',
      '  margin-inline: auto;',
      '  padding: 1rem;',
      '  border: 1px solid #cbd5e1;',
      '  border-radius: 1rem;',
      '  background: #ffffff;',
      '  color: #0f172a;',
      '  color-scheme: light;',
      '}',
      '',
      '.component-switch-settings-card__switch {',
      '  --tng-semantic-accent-brand: #2563eb;',
      '  --tng-semantic-border-subtle: #cbd5e1;',
      '  --tng-semantic-focus-ring: rgba(37, 99, 235, 0.25);',
      '  --tng-semantic-foreground-primary: #0f172a;',
      '}',
      '',
    ].join('\n'),
  );

  protected readonly settingsTailwindCodeTabs = createCodeTabs(
    'component-switch-settings-tailwind',
    [
      "import { Component, signal } from '@angular/core';",
      "import { TngSwitchComponent } from '@tailng-ui/components';",
      '',
      '@Component({',
      "  selector: 'app-component-switch-settings-tailwind',",
      '  standalone: true,',
      '  imports: [TngSwitchComponent],',
      "  templateUrl: './component-switch-settings-tailwind.component.html',",
      '})',
      'export class ComponentSwitchSettingsTailwindComponent {',
      '  readonly releaseEmails = signal(true);',
      '  readonly freezeWindow = signal(false);',
      '}',
      '',
    ].join('\n'),
    [
      '<section class="grid w-full max-w-[32rem] gap-3 rounded-2xl border border-slate-300 bg-white p-4 text-slate-900 shadow-sm [color-scheme:light]">',
      '  <tng-switch',
      '    class="[--tng-semantic-accent-brand:#2563eb] [--tng-semantic-border-subtle:#cbd5e1] [--tng-semantic-focus-ring:rgba(37,99,235,0.25)] [--tng-semantic-foreground-primary:#0f172a]"',
      '    [checked]="releaseEmails()"',
      '    (checkedChange)="releaseEmails.set($event)"',
      '  >',
      '    Release summary email',
      '  </tng-switch>',
      '  <tng-switch',
      '    class="[--tng-semantic-accent-brand:#2563eb] [--tng-semantic-border-subtle:#cbd5e1] [--tng-semantic-focus-ring:rgba(37,99,235,0.25)] [--tng-semantic-foreground-primary:#0f172a]"',
      '    [checked]="freezeWindow()"',
      '    (checkedChange)="freezeWindow.set($event)"',
      '  >',
      '    Freeze deploy window',
      '  </tng-switch>',
      '</section>',
      '',
    ].join('\n'),
    '/* Tailwind utilities are applied directly in the template. */',
  );

  protected readonly disabledPlainCodeTabs = createCodeTabs(
    'component-switch-disabled-plain',
    [
      "import { Component } from '@angular/core';",
      "import { TngSwitchComponent } from '@tailng-ui/components';",
      '',
      '@Component({',
      "  selector: 'app-component-switch-disabled-plain',",
      '  standalone: true,',
      '  imports: [TngSwitchComponent],',
      "  templateUrl: './component-switch-disabled-plain.component.html',",
      "  styleUrl: './component-switch-disabled-plain.component.css',",
      '})',
      'export class ComponentSwitchDisabledPlainComponent {}',
      '',
    ].join('\n'),
    [
      '<section class="component-switch-disabled-card">',
      '  <tng-switch',
      '    class="component-switch-disabled-card__switch"',
      '    [checked]="true"',
      '    [disabled]="true"',
      '  >',
      '    Locked after compliance review',
      '  </tng-switch>',
      '</section>',
      '',
    ].join('\n'),
    [
      '.component-switch-disabled-card {',
      '  display: grid;',
      '  gap: 0.8rem;',
      '  inline-size: min(100%, 32rem);',
      '  margin-inline: auto;',
      '  padding: 1rem;',
      '  border: 1px solid #cbd5e1;',
      '  border-radius: 1rem;',
      '  background: #ffffff;',
      '  color: #0f172a;',
      '  color-scheme: light;',
      '}',
      '',
      '.component-switch-disabled-card__switch {',
      '  --tng-semantic-accent-brand: #2563eb;',
      '  --tng-semantic-border-subtle: #cbd5e1;',
      '  --tng-semantic-focus-ring: rgba(37, 99, 235, 0.25);',
      '  --tng-semantic-foreground-primary: #64748b;',
      '}',
      '',
    ].join('\n'),
  );

  protected readonly disabledTailwindCodeTabs = createCodeTabs(
    'component-switch-disabled-tailwind',
    [
      "import { Component } from '@angular/core';",
      "import { TngSwitchComponent } from '@tailng-ui/components';",
      '',
      '@Component({',
      "  selector: 'app-component-switch-disabled-tailwind',",
      '  standalone: true,',
      '  imports: [TngSwitchComponent],',
      "  templateUrl: './component-switch-disabled-tailwind.component.html',",
      '})',
      'export class ComponentSwitchDisabledTailwindComponent {}',
      '',
    ].join('\n'),
    [
      '<section class="grid w-full max-w-[32rem] gap-3 rounded-2xl border border-slate-300 bg-white p-4 text-slate-500 shadow-sm [color-scheme:light]">',
      '  <tng-switch',
      '    class="[--tng-semantic-accent-brand:#2563eb] [--tng-semantic-border-subtle:#cbd5e1] [--tng-semantic-focus-ring:rgba(37,99,235,0.25)] [--tng-semantic-foreground-primary:#64748b]"',
      '    [checked]="true"',
      '    [disabled]="true"',
      '  >',
      '    Locked after compliance review',
      '  </tng-switch>',
      '</section>',
      '',
    ].join('\n'),
    '/* Tailwind utilities are applied directly in the template. */',
  );

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
