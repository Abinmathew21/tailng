import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import {
  TngAccordionComponent,
  TngAccordionItemComponent,
  TngAccordionPanelComponent,
  TngAccordionTriggerComponent,
  TngCodeBlockComponent,
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
  selector: 'app-accordion-overview-page',
  imports: [
    TngCodeBlockComponent,
    TngAccordionPrimitive,
    TngAccordionItemPrimitive,
    TngAccordionTriggerPrimitive,
    TngAccordionPanelPrimitive,
    TngAccordionComponent,
    TngAccordionItemComponent,
    TngAccordionTriggerComponent,
    TngAccordionPanelComponent,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './accordion-overview-page.component.html',
  styleUrl: './accordion-overview-page.component.css',
})
export class AccordionOverviewPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);
  private readonly colorSchemeObserver = this.observeCodeThemeChanges();

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    this.resolveCodeBlockTheme(),
  );

  protected readonly primitiveImportCode = [
    "import { TngAccordion, TngAccordionItem, TngAccordionTrigger, TngAccordionPanel } from '@tailng-ui/primitives';",
    '',
  ].join('\n');

  protected readonly componentImportCode = [
    "import { TngAccordionComponent, TngAccordionItemComponent, TngAccordionTriggerComponent, TngAccordionPanelComponent } from '@tailng-ui/components';",
    '',
  ].join('\n');

  protected readonly headlessCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'accordion-overview-headless.component.ts',
      code: [
        "readonly defaultOpen = 'account';",
        '',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'accordion-overview-headless.component.html',
      code: [
        '<section tngAccordion [defaultValue]="\'account\'" class="accordion-preview-primitive">',
        '  <article tngAccordionItem value="account" class="accordion-preview-item">',
        '    <button tngAccordionTrigger type="button" class="accordion-preview-trigger">',
        '      Account access',
        '      <span aria-hidden="true" class="accordion-preview-chevron">⌄</span>',
        '    </button>',
        '    <div tngAccordionPanel class="accordion-preview-panel">',
        '      Manage identities, MFA posture, and session controls.',
        '    </div>',
        '  </article>',
        '  <article tngAccordionItem value="audit" class="accordion-preview-item">',
        '    <button tngAccordionTrigger type="button" class="accordion-preview-trigger">',
        '      Audit logs',
        '      <span aria-hidden="true" class="accordion-preview-chevron">⌄</span>',
        '    </button>',
        '    <div tngAccordionPanel class="accordion-preview-panel">',
        '      Review activity trails, export logs, and retention windows.',
        '    </div>',
        '  </article>',
        '</section>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'accordion-overview-headless.component.css',
      code: [
        '.accordion-preview-trigger[data-state="open"] {',
        '  border-color: var(--tng-semantic-accent-brand);',
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
      title: 'accordion-overview-plain-css.component.ts',
      code: [
        "readonly defaultOpen = 'ownership';",
        '',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'accordion-overview-plain-css.component.html',
      code: [
        '<tng-accordion ariaLabel="Release FAQ" [defaultValue]="\'ownership\'">',
        '  <tng-accordion-item value="ownership">',
        '    <tng-accordion-trigger>',
        '      Ownership model',
        '      <span aria-hidden="true" class="accordion-preview-chevron">⌄</span>',
        '    </tng-accordion-trigger>',
        '    <tng-accordion-panel>',
        '      Copy-paste mode keeps source in your app for long-term ownership.',
        '    </tng-accordion-panel>',
        '  </tng-accordion-item>',
        '  <tng-accordion-item value="testing">',
        '    <tng-accordion-trigger>',
        '      Test coverage',
        '      <span aria-hidden="true" class="accordion-preview-chevron">⌄</span>',
        '    </tng-accordion-trigger>',
        '    <tng-accordion-panel>',
        '      Primitive suites in __tests__ validate keyboard, pointer, and aria behavior.',
        '    </tng-accordion-panel>',
        '  </tng-accordion-item>',
        '</tng-accordion>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'accordion-overview-plain-css.component.css',
      code: [
        'tng-accordion-panel {',
        '  color: var(--tng-semantic-foreground-secondary);',
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
      title: 'accordion-overview-tailwind.component.ts',
      code: [
        "readonly defaultOpen = 'governance';",
        '',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'accordion-overview-tailwind.component.html',
      code: [
        '<div class="rounded-xl border border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">',
        '  <tng-accordion ariaLabel="Operational guide" [defaultValue]="\'governance\'">',
        '    <tng-accordion-item value="governance">',
        '      <tng-accordion-trigger class="font-medium text-slate-900 dark:text-slate-100">',
        '        Governance',
        '        <span aria-hidden="true" class="accordion-preview-chevron">⌄</span>',
        '      </tng-accordion-trigger>',
        '      <tng-accordion-panel class="text-slate-700 dark:text-slate-300">',
        '        Define release policy, reviewer gates, and rollback ownership.',
        '      </tng-accordion-panel>',
        '    </tng-accordion-item>',
        '    <tng-accordion-item value="delivery">',
        '      <tng-accordion-trigger class="font-medium text-slate-900 dark:text-slate-100">',
        '        Delivery',
        '        <span aria-hidden="true" class="accordion-preview-chevron">⌄</span>',
        '      </tng-accordion-trigger>',
        '      <tng-accordion-panel class="text-slate-700 dark:text-slate-300">',
        '        Ship documentation and examples in the same milestone cadence.',
        '      </tng-accordion-panel>',
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
      title: 'accordion-overview-tailwind.component.css',
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
