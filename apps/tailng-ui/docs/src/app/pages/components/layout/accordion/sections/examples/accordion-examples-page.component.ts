import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import {
  TngAccordionComponent,
  TngAccordionItemComponent,
  TngAccordionPanelComponent,
  TngAccordionTriggerComponent,
} from '@tailng-ui/components';
import {
  TngAccordion as TngAccordionPrimitive,
  TngAccordionItem as TngAccordionItemPrimitive,
  TngAccordionPanel as TngAccordionPanelPrimitive,
  TngAccordionTrigger as TngAccordionTriggerPrimitive,
} from '@tailng-ui/primitives';
import { type DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';

@Component({
  selector: 'app-accordion-examples-page',
  imports: [
    TngAccordionComponent,
    TngAccordionItemComponent,
    TngAccordionTriggerComponent,
    TngAccordionPanelComponent,
    TngAccordionPrimitive,
    TngAccordionItemPrimitive,
    TngAccordionTriggerPrimitive,
    TngAccordionPanelPrimitive,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './accordion-examples-page.component.html',
  styleUrl: './accordion-examples-page.component.css',
})
export class AccordionExamplesPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);
  private readonly colorSchemeObserver = this.observeCodeThemeChanges();

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    this.resolveCodeBlockTheme(),
  );

  protected readonly faqHeadlessCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'accordion-examples-faq-headless.component.ts',
      code: ["readonly defaultOpen = 'license';", ''].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'accordion-examples-faq-headless.component.html',
      code: [
        '<section tngAccordion [defaultValue]="\'license\'" class="accordion-example-root">',
        '  <article tngAccordionItem value="license" class="accordion-example-item">',
        '    <button tngAccordionTrigger type="button" class="accordion-example-trigger">License</button>',
        '    <div tngAccordionPanel class="accordion-example-panel">MIT with optional enterprise add-ons.</div>',
        '  </article>',
        '  <article tngAccordionItem value="support" class="accordion-example-item">',
        '    <button tngAccordionTrigger type="button" class="accordion-example-trigger">Support window</button>',
        '    <div tngAccordionPanel class="accordion-example-panel">Community and commercial channels.</div>',
        '  </article>',
        '</section>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'accordion-examples-faq-headless.component.css',
      code: [
        '.accordion-example-trigger[data-state="open"] {',
        '  color: var(--tng-semantic-accent-brand);',
        '}',
        '',
      ].join('\n'),
    },
  ]);

  protected readonly faqPlainCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'accordion-examples-faq-plain-css.component.ts',
      code: ["readonly defaultOpen = 'timeline';", ''].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'accordion-examples-faq-plain-css.component.html',
      code: [
        '<tng-accordion ariaLabel="Project FAQ" [defaultValue]="\'timeline\'">',
        '  <tng-accordion-item value="timeline">',
        '    <tng-accordion-trigger class="accordion-example-trigger">Timeline</tng-accordion-trigger>',
        '    <tng-accordion-panel class="accordion-example-panel">Roadmap and release cadence.</tng-accordion-panel>',
        '  </tng-accordion-item>',
        '  <tng-accordion-item value="governance">',
        '    <tng-accordion-trigger class="accordion-example-trigger">Governance</tng-accordion-trigger>',
        '    <tng-accordion-panel class="accordion-example-panel">Contribution and review policy.</tng-accordion-panel>',
        '  </tng-accordion-item>',
        '</tng-accordion>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'accordion-examples-faq-plain-css.component.css',
      code: [
        '.accordion-example-panel {',
        '  color: var(--tng-semantic-foreground-secondary);',
        '}',
        '',
      ].join('\n'),
    },
  ]);

  protected readonly faqTailwindCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'accordion-examples-faq-tailwind.component.ts',
      code: ["readonly defaultOpen = 'release';", ''].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'accordion-examples-faq-tailwind.component.html',
      code: [
        '<div class="rounded-xl border border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">',
        '  <tng-accordion ariaLabel="Project FAQ" [defaultValue]="\'release\'">',
        '    <tng-accordion-item value="release">',
        '      <tng-accordion-trigger class="accordion-example-trigger font-medium text-slate-900 dark:text-slate-100">Release model</tng-accordion-trigger>',
        '      <tng-accordion-panel class="accordion-example-panel text-slate-700 dark:text-slate-300">Weekly patch and monthly minor cadence.</tng-accordion-panel>',
        '    </tng-accordion-item>',
        '    <tng-accordion-item value="quality">',
        '      <tng-accordion-trigger class="accordion-example-trigger font-medium text-slate-900 dark:text-slate-100">Quality gates</tng-accordion-trigger>',
        '      <tng-accordion-panel class="accordion-example-panel text-slate-700 dark:text-slate-300">Tests and lint pass before merge.</tng-accordion-panel>',
        '    </tng-accordion-item>',
        '  </tng-accordion>',
        '</div>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'accordion-examples-faq-tailwind.component.css',
      code: '/* Tailwind utilities are applied directly in the template. */',
    },
  ]);

  protected readonly settingsHeadlessCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'accordion-examples-settings-headless.component.ts',
      code: ["readonly defaultOpen = ['alerts'];", ''].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'accordion-examples-settings-headless.component.html',
      code: [
        '<section tngAccordion type="multiple" [defaultValue]="[\'alerts\']" class="accordion-example-root">',
        '  <article tngAccordionItem value="alerts" class="accordion-example-item">',
        '    <button tngAccordionTrigger type="button" class="accordion-example-trigger">Alerts</button>',
        '    <div tngAccordionPanel class="accordion-example-panel">PagerDuty, email, and Slack routing.</div>',
        '  </article>',
        '  <article tngAccordionItem value="audits" class="accordion-example-item">',
        '    <button tngAccordionTrigger type="button" class="accordion-example-trigger">Audits</button>',
        '    <div tngAccordionPanel class="accordion-example-panel">Retention and export scheduling.</div>',
        '  </article>',
        '</section>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'accordion-examples-settings-headless.component.css',
      code: [
        '.accordion-example-root[data-type="multiple"] {',
        '  border-color: var(--tng-semantic-accent-info);',
        '}',
        '',
      ].join('\n'),
    },
  ]);

  protected readonly settingsPlainCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'accordion-examples-settings-plain-css.component.ts',
      code: ["readonly defaultOpen = ['alerts'];", ''].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'accordion-examples-settings-plain-css.component.html',
      code: [
        '<tng-accordion type="multiple" [defaultValue]="[\'alerts\']" ariaLabel="System settings">',
        '  <tng-accordion-item value="alerts">',
        '    <tng-accordion-trigger class="accordion-example-trigger">Alerts</tng-accordion-trigger>',
        '    <tng-accordion-panel class="accordion-example-panel">PagerDuty, email, and Slack routing.</tng-accordion-panel>',
        '  </tng-accordion-item>',
        '  <tng-accordion-item value="audits">',
        '    <tng-accordion-trigger class="accordion-example-trigger">Audits</tng-accordion-trigger>',
        '    <tng-accordion-panel class="accordion-example-panel">Retention and export scheduling.</tng-accordion-panel>',
        '  </tng-accordion-item>',
        '  <tng-accordion-item value="billing" disabled>',
        '    <tng-accordion-trigger class="accordion-example-trigger">Billing (disabled)</tng-accordion-trigger>',
        '    <tng-accordion-panel class="accordion-example-panel">Disabled sections stay locked.</tng-accordion-panel>',
        '  </tng-accordion-item>',
        '</tng-accordion>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'accordion-examples-settings-plain-css.component.css',
      code: [
        'tng-accordion-item[disabled] {',
        '  opacity: 0.65;',
        '}',
        '',
      ].join('\n'),
    },
  ]);

  protected readonly settingsTailwindCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'accordion-examples-settings-tailwind.component.ts',
      code: ["readonly defaultOpen = ['alerts'];", ''].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'accordion-examples-settings-tailwind.component.html',
      code: [
        '<div class="rounded-xl border border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">',
        '  <tng-accordion type="multiple" [defaultValue]="[\'alerts\']" ariaLabel="System settings">',
        '    <tng-accordion-item value="alerts">',
        '      <tng-accordion-trigger class="accordion-example-trigger font-medium text-slate-900 dark:text-slate-100">Alerts</tng-accordion-trigger>',
        '      <tng-accordion-panel class="accordion-example-panel text-slate-700 dark:text-slate-300">PagerDuty, email, and Slack routing.</tng-accordion-panel>',
        '    </tng-accordion-item>',
        '    <tng-accordion-item value="audits">',
        '      <tng-accordion-trigger class="accordion-example-trigger font-medium text-slate-900 dark:text-slate-100">Audits</tng-accordion-trigger>',
        '      <tng-accordion-panel class="accordion-example-panel text-slate-700 dark:text-slate-300">Retention and export scheduling.</tng-accordion-panel>',
        '    </tng-accordion-item>',
        '  </tng-accordion>',
        '</div>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'accordion-examples-settings-tailwind.component.css',
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
