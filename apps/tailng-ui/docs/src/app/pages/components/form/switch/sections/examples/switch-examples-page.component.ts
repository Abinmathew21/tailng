import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngSwitchComponent } from '@tailng-ui/components';
import type { DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';
import { DocsFormDemoShellComponent } from '../../../../../../shared/form-demo-shell/docs-form-demo-shell.component';
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
  imports: [
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
    DocsFormDemoShellComponent,
    TngSwitchComponent,
  ],
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
      '    [checked]="releaseEmails()"',
      '    (checkedChange)="releaseEmails.set($event)"',
      '  >',
      '    Release summary email',
      '  </tng-switch>',
      '  <tng-switch',
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
      '  border: 1px solid var(--tng-semantic-border-subtle);',
      '  border-radius: 1rem;',
      '  background: var(--tng-semantic-background-surface);',
      '  color: var(--tng-semantic-foreground-primary);',
      '  color-scheme: light;',
      '}',
      '',
      '.component-switch-settings-card tng-switch {',
      '  --tng-semantic-accent-brand: #2563eb;',
      '  --tng-semantic-border-subtle: #cbd5e1;',
      '  --tng-semantic-focus-ring: rgba(37, 99, 235, 0.25);',
      '  --tng-semantic-foreground-primary: var(--tng-semantic-foreground-primary);',
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
      '<section class="grid w-full max-w-[32rem] gap-3 rounded-2xl border border-[var(--tng-semantic-border-subtle)] bg-[var(--tng-semantic-background-surface)] p-4 text-[var(--tng-semantic-foreground-primary)] shadow-sm">',
      '  <tng-switch',
      '    [checked]="releaseEmails()"',
      '    (checkedChange)="releaseEmails.set($event)"',
      '  >',
      '    Release summary email',
      '  </tng-switch>',
      '  <tng-switch',
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
      '  border: 1px solid var(--tng-semantic-border-subtle);',
      '  border-radius: 1rem;',
      '  background: var(--tng-semantic-background-surface);',
      '  color: var(--tng-semantic-foreground-primary);',
      '  color-scheme: light;',
      '}',
      '',
      '.component-switch-disabled-card tng-switch {',
      '  --tng-semantic-accent-brand: #2563eb;',
      '  --tng-semantic-border-subtle: #cbd5e1;',
      '  --tng-semantic-focus-ring: rgba(37, 99, 235, 0.25);',
      '  --tng-semantic-foreground-primary: var(--tng-semantic-foreground-secondary);',
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
      '<section class="grid w-full max-w-[32rem] gap-3 rounded-2xl border border-[var(--tng-semantic-border-subtle)] bg-[var(--tng-semantic-background-surface)] p-4 text-[var(--tng-semantic-foreground-secondary)] shadow-sm">',
      '  <tng-switch',
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
