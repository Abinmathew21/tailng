import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { TngRadio } from '@tailng-ui/primitives';
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

type BillingPlan = 'starter' | 'pro' | 'enterprise';

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

function isCheckedRadioEvent(event: unknown): event is Event & { target: HTMLInputElement } {
  if (!(event instanceof Event)) {
    return false;
  }

  const target = event.target;
  return target instanceof HTMLInputElement && target.checked;
}

@Component({
  selector: 'app-headless-radio-overview-page',
  imports: [
    TngCodeBlockComponent,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
    TngRadio,
  ],
  templateUrl: './headless-radio-overview-page.component.html',
  styleUrl: './headless-radio-overview-page.component.css',
})
export class HeadlessRadioOverviewPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly selectedPlainPlan = signal<BillingPlan>('pro');
  protected readonly selectedTailwindPlan = signal<BillingPlan>('pro');

  protected readonly stackblitzVanillaUrl = stackblitzVanillaUrl;
  protected readonly stackblitzTailwindUrl = stackblitzTailwindUrl;

  protected readonly primitiveImportCode = "import { TngRadio } from '@tailng-ui/primitives';\n";

  protected readonly attachmentCode = ['<input tngRadio name="plan" value="starter" />', ''].join(
    '\n',
  );

  protected readonly groupedUsageCode = [
    '<fieldset class="radio-group">',
    '  <legend>Billing plan</legend>',
    '  <label class="radio-row">',
    '    <input tngRadio name="billing-plan" value="starter" />',
    '    <span>Starter</span>',
    '  </label>',
    '  <label class="radio-row">',
    '    <input tngRadio name="billing-plan" value="pro" [checked]="true" />',
    '    <span>Pro</span>',
    '  </label>',
    '</fieldset>',
    '',
  ].join('\n');

  protected readonly plainCssCodeTabs = createCodeTabs({
    baseName: 'headless-radio-plan-card-plain',
    tsCode: [
      "import { Component, signal } from '@angular/core';",
      "import { TngRadio } from '@tailng-ui/primitives';",
      '',
      "type BillingPlan = 'starter' | 'pro' | 'enterprise';",
      '',
      '@Component({',
      "  selector: 'app-headless-radio-plan-card-plain',",
      '  imports: [TngRadio],',
      "  templateUrl: './headless-radio-plan-card-plain.component.html',",
      "  styleUrl: './headless-radio-plan-card-plain.component.css',",
      '})',
      'export class HeadlessRadioPlanCardPlainComponent {',
      "  readonly selectedPlan = signal<BillingPlan>('pro');",
      '',
      '  onPlanChange(plan: BillingPlan, event: Event): void {',
      '    const target = event.target;',
      '    if (!(target instanceof HTMLInputElement) || !target.checked) {',
      '      return;',
      '    }',
      '',
      '    this.selectedPlan.set(plan);',
      '  }',
      '}',
      '',
    ].join('\n'),
    htmlCode: [
      '<fieldset class="headless-radio-plan-card">',
      '  <legend class="headless-radio-plan-card__legend">Billing plan</legend>',
      '  <label class="headless-radio-plan-card__row">',
      '    <input',
      '      type="radio"',
      '      tngRadio',
      '      name="billing-plan"',
      '      [checked]="selectedPlan() === \'starter\'"',
      '      (change)="onPlanChange(\'starter\', $event)"',
      '      class="headless-radio-plan-card__control"',
      '    />',
      '    <span>Starter</span>',
      '  </label>',
      '  <label class="headless-radio-plan-card__row">',
      '    <input',
      '      type="radio"',
      '      tngRadio',
      '      name="billing-plan"',
      '      [checked]="selectedPlan() === \'pro\'"',
      '      (change)="onPlanChange(\'pro\', $event)"',
      '      class="headless-radio-plan-card__control"',
      '    />',
      '    <span>Pro</span>',
      '  </label>',
      '  <label class="headless-radio-plan-card__row">',
      '    <input',
      '      type="radio"',
      '      tngRadio',
      '      name="billing-plan"',
      '      [checked]="selectedPlan() === \'enterprise\'"',
      '      (change)="onPlanChange(\'enterprise\', $event)"',
      '      class="headless-radio-plan-card__control"',
      '    />',
      '    <span>Enterprise</span>',
      '  </label>',
      '  <p class="headless-radio-plan-card__summary">Selected: {{ selectedPlan() }}</p>',
      '</fieldset>',
      '',
    ].join('\n'),
    cssCode: [
      '.headless-radio-plan-card {',
      '  background: var(--tng-semantic-background-base, #ffffff);',
      '  border: 1px solid var(--tng-semantic-border-subtle, #cbd5e1);',
      '  border-radius: 0.95rem;',
      '  display: grid;',
      '  gap: 0.8rem;',
      '  inline-size: min(100%, 28rem);',
      '  margin-inline: auto;',
      '  padding: 1rem;',
      '}',
      '',
      '.headless-radio-plan-card__legend {',
      '  color: var(--tng-semantic-foreground-primary, #0f172a);',
      '  font-weight: 700;',
      '  margin: 0 0 0.2rem;',
      '  padding: 0;',
      '}',
      '',
      '.headless-radio-plan-card__row {',
      '  align-items: center;',
      '  color: var(--tng-semantic-foreground-primary, #0f172a);',
      '  display: inline-flex;',
      '  gap: 0.65rem;',
      '}',
      '',
      '.headless-radio-plan-card__control {',
      '  accent-color: var(--tng-semantic-accent-brand, #2563eb);',
      '}',
      '',
      '.headless-radio-plan-card__control[data-focus-visible] {',
      '  outline: 2px solid color-mix(in srgb, var(--tng-semantic-accent-brand, #2563eb) 70%, white);',
      '  outline-offset: 2px;',
      '}',
      '',
      '.headless-radio-plan-card__summary {',
      '  color: var(--tng-semantic-foreground-secondary, #64748b);',
      '  font-size: 0.85rem;',
      '  margin: 0;',
      '}',
      '',
    ].join('\n'),
  });

  protected readonly tailwindCodeTabs = createCodeTabs({
    baseName: 'headless-radio-plan-card-tailwind',
    tsCode: [
      "import { Component, signal } from '@angular/core';",
      "import { TngRadio } from '@tailng-ui/primitives';",
      '',
      "type BillingPlan = 'starter' | 'pro' | 'enterprise';",
      '',
      '@Component({',
      "  selector: 'app-headless-radio-plan-card-tailwind',",
      '  imports: [TngRadio],',
      "  templateUrl: './headless-radio-plan-card-tailwind.component.html',",
      '})',
      'export class HeadlessRadioPlanCardTailwindComponent {',
      "  readonly selectedPlan = signal<BillingPlan>('pro');",
      '',
      '  onPlanChange(plan: BillingPlan, event: Event): void {',
      '    const target = event.target;',
      '    if (!(target instanceof HTMLInputElement) || !target.checked) {',
      '      return;',
      '    }',
      '',
      '    this.selectedPlan.set(plan);',
      '  }',
      '}',
      '',
    ].join('\n'),
    htmlCode: [
      '<fieldset class="grid w-full max-w-[28rem] gap-3 rounded-xl border border-slate-300 bg-white p-4 shadow-sm">',
      '  <legend class="text-sm font-semibold text-slate-900">Billing plan</legend>',
      '  <label class="inline-flex items-center gap-3 text-sm font-medium text-slate-900">',
      '    <input',
      '      type="radio"',
      '      tngRadio',
      '      name="billing-plan"',
      '      [checked]="selectedPlan() === \'starter\'"',
      '      (change)="onPlanChange(\'starter\', $event)"',
      '      class="h-4 w-4 border-slate-300 text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"',
      '    />',
      '    <span>Starter</span>',
      '  </label>',
      '  <label class="inline-flex items-center gap-3 text-sm font-medium text-slate-900">',
      '    <input',
      '      type="radio"',
      '      tngRadio',
      '      name="billing-plan"',
      '      [checked]="selectedPlan() === \'pro\'"',
      '      (change)="onPlanChange(\'pro\', $event)"',
      '      class="h-4 w-4 border-slate-300 text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"',
      '    />',
      '    <span>Pro</span>',
      '  </label>',
      '  <label class="inline-flex items-center gap-3 text-sm font-medium text-slate-900">',
      '    <input',
      '      type="radio"',
      '      tngRadio',
      '      name="billing-plan"',
      '      [checked]="selectedPlan() === \'enterprise\'"',
      '      (change)="onPlanChange(\'enterprise\', $event)"',
      '      class="h-4 w-4 border-slate-300 text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"',
      '    />',
      '    <span>Enterprise</span>',
      '  </label>',
      '  <p class="m-0 text-xs text-slate-600">Selected: {{ selectedPlan() }}</p>',
      '</fieldset>',
      '',
    ].join('\n'),
    cssCode: '/* Tailwind utilities are applied directly in the template. */',
  });

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }

  protected onPlainPlanChange(plan: BillingPlan, event: unknown): void {
    if (!isCheckedRadioEvent(event)) {
      return;
    }

    this.selectedPlainPlan.set(plan);
  }

  protected onTailwindPlanChange(plan: BillingPlan, event: unknown): void {
    if (!isCheckedRadioEvent(event)) {
      return;
    }

    this.selectedTailwindPlan.set(plan);
  }
}
