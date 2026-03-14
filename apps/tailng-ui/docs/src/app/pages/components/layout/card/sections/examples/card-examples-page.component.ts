import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import {
  TngCardActionsComponent,
  TngCardComponent,
  TngCardContentComponent,
  TngCardDescriptionComponent,
  TngCardDividerComponent,
  TngCardFooterComponent,
  TngCardHeaderComponent,
  TngCardLinkComponent,
  TngCardMediaComponent,
  TngCardTitleComponent,
} from '@tailng-ui/components';
import {
  TngCard as TngCardPrimitive,
  TngCardActions as TngCardActionsPrimitive,
  TngCardContent as TngCardContentPrimitive,
  TngCardDescription as TngCardDescriptionPrimitive,
  TngCardDivider as TngCardDividerPrimitive,
  TngCardFooter as TngCardFooterPrimitive,
  TngCardHeader as TngCardHeaderPrimitive,
  TngCardLink as TngCardLinkPrimitive,
  TngCardMedia as TngCardMediaPrimitive,
  TngCardTitle as TngCardTitlePrimitive,
} from '@tailng-ui/primitives';
import { type DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';

@Component({
  selector: 'app-card-examples-page',
  imports: [
    TngCardPrimitive,
    TngCardHeaderPrimitive,
    TngCardTitlePrimitive,
    TngCardDescriptionPrimitive,
    TngCardContentPrimitive,
    TngCardMediaPrimitive,
    TngCardFooterPrimitive,
    TngCardActionsPrimitive,
    TngCardDividerPrimitive,
    TngCardLinkPrimitive,
    TngCardComponent,
    TngCardHeaderComponent,
    TngCardTitleComponent,
    TngCardDescriptionComponent,
    TngCardContentComponent,
    TngCardMediaComponent,
    TngCardFooterComponent,
    TngCardActionsComponent,
    TngCardDividerComponent,
    TngCardLinkComponent,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './card-examples-page.component.html',
  styleUrl: './card-examples-page.component.css',
})
export class CardExamplesPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);
  private readonly colorSchemeObserver = this.observeCodeThemeChanges();

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    this.resolveCodeBlockTheme(),
  );

  protected readonly mediaHeadlessCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'card-examples-media-headless.component.ts',
      code: [
        "import { TngCard, TngCardHeader, TngCardTitle, TngCardDescription, TngCardMedia, TngCardContent, TngCardFooter, TngCardActions } from '@tailng-ui/primitives';",
        '',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'card-examples-media-headless.component.html',
      code: [
        '<article tngCard class="card-example card-example--headless">',
        '  <div tngCardMedia><div class="card-example__media-placeholder" aria-hidden="true">AV</div></div>',
        '  <header tngCardHeader>',
        '    <h3 tngCardTitle>Ava Mathews</h3>',
        '    <p tngCardDescription>Design systems engineer</p>',
        '  </header>',
        '  <section tngCardContent>',
        '    <p>Building reusable interaction patterns across product teams.</p>',
        '  </section>',
        '  <footer tngCardFooter>',
        '    <div tngCardActions>',
        '      <button type="button">Message</button>',
        '      <button type="button">Follow</button>',
        '    </div>',
        '  </footer>',
        '</article>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'card-examples-media-headless.component.css',
      code: [
        '.card-example--headless {',
        '  border: 1px solid var(--tng-semantic-border-subtle);',
        '  border-radius: 0.9rem;',
        '  padding: 1rem;',
        '}',
        '',
      ].join('\n'),
    },
  ]);

  protected readonly mediaPlainCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'card-examples-media-plain-css.component.ts',
      code: [
        "import { TngCardComponent, TngCardMediaComponent, TngCardHeaderComponent, TngCardTitleComponent, TngCardDescriptionComponent, TngCardContentComponent, TngCardFooterComponent, TngCardActionsComponent } from '@tailng-ui/components';",
        '',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'card-examples-media-plain-css.component.html',
      code: [
        '<div class="card-example-shell card-example-shell--plain">',
        '  <tng-card variant="outline" tone="neutral" interactive>',
        '    <tng-card-media><div class="card-example__media-placeholder" aria-hidden="true">AV</div></tng-card-media>',
        '    <tng-card-header>',
        '      <tng-card-title>Ava Mathews</tng-card-title>',
        '      <tng-card-description>Design systems engineer</tng-card-description>',
        '    </tng-card-header>',
        '    <tng-card-content>',
        '      <p>Building reusable interaction patterns across product teams.</p>',
        '    </tng-card-content>',
        '    <tng-card-footer>',
        '      <tng-card-actions>',
        '        <button type="button">Message</button>',
        '        <button type="button">Follow</button>',
        '      </tng-card-actions>',
        '    </tng-card-footer>',
        '  </tng-card>',
        '</div>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'card-examples-media-plain-css.component.css',
      code: [
        '.card-example-shell--plain {',
        '  border: 1px solid var(--tng-semantic-border-subtle);',
        '  border-radius: 0.9rem;',
        '  padding: 1rem;',
        '}',
        '',
      ].join('\n'),
    },
  ]);

  protected readonly mediaTailwindCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'card-examples-media-tailwind.component.ts',
      code: [
        "import { TngCardComponent, TngCardMediaComponent, TngCardHeaderComponent, TngCardTitleComponent, TngCardDescriptionComponent, TngCardContentComponent, TngCardFooterComponent, TngCardActionsComponent } from '@tailng-ui/components';",
        '',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'card-examples-media-tailwind.component.html',
      code: [
        '<div class="rounded-xl border border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">',
        '  <tng-card variant="outline" tone="primary" padding="lg" interactive>',
        '    <tng-card-media><div class="card-example__media-placeholder" aria-hidden="true">AV</div></tng-card-media>',
        '    <tng-card-header>',
        '      <tng-card-title>Ava Mathews</tng-card-title>',
        '      <tng-card-description>Design systems engineer</tng-card-description>',
        '    </tng-card-header>',
        '    <tng-card-content>',
        '      <p class="text-sm text-slate-600 dark:text-slate-300">',
        '        Building reusable interaction patterns across product teams.',
        '      </p>',
        '    </tng-card-content>',
        '    <tng-card-footer>',
        '      <tng-card-actions>',
        '        <button type="button">Message</button>',
        '        <button type="button">Follow</button>',
        '      </tng-card-actions>',
        '    </tng-card-footer>',
        '  </tng-card>',
        '</div>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'card-examples-media-tailwind.component.css',
      code: '/* Tailwind utilities are applied directly in the template. */',
    },
  ]);

  protected readonly actionHeadlessCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'card-examples-actions-headless.component.ts',
      code: [
        "import { TngCard, TngCardHeader, TngCardTitle, TngCardDescription, TngCardContent, TngCardDivider, TngCardFooter, TngCardLink, TngCardActions } from '@tailng-ui/primitives';",
        '',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'card-examples-actions-headless.component.html',
      code: [
        '<article tngCard class="card-example card-example--headless">',
        '  <header tngCardHeader>',
        '    <h3 tngCardTitle>Billing reminder</h3>',
        '    <p tngCardDescription>Invoice #3912 is due in 2 days.</p>',
        '  </header>',
        '  <section tngCardContent>',
        '    <p>Assign owner and send reminder before due date.</p>',
        '  </section>',
        '  <hr tngCardDivider />',
        '  <footer tngCardFooter>',
        '    <a tngCardLink href="#invoice">Open invoice</a>',
        '    <div tngCardActions>',
        '      <button type="button">Snooze</button>',
        '      <button type="button">Assign owner</button>',
        '    </div>',
        '  </footer>',
        '</article>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'card-examples-actions-headless.component.css',
      code: [
        '.card-example [data-slot="card-link"] {',
        '  color: var(--tng-semantic-accent-brand);',
        '  font-weight: 600;',
        '}',
        '',
      ].join('\n'),
    },
  ]);

  protected readonly actionPlainCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'card-examples-actions-plain-css.component.ts',
      code: [
        "import { TngCardComponent, TngCardHeaderComponent, TngCardTitleComponent, TngCardDescriptionComponent, TngCardContentComponent, TngCardDividerComponent, TngCardFooterComponent, TngCardLinkComponent, TngCardActionsComponent } from '@tailng-ui/components';",
        '',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'card-examples-actions-plain-css.component.html',
      code: [
        '<div class="card-example-shell card-example-shell--plain">',
        '  <tng-card variant="outline" tone="warning" padding="md">',
        '    <tng-card-header>',
        '      <tng-card-title>Billing reminder</tng-card-title>',
        '      <tng-card-description>Invoice #3912 is due in 2 days.</tng-card-description>',
        '    </tng-card-header>',
        '    <tng-card-content>',
        '      <p>Assign owner and send reminder before due date.</p>',
        '    </tng-card-content>',
        '    <tng-card-divider></tng-card-divider>',
        '    <tng-card-footer>',
        '      <tng-card-link href="#invoice">Open invoice</tng-card-link>',
        '      <tng-card-actions>',
        '        <button type="button">Snooze</button>',
        '        <button type="button">Assign owner</button>',
        '      </tng-card-actions>',
        '    </tng-card-footer>',
        '  </tng-card>',
        '</div>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'card-examples-actions-plain-css.component.css',
      code: [
        '.card-example-shell--plain [data-slot="card-link"] {',
        '  color: var(--tng-semantic-accent-brand);',
        '}',
        '',
      ].join('\n'),
    },
  ]);

  protected readonly actionTailwindCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'card-examples-actions-tailwind.component.ts',
      code: [
        "import { TngCardComponent, TngCardHeaderComponent, TngCardTitleComponent, TngCardDescriptionComponent, TngCardContentComponent, TngCardDividerComponent, TngCardFooterComponent, TngCardLinkComponent, TngCardActionsComponent } from '@tailng-ui/components';",
        '',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'card-examples-actions-tailwind.component.html',
      code: [
        '<div class="rounded-xl border border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">',
        '  <tng-card variant="outline" tone="warning" padding="md" interactive>',
        '    <tng-card-header>',
        '      <tng-card-title>Billing reminder</tng-card-title>',
        '      <tng-card-description>Invoice #3912 is due in 2 days.</tng-card-description>',
        '    </tng-card-header>',
        '    <tng-card-content>',
        '      <p class="text-sm text-slate-600 dark:text-slate-300">',
        '        Assign owner and send reminder before due date.',
        '      </p>',
        '    </tng-card-content>',
        '    <tng-card-divider></tng-card-divider>',
        '    <tng-card-footer>',
        '      <tng-card-link href="#invoice">Open invoice</tng-card-link>',
        '      <tng-card-actions>',
        '        <button type="button">Snooze</button>',
        '        <button type="button">Assign owner</button>',
        '      </tng-card-actions>',
        '    </tng-card-footer>',
        '  </tng-card>',
        '</div>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'card-examples-actions-tailwind.component.css',
      code: '/* Tailwind utilities are applied directly in the template. */',
    },
  ]);

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }

  private observeCodeThemeChanges(): MutationObserver | null {
    const mutationObserverCtor = this.documentRef.defaultView?.MutationObserver;
    if (mutationObserverCtor === undefined) {
      return null;
    }

    const observer = new mutationObserverCtor(() => {
      this.codeBlockTheme.set(this.resolveCodeBlockTheme());
    });

    observer.observe(this.documentRef.documentElement, {
      attributeFilter: ['style', 'class'],
      attributes: true,
    });

    return observer;
  }

  private resolveCodeBlockTheme(): 'github-dark' | 'github-light' {
    const root = this.documentRef.documentElement;
    const inlineColorScheme = root.style.getPropertyValue('color-scheme').trim().toLowerCase();
    if (inlineColorScheme.includes('dark')) {
      return 'github-dark';
    }

    const computedColorScheme = this.documentRef.defaultView
      ?.getComputedStyle(root)
      .getPropertyValue('color-scheme')
      .trim()
      .toLowerCase();

    return computedColorScheme?.includes('dark') ? 'github-dark' : 'github-light';
  }
}
