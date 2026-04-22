import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngCheckboxComponent } from '@tailng-ui/components';
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
import { stackblitzTailwindUrl, stackblitzVanillaUrl } from '../../checkbox.util';

const deploymentChecks = ['build', 'security', 'monitoring'] as const;
type DeploymentCheck = (typeof deploymentChecks)[number];
type ExampleVariant = 'plain-css' | 'tailwind-css';

type CreateCodeTabsOptions = {
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
}: CreateCodeTabsOptions): readonly DocsExampleCodeTab[] {
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
  selector: 'app-checkbox-examples-page',
  imports: [
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
    DocsFormDemoShellComponent,
    TngCheckboxComponent,
  ],
  templateUrl: './checkbox-examples-page.component.html',
  styleUrl: './checkbox-examples-page.component.css',
})
export class CheckboxExamplesPageComponent implements OnDestroy {
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
  protected readonly formDemoAccepted = signal(false);

  protected readonly rows = deploymentChecks;

  private readonly plainCssRows = signal<ReadonlySet<DeploymentCheck>>(
    new Set<DeploymentCheck>(['build']),
  );
  private readonly tailwindRows = signal<ReadonlySet<DeploymentCheck>>(
    new Set<DeploymentCheck>(['build']),
  );

  protected readonly consentPlainCssCodeTabs = createCodeTabs({
    baseName: 'doc-cmp-checkbox-consent-plain',
    tsCode: [
      "import { Component } from '@angular/core';",
      "import { TngCheckboxComponent } from '@tailng-ui/components';",
      '',
      '@Component({',
      "  selector: 'app-doc-cmp-checkbox-consent-plain',",
      '  standalone: true,',
      '  imports: [TngCheckboxComponent],',
      "  templateUrl: './doc-cmp-checkbox-consent-plain.component.html',",
      "  styleUrl: './doc-cmp-checkbox-consent-plain.component.css',",
      '})',
      'export class DocCmpCheckboxConsentPlainComponent {}',
      '',
    ].join('\n'),
    htmlCode: [
      '<section class="doc-cmp-checkbox-consent-panel">',
      '  <tng-checkbox [checked]="true">',
      '    I confirm release notes are reviewed.',
      '  </tng-checkbox>',
      '  <div class="doc-cmp-checkbox-consent-item--muted">',
      '    <tng-checkbox',
      '      [readonly]="true"',
      '      [checked]="true"',
      '    >',
      '      Legal policy accepted (readonly).',
      '    </tng-checkbox>',
      '  </div>',
      '</section>',
      '',
    ].join('\n'),
    cssCode: [
      '.doc-cmp-checkbox-consent-panel {',
      '  display: grid;',
      '  gap: 0.75rem;',
      '  inline-size: min(100%, 32rem);',
      '  margin-inline: auto;',
      '  padding: 1rem;',
      '  border: 1px solid #cbd5e1;',
      '  border-radius: 1rem;',
      '  background: rgba(255, 255, 255, 0.92);',
      '}',
      '',
      '.doc-cmp-checkbox-consent-panel > tng-checkbox {',
      '  display: block;',
      '  --tng-semantic-accent-brand: #2563eb;',
      '  --tng-semantic-focus-ring: rgba(37, 99, 235, 0.22);',
      '}',
      '',
      '.doc-cmp-checkbox-consent-item--muted tng-checkbox {',
      '  --tng-semantic-foreground-primary: #64748b;',
      '  --tng-semantic-foreground-secondary: #64748b;',
      '}',
      '',
    ].join('\n'),
  });

  protected readonly consentTailwindCodeTabs = createCodeTabs({
    baseName: 'doc-cmp-checkbox-consent-tailwind',
    tsCode: [
      "import { Component } from '@angular/core';",
      "import { TngCheckboxComponent } from '@tailng-ui/components';",
      '',
      '@Component({',
      "  selector: 'app-doc-cmp-checkbox-consent-tailwind',",
      '  standalone: true,',
      '  imports: [TngCheckboxComponent],',
      "  templateUrl: './doc-cmp-checkbox-consent-tailwind.component.html',",
      '})',
      'export class DocCmpCheckboxConsentTailwindComponent {}',
      '',
    ].join('\n'),
    htmlCode: [
      '<section',
      '  class="grid w-full max-w-[32rem] gap-3 rounded-2xl border border-slate-300 bg-white/90 p-4 text-slate-900 shadow-sm [--tng-semantic-accent-brand:#2563eb] [--tng-semantic-focus-ring:rgba(37,99,235,0.22)] dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-100"',
      '>',
      '  <tng-checkbox [checked]="true">',
      '    I confirm release notes are reviewed.',
      '  </tng-checkbox>',
      '  <div class="text-slate-500 dark:text-slate-400">',
      '    <tng-checkbox',
      '      [readonly]="true"',
      '      [checked]="true"',
      '    >',
      '      Legal policy accepted (readonly).',
      '    </tng-checkbox>',
      '  </div>',
      '</section>',
      '',
    ].join('\n'),
    cssCode: '/* Tailwind utilities are applied directly in the template. */',
  });

  protected readonly triStatePlainCssCodeTabs = createCodeTabs({
    baseName: 'doc-cmp-checkbox-tri-state-plain',
    tsCode: [
      "import { Component, signal } from '@angular/core';",
      "import { TngCheckboxComponent } from '@tailng-ui/components';",
      '',
      "type PlainDeploymentCheck = 'build' | 'security' | 'monitoring';",
      '',
      '@Component({',
      "  selector: 'app-doc-cmp-checkbox-tri-state-plain',",
      '  standalone: true,',
      '  imports: [TngCheckboxComponent],',
      "  templateUrl: './doc-cmp-checkbox-tri-state-plain.component.html',",
      "  styleUrl: './doc-cmp-checkbox-tri-state-plain.component.css',",
      '})',
      'export class DocCmpCheckboxTriStatePlainComponent {',
      "  readonly deploymentChecks: readonly PlainDeploymentCheck[] = ['build', 'security', 'monitoring'];",
      "  readonly selectedDeploymentChecks = signal<ReadonlySet<PlainDeploymentCheck>>(new Set(['build']));",
      '',
      '  isCheckSelected(check: PlainDeploymentCheck): boolean {',
      '    return this.selectedDeploymentChecks().has(check);',
      '  }',
      '',
      '  areAllChecksSelected(): boolean {',
      '    return this.selectedDeploymentChecks().size === this.deploymentChecks.length;',
      '  }',
      '',
      '  isChecklistMixed(): boolean {',
      '    const count = this.selectedDeploymentChecks().size;',
      '    return count > 0 && count < this.deploymentChecks.length;',
      '  }',
      '',
      '  onSelectAllChange(checked: boolean): void {',
      '    this.selectedDeploymentChecks.set(',
      '      checked ? new Set(this.deploymentChecks) : new Set(),',
      '    );',
      '  }',
      '',
      '  onCheckChange(check: PlainDeploymentCheck, checked: boolean): void {',
      '    const next = new Set(this.selectedDeploymentChecks());',
      '    if (checked) {',
      '      next.add(check);',
      '    } else {',
      '      next.delete(check);',
      '    }',
      '',
      '    this.selectedDeploymentChecks.set(next);',
      '  }',
      '',
      '  summary(): string {',
      '    const selected = Array.from(this.selectedDeploymentChecks());',
      "    return selected.length > 0 ? selected.join(', ') : 'none';",
      '  }',
      '}',
      '',
    ].join('\n'),
    htmlCode: [
      '<section class="doc-cmp-checkbox-tri-state-card">',
      '  <tng-checkbox',
      '    [checked]="areAllChecksSelected()"',
      '    [indeterminate]="isChecklistMixed()"',
      '    (checkedChange)="onSelectAllChange($event)"',
      '  >',
      '    Select all deployment checks',
      '  </tng-checkbox>',
      '',
      '  <div class="doc-cmp-checkbox-tri-state-children">',
      '    @for (check of deploymentChecks; track check) {',
      '      <tng-checkbox',
      '        [checked]="isCheckSelected(check)"',
      '        (checkedChange)="onCheckChange(check, $event)"',
      '      >',
      '        {{ check }}',
      '      </tng-checkbox>',
      '    }',
      '  </div>',
      '',
      '  <p class="doc-cmp-checkbox-tri-state-summary">selected: {{ summary() }}</p>',
      '</section>',
      '',
    ].join('\n'),
    cssCode: [
      '.doc-cmp-checkbox-tri-state-card {',
      '  display: grid;',
      '  gap: 0.75rem;',
      '  inline-size: min(100%, 32rem);',
      '  margin-inline: auto;',
      '  padding: 1rem;',
      '  border: 1px solid #cbd5e1;',
      '  border-radius: 1rem;',
      '  background: rgba(255, 255, 255, 0.92);',
      '}',
      '',
      '.doc-cmp-checkbox-tri-state-card > tng-checkbox,',
      '.doc-cmp-checkbox-tri-state-children tng-checkbox {',
      '  display: block;',
      '  --tng-semantic-accent-brand: #2563eb;',
      '  --tng-semantic-focus-ring: rgba(37, 99, 235, 0.22);',
      '}',
      '',
      '.doc-cmp-checkbox-tri-state-children {',
      '  display: grid;',
      '  gap: 0.65rem;',
      '  margin-left: 0.5rem;',
      '  padding-left: 0.85rem;',
      '  border-left: 2px solid #cbd5e1;',
      '}',
      '',
      '.doc-cmp-checkbox-tri-state-summary {',
      '  margin: 0;',
      '  color: #64748b;',
      '  font-size: 0.82rem;',
      '  text-transform: lowercase;',
      '}',
      '',
    ].join('\n'),
  });

  protected readonly triStateTailwindCodeTabs = createCodeTabs({
    baseName: 'doc-cmp-checkbox-tri-state-tailwind',
    tsCode: [
      "import { Component, signal } from '@angular/core';",
      "import { TngCheckboxComponent } from '@tailng-ui/components';",
      '',
      "type TailwindDeploymentCheck = 'build' | 'security' | 'monitoring';",
      '',
      '@Component({',
      "  selector: 'app-doc-cmp-checkbox-tri-state-tailwind',",
      '  standalone: true,',
      '  imports: [TngCheckboxComponent],',
      "  templateUrl: './doc-cmp-checkbox-tri-state-tailwind.component.html',",
      '})',
      'export class DocCmpCheckboxTriStateTailwindComponent {',
      "  readonly releaseChecks: readonly TailwindDeploymentCheck[] = ['build', 'security', 'monitoring'];",
      "  readonly selectedReleaseChecks = signal<ReadonlySet<TailwindDeploymentCheck>>(new Set(['build']));",
      '',
      '  isReleaseCheckSelected(check: TailwindDeploymentCheck): boolean {',
      '    return this.selectedReleaseChecks().has(check);',
      '  }',
      '',
      '  areAllReleaseChecksSelected(): boolean {',
      '    return this.selectedReleaseChecks().size === this.releaseChecks.length;',
      '  }',
      '',
      '  isReleaseChecklistMixed(): boolean {',
      '    const count = this.selectedReleaseChecks().size;',
      '    return count > 0 && count < this.releaseChecks.length;',
      '  }',
      '',
      '  onReleaseChecklistChange(checked: boolean): void {',
      '    this.selectedReleaseChecks.set(',
      '      checked ? new Set(this.releaseChecks) : new Set(),',
      '    );',
      '  }',
      '',
      '  onReleaseCheckChange(check: TailwindDeploymentCheck, checked: boolean): void {',
      '    const next = new Set(this.selectedReleaseChecks());',
      '    if (checked) {',
      '      next.add(check);',
      '    } else {',
      '      next.delete(check);',
      '    }',
      '',
      '    this.selectedReleaseChecks.set(next);',
      '  }',
      '',
      '  summary(): string {',
      '    const selected = Array.from(this.selectedReleaseChecks());',
      "    return selected.length > 0 ? selected.join(', ') : 'none';",
      '  }',
      '}',
      '',
    ].join('\n'),
    htmlCode: [
      '<section',
      '  class="grid w-full max-w-[32rem] gap-3 rounded-2xl border border-slate-300 bg-white/90 p-4 text-slate-900 shadow-sm [--tng-semantic-accent-brand:#2563eb] [--tng-semantic-focus-ring:rgba(37,99,235,0.22)] dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-100"',
      '>',
      '  <tng-checkbox',
      '    [checked]="areAllReleaseChecksSelected()"',
      '    [indeterminate]="isReleaseChecklistMixed()"',
      '    (checkedChange)="onReleaseChecklistChange($event)"',
      '  >',
      '    Select all deployment checks',
      '  </tng-checkbox>',
      '',
      '  <div class="ml-2 grid gap-2 border-l-2 border-slate-300 pl-3 dark:border-slate-600">',
      '    @for (check of releaseChecks; track check) {',
      '      <tng-checkbox',
      '        [checked]="isReleaseCheckSelected(check)"',
      '        (checkedChange)="onReleaseCheckChange(check, $event)"',
      '      >',
      '        {{ check }}',
      '      </tng-checkbox>',
      '    }',
      '  </div>',
      '',
      '  <p class="text-xs lowercase text-slate-600 dark:text-slate-300">',
      '    selected: {{ summary() }}',
      '  </p>',
      '</section>',
      '',
    ].join('\n'),
    cssCode: '/* Tailwind utilities are applied directly in the template. */',
  });

  protected readonly validationPlainCssCodeTabs = createCodeTabs({
    baseName: 'doc-cmp-checkbox-validation-plain',
    tsCode: [
      "import { Component } from '@angular/core';",
      "import { TngCheckboxComponent } from '@tailng-ui/components';",
      '',
      '@Component({',
      "  selector: 'app-doc-cmp-checkbox-validation-plain',",
      '  standalone: true,',
      '  imports: [TngCheckboxComponent],',
      "  templateUrl: './doc-cmp-checkbox-validation-plain.component.html',",
      "  styleUrl: './doc-cmp-checkbox-validation-plain.component.css',",
      '})',
      'export class DocCmpCheckboxValidationPlainComponent {}',
      '',
    ].join('\n'),
    htmlCode: [
      '<section class="doc-cmp-checkbox-validation-panel">',
      '  <tng-checkbox [invalid]="true">',
      '    Security review is required before production deploy.',
      '  </tng-checkbox>',
      '</section>',
      '',
    ].join('\n'),
    cssCode: [
      '.doc-cmp-checkbox-validation-panel {',
      '  display: grid;',
      '  gap: 0.75rem;',
      '  inline-size: min(100%, 32rem);',
      '  margin-inline: auto;',
      '  padding: 1rem;',
      '  border: 1px solid #fecaca;',
      '  border-radius: 1rem;',
      '  background: rgba(254, 242, 242, 0.78);',
      '}',
      '',
      '.doc-cmp-checkbox-validation-panel tng-checkbox {',
      '  display: block;',
      '  --tng-semantic-accent-danger: #dc2626;',
      '  --tng-semantic-focus-ring: rgba(220, 38, 38, 0.18);',
      '  --tng-semantic-foreground-primary: #991b1b;',
      '}',
      '',
    ].join('\n'),
  });

  protected readonly validationTailwindCodeTabs = createCodeTabs({
    baseName: 'doc-cmp-checkbox-validation-tailwind',
    tsCode: [
      "import { Component } from '@angular/core';",
      "import { TngCheckboxComponent } from '@tailng-ui/components';",
      '',
      '@Component({',
      "  selector: 'app-doc-cmp-checkbox-validation-tailwind',",
      '  standalone: true,',
      '  imports: [TngCheckboxComponent],',
      "  templateUrl: './doc-cmp-checkbox-validation-tailwind.component.html',",
      '})',
      'export class DocCmpCheckboxValidationTailwindComponent {}',
      '',
    ].join('\n'),
    htmlCode: [
      '<section',
      '  class="rounded-2xl border border-rose-300 bg-rose-50/70 p-4 text-rose-900 [--tng-semantic-accent-danger:#dc2626] [--tng-semantic-focus-ring:rgba(220,38,38,0.18)] dark:border-rose-500/70 dark:bg-rose-950/25 dark:text-rose-200"',
      '>',
      '  <tng-checkbox [invalid]="true">',
      '    Security review is required before production deploy.',
      '  </tng-checkbox>',
      '</section>',
      '',
    ].join('\n'),
    cssCode: '/* Tailwind utilities are applied directly in the template. */',
  });

  protected isRowChecked(variant: ExampleVariant, row: DeploymentCheck): boolean {
    return this.readSelection(variant).has(row);
  }

  protected areAllRowsChecked(variant: ExampleVariant): boolean {
    return this.readSelection(variant).size === deploymentChecks.length;
  }

  protected isMixedRowsChecked(variant: ExampleVariant): boolean {
    const count = this.readSelection(variant).size;
    return count > 0 && count < deploymentChecks.length;
  }

  protected selectedSummary(variant: ExampleVariant): string {
    const selected = Array.from(this.readSelection(variant));
    return selected.length > 0 ? selected.join(', ') : 'none';
  }

  protected onRowChange(variant: ExampleVariant, row: DeploymentCheck, checked: boolean): void {
    const next = new Set(this.readSelection(variant));
    if (checked) {
      next.add(row);
    } else {
      next.delete(row);
    }

    this.writeSelection(variant, next);
  }

  protected onSelectAllChange(variant: ExampleVariant, checked: boolean): void {
    this.writeSelection(
      variant,
      checked ? new Set<DeploymentCheck>(deploymentChecks) : new Set<DeploymentCheck>(),
    );
  }

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }

  private readSelection(variant: ExampleVariant): ReadonlySet<DeploymentCheck> {
    return variant === 'plain-css' ? this.plainCssRows() : this.tailwindRows();
  }

  private writeSelection(variant: ExampleVariant, rows: ReadonlySet<DeploymentCheck>): void {
    if (variant === 'plain-css') {
      this.plainCssRows.set(rows);
      return;
    }

    this.tailwindRows.set(rows);
  }
}
