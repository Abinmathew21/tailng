import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
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
type ReleaseTrack = 'stable' | 'canary';
type AlertRoute = 'email' | 'slack';

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
  selector: 'app-headless-radio-examples-page',
  imports: [DocsExampleTabsSectionComponent, DocsExampleVariantDirective, TngRadio],
  templateUrl: './headless-radio-examples-page.component.html',
  styleUrl: './headless-radio-examples-page.component.css',
})
export class HeadlessRadioExamplesPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly plainBillingPlan = signal<BillingPlan>('pro');
  protected readonly tailwindBillingPlan = signal<BillingPlan>('pro');
  protected readonly plainReleaseTrack = signal<ReleaseTrack>('stable');
  protected readonly tailwindReleaseTrack = signal<ReleaseTrack>('stable');
  protected readonly plainAlertRoute = signal<AlertRoute>('email');
  protected readonly tailwindAlertRoute = signal<AlertRoute>('email');

  protected readonly stackblitzVanillaUrl = stackblitzVanillaUrl;
  protected readonly stackblitzTailwindUrl = stackblitzTailwindUrl;

  protected readonly billingPlainCodeTabs = createCodeTabs({
    baseName: 'headless-radio-billing-plain',
    tsCode: [
      "import { Component, signal } from '@angular/core';",
      "import { TngRadio } from '@tailng-ui/primitives';",
      '',
      "type BillingPlan = 'starter' | 'pro' | 'enterprise';",
      '',
      '@Component({',
      "  selector: 'app-headless-radio-billing-plain',",
      '  imports: [TngRadio],',
      "  templateUrl: './headless-radio-billing-plain.component.html',",
      "  styleUrl: './headless-radio-billing-plain.component.css',",
      '})',
      'export class HeadlessRadioBillingPlainComponent {',
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
      '<fieldset class="headless-radio-billing-card">',
      '  <legend class="headless-radio-billing-card__legend">Billing plan</legend>',
      '  <label class="headless-radio-billing-card__row">',
      '    <input type="radio" tngRadio name="billing-plan" [checked]="selectedPlan() === \'starter\'" (change)="onPlanChange(\'starter\', $event)" class="headless-radio-billing-card__control" />',
      '    <span>Starter</span>',
      '  </label>',
      '  <label class="headless-radio-billing-card__row">',
      '    <input type="radio" tngRadio name="billing-plan" [checked]="selectedPlan() === \'pro\'" (change)="onPlanChange(\'pro\', $event)" class="headless-radio-billing-card__control" />',
      '    <span>Pro</span>',
      '  </label>',
      '  <label class="headless-radio-billing-card__row">',
      '    <input type="radio" tngRadio name="billing-plan" [checked]="selectedPlan() === \'enterprise\'" (change)="onPlanChange(\'enterprise\', $event)" class="headless-radio-billing-card__control" />',
      '    <span>Enterprise</span>',
      '  </label>',
      '  <p class="headless-radio-billing-card__summary">Selected: {{ selectedPlan() }}</p>',
      '</fieldset>',
      '',
    ].join('\n'),
    cssCode: [
      '.headless-radio-billing-card {',
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
      '.headless-radio-billing-card__legend {',
      '  color: var(--tng-semantic-foreground-primary, #0f172a);',
      '  font-weight: 700;',
      '  margin: 0 0 0.2rem;',
      '  padding: 0;',
      '}',
      '',
      '.headless-radio-billing-card__row {',
      '  align-items: center;',
      '  color: var(--tng-semantic-foreground-primary, #0f172a);',
      '  display: inline-flex;',
      '  gap: 0.65rem;',
      '}',
      '',
      '.headless-radio-billing-card__control {',
      '  accent-color: var(--tng-semantic-accent-brand, #2563eb);',
      '}',
      '',
      '.headless-radio-billing-card__summary {',
      '  color: var(--tng-semantic-foreground-secondary, #64748b);',
      '  font-size: 0.85rem;',
      '  margin: 0;',
      '}',
      '',
    ].join('\n'),
  });

  protected readonly billingTailwindCodeTabs = createCodeTabs({
    baseName: 'headless-radio-billing-tailwind',
    tsCode: [
      "import { Component, signal } from '@angular/core';",
      "import { TngRadio } from '@tailng-ui/primitives';",
      '',
      "type BillingPlan = 'starter' | 'pro' | 'enterprise';",
      '',
      '@Component({',
      "  selector: 'app-headless-radio-billing-tailwind',",
      '  imports: [TngRadio],',
      "  templateUrl: './headless-radio-billing-tailwind.component.html',",
      '})',
      'export class HeadlessRadioBillingTailwindComponent {',
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
      '    <input type="radio" tngRadio name="billing-plan" [checked]="selectedPlan() === \'starter\'" (change)="onPlanChange(\'starter\', $event)" class="h-4 w-4 border-slate-300 text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40" />',
      '    <span>Starter</span>',
      '  </label>',
      '  <label class="inline-flex items-center gap-3 text-sm font-medium text-slate-900">',
      '    <input type="radio" tngRadio name="billing-plan" [checked]="selectedPlan() === \'pro\'" (change)="onPlanChange(\'pro\', $event)" class="h-4 w-4 border-slate-300 text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40" />',
      '    <span>Pro</span>',
      '  </label>',
      '  <label class="inline-flex items-center gap-3 text-sm font-medium text-slate-900">',
      '    <input type="radio" tngRadio name="billing-plan" [checked]="selectedPlan() === \'enterprise\'" (change)="onPlanChange(\'enterprise\', $event)" class="h-4 w-4 border-slate-300 text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40" />',
      '    <span>Enterprise</span>',
      '  </label>',
      '  <p class="m-0 text-xs text-slate-600">Selected: {{ selectedPlan() }}</p>',
      '</fieldset>',
      '',
    ].join('\n'),
    cssCode: '/* Tailwind utilities are applied directly in the template. */',
  });

  protected readonly reviewPlainCodeTabs = createCodeTabs({
    baseName: 'headless-radio-review-plain',
    tsCode: [
      "import { Component, signal } from '@angular/core';",
      "import { TngRadio } from '@tailng-ui/primitives';",
      '',
      "type ReleaseTrack = 'stable' | 'canary';",
      '',
      '@Component({',
      "  selector: 'app-headless-radio-review-plain',",
      '  imports: [TngRadio],',
      "  templateUrl: './headless-radio-review-plain.component.html',",
      "  styleUrl: './headless-radio-review-plain.component.css',",
      '})',
      'export class HeadlessRadioReviewPlainComponent {',
      "  readonly selectedTrack = signal<ReleaseTrack>('stable');",
      '}',
      '',
    ].join('\n'),
    htmlCode: [
      '<fieldset class="headless-radio-review-card">',
      '  <legend class="headless-radio-review-card__legend">Release track</legend>',
      '  <label class="headless-radio-review-card__row">',
      '    <input type="radio" tngRadio name="release-track" [readonly]="true" [checked]="selectedTrack() === \'stable\'" class="headless-radio-review-card__control" />',
      '    <span>Stable</span>',
      '  </label>',
      '  <label class="headless-radio-review-card__row headless-radio-review-card__row--danger">',
      '    <input type="radio" tngRadio name="release-track" [readonly]="true" [invalid]="true" [checked]="selectedTrack() === \'canary\'" class="headless-radio-review-card__control" />',
      '    <span>Canary requires sign-off</span>',
      '  </label>',
      '</fieldset>',
      '',
    ].join('\n'),
    cssCode: [
      '.headless-radio-review-card {',
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
      '.headless-radio-review-card__legend {',
      '  color: var(--tng-semantic-foreground-primary, #0f172a);',
      '  font-weight: 700;',
      '  margin: 0 0 0.2rem;',
      '  padding: 0;',
      '}',
      '',
      '.headless-radio-review-card__row {',
      '  align-items: center;',
      '  display: inline-flex;',
      '  gap: 0.65rem;',
      '}',
      '',
      '.headless-radio-review-card__row--danger {',
      '  color: var(--tng-semantic-accent-danger, #dc2626);',
      '}',
      '',
      '.headless-radio-review-card__control[data-invalid] {',
      '  outline: 2px solid color-mix(in srgb, var(--tng-semantic-accent-danger, #dc2626) 55%, white);',
      '  outline-offset: 2px;',
      '}',
      '',
    ].join('\n'),
  });

  protected readonly reviewTailwindCodeTabs = createCodeTabs({
    baseName: 'headless-radio-review-tailwind',
    tsCode: [
      "import { Component, signal } from '@angular/core';",
      "import { TngRadio } from '@tailng-ui/primitives';",
      '',
      "type ReleaseTrack = 'stable' | 'canary';",
      '',
      '@Component({',
      "  selector: 'app-headless-radio-review-tailwind',",
      '  imports: [TngRadio],',
      "  templateUrl: './headless-radio-review-tailwind.component.html',",
      '})',
      'export class HeadlessRadioReviewTailwindComponent {',
      "  readonly selectedTrack = signal<ReleaseTrack>('stable');",
      '}',
      '',
    ].join('\n'),
    htmlCode: [
      '<fieldset class="grid w-full max-w-[28rem] gap-3 rounded-xl border border-slate-300 bg-white p-4 shadow-sm">',
      '  <legend class="text-sm font-semibold text-slate-900">Release track</legend>',
      '  <label class="inline-flex items-center gap-3 text-sm font-medium text-slate-900">',
      '    <input type="radio" tngRadio name="release-track" [readonly]="true" [checked]="selectedTrack() === \'stable\'" class="h-4 w-4 border-slate-300 text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40" />',
      '    <span>Stable</span>',
      '  </label>',
      '  <label class="inline-flex items-center gap-3 text-sm font-medium text-rose-700">',
      '    <input type="radio" tngRadio name="release-track" [readonly]="true" [invalid]="true" [checked]="selectedTrack() === \'canary\'" class="h-4 w-4 border-rose-400 text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/30" />',
      '    <span>Canary requires sign-off</span>',
      '  </label>',
      '</fieldset>',
      '',
    ].join('\n'),
    cssCode: '/* Tailwind utilities are applied directly in the template. */',
  });

  protected readonly alertPlainCodeTabs = createCodeTabs({
    baseName: 'headless-radio-alert-plain',
    tsCode: [
      "import { Component, signal } from '@angular/core';",
      "import { TngRadio } from '@tailng-ui/primitives';",
      '',
      "type AlertRoute = 'email' | 'slack';",
      '',
      '@Component({',
      "  selector: 'app-headless-radio-alert-plain',",
      '  imports: [TngRadio],',
      "  templateUrl: './headless-radio-alert-plain.component.html',",
      "  styleUrl: './headless-radio-alert-plain.component.css',",
      '})',
      'export class HeadlessRadioAlertPlainComponent {',
      "  readonly selectedRoute = signal<AlertRoute>('email');",
      '',
      '  onRouteChange(route: AlertRoute, event: Event): void {',
      '    const target = event.target;',
      '    if (!(target instanceof HTMLInputElement) || !target.checked) {',
      '      return;',
      '    }',
      '',
      '    this.selectedRoute.set(route);',
      '  }',
      '}',
      '',
    ].join('\n'),
    htmlCode: [
      '<section class="headless-radio-alert-card">',
      '  <h3 class="headless-radio-alert-card__title">Alert route</h3>',
      '  <label class="headless-radio-alert-card__row">',
      '    <input type="radio" tngRadio name="alert-route" [checked]="selectedRoute() === \'email\'" (change)="onRouteChange(\'email\', $event)" class="headless-radio-alert-card__control" />',
      '    <span>Email the release owner</span>',
      '  </label>',
      '  <label class="headless-radio-alert-card__row">',
      '    <input type="radio" tngRadio name="alert-route" [checked]="selectedRoute() === \'slack\'" (change)="onRouteChange(\'slack\', $event)" class="headless-radio-alert-card__control" />',
      '    <span>Post to the incident Slack channel</span>',
      '  </label>',
      '  <p class="headless-radio-alert-card__summary">Selected: {{ selectedRoute() }}</p>',
      '</section>',
      '',
    ].join('\n'),
    cssCode: [
      '.headless-radio-alert-card {',
      '  display: grid;',
      '  gap: 0.8rem;',
      '  inline-size: min(100%, 30rem);',
      '  margin-inline: auto;',
      '  padding: 1rem;',
      '  border: 1px solid var(--tng-semantic-border-subtle, #cbd5e1);',
      '  border-radius: 0.95rem;',
      '  background: var(--tng-semantic-background-base, #ffffff);',
      '}',
      '',
      '.headless-radio-alert-card__title {',
      '  color: var(--tng-semantic-foreground-primary, #0f172a);',
      '  font-size: 1rem;',
      '  font-weight: 700;',
      '  margin: 0;',
      '}',
      '',
      '.headless-radio-alert-card__row {',
      '  align-items: center;',
      '  display: inline-flex;',
      '  gap: 0.65rem;',
      '  color: var(--tng-semantic-foreground-primary, #0f172a);',
      '}',
      '',
      '.headless-radio-alert-card__control {',
      '  accent-color: var(--tng-semantic-accent-brand, #2563eb);',
      '}',
      '',
      '.headless-radio-alert-card__summary {',
      '  color: var(--tng-semantic-foreground-secondary, #64748b);',
      '  font-size: 0.85rem;',
      '  margin: 0;',
      '}',
      '',
    ].join('\n'),
  });

  protected readonly alertTailwindCodeTabs = createCodeTabs({
    baseName: 'headless-radio-alert-tailwind',
    tsCode: [
      "import { Component, signal } from '@angular/core';",
      "import { TngRadio } from '@tailng-ui/primitives';",
      '',
      "type AlertRoute = 'email' | 'slack';",
      '',
      '@Component({',
      "  selector: 'app-headless-radio-alert-tailwind',",
      '  imports: [TngRadio],',
      "  templateUrl: './headless-radio-alert-tailwind.component.html',",
      '})',
      'export class HeadlessRadioAlertTailwindComponent {',
      "  readonly selectedRoute = signal<AlertRoute>('email');",
      '',
      '  onRouteChange(route: AlertRoute, event: Event): void {',
      '    const target = event.target;',
      '    if (!(target instanceof HTMLInputElement) || !target.checked) {',
      '      return;',
      '    }',
      '',
      '    this.selectedRoute.set(route);',
      '  }',
      '}',
      '',
    ].join('\n'),
    htmlCode: [
      '<section class="grid w-full max-w-[30rem] gap-3 rounded-xl border border-slate-300 bg-white p-4 shadow-sm">',
      '  <h3 class="m-0 text-sm font-semibold text-slate-900">Alert route</h3>',
      '  <label class="inline-flex items-center gap-3 text-sm font-medium text-slate-900">',
      '    <input type="radio" tngRadio name="alert-route" [checked]="selectedRoute() === \'email\'" (change)="onRouteChange(\'email\', $event)" class="h-4 w-4 border-slate-300 text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40" />',
      '    <span>Email the release owner</span>',
      '  </label>',
      '  <label class="inline-flex items-center gap-3 text-sm font-medium text-slate-900">',
      '    <input type="radio" tngRadio name="alert-route" [checked]="selectedRoute() === \'slack\'" (change)="onRouteChange(\'slack\', $event)" class="h-4 w-4 border-slate-300 text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40" />',
      '    <span>Post to the incident Slack channel</span>',
      '  </label>',
      '  <p class="m-0 text-xs text-slate-600">Selected: {{ selectedRoute() }}</p>',
      '</section>',
      '',
    ].join('\n'),
    cssCode: '/* Tailwind utilities are applied directly in the template. */',
  });

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }

  protected onPlainBillingPlanChange(plan: BillingPlan, event: unknown): void {
    if (!isCheckedRadioEvent(event)) {
      return;
    }

    this.plainBillingPlan.set(plan);
  }

  protected onTailwindBillingPlanChange(plan: BillingPlan, event: unknown): void {
    if (!isCheckedRadioEvent(event)) {
      return;
    }

    this.tailwindBillingPlan.set(plan);
  }

  protected onPlainAlertRouteChange(route: AlertRoute, event: unknown): void {
    if (!isCheckedRadioEvent(event)) {
      return;
    }

    this.plainAlertRoute.set(route);
  }

  protected onTailwindAlertRouteChange(route: AlertRoute, event: unknown): void {
    if (!isCheckedRadioEvent(event)) {
      return;
    }

    this.tailwindAlertRoute.set(route);
  }
}
