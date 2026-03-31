import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngCheckbox } from '@tailng-ui/primitives';
import type { DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';
import {
  observeDocsCodeThemeChanges,
  resolveDocsCodeBlockTheme,
} from '../../../../../../shared/util';
import { stackblitzTailwindUrl, stackblitzVanillaUrl } from '../../checkbox.util';

const deploymentGateItems = ['build', 'security', 'monitoring'] as const;
type DeploymentGateItem = (typeof deploymentGateItems)[number];
type ExampleVariant = 'plain-css' | 'tailwind-css';

type CreateCodeTabsArgs = {
  readonly baseName: string;
  readonly cssCode: string;
  readonly htmlCode: string;
  readonly tsCode: string;
};

function createCodeTabs({
  baseName,
  cssCode,
  htmlCode,
  tsCode,
}: CreateCodeTabsArgs): readonly DocsExampleCodeTab[] {
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

function createStaticExampleTsCode(selector: string, className: string): string {
  return [
    "import { Component } from '@angular/core';",
    "import { TngCheckbox } from '@tailng-ui/primitives';",
    '',
    '@Component({',
    `  selector: '${selector}',`,
    '  imports: [TngCheckbox],',
    `  templateUrl: './${selector}.component.html',`,
    `  styleUrl: './${selector}.component.css',`,
    '})',
    `export class ${className} {}`,
    '',
  ].join('\n');
}

function createRollupExampleTsCode(selector: string, className: string): string {
  return [
    "import { Component, signal } from '@angular/core';",
    "import { TngCheckbox } from '@tailng-ui/primitives';",
    '',
    "const deploymentGateItems = ['build', 'security', 'monitoring'] as const;",
    'type DeploymentGateItem = (typeof deploymentGateItems)[number];',
    '',
    '@Component({',
    `  selector: '${selector}',`,
    '  imports: [TngCheckbox],',
    `  templateUrl: './${selector}.component.html',`,
    `  styleUrl: './${selector}.component.css',`,
    '})',
    `export class ${className} {`,
    '  readonly deploymentGateItems = deploymentGateItems;',
    "  readonly deploymentGateSelections = signal<ReadonlySet<DeploymentGateItem>>(new Set(['build']));",
    '',
    '  isAllSelected(): boolean {',
    '    return this.deploymentGateSelections().size === this.deploymentGateItems.length;',
    '  }',
    '',
    '  isMixed(): boolean {',
    '    const count = this.deploymentGateSelections().size;',
    '    return count > 0 && count < this.deploymentGateItems.length;',
    '  }',
    '',
    '  isItemSelected(item: DeploymentGateItem): boolean {',
    '    return this.deploymentGateSelections().has(item);',
    '  }',
    '',
    '  onRollupChange(event: Event): void {',
    '    const target = event.target;',
    '    if (!(target instanceof HTMLInputElement)) {',
    '      return;',
    '    }',
    '',
    '    this.deploymentGateSelections.set(',
    '      target.checked ? new Set(this.deploymentGateItems) : new Set<DeploymentGateItem>(),',
    '    );',
    '  }',
    '',
    '  onItemChange(item: DeploymentGateItem, event: Event): void {',
    '    const target = event.target;',
    '    if (!(target instanceof HTMLInputElement)) {',
    '      return;',
    '    }',
    '',
    '    const nextSelection = new Set(this.deploymentGateSelections());',
    '    if (target.checked) {',
    '      nextSelection.add(item);',
    '    } else {',
    '      nextSelection.delete(item);',
    '    }',
    '',
    '    this.deploymentGateSelections.set(nextSelection);',
    '  }',
    '}',
    '',
  ].join('\n');
}

@Component({
  selector: 'app-headless-checkbox-examples-page',
  imports: [DocsExampleTabsSectionComponent, DocsExampleVariantDirective, TngCheckbox],
  templateUrl: './headless-checkbox-examples-page.component.html',
  styleUrl: './headless-checkbox-examples-page.component.css',
})
export class HeadlessCheckboxExamplesPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);
  private readonly deploymentGateSelectionsPlain = signal<ReadonlySet<DeploymentGateItem>>(
    new Set(['build']),
  );
  private readonly deploymentGateSelectionsTailwind = signal<ReadonlySet<DeploymentGateItem>>(
    new Set(['build']),
  );

  protected readonly deploymentGateItems = deploymentGateItems;

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly stackblitzVanillaUrl = stackblitzVanillaUrl;
  protected readonly stackblitzTailwindUrl = stackblitzTailwindUrl;

  protected readonly consentPlainCodeTabs = createCodeTabs({
    baseName: 'headless-checkbox-consent-card-plain',
    tsCode: createStaticExampleTsCode(
      'app-headless-checkbox-consent-card-plain',
      'HeadlessCheckboxConsentCardPlainComponent',
    ),
    htmlCode: [
      '<section class="headless-checkbox-consent-card">',
      '  <label class="headless-checkbox-consent-card__row">',
      '    <input tngCheckbox [checked]="true" class="headless-checkbox-consent-card__control" />',
      '    <span>Email release updates</span>',
      '  </label>',
      '  <label class="headless-checkbox-consent-card__row">',
      '    <input tngCheckbox class="headless-checkbox-consent-card__control" />',
      '    <span>Slack incident digest</span>',
      '  </label>',
      '  <label class="headless-checkbox-consent-card__row headless-checkbox-consent-card__row--readonly">',
      '    <input',
      '      tngCheckbox',
      '      [readonly]="true"',
      '      [checked]="true"',
      '      class="headless-checkbox-consent-card__control"',
      '    />',
      '    <span>Legal archive confirmed (readonly)</span>',
      '  </label>',
      '</section>',
      '',
    ].join('\n'),
    cssCode: [
      '.headless-checkbox-consent-card {',
      '  display: grid;',
      '  gap: 0.8rem;',
      '  inline-size: min(100%, 28rem);',
      '  margin-inline: auto;',
      '  padding: 1rem;',
      '  border: 1px solid var(--tng-semantic-border-subtle, #cbd5e1);',
      '  border-radius: 0.95rem;',
      '  background: var(--tng-semantic-background-base, #ffffff);',
      '}',
      '',
      '.headless-checkbox-consent-card__row {',
      '  display: inline-flex;',
      '  align-items: center;',
      '  gap: 0.7rem;',
      '  color: var(--tng-semantic-foreground-primary, #0f172a);',
      '  font-size: 0.95rem;',
      '  font-weight: 500;',
      '}',
      '',
      '.headless-checkbox-consent-card__row--readonly {',
      '  color: var(--tng-semantic-foreground-secondary, #64748b);',
      '}',
      '',
      '.headless-checkbox-consent-card__control {',
      '  accent-color: var(--tng-semantic-accent-brand, #2563eb);',
      '}',
      '',
      '.headless-checkbox-consent-card__control[data-focus-visible] {',
      '  outline: 2px solid color-mix(',
      '    in srgb,',
      '    var(--tng-semantic-accent-brand, #2563eb) 70%,',
      '    white',
      '  );',
      '  outline-offset: 2px;',
      '}',
      '',
    ].join('\n'),
  });

  protected readonly consentTailwindCodeTabs = createCodeTabs({
    baseName: 'headless-checkbox-consent-card-tailwind',
    tsCode: createStaticExampleTsCode(
      'app-headless-checkbox-consent-card-tailwind',
      'HeadlessCheckboxConsentCardTailwindComponent',
    ),
    htmlCode: [
      '<section class="grid w-full max-w-[28rem] gap-3 rounded-xl border border-slate-300 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-950/60">',
      '  <label class="inline-flex items-center gap-3 text-sm font-medium text-slate-900 dark:text-slate-100">',
      '    <input',
      '      tngCheckbox',
      '      [checked]="true"',
      '      class="h-4 w-4 rounded border-slate-300 text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 dark:border-slate-600"',
      '    />',
      '    <span>Email release updates</span>',
      '  </label>',
      '  <label class="inline-flex items-center gap-3 text-sm font-medium text-slate-900 dark:text-slate-100">',
      '    <input',
      '      tngCheckbox',
      '      class="h-4 w-4 rounded border-slate-300 text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 dark:border-slate-600"',
      '    />',
      '    <span>Slack incident digest</span>',
      '  </label>',
      '  <label class="inline-flex items-center gap-3 text-sm font-medium text-slate-500 dark:text-slate-400">',
      '    <input',
      '      tngCheckbox',
      '      [readonly]="true"',
      '      [checked]="true"',
      '      class="h-4 w-4 rounded border-slate-300 text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 dark:border-slate-600"',
      '    />',
      '    <span>Legal archive confirmed (readonly)</span>',
      '  </label>',
      '</section>',
      '',
    ].join('\n'),
    cssCode: '/* Tailwind utilities are applied directly in the template. */',
  });

  protected readonly rollupPlainCodeTabs = createCodeTabs({
    baseName: 'headless-checkbox-rollup-card-plain',
    tsCode: createRollupExampleTsCode(
      'app-headless-checkbox-rollup-card-plain',
      'HeadlessCheckboxRollupCardPlainComponent',
    ),
    htmlCode: [
      '<section class="headless-checkbox-rollup-card">',
      '  <label class="headless-checkbox-rollup-card__parent">',
      '    <input',
      '      tngCheckbox',
      '      [checked]="isAllSelected()"',
      '      [indeterminate]="isMixed()"',
      '      (change)="onRollupChange($event)"',
      '      class="headless-checkbox-rollup-card__control"',
      '    />',
      '    <span>Select all deployment checks</span>',
      '  </label>',
      '  <div class="headless-checkbox-rollup-card__children">',
      '    @for (item of deploymentGateItems; track item) {',
      '      <label class="headless-checkbox-rollup-card__child">',
      '        <input',
      '          tngCheckbox',
      '          [checked]="isItemSelected(item)"',
      '          (change)="onItemChange(item, $event)"',
      '          class="headless-checkbox-rollup-card__control"',
      '        />',
      '        <span>{{ item }}</span>',
      '      </label>',
      '    }',
      '  </div>',
      '  <p class="headless-checkbox-rollup-card__summary">',
      '    Selected: {{ deploymentGateSelections().size === 0 ? "none" : Array.from(deploymentGateSelections()).join(", ") }}',
      '  </p>',
      '</section>',
      '',
    ].join('\n'),
    cssCode: [
      '.headless-checkbox-rollup-card {',
      '  display: grid;',
      '  gap: 0.85rem;',
      '  inline-size: min(100%, 30rem);',
      '  margin-inline: auto;',
      '  padding: 1rem;',
      '  border: 1px solid var(--tng-semantic-border-subtle, #cbd5e1);',
      '  border-radius: 0.95rem;',
      '  background: color-mix(',
      '    in srgb,',
      '    var(--tng-semantic-background-base, #ffffff) 92%,',
      '    transparent',
      '  );',
      '}',
      '',
      '.headless-checkbox-rollup-card__parent,',
      '.headless-checkbox-rollup-card__child {',
      '  display: inline-flex;',
      '  align-items: center;',
      '  gap: 0.7rem;',
      '  color: var(--tng-semantic-foreground-primary, #0f172a);',
      '  font-size: 0.95rem;',
      '  font-weight: 500;',
      '}',
      '',
      '.headless-checkbox-rollup-card__children {',
      '  display: grid;',
      '  gap: 0.65rem;',
      '  margin-left: 0.35rem;',
      '  padding-left: 0.85rem;',
      '  border-left: 2px solid var(--tng-semantic-border-subtle, #cbd5e1);',
      '}',
      '',
      '.headless-checkbox-rollup-card__summary {',
      '  color: var(--tng-semantic-foreground-secondary, #64748b);',
      '  font-size: 0.8rem;',
      '  margin: 0;',
      '}',
      '',
      '.headless-checkbox-rollup-card__control {',
      '  accent-color: var(--tng-semantic-accent-brand, #2563eb);',
      '}',
      '',
      '.headless-checkbox-rollup-card__control[data-focus-visible] {',
      '  outline: 2px solid color-mix(',
      '    in srgb,',
      '    var(--tng-semantic-accent-brand, #2563eb) 70%,',
      '    white',
      '  );',
      '  outline-offset: 2px;',
      '}',
      '',
    ].join('\n'),
  });

  protected readonly rollupTailwindCodeTabs = createCodeTabs({
    baseName: 'headless-checkbox-rollup-card-tailwind',
    tsCode: createRollupExampleTsCode(
      'app-headless-checkbox-rollup-card-tailwind',
      'HeadlessCheckboxRollupCardTailwindComponent',
    ),
    htmlCode: [
      '<section class="grid w-full max-w-[30rem] gap-3 rounded-xl border border-slate-300 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-950/60">',
      '  <label class="inline-flex items-center gap-3 text-sm font-semibold text-slate-900 dark:text-slate-100">',
      '    <input',
      '      tngCheckbox',
      '      [checked]="isAllSelected()"',
      '      [indeterminate]="isMixed()"',
      '      (change)="onRollupChange($event)"',
      '      class="h-4 w-4 rounded border-slate-300 text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 dark:border-slate-600"',
      '    />',
      '    <span>Select all deployment checks</span>',
      '  </label>',
      '  <div class="ml-2 grid gap-2 border-l-2 border-slate-300 pl-3 dark:border-slate-700">',
      '    @for (item of deploymentGateItems; track item) {',
      '      <label class="inline-flex items-center gap-3 text-sm font-medium text-slate-900 dark:text-slate-100">',
      '        <input',
      '          tngCheckbox',
      '          [checked]="isItemSelected(item)"',
      '          (change)="onItemChange(item, $event)"',
      '          class="h-4 w-4 rounded border-slate-300 text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 dark:border-slate-600"',
      '        />',
      '        <span>{{ item }}</span>',
      '      </label>',
      '    }',
      '  </div>',
      '  <p class="text-xs lowercase text-slate-600 dark:text-slate-400">',
      '    Selected: {{ deploymentGateSelections().size === 0 ? "none" : Array.from(deploymentGateSelections()).join(", ") }}',
      '  </p>',
      '</section>',
      '',
    ].join('\n'),
    cssCode: '/* Tailwind utilities are applied directly in the template. */',
  });

  protected readonly policyPlainCodeTabs = createCodeTabs({
    baseName: 'headless-checkbox-policy-card-plain',
    tsCode: createStaticExampleTsCode(
      'app-headless-checkbox-policy-card-plain',
      'HeadlessCheckboxPolicyCardPlainComponent',
    ),
    htmlCode: [
      '<section class="headless-checkbox-policy-card">',
      '  <div class="headless-checkbox-policy-card__group">',
      '    <label class="headless-checkbox-policy-card__row headless-checkbox-policy-card__row--danger">',
      '      <input',
      '        tngCheckbox',
      '        [invalid]="true"',
      '        [ariaDescribedBy]="\'headless-checkbox-policy-help\'"',
      '        class="headless-checkbox-policy-card__control"',
      '      />',
      '      <span>Security review is required before production deploy.</span>',
      '    </label>',
      '    <p id="headless-checkbox-policy-help" class="headless-checkbox-policy-card__helper">',
      '      Finish this approval gate before enabling the release toggle.',
      '    </p>',
      '  </div>',
      '  <label class="headless-checkbox-policy-card__row headless-checkbox-policy-card__row--readonly">',
      '    <input',
      '      tngCheckbox',
      '      [readonly]="true"',
      '      [checked]="true"',
      '      class="headless-checkbox-policy-card__control"',
      '    />',
      '    <span>Compliance archive is locked after sign-off.</span>',
      '  </label>',
      '  <label class="headless-checkbox-policy-card__row headless-checkbox-policy-card__row--disabled">',
      '    <input',
      '      tngCheckbox',
      '      [disabled]="true"',
      '      class="headless-checkbox-policy-card__control"',
      '    />',
      '    <span>Background sync is still reconciling release metrics.</span>',
      '  </label>',
      '</section>',
      '',
    ].join('\n'),
    cssCode: [
      '.headless-checkbox-policy-card {',
      '  display: grid;',
      '  gap: 0.85rem;',
      '  inline-size: min(100%, 32rem);',
      '  margin-inline: auto;',
      '}',
      '',
      '.headless-checkbox-policy-card__group {',
      '  display: grid;',
      '  gap: 0.45rem;',
      '  padding: 0.9rem 1rem;',
      '  border: 1px solid color-mix(',
      '    in srgb,',
      '    var(--tng-semantic-accent-danger, #dc2626) 35%,',
      '    var(--tng-semantic-border-subtle, #cbd5e1)',
      '  );',
      '  border-radius: 0.95rem;',
      '  background: color-mix(',
      '    in srgb,',
      '    var(--tng-semantic-accent-danger, #dc2626) 7%,',
      '    var(--tng-semantic-background-base, #ffffff)',
      '  );',
      '}',
      '',
      '.headless-checkbox-policy-card__row {',
      '  display: inline-flex;',
      '  align-items: center;',
      '  gap: 0.7rem;',
      '  color: var(--tng-semantic-foreground-primary, #0f172a);',
      '  font-size: 0.95rem;',
      '  font-weight: 500;',
      '}',
      '',
      '.headless-checkbox-policy-card__row--readonly {',
      '  color: var(--tng-semantic-foreground-secondary, #64748b);',
      '}',
      '',
      '.headless-checkbox-policy-card__row--disabled {',
      '  color: color-mix(',
      '    in srgb,',
      '    var(--tng-semantic-foreground-secondary, #64748b) 85%,',
      '    transparent',
      '  );',
      '}',
      '',
      '.headless-checkbox-policy-card__helper {',
      '  color: var(--tng-semantic-accent-danger, #dc2626);',
      '  font-size: 0.78rem;',
      '  margin: 0 0 0 1.7rem;',
      '}',
      '',
      '.headless-checkbox-policy-card__control {',
      '  accent-color: var(--tng-semantic-accent-brand, #2563eb);',
      '}',
      '',
      '.headless-checkbox-policy-card__control[data-invalid] {',
      '  outline: 2px solid color-mix(',
      '    in srgb,',
      '    var(--tng-semantic-accent-danger, #dc2626) 55%,',
      '    white',
      '  );',
      '  outline-offset: 2px;',
      '}',
      '',
      '.headless-checkbox-policy-card__control[data-focus-visible] {',
      '  box-shadow: none;',
      '}',
      '',
    ].join('\n'),
  });

  protected readonly policyTailwindCodeTabs = createCodeTabs({
    baseName: 'headless-checkbox-policy-card-tailwind',
    tsCode: createStaticExampleTsCode(
      'app-headless-checkbox-policy-card-tailwind',
      'HeadlessCheckboxPolicyCardTailwindComponent',
    ),
    htmlCode: [
      '<section class="grid w-full max-w-[32rem] gap-3">',
      '  <div class="grid gap-2 rounded-xl border border-rose-300 bg-rose-50/70 p-4 dark:border-rose-500/70 dark:bg-rose-950/20">',
      '    <label class="inline-flex items-center gap-3 text-sm font-medium text-rose-900 dark:text-rose-100">',
      '      <input',
      '        tngCheckbox',
      '        [invalid]="true"',
      '        [ariaDescribedBy]="\'headless-checkbox-policy-help-tailwind\'"',
      '        class="h-4 w-4 rounded border-rose-300 text-rose-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/30 dark:border-rose-500/70"',
      '      />',
      '      <span>Security review is required before production deploy.</span>',
      '    </label>',
      '    <p id="headless-checkbox-policy-help-tailwind" class="ml-7 text-xs font-medium text-rose-700 dark:text-rose-300">',
      '      Finish this approval gate before enabling the release toggle.',
      '    </p>',
      '  </div>',
      '  <label class="inline-flex items-center gap-3 text-sm font-medium text-slate-500 dark:text-slate-400">',
      '    <input',
      '      tngCheckbox',
      '      [readonly]="true"',
      '      [checked]="true"',
      '      class="h-4 w-4 rounded border-slate-300 text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 dark:border-slate-600"',
      '    />',
      '    <span>Compliance archive is locked after sign-off.</span>',
      '  </label>',
      '  <label class="inline-flex items-center gap-3 text-sm font-medium text-slate-400 dark:text-slate-500">',
      '    <input',
      '      tngCheckbox',
      '      [disabled]="true"',
      '      class="h-4 w-4 rounded border-slate-300 text-slate-400 dark:border-slate-700"',
      '    />',
      '    <span>Background sync is still reconciling release metrics.</span>',
      '  </label>',
      '</section>',
      '',
    ].join('\n'),
    cssCode: '/* Tailwind utilities are applied directly in the template. */',
  });

  private getDeploymentSelections(variant: ExampleVariant): ReadonlySet<DeploymentGateItem> {
    switch (variant) {
      case 'tailwind-css':
        return this.deploymentGateSelectionsTailwind();
      case 'plain-css':
      default:
        return this.deploymentGateSelectionsPlain();
    }
  }

  private setDeploymentSelections(
    variant: ExampleVariant,
    nextSelection: ReadonlySet<DeploymentGateItem>,
  ): void {
    switch (variant) {
      case 'tailwind-css':
        this.deploymentGateSelectionsTailwind.set(nextSelection);
        break;
      case 'plain-css':
      default:
        this.deploymentGateSelectionsPlain.set(nextSelection);
        break;
    }
  }

  protected isAllDeploymentChecksSelected(variant: ExampleVariant): boolean {
    return this.getDeploymentSelections(variant).size === deploymentGateItems.length;
  }

  protected isDeploymentChecklistMixed(variant: ExampleVariant): boolean {
    const selectedCount = this.getDeploymentSelections(variant).size;
    return selectedCount > 0 && selectedCount < deploymentGateItems.length;
  }

  protected isDeploymentCheckSelected(
    variant: ExampleVariant,
    item: DeploymentGateItem,
  ): boolean {
    return this.getDeploymentSelections(variant).has(item);
  }

  protected deploymentSummary(variant: ExampleVariant): string {
    const selectedItems = Array.from(this.getDeploymentSelections(variant));
    if (selectedItems.length === 0) {
      return 'none';
    }

    return selectedItems.join(', ');
  }

  protected onDeploymentRollupChange(variant: ExampleVariant, event: Event): void {
    const target = event.target;
    if (!(target instanceof HTMLInputElement)) {
      return;
    }

    this.setDeploymentSelections(
      variant,
      target.checked ? new Set(deploymentGateItems) : new Set<DeploymentGateItem>(),
    );
  }

  protected onDeploymentCheckChange(
    variant: ExampleVariant,
    item: DeploymentGateItem,
    event: Event,
  ): void {
    const target = event.target;
    if (!(target instanceof HTMLInputElement)) {
      return;
    }

    const nextSelection = new Set(this.getDeploymentSelections(variant));
    if (target.checked) {
      nextSelection.add(item);
    } else {
      nextSelection.delete(item);
    }

    this.setDeploymentSelections(variant, nextSelection);
  }

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
