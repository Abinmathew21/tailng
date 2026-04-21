import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import {
  TngCard,
  TngCardActions,
  TngCardContent,
  TngCardDescription,
  TngCardDivider,
  TngCardFooter,
  TngCardHeader,
  TngCardLink,
  TngCardMedia,
  TngCardTitle,
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

@Component({
  selector: 'app-headless-card-examples-page',
  imports: [
    TngCard,
    TngCardHeader,
    TngCardTitle,
    TngCardDescription,
    TngCardContent,
    TngCardFooter,
    TngCardActions,
    TngCardMedia,
    TngCardDivider,
    TngCardLink,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './card-examples-page.component.html',
  styleUrl: './card-examples-page.component.css',
})
export class HeadlessCardExamplesPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly announcementPlainCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'headless-card-editorial-plain.component.html',
      code: [
        '<article tngCard class="headless-card-example headless-card-example--announcement">',
        '  <header tngCardHeader>',
        '    <h3 tngCardTitle>Editorial launch note</h3>',
        '    <p tngCardDescription>Docs, onboarding, and migration guides are ready for rollout.</p>',
        '  </header>',
        '  <section tngCardContent>',
        '    <p>Coordinate publishing across docs, support, and customer success before the announcement goes live.</p>',
        '  </section>',
        '  <footer tngCardFooter class="headless-card-example__footer">',
        '    <div tngCardActions>',
        '      <button type="button" class="headless-card-example__button">Review copy</button>',
        '      <button type="button" class="headless-card-example__button headless-card-example__button--primary">Publish</button>',
        '    </div>',
        '  </footer>',
        '</article>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'headless-card-editorial-plain.component.css',
      code: '/* Uses the owner-authored classes shown in the live example. */',
    },
  ]);

  protected readonly announcementTailwindCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'headless-card-editorial-tailwind.component.html',
      code: [
        '<article tngCard class="grid gap-4 rounded-3xl border border-amber-300 bg-gradient-to-br from-amber-50 via-white to-rose-50 p-5 shadow-sm dark:border-amber-800 dark:from-amber-950/40 dark:via-slate-950 dark:to-rose-950/30">',
        '  <header tngCardHeader class="grid gap-1">',
        '    <h3 tngCardTitle class="m-0 text-lg font-semibold text-slate-950 dark:text-slate-50">Editorial launch note</h3>',
        '    <p tngCardDescription class="m-0 text-sm text-slate-600 dark:text-slate-300">Docs, onboarding, and migration guides are ready for rollout.</p>',
        '  </header>',
        '  <section tngCardContent class="text-sm leading-6 text-slate-700 dark:text-slate-200">',
        '    Coordinate publishing across docs, support, and customer success before the announcement goes live.',
        '  </section>',
        '  <footer tngCardFooter class="flex flex-wrap justify-end gap-2">',
        '    <div tngCardActions class="flex flex-wrap gap-2">',
        '      <button type="button" class="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 dark:border-slate-700 dark:text-slate-200">Review copy</button>',
        '      <button type="button" class="rounded-lg border border-rose-500 bg-rose-500 px-3 py-2 text-sm font-medium text-white">Publish</button>',
        '    </div>',
        '  </footer>',
        '</article>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'headless-card-editorial-tailwind.component.css',
      code: '/* Tailwind utilities are applied directly in the template. */',
    },
  ]);

  protected readonly profilePlainCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'headless-card-profile-plain.component.html',
      code: [
        '<article tngCard class="headless-card-example">',
        '  <div tngCardMedia class="headless-card-example__media">',
        '    <div class="headless-card-example__media-placeholder" aria-hidden="true">AV</div>',
        '  </div>',
        '  <header tngCardHeader>',
        '    <h3 tngCardTitle>Ava Mathews</h3>',
        '    <p tngCardDescription>Design systems engineer</p>',
        '  </header>',
        '  <section tngCardContent>',
        '    <p>Building reusable interaction patterns across product teams.</p>',
        '  </section>',
        '  <footer tngCardFooter class="headless-card-example__footer">',
        '    <div tngCardActions>',
        '      <button type="button" class="headless-card-example__button">Message</button>',
        '      <button type="button" class="headless-card-example__button headless-card-example__button--primary">Follow</button>',
        '    </div>',
        '  </footer>',
        '</article>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'headless-card-profile-plain.component.css',
      code: '/* Uses the owner-authored classes shown in the live example. */',
    },
  ]);

  protected readonly profileTailwindCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'headless-card-profile-tailwind.component.html',
      code: [
        '<article tngCard class="grid gap-4 rounded-2xl border border-slate-300 bg-white/95 p-5 shadow-sm dark:border-slate-700 dark:bg-slate-950/70">',
        '  <div tngCardMedia class="overflow-hidden rounded-2xl">',
        '    <div class="flex aspect-[16/7] items-center justify-center bg-gradient-to-br from-sky-200 via-cyan-100 to-emerald-100 text-lg font-black tracking-[0.18em] text-slate-900 dark:from-sky-900/60 dark:via-cyan-900/40 dark:to-emerald-900/40 dark:text-slate-50">AV</div>',
        '  </div>',
        '  <header tngCardHeader class="grid gap-1">',
        '    <h3 tngCardTitle class="m-0 text-lg font-semibold text-slate-950 dark:text-slate-50">Ava Mathews</h3>',
        '    <p tngCardDescription class="m-0 text-sm text-slate-600 dark:text-slate-300">Design systems engineer</p>',
        '  </header>',
        '  <section tngCardContent class="text-sm leading-6 text-slate-700 dark:text-slate-200">',
        '    Building reusable interaction patterns across product teams.',
        '  </section>',
        '  <footer tngCardFooter class="flex flex-wrap justify-end gap-2">',
        '    <div tngCardActions class="flex flex-wrap gap-2">',
        '      <button type="button" class="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 dark:border-slate-700 dark:text-slate-200">Message</button>',
        '      <button type="button" class="rounded-lg border border-sky-500 bg-sky-500 px-3 py-2 text-sm font-medium text-white">Follow</button>',
        '    </div>',
        '  </footer>',
        '</article>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'headless-card-profile-tailwind.component.css',
      code: '/* Tailwind utilities are applied directly in the template. */',
    },
  ]);

  protected readonly actionPlainCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'headless-card-actions-plain.component.html',
      code: [
        '<article tngCard class="headless-card-example">',
        '  <header tngCardHeader>',
        '    <h3 tngCardTitle>Billing reminder</h3>',
        '    <p tngCardDescription>Invoice #3912 is due in 2 days.</p>',
        '  </header>',
        '  <section tngCardContent>',
        '    <p>Assign owner and send reminder before the due date.</p>',
        '  </section>',
        '  <hr tngCardDivider />',
        '  <footer tngCardFooter class="headless-card-example__footer">',
        '    <a tngCardLink href="#invoice" class="headless-card-example__link">Open invoice</a>',
        '    <div tngCardActions>',
        '      <button type="button" class="headless-card-example__button">Snooze</button>',
        '      <button type="button" class="headless-card-example__button headless-card-example__button--primary">Assign owner</button>',
        '    </div>',
        '  </footer>',
        '</article>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'headless-card-actions-plain.component.css',
      code: '/* Uses the owner-authored classes shown in the live example. */',
    },
  ]);

  protected readonly actionTailwindCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'headless-card-actions-tailwind.component.html',
      code: [
        '<article tngCard class="grid gap-4 rounded-2xl border border-amber-300 bg-white/95 p-5 shadow-sm dark:border-amber-800 dark:bg-slate-950/70">',
        '  <header tngCardHeader class="grid gap-1">',
        '    <h3 tngCardTitle class="m-0 text-lg font-semibold text-slate-950 dark:text-slate-50">Billing reminder</h3>',
        '    <p tngCardDescription class="m-0 text-sm text-slate-600 dark:text-slate-300">Invoice #3912 is due in 2 days.</p>',
        '  </header>',
        '  <section tngCardContent class="text-sm leading-6 text-slate-700 dark:text-slate-200">',
        '    Assign owner and send reminder before the due date.',
        '  </section>',
        '  <hr tngCardDivider class="border-0 border-t border-slate-200 dark:border-slate-800" />',
        '  <footer tngCardFooter class="flex flex-wrap items-center justify-between gap-3">',
        '    <a tngCardLink href="#invoice" class="text-sm font-semibold text-amber-700 dark:text-amber-300">Open invoice</a>',
        '    <div tngCardActions class="flex flex-wrap gap-2">',
        '      <button type="button" class="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 dark:border-slate-700 dark:text-slate-200">Snooze</button>',
        '      <button type="button" class="rounded-lg border border-amber-500 bg-amber-500 px-3 py-2 text-sm font-medium text-slate-950">Assign owner</button>',
        '    </div>',
        '  </footer>',
        '</article>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'headless-card-actions-tailwind.component.css',
      code: '/* Tailwind utilities are applied directly in the template. */',
    },
  ]);

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
