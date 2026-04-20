import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngRadioComponent } from '@tailng-ui/components';
import type { DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';
import {
  observeDocsCodeThemeChanges,
  resolveDocsCodeBlockTheme,
} from '../../../../../../shared/util';
import { stackblitzTailwindUrl, stackblitzVanillaUrl } from '../../radio.util';

type BillingPlan = 'enterprise' | 'pro' | 'starter';

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
  selector: 'app-radio-examples-page',
  imports: [DocsExampleTabsSectionComponent, DocsExampleVariantDirective, TngRadioComponent],
  templateUrl: './radio-examples-page.component.html',
  styleUrl: './radio-examples-page.component.css',
})
export class RadioExamplesPageComponent implements OnDestroy {
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

  protected readonly plainBillingPlan = signal<BillingPlan>('pro');
  protected readonly tailwindBillingPlan = signal<BillingPlan>('pro');

  protected readonly billingPlainCodeTabs = createCodeTabs({
    baseName: 'doc-cmp-radio-billing-plain',
    tsCode: [
      "import { Component, signal } from '@angular/core';",
      "import { TngRadioComponent } from '@tailng-ui/components';",
      '',
      "type PlainBillingPlan = 'starter' | 'pro' | 'enterprise';",
      '',
      '@Component({',
      "  selector: 'app-doc-cmp-radio-billing-plain',",
      '  standalone: true,',
      '  imports: [TngRadioComponent],',
      "  templateUrl: './doc-cmp-radio-billing-plain.component.html',",
      "  styleUrl: './doc-cmp-radio-billing-plain.component.css',",
      '})',
      'export class DocCmpRadioBillingPlainComponent {',
      "  readonly selectedPlainBillingPlan = signal<PlainBillingPlan>('pro');",
      '',
      '  onPlainBillingPlanChange(plan: PlainBillingPlan, checked: boolean): void {',
      '    if (!checked) {',
      '      return;',
      '    }',
      '',
      '    this.selectedPlainBillingPlan.set(plan);',
      '  }',
      '}',
      '',
    ].join('\n'),
    htmlCode: [
      '<section class="doc-cmp-radio-billing-card">',
      '  <h3 class="doc-cmp-radio-billing-card__title">Billing plan</h3>',
      '  <p class="doc-cmp-radio-billing-card__subtitle">Select the launch tier for this customer workspace.</p>',
      '  <tng-radio',
      '    name="plain-billing-selection"',
      '    value="starter"',
      '    [checked]="selectedPlainBillingPlan() === \'starter\'"',
      '    (checkedChange)="onPlainBillingPlanChange(\'starter\', $event)"',
      '  >',
      '    Starter',
      '  </tng-radio>',
      '  <tng-radio',
      '    name="plain-billing-selection"',
      '    value="pro"',
      '    [checked]="selectedPlainBillingPlan() === \'pro\'"',
      '    (checkedChange)="onPlainBillingPlanChange(\'pro\', $event)"',
      '  >',
      '    Pro',
      '  </tng-radio>',
      '  <div class="doc-cmp-radio-billing-item doc-cmp-radio-billing-item--muted">',
      '    <tng-radio',
      '      name="plain-billing-selection"',
      '      value="enterprise"',
      '      [checked]="selectedPlainBillingPlan() === \'enterprise\'"',
      '      (checkedChange)="onPlainBillingPlanChange(\'enterprise\', $event)"',
      '    >',
      '      Enterprise',
      '    </tng-radio>',
      '  </div>',
      '  <p class="doc-cmp-radio-billing-card__summary">Selected: {{ selectedPlainBillingPlan() }}</p>',
      '</section>',
      '',
    ].join('\n'),
    cssCode: [
      '.doc-cmp-radio-billing-card {',
      '  display: grid;',
      '  gap: 0.8rem;',
      '  inline-size: min(100%, 30rem);',
      '  margin-inline: auto;',
      '  padding: 1rem;',
      '  border: 1px solid var(--tng-semantic-border-subtle);',
      '  border-radius: 1rem;',
      '  background: var(--tng-semantic-background-surface);',
      '  box-shadow: 0 20px 40px -32px rgba(15, 23, 42, 0.28);',
      '}',
      '',
      '.doc-cmp-radio-billing-card__title {',
      '  margin: 0;',
      '  font-size: 1rem;',
      '  font-weight: 700;',
      '  color: var(--tng-semantic-foreground-primary);',
      '}',
      '',
      '.doc-cmp-radio-billing-card__subtitle {',
      '  margin: 0;',
      '  color: var(--tng-semantic-foreground-secondary);',
      '  font-size: 0.88rem;',
      '}',
      '',
      '.doc-cmp-radio-billing-card > tng-radio,',
      '.doc-cmp-radio-billing-item {',
      '  display: block;',
      '  padding: 0.75rem 0.9rem;',
      '  border: 1px solid var(--tng-semantic-border-subtle);',
      '  border-radius: 0.9rem;',
      '  background: var(--tng-semantic-background-surface);',
      '  --tng-semantic-accent-brand: #2563eb;',
      '  --tng-semantic-focus-ring: rgba(37, 99, 235, 0.22);',
      '  --tng-semantic-foreground-primary: var(--tng-semantic-foreground-primary);',
      '}',
      '',
      '.doc-cmp-radio-billing-item--muted,',
      '.doc-cmp-radio-billing-card > tng-radio:last-of-type {',
      '  background: color-mix(in srgb, var(--tng-semantic-background-surface) 92%, var(--tng-semantic-foreground-primary) 8%);',
      '  --tng-semantic-foreground-primary: var(--tng-semantic-foreground-secondary);',
      '}',
      '',
      '.doc-cmp-radio-billing-card__summary {',
      '  margin: 0;',
      '  color: var(--tng-semantic-foreground-secondary);',
      '  font-size: 0.82rem;',
      '  text-transform: capitalize;',
      '}',
      '',
    ].join('\n'),
  });

  protected readonly billingTailwindCodeTabs = createCodeTabs({
    baseName: 'doc-cmp-radio-billing-tailwind',
    tsCode: [
      "import { Component, signal } from '@angular/core';",
      "import { TngRadioComponent } from '@tailng-ui/components';",
      '',
      "type TailwindBillingPlan = 'starter' | 'pro' | 'enterprise';",
      '',
      '@Component({',
      "  selector: 'app-doc-cmp-radio-billing-tailwind',",
      '  standalone: true,',
      '  imports: [TngRadioComponent],',
      "  templateUrl: './doc-cmp-radio-billing-tailwind.component.html',",
      '})',
      'export class DocCmpRadioBillingTailwindComponent {',
      "  readonly selectedTailwindBillingPlan = signal<TailwindBillingPlan>('pro');",
      '',
      '  onTailwindBillingPlanChange(plan: TailwindBillingPlan, checked: boolean): void {',
      '    if (!checked) {',
      '      return;',
      '    }',
      '',
      '    this.selectedTailwindBillingPlan.set(plan);',
      '  }',
      '}',
      '',
    ].join('\n'),
    htmlCode: [
      '<section',
      '  class="grid w-full max-w-[30rem] gap-3 rounded-2xl border border-[var(--tng-semantic-border-subtle)] bg-[var(--tng-semantic-background-surface)] p-4 shadow-sm"',
      '>',
      '  <div class="grid gap-1">',
      '    <h3 class="m-0 text-base font-semibold text-[var(--tng-semantic-foreground-primary)]">Billing plan</h3>',
      '    <p class="m-0 text-sm text-[var(--tng-semantic-foreground-secondary)]">Select the launch tier for this customer workspace.</p>',
      '  </div>',
      '  <div class="block rounded-xl border border-[var(--tng-semantic-border-subtle)] bg-[var(--tng-semantic-background-surface)] px-3 py-2 text-[var(--tng-semantic-foreground-primary)] shadow-sm [--tng-semantic-accent-brand:#2563eb] [--tng-semantic-focus-ring:rgba(37,99,235,0.22)]">',
      '    <tng-radio',
      '    name="tailwind-billing-selection"',
      '    value="starter"',
      '    [checked]="selectedTailwindBillingPlan() === \'starter\'"',
      '    (checkedChange)="onTailwindBillingPlanChange(\'starter\', $event)"',
      '  >',
      '    Starter',
      '    </tng-radio>',
      '  </div>',
      '  <div class="block rounded-xl border border-[var(--tng-semantic-border-subtle)] bg-[var(--tng-semantic-background-surface)] px-3 py-2 text-[var(--tng-semantic-foreground-primary)] shadow-sm [--tng-semantic-accent-brand:#2563eb] [--tng-semantic-focus-ring:rgba(37,99,235,0.22)]">',
      '    <tng-radio',
      '    name="tailwind-billing-selection"',
      '    value="pro"',
      '    [checked]="selectedTailwindBillingPlan() === \'pro\'"',
      '    (checkedChange)="onTailwindBillingPlanChange(\'pro\', $event)"',
      '  >',
      '    Pro',
      '    </tng-radio>',
      '  </div>',
      '  <div class="block rounded-xl border border-[var(--tng-semantic-border-subtle)] bg-[color-mix(in_srgb,var(--tng-semantic-background-surface)_92%,var(--tng-semantic-foreground-primary)_8%)] px-3 py-2 text-[var(--tng-semantic-foreground-secondary)] shadow-sm [--tng-semantic-accent-brand:#2563eb] [--tng-semantic-focus-ring:rgba(37,99,235,0.22)]">',
      '    <tng-radio',
      '    name="tailwind-billing-selection"',
      '    value="enterprise"',
      '    [checked]="selectedTailwindBillingPlan() === \'enterprise\'"',
      '    (checkedChange)="onTailwindBillingPlanChange(\'enterprise\', $event)"',
      '  >',
      '    Enterprise',
      '    </tng-radio>',
      '  </div>',
      '  <p class="m-0 text-xs text-[var(--tng-semantic-foreground-secondary)]">Selected: {{ selectedTailwindBillingPlan() }}</p>',
      '</section>',
      '',
    ].join('\n'),
    cssCode: '/* Tailwind utilities are applied directly in the template. */',
  });

  protected readonly readonlyPlainCodeTabs = createCodeTabs({
    baseName: 'doc-cmp-radio-readonly-plain',
    tsCode: [
      "import { Component } from '@angular/core';",
      "import { TngRadioComponent } from '@tailng-ui/components';",
      '',
      '@Component({',
      "  selector: 'app-doc-cmp-radio-readonly-plain',",
      '  standalone: true,',
      '  imports: [TngRadioComponent],',
      "  templateUrl: './doc-cmp-radio-readonly-plain.component.html',",
      "  styleUrl: './doc-cmp-radio-readonly-plain.component.css',",
      '})',
      'export class DocCmpRadioReadonlyPlainComponent {}',
      '',
    ].join('\n'),
    htmlCode: [
      '<section class="doc-cmp-radio-review-card">',
      '  <h3 class="doc-cmp-radio-review-card__title">Release track review</h3>',
      '  <tng-radio',
      '    name="plain-release-track"',
      '    value="stable"',
      '    [checked]="true"',
      '    [readonly]="true"',
      '  >',
      '    Stable',
      '  </tng-radio>',
      '  <div class="doc-cmp-radio-review-item doc-cmp-radio-review-item--danger">',
      '    <tng-radio',
      '      name="plain-release-track"',
      '      value="canary"',
      '      [invalid]="true"',
      '      [readonly]="true"',
      '    >',
      '      Canary requires compliance approval',
      '    </tng-radio>',
      '  </div>',
      '</section>',
      '',
    ].join('\n'),
    cssCode: [
      '.doc-cmp-radio-review-card {',
      '  display: grid;',
      '  gap: 0.8rem;',
      '  inline-size: min(100%, 30rem);',
      '  margin-inline: auto;',
      '  padding: 1rem;',
      '  border: 1px solid var(--tng-semantic-border-subtle);',
      '  border-radius: 1rem;',
      '  background: var(--tng-semantic-background-surface);',
      '  box-shadow: 0 20px 40px -32px rgba(15, 23, 42, 0.28);',
      '}',
      '',
      '.doc-cmp-radio-review-card__title {',
      '  margin: 0;',
      '  font-size: 1rem;',
      '  font-weight: 700;',
      '  color: var(--tng-semantic-foreground-primary);',
      '}',
      '',
      '.doc-cmp-radio-review-card > tng-radio,',
      '.doc-cmp-radio-review-item {',
      '  display: block;',
      '  padding: 0.75rem 0.9rem;',
      '  border: 1px solid var(--tng-semantic-border-subtle);',
      '  border-radius: 0.9rem;',
      '  background: var(--tng-semantic-background-surface);',
      '  --tng-semantic-accent-brand: #2563eb;',
      '  --tng-semantic-focus-ring: rgba(37, 99, 235, 0.22);',
      '  --tng-semantic-foreground-primary: var(--tng-semantic-foreground-primary);',
      '}',
      '',
      '.doc-cmp-radio-review-item--danger,',
      '.doc-cmp-radio-review-card > .doc-cmp-radio-review-item--danger {',
      '  border-color: color-mix(in srgb, var(--tng-semantic-accent-danger) 35%, var(--tng-semantic-border-subtle) 65%);',
      '  background: color-mix(in srgb, var(--tng-semantic-accent-danger) 10%, var(--tng-semantic-background-surface) 90%);',
      '  --tng-semantic-accent-danger: #dc2626;',
      '  --tng-semantic-foreground-primary: var(--tng-semantic-accent-danger);',
      '}',
      '',
    ].join('\n'),
  });

  protected readonly readonlyTailwindCodeTabs = createCodeTabs({
    baseName: 'doc-cmp-radio-readonly-tailwind',
    tsCode: [
      "import { Component } from '@angular/core';",
      "import { TngRadioComponent } from '@tailng-ui/components';",
      '',
      '@Component({',
      "  selector: 'app-doc-cmp-radio-readonly-tailwind',",
      '  standalone: true,',
      '  imports: [TngRadioComponent],',
      "  templateUrl: './doc-cmp-radio-readonly-tailwind.component.html',",
      '})',
      'export class DocCmpRadioReadonlyTailwindComponent {}',
      '',
    ].join('\n'),
    htmlCode: [
      '<section',
      '  class="grid w-full max-w-[30rem] gap-3 rounded-2xl border border-[var(--tng-semantic-border-subtle)] bg-[var(--tng-semantic-background-surface)] p-4 shadow-sm"',
      '>',
      '  <h3 class="m-0 text-base font-semibold text-[var(--tng-semantic-foreground-primary)]">Release track review</h3>',
      '  <div class="block rounded-xl border border-[var(--tng-semantic-border-subtle)] bg-[var(--tng-semantic-background-surface)] px-3 py-2 text-[var(--tng-semantic-foreground-primary)] shadow-sm [--tng-semantic-accent-brand:#2563eb] [--tng-semantic-focus-ring:rgba(37,99,235,0.22)]">',
      '    <tng-radio',
      '    name="tailwind-release-track"',
      '    value="stable"',
      '    [checked]="true"',
      '    [readonly]="true"',
      '  >',
      '    Stable',
      '    </tng-radio>',
      '  </div>',
      '  <div class="block rounded-xl border border-[color-mix(in_srgb,var(--tng-semantic-accent-danger)_35%,var(--tng-semantic-border-subtle)_65%)] bg-[color-mix(in_srgb,var(--tng-semantic-accent-danger)_10%,var(--tng-semantic-background-surface)_90%)] px-3 py-2 text-[var(--tng-semantic-accent-danger)] shadow-sm [--tng-semantic-accent-danger:#dc2626] [--tng-semantic-focus-ring:rgba(220,38,38,0.18)]">',
      '    <tng-radio',
      '    name="tailwind-release-track"',
      '    value="canary"',
      '    [invalid]="true"',
      '    [readonly]="true"',
      '  >',
      '    Canary requires compliance approval',
      '    </tng-radio>',
      '  </div>',
      '</section>',
      '',
    ].join('\n'),
    cssCode: '/* Tailwind utilities are applied directly in the template. */',
  });

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }

  protected onPlainBillingPlanChange(plan: BillingPlan, checked: boolean): void {
    if (!checked) {
      return;
    }

    this.plainBillingPlan.set(plan);
  }

  protected onTailwindBillingPlanChange(plan: BillingPlan, checked: boolean): void {
    if (!checked) {
      return;
    }

    this.tailwindBillingPlan.set(plan);
  }
}
