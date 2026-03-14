import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import {
  TngCardActionsComponent,
  TngCardComponent,
  TngCardContentComponent,
  TngCardDescriptionComponent,
  TngCardFooterComponent,
  TngCardHeaderComponent,
  TngCardTitleComponent,
  TngCodeBlockComponent,
} from '@tailng-ui/components';
import {
  TngCard as TngCardPrimitive,
  TngCardActions as TngCardActionsPrimitive,
  TngCardContent as TngCardContentPrimitive,
  TngCardDescription as TngCardDescriptionPrimitive,
  TngCardFooter as TngCardFooterPrimitive,
  TngCardHeader as TngCardHeaderPrimitive,
  TngCardTitle as TngCardTitlePrimitive,
} from '@tailng-ui/primitives';
import { type DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';

@Component({
  selector: 'app-card-overview-page',
  imports: [
    TngCodeBlockComponent,
    TngCardPrimitive,
    TngCardHeaderPrimitive,
    TngCardTitlePrimitive,
    TngCardDescriptionPrimitive,
    TngCardContentPrimitive,
    TngCardFooterPrimitive,
    TngCardActionsPrimitive,
    TngCardComponent,
    TngCardHeaderComponent,
    TngCardTitleComponent,
    TngCardDescriptionComponent,
    TngCardContentComponent,
    TngCardFooterComponent,
    TngCardActionsComponent,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './card-overview-page.component.html',
  styleUrl: './card-overview-page.component.css',
})
export class CardOverviewPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);
  private readonly colorSchemeObserver = this.observeCodeThemeChanges();

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    this.resolveCodeBlockTheme(),
  );

  protected readonly primitiveImportCode = [
    'import {',
    '  TngCard,',
    '  TngCardHeader,',
    '  TngCardTitle,',
    '  TngCardDescription,',
    '  TngCardContent,',
    '  TngCardFooter,',
    '  TngCardActions,',
    '} from \'@tailng-ui/primitives\';',
    '',
  ].join('\n');

  protected readonly componentImportCode = [
    'import {',
    '  TngCardComponent,',
    '  TngCardHeaderComponent,',
    '  TngCardTitleComponent,',
    '  TngCardDescriptionComponent,',
    '  TngCardContentComponent,',
    '  TngCardFooterComponent,',
    '  TngCardActionsComponent,',
    '} from \'@tailng-ui/components\';',
    '',
  ].join('\n');

  protected readonly headlessCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'card-overview-headless.component.ts',
      code: this.primitiveImportCode,
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'card-overview-headless.component.html',
      code: [
        '<article tngCard class="card-preview card-preview--headless">',
        '  <header tngCardHeader class="card-preview__header">',
        '    <h3 tngCardTitle>Release status</h3>',
        '    <p tngCardDescription>Production rollout is complete and monitoring is stable.</p>',
        '  </header>',
        '',
        '  <section tngCardContent class="card-preview__content">',
        '    <ul>',
        '      <li>Latency is below 120ms across all regions.</li>',
        '      <li>Error rate remained under 0.2% for the last hour.</li>',
        '    </ul>',
        '  </section>',
        '',
        '  <footer tngCardFooter class="card-preview__footer">',
        '    <div tngCardActions>',
        '      <button type="button">View report</button>',
        '      <button type="button">Promote</button>',
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
      title: 'card-overview-headless.component.css',
      code: [
        '.card-preview--headless {',
        '  border: 1px solid var(--tng-semantic-border-subtle);',
        '  border-radius: 0.9rem;',
        '  padding: 1rem;',
        '}',
        '',
        '.card-preview__content ul {',
        '  margin: 0;',
        '  padding-left: 1rem;',
        '}',
        '',
      ].join('\n'),
    },
  ]);

  protected readonly plainCssCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'card-overview-plain-css.component.ts',
      code: this.componentImportCode,
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'card-overview-plain-css.component.html',
      code: [
        '<div class="card-preview-shell card-preview-shell--plain">',
        '  <tng-card variant="outline" tone="info" padding="md">',
        '    <tng-card-header>',
        '      <tng-card-title>Release status</tng-card-title>',
        '      <tng-card-description>Production rollout is complete and monitoring is stable.</tng-card-description>',
        '    </tng-card-header>',
        '    <tng-card-content>',
        '      <ul>',
        '        <li>Latency is below 120ms across all regions.</li>',
        '        <li>Error rate remained under 0.2% for the last hour.</li>',
        '      </ul>',
        '    </tng-card-content>',
        '    <tng-card-footer>',
        '      <tng-card-actions>',
        '        <button type="button">View report</button>',
        '        <button type="button">Promote</button>',
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
      title: 'card-overview-plain-css.component.css',
      code: [
        '.card-preview-shell--plain {',
        '  border: 1px solid var(--tng-semantic-border-subtle);',
        '  border-radius: 0.9rem;',
        '  padding: 1rem;',
        '}',
        '',
      ].join('\n'),
    },
  ]);

  protected readonly tailwindCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'card-overview-tailwind.component.ts',
      code: this.componentImportCode,
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'card-overview-tailwind.component.html',
      code: [
        '<div class="rounded-xl border border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">',
        '  <tng-card variant="outline" tone="primary" padding="lg" interactive>',
        '    <tng-card-header>',
        '      <tng-card-title>Release status</tng-card-title>',
        '      <tng-card-description>Production rollout is complete and monitoring is stable.</tng-card-description>',
        '    </tng-card-header>',
        '    <tng-card-content>',
        '      <ul class="space-y-2 pl-4">',
        '        <li>Latency is below 120ms across all regions.</li>',
        '        <li>Error rate remained under 0.2% for the last hour.</li>',
        '      </ul>',
        '    </tng-card-content>',
        '    <tng-card-footer>',
        '      <tng-card-actions>',
        '        <button type="button">View report</button>',
        '        <button type="button">Promote</button>',
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
      title: 'card-overview-tailwind.component.css',
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
