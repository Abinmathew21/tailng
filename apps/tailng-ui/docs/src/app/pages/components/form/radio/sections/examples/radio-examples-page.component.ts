import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { observeDocsCodeThemeChanges, resolveDocsCodeBlockTheme } from '../../../../../../shared/util';
import { TngRadioComponent } from '@tailng-ui/components';
import { TngRadio as TngRadioPrimitive } from '@tailng-ui/primitives';
import { type DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';

type BillingPlan = 'enterprise' | 'pro' | 'starter';
type ReleaseTrack = 'canary' | 'stable';

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
  selector: 'app-radio-examples-page',
  imports: [
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
    TngRadioComponent,
    TngRadioPrimitive,
  ],
  templateUrl: './radio-examples-page.component.html',
  styleUrl: './radio-examples-page.component.css',
})
export class RadioExamplesPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(this.documentRef, this.codeBlockTheme);

  protected readonly headlessPlan = signal<BillingPlan>('pro');
  protected readonly plainCssPlan = signal<BillingPlan>('pro');
  protected readonly tailwindPlan = signal<BillingPlan>('pro');

  protected readonly headlessTrack = signal<ReleaseTrack>('stable');
  protected readonly plainCssTrack = signal<ReleaseTrack>('stable');
  protected readonly tailwindTrack = signal<ReleaseTrack>('stable');

  protected readonly billingHeadlessCodeTabs = createCodeTabs(
    'radio-examples-billing-headless',
    [
      "import { Component, signal } from '@angular/core';",
      "import { TngRadio } from '@tailng-ui/primitives';",
      '',
      'export class BillingHeadlessExample {',
      "  readonly plan = signal<'starter' | 'pro' | 'enterprise'>('pro');",
      '}',
      '',
    ].join('\n'),
    [
      '<label class="radio-row"><input tngRadio name="billing" />Starter</label>',
      '<label class="radio-row"><input tngRadio name="billing" [checked]="true" />Pro</label>',
      '<label class="radio-row"><input tngRadio name="billing" />Enterprise</label>',
      '',
    ].join('\n'),
    [
      '.radio-example-stack { display: grid; gap: 0.7rem; }',
      '.radio-row { align-items: center; display: inline-flex; gap: 0.55rem; }',
      '',
    ].join('\n'),
  );

  protected readonly billingPlainCssCodeTabs = createCodeTabs(
    'radio-examples-billing-plain-css',
    [
      "import { Component, signal } from '@angular/core';",
      "import { TngRadioComponent } from '@tailng-ui/components';",
      '',
      'export class BillingPlainCssExample {}',
      '',
    ].join('\n'),
    [
      '<div class="radio-card">',
      '  <tng-radio name="billing" value="starter">Starter</tng-radio>',
      '  <tng-radio name="billing" value="pro" [checked]="true">Pro</tng-radio>',
      '  <tng-radio name="billing" value="enterprise">Enterprise</tng-radio>',
      '</div>',
      '',
    ].join('\n'),
    [
      '.radio-card {',
      '  background: var(--tng-semantic-background-surface);',
      '  border: 1px solid var(--tng-semantic-border-subtle);',
      '  border-radius: 0.8rem;',
      '  display: grid;',
      '  gap: 0.75rem;',
      '  padding: 0.9rem 1rem;',
      '}',
      '',
    ].join('\n'),
  );

  protected readonly billingTailwindCodeTabs = createCodeTabs(
    'radio-examples-billing-tailwind',
    [
      "import { Component } from '@angular/core';",
      "import { TngRadioComponent } from '@tailng-ui/components';",
      '',
      'export class BillingTailwindExample {}',
      '',
    ].join('\n'),
    [
      '<div class="grid gap-3 rounded-xl border border-slate-300 bg-white/80 p-4 dark:border-slate-700 dark:bg-slate-900/60">',
      '  <tng-radio class="text-slate-900 dark:text-slate-100" name="billing">Starter</tng-radio>',
      '  <tng-radio class="text-slate-900 dark:text-slate-100" name="billing" [checked]="true">Pro</tng-radio>',
      '  <tng-radio class="text-slate-900 dark:text-slate-100" name="billing">Enterprise</tng-radio>',
      '</div>',
      '',
    ].join('\n'),
    '/* Tailwind utilities are applied directly in the template. */',
  );

  protected readonly readonlyHeadlessCodeTabs = createCodeTabs(
    'radio-examples-readonly-headless',
    [
      "import { Component } from '@angular/core';",
      "import { TngRadio } from '@tailng-ui/primitives';",
      '',
      'export class ReadonlyHeadlessExample {}',
      '',
    ].join('\n'),
    [
      '<label class="radio-row">',
      '  <input tngRadio [checked]="true" [readonly]="true" name="track" />',
      '  <span>Stable</span>',
      '</label>',
      '<label class="radio-row">',
      '  <input tngRadio [readonly]="true" [invalid]="true" name="track" />',
      '  <span>Canary</span>',
      '</label>',
      '',
    ].join('\n'),
    [
      '.radio-row { align-items: center; display: inline-flex; gap: 0.55rem; }',
      '',
    ].join('\n'),
  );

  protected readonly readonlyPlainCssCodeTabs = createCodeTabs(
    'radio-examples-readonly-plain-css',
    [
      "import { Component } from '@angular/core';",
      "import { TngRadioComponent } from '@tailng-ui/components';",
      '',
      'export class ReadonlyPlainCssExample {}',
      '',
    ].join('\n'),
    [
      '<div class="radio-card">',
      '  <tng-radio [checked]="true" [readonly]="true">Stable</tng-radio>',
      '  <tng-radio [readonly]="true" [invalid]="true">Canary</tng-radio>',
      '</div>',
      '',
    ].join('\n'),
    [
      '.radio-card {',
      '  background: var(--tng-semantic-background-surface);',
      '  border: 1px solid var(--tng-semantic-border-subtle);',
      '  border-radius: 0.8rem;',
      '  display: grid;',
      '  gap: 0.75rem;',
      '  padding: 0.9rem 1rem;',
      '}',
      '',
    ].join('\n'),
  );

  protected readonly readonlyTailwindCodeTabs = createCodeTabs(
    'radio-examples-readonly-tailwind',
    [
      "import { Component } from '@angular/core';",
      "import { TngRadioComponent } from '@tailng-ui/components';",
      '',
      'export class ReadonlyTailwindExample {}',
      '',
    ].join('\n'),
    [
      '<div class="grid gap-3 rounded-xl border border-slate-300 bg-white/80 p-4 dark:border-slate-700 dark:bg-slate-900/60">',
      '  <tng-radio [checked]="true" [readonly]="true" class="text-slate-900 dark:text-slate-100">Stable</tng-radio>',
      '  <tng-radio [readonly]="true" [invalid]="true" class="text-slate-900 dark:text-slate-100">Canary</tng-radio>',
      '</div>',
      '',
    ].join('\n'),
    '/* Tailwind utilities are applied directly in the template. */',
  );

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }

  protected onHeadlessPlanChange(plan: BillingPlan, event: unknown): void {
    if (!(event instanceof Event)) {
      return;
    }

    const target = event.target;
    if (!(target instanceof HTMLInputElement) || !target.checked) {
      return;
    }

    this.headlessPlan.set(plan);
  }

  protected onPlainCssPlanChange(plan: BillingPlan, checked: boolean): void {
    if (checked) {
      this.plainCssPlan.set(plan);
    }
  }

  protected onTailwindPlanChange(plan: BillingPlan, checked: boolean): void {
    if (checked) {
      this.tailwindPlan.set(plan);
    }
  }

  protected onHeadlessTrackChange(track: ReleaseTrack, event: unknown): void {
    if (!(event instanceof Event)) {
      return;
    }

    const target = event.target;
    if (!(target instanceof HTMLInputElement) || !target.checked) {
      return;
    }

    this.headlessTrack.set(track);
  }

  protected onPlainCssTrackChange(track: ReleaseTrack, checked: boolean): void {
    if (checked) {
      this.plainCssTrack.set(track);
    }
  }

  protected onTailwindTrackChange(track: ReleaseTrack, checked: boolean): void {
    if (checked) {
      this.tailwindTrack.set(track);
    }
  }

}
