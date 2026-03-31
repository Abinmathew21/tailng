import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent, TngRadioComponent } from '@tailng-ui/components';
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
  selector: 'app-radio-overview-page',
  imports: [
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
    TngCodeBlockComponent,
    TngRadioComponent,
  ],
  templateUrl: './radio-overview-page.component.html',
  styleUrl: './radio-overview-page.component.css',
})
export class RadioOverviewPageComponent implements OnDestroy {
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

  protected readonly plainCssPlan = signal<BillingPlan>('pro');
  protected readonly tailwindPlan = signal<BillingPlan>('pro');

  protected readonly componentImportCode =
    "import { TngRadioComponent } from '@tailng-ui/components';\n";

  protected readonly componentUsageCode = [
    '<tng-radio',
    '  name="billing-plan"',
    '  value="pro"',
    '  [checked]="selectedPlan() === \'pro\'"',
    '  (checkedChange)="onPlanChange(\'pro\', $event)"',
    '>',
    '  Pro plan',
    '</tng-radio>',
    '',
  ].join('\n');

  protected readonly groupUsageCode = [
    '<section class="doc-cmp-radio-group">',
    '  <tng-radio',
    '    name="billing-plan"',
    '    value="starter"',
    '    [checked]="selectedPlan() === \'starter\'"',
    '    (checkedChange)="onPlanChange(\'starter\', $event)"',
    '  >',
    '    Starter',
    '  </tng-radio>',
    '  <tng-radio',
    '    name="billing-plan"',
    '    value="pro"',
    '    [checked]="selectedPlan() === \'pro\'"',
    '    (checkedChange)="onPlanChange(\'pro\', $event)"',
    '  >',
    '    Pro',
    '  </tng-radio>',
    '</section>',
    '',
  ].join('\n');

  protected readonly plainCssCodeTabs = createCodeTabs({
    baseName: 'doc-cmp-radio-overview-plain',
    tsCode: [
      "import { Component, signal } from '@angular/core';",
      "import { TngRadioComponent } from '@tailng-ui/components';",
      '',
      "type PlainBillingPlan = 'starter' | 'pro' | 'enterprise';",
      '',
      '@Component({',
      "  selector: 'app-doc-cmp-radio-overview-plain',",
      '  standalone: true,',
      '  imports: [TngRadioComponent],',
      "  templateUrl: './doc-cmp-radio-overview-plain.component.html',",
      "  styleUrl: './doc-cmp-radio-overview-plain.component.css',",
      '})',
      'export class DocCmpRadioOverviewPlainComponent {',
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
      '<section class="doc-cmp-radio-overview-card">',
      '  <h3 class="doc-cmp-radio-overview-card__title">Billing plan</h3>',
      '  <p class="doc-cmp-radio-overview-card__subtitle">Choose the launch plan for this workspace.</p>',
      '  <tng-radio',
      '    class="doc-cmp-radio-overview-item"',
      '    name="plain-billing-plan"',
      '    value="starter"',
      '    [checked]="selectedPlainBillingPlan() === \'starter\'"',
      '    (checkedChange)="onPlainBillingPlanChange(\'starter\', $event)"',
      '  >',
      '    Starter',
      '  </tng-radio>',
      '  <tng-radio',
      '    class="doc-cmp-radio-overview-item"',
      '    name="plain-billing-plan"',
      '    value="pro"',
      '    [checked]="selectedPlainBillingPlan() === \'pro\'"',
      '    (checkedChange)="onPlainBillingPlanChange(\'pro\', $event)"',
      '  >',
      '    Pro',
      '  </tng-radio>',
      '  <tng-radio',
      '    class="doc-cmp-radio-overview-item doc-cmp-radio-overview-item--muted"',
      '    name="plain-billing-plan"',
      '    value="enterprise"',
      '    [checked]="selectedPlainBillingPlan() === \'enterprise\'"',
      '    (checkedChange)="onPlainBillingPlanChange(\'enterprise\', $event)"',
      '  >',
      '    Enterprise',
      '  </tng-radio>',
      '  <p class="doc-cmp-radio-overview-card__summary">Selected: {{ selectedPlainBillingPlan() }}</p>',
      '</section>',
      '',
    ].join('\n'),
    cssCode: [
      '.doc-cmp-radio-overview-card {',
      '  display: grid;',
      '  gap: 0.8rem;',
      '  inline-size: min(100%, 30rem);',
      '  margin-inline: auto;',
      '  padding: 1rem;',
      '  border: 1px solid #d8e1ec;',
      '  border-radius: 1rem;',
      '  background: #fff;',
      '  box-shadow: 0 20px 40px -32px rgba(15, 23, 42, 0.28);',
      '}',
      '',
      '.doc-cmp-radio-overview-card__title {',
      '  margin: 0;',
      '  font-size: 1rem;',
      '  font-weight: 700;',
      '  color: #0f172a;',
      '}',
      '',
      '.doc-cmp-radio-overview-card__subtitle {',
      '  margin: 0;',
      '  color: #64748b;',
      '  font-size: 0.88rem;',
      '}',
      '',
      '.doc-cmp-radio-overview-item {',
      '  display: block;',
      '  padding: 0.75rem 0.9rem;',
      '  border: 1px solid #d8e1ec;',
      '  border-radius: 0.9rem;',
      '  background: #fff;',
      '  --tng-semantic-accent-brand: #2563eb;',
      '  --tng-semantic-focus-ring: rgba(37, 99, 235, 0.22);',
      '  --tng-semantic-foreground-primary: #0f172a;',
      '}',
      '',
      '.doc-cmp-radio-overview-item--muted {',
      '  background: #f8fafc;',
      '  --tng-semantic-foreground-primary: #475569;',
      '}',
      '',
      '.doc-cmp-radio-overview-card__summary {',
      '  margin: 0;',
      '  color: #64748b;',
      '  font-size: 0.82rem;',
      '  text-transform: capitalize;',
      '}',
      '',
    ].join('\n'),
  });

  protected readonly tailwindCodeTabs = createCodeTabs({
    baseName: 'doc-cmp-radio-overview-tailwind',
    tsCode: [
      "import { Component, signal } from '@angular/core';",
      "import { TngRadioComponent } from '@tailng-ui/components';",
      '',
      "type TailwindBillingPlan = 'starter' | 'pro' | 'enterprise';",
      '',
      '@Component({',
      "  selector: 'app-doc-cmp-radio-overview-tailwind',",
      '  standalone: true,',
      '  imports: [TngRadioComponent],',
      "  templateUrl: './doc-cmp-radio-overview-tailwind.component.html',",
      '})',
      'export class DocCmpRadioOverviewTailwindComponent {',
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
      '  class="grid w-full max-w-[30rem] gap-3 rounded-2xl border border-slate-300 bg-white p-4 shadow-sm"',
      '>',
      '  <div class="grid gap-1">',
      '    <h3 class="m-0 text-base font-semibold text-slate-900">Billing plan</h3>',
      '    <p class="m-0 text-sm text-slate-600">Choose the launch plan for this workspace.</p>',
      '  </div>',
      '  <tng-radio',
      '    class="block rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 shadow-sm [--tng-semantic-foreground-primary:#0f172a] [--tng-semantic-accent-brand:#2563eb] [--tng-semantic-focus-ring:rgba(37,99,235,0.22)]"',
      '    name="tailwind-billing-plan"',
      '    value="starter"',
      '    [checked]="selectedTailwindBillingPlan() === \'starter\'"',
      '    (checkedChange)="onTailwindBillingPlanChange(\'starter\', $event)"',
      '  >',
      '    Starter',
      '  </tng-radio>',
      '  <tng-radio',
      '    class="block rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 shadow-sm [--tng-semantic-foreground-primary:#0f172a] [--tng-semantic-accent-brand:#2563eb] [--tng-semantic-focus-ring:rgba(37,99,235,0.22)]"',
      '    name="tailwind-billing-plan"',
      '    value="pro"',
      '    [checked]="selectedTailwindBillingPlan() === \'pro\'"',
      '    (checkedChange)="onTailwindBillingPlanChange(\'pro\', $event)"',
      '  >',
      '    Pro',
      '  </tng-radio>',
      '  <tng-radio',
      '    class="block rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-600 shadow-sm [--tng-semantic-foreground-primary:#475569] [--tng-semantic-accent-brand:#2563eb] [--tng-semantic-focus-ring:rgba(37,99,235,0.22)]"',
      '    name="tailwind-billing-plan"',
      '    value="enterprise"',
      '    [checked]="selectedTailwindBillingPlan() === \'enterprise\'"',
      '    (checkedChange)="onTailwindBillingPlanChange(\'enterprise\', $event)"',
      '  >',
      '    Enterprise',
      '  </tng-radio>',
      '  <p class="m-0 text-xs text-slate-600">Selected: {{ selectedTailwindBillingPlan() }}</p>',
      '</section>',
      '',
    ].join('\n'),
    cssCode: '/* Tailwind utilities are applied directly in the template. */',
  });

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }

  protected onPlainCssPlanChange(plan: BillingPlan, checked: boolean): void {
    if (!checked) {
      return;
    }

    this.plainCssPlan.set(plan);
  }

  protected onTailwindPlanChange(plan: BillingPlan, checked: boolean): void {
    if (!checked) {
      return;
    }

    this.tailwindPlan.set(plan);
  }
}
