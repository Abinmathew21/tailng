import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import {
  TngCollapsible,
  TngCollapsibleContent,
  TngCollapsibleTrigger,
} from '@tailng-ui/primitives';
import type { DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';
import {
  observeDocsCodeThemeChanges,
  resolveDocsCodeBlockTheme,
} from '../../../../../../shared/util';

const checkoutContentId = 'headless-collapsible-examples-checkout-content';
const checkoutTailwindContentId = 'headless-collapsible-examples-checkout-tailwind-content';
const errorContentId = 'headless-collapsible-examples-error-content';
const errorTailwindContentId = 'headless-collapsible-examples-error-tailwind-content';

@Component({
  selector: 'app-headless-collapsible-examples-page',
  imports: [
    TngCollapsible,
    TngCollapsibleTrigger,
    TngCollapsibleContent,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './collapsible-examples-page.component.html',
  styleUrls: ['./collapsible-examples-page.component.css'],
})
export class HeadlessCollapsibleExamplesPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  public readonly checkoutContentId = checkoutContentId;
  public readonly checkoutTailwindContentId = checkoutTailwindContentId;
  public readonly errorContentId = errorContentId;
  public readonly errorTailwindContentId = errorTailwindContentId;
  public readonly checkoutOpen = signal(true);
  public readonly checkoutTailwindOpen = signal(true);
  public readonly errorOpen = signal(true);
  public readonly errorTailwindOpen = signal(true);

  protected readonly checkoutPlainCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'headless-collapsible-checkout-plain.component.html',
      code: [
    '<section tngCollapsible class="headless-collapsible-example-shell" [open]="checkoutOpen()">',
    '  <button',
    '    tngCollapsibleTrigger',
    '    class="headless-collapsible-example-trigger"',
    '    [open]="checkoutOpen()"',
    '    [contentId]="checkoutContentId"',
    '    (click)="checkoutOpen.set(!checkoutOpen())"',
    '  >',
    '    Checkout progress',
    '  </button>',
    '',
    '  <ol',
    '    tngCollapsibleContent',
    '    class="headless-collapsible-example-list"',
    '    [id]="checkoutContentId"',
    '    [open]="checkoutOpen()"',
    '    aria-label="Checkout progress"',
    '  >',
    '    <li class="headless-collapsible-example-item is-complete"><span class="dot">✓</span> Cart</li>',
    '    <li class="headless-collapsible-example-item is-current"><span class="dot">2</span> Shipping</li>',
    '    <li class="headless-collapsible-example-item"><span class="dot">3</span> Payment</li>',
    '  </ol>',
    '</section>',
    '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'headless-collapsible-checkout-plain.component.css',
      code: '/* Uses the owner-authored classes from the page stylesheet. */',
    },
  ]);

  protected readonly checkoutTailwindCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'headless-collapsible-checkout-tailwind.component.html',
      code: [
        '<section tngCollapsible class="overflow-hidden rounded-2xl border border-[var(--tng-semantic-border-subtle)] bg-[var(--tng-semantic-background-surface)]" [open]="checkoutOpen()">',
        '  <button',
        '    tngCollapsibleTrigger',
        '    class="flex w-full items-center justify-between border-0 bg-transparent px-4 py-3 text-left font-medium text-[var(--tng-semantic-foreground-primary)]"',
        '    [open]="checkoutOpen()"',
        '    [contentId]="checkoutContentId"',
        '    (click)="checkoutOpen.set(!checkoutOpen())"',
        '  >',
        '    Checkout progress',
        '    <span class="text-sm text-[var(--tng-semantic-foreground-muted)]">{{ checkoutOpen() ? "Hide" : "Show" }}</span>',
        '  </button>',
        '',
        '  <ol',
        '    tngCollapsibleContent',
        '    class="m-0 grid list-none gap-3 border-t border-[var(--tng-semantic-border-subtle)] bg-[var(--tng-semantic-background-canvas)] px-4 py-4"',
        '    [id]="checkoutContentId"',
        '    [open]="checkoutOpen()"',
        '    aria-label="Checkout progress"',
        '  >',
        '    <li class="flex items-center gap-3 rounded-xl border border-[color-mix(in_srgb,var(--tng-semantic-accent-success)_55%,transparent)] px-3 py-2 text-[var(--tng-semantic-foreground-secondary)]"><span class="grid h-7 w-7 place-items-center rounded-full bg-[var(--tng-semantic-accent-success)] text-white">✓</span> Cart</li>',
        '    <li class="flex items-center gap-3 rounded-xl border border-[color-mix(in_srgb,var(--tng-semantic-accent-brand)_55%,transparent)] bg-[color-mix(in_srgb,var(--tng-semantic-accent-brand)_12%,var(--tng-semantic-background-canvas))] px-3 py-2 text-[var(--tng-semantic-foreground-primary)]"><span class="grid h-7 w-7 place-items-center rounded-full bg-[var(--tng-semantic-accent-brand)] text-white">2</span> Shipping</li>',
        '    <li class="flex items-center gap-3 rounded-xl border border-[var(--tng-semantic-border-subtle)] px-3 py-2 text-[var(--tng-semantic-foreground-secondary)]"><span class="grid h-7 w-7 place-items-center rounded-full bg-[var(--tng-semantic-background-muted)] text-[var(--tng-semantic-foreground-secondary)]">3</span> Payment</li>',
        '  </ol>',
        '</section>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'headless-collapsible-checkout-tailwind.component.css',
      code: '/* Tailwind utilities are applied directly in the template. */',
    },
  ]);

  protected readonly errorPlainCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'headless-collapsible-error-plain.component.html',
      code: [
    '<section tngCollapsible class="headless-collapsible-example-shell" [open]="errorOpen()">',
    '  <button',
    '    tngCollapsibleTrigger',
    '    class="headless-collapsible-example-trigger"',
    '    [open]="errorOpen()"',
    '    [contentId]="errorContentId"',
    '    (click)="errorOpen.set(!errorOpen())"',
    '  >',
    '    Onboarding checklist',
    '  </button>',
    '',
    '  <ol',
    '    tngCollapsibleContent',
    '    class="headless-collapsible-example-list"',
    '    [id]="errorContentId"',
    '    [open]="errorOpen()"',
    '    aria-label="Onboarding checklist"',
    '  >',
    '    <li class="headless-collapsible-example-item is-complete"><span class="dot">✓</span> Profile</li>',
    '    <li class="headless-collapsible-example-item is-error"><span class="dot">2</span> Billing</li>',
    '    <li class="headless-collapsible-example-item"><span class="dot">3</span> Team invite</li>',
    '  </ol>',
    '</section>',
    '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'headless-collapsible-error-plain.component.css',
      code: '/* Uses the owner-authored classes from the page stylesheet. */',
    },
  ]);

  protected readonly errorTailwindCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'headless-collapsible-error-tailwind.component.html',
      code: [
        '<section tngCollapsible class="overflow-hidden rounded-2xl border border-[var(--tng-semantic-border-subtle)] bg-[var(--tng-semantic-background-surface)]" [open]="errorOpen()">',
        '  <button',
        '    tngCollapsibleTrigger',
        '    class="flex w-full items-center justify-between border-0 bg-transparent px-4 py-3 text-left font-medium text-[var(--tng-semantic-foreground-primary)]"',
        '    [open]="errorOpen()"',
        '    [contentId]="errorContentId"',
        '    (click)="errorOpen.set(!errorOpen())"',
        '  >',
        '    Onboarding checklist',
        '    <span class="text-sm text-[var(--tng-semantic-foreground-muted)]">{{ errorOpen() ? "Hide" : "Show" }}</span>',
        '  </button>',
        '',
        '  <ol',
        '    tngCollapsibleContent',
        '    class="m-0 grid list-none gap-3 border-t border-[var(--tng-semantic-border-subtle)] bg-[var(--tng-semantic-background-canvas)] px-4 py-4"',
        '    [id]="errorContentId"',
        '    [open]="errorOpen()"',
        '    aria-label="Onboarding checklist"',
        '  >',
        '    <li class="flex items-center gap-3 rounded-xl border border-[color-mix(in_srgb,var(--tng-semantic-accent-success)_55%,transparent)] px-3 py-2 text-[var(--tng-semantic-foreground-secondary)]"><span class="grid h-7 w-7 place-items-center rounded-full bg-[var(--tng-semantic-accent-success)] text-white">✓</span> Profile</li>',
        '    <li class="flex items-center gap-3 rounded-xl border border-[color-mix(in_srgb,var(--tng-semantic-accent-danger)_55%,transparent)] bg-[color-mix(in_srgb,var(--tng-semantic-accent-danger)_12%,var(--tng-semantic-background-canvas))] px-3 py-2 text-[var(--tng-semantic-foreground-primary)]"><span class="grid h-7 w-7 place-items-center rounded-full bg-[var(--tng-semantic-accent-danger)] text-white">2</span> Billing</li>',
        '    <li class="flex items-center gap-3 rounded-xl border border-[var(--tng-semantic-border-subtle)] px-3 py-2 text-[var(--tng-semantic-foreground-secondary)]"><span class="grid h-7 w-7 place-items-center rounded-full bg-[var(--tng-semantic-background-muted)] text-[var(--tng-semantic-foreground-secondary)]">3</span> Team invite</li>',
        '  </ol>',
        '</section>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'headless-collapsible-error-tailwind.component.css',
      code: '/* Tailwind utilities are applied directly in the template. */',
    },
  ]);

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
