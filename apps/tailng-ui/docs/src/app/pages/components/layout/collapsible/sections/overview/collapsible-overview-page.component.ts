import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent, TngCollapsibleComponent } from '@tailng-ui/components';
import {
  TngCollapsible as TngCollapsiblePrimitive,
  TngCollapsibleContent as TngCollapsibleContentPrimitive,
  TngCollapsibleTrigger as TngCollapsibleTriggerPrimitive,
} from '@tailng-ui/primitives';
import { type DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';

const headlessContentId = 'docs-collapsible-overview-headless-content';

@Component({
  selector: 'app-collapsible-overview-page',
  imports: [
    TngCodeBlockComponent,
    TngCollapsiblePrimitive,
    TngCollapsibleTriggerPrimitive,
    TngCollapsibleContentPrimitive,
    TngCollapsibleComponent,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './collapsible-overview-page.component.html',
  styleUrl: './collapsible-overview-page.component.css',
})
export class CollapsibleOverviewPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);
  private readonly colorSchemeObserver = this.observeCodeThemeChanges();

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    this.resolveCodeBlockTheme(),
  );
  public readonly headlessContentId = headlessContentId;
  public readonly headlessOpen = signal(false);
  public readonly plainCssOpen = signal(false);
  public readonly tailwindOpen = signal(false);

  protected readonly primitiveImportCode = [
    "import { TngCollapsible, TngCollapsibleTrigger, TngCollapsibleContent } from '@tailng-ui/primitives';",
    '',
  ].join('\n');

  protected readonly componentImportCode =
    "import { TngCollapsibleComponent } from '@tailng-ui/components';";

  protected readonly headlessCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'collapsible-overview-headless.component.ts',
      code: [
        "readonly headlessContentId = 'docs-collapsible-overview-headless-content';",
        'readonly headlessOpen = signal(false);',
        '',
        'onHeadlessOpenChange(nextOpen: boolean): void {',
        '  this.headlessOpen.set(nextOpen);',
        '}',
        '',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'collapsible-overview-headless.component.html',
      code: [
        '<section tngCollapsible class="collapsible-preview-headless" [open]="headlessOpen()">',
        '  <button',
        '    tngCollapsibleTrigger',
        '    class="collapsible-preview-trigger"',
        '    [open]="headlessOpen()"',
        '    [contentId]="headlessContentId"',
        '    (click)="onHeadlessOpenChange(!headlessOpen())"',
        '  >',
        '    Checkout progress',
        '  </button>',
        '',
        '  <ol',
        '    tngCollapsibleContent',
        '    class="collapsible-preview-list"',
        '    [id]="headlessContentId"',
        '    [open]="headlessOpen()"',
        '    aria-label="Checkout progress"',
        '  >',
        '    <li class="collapsible-preview-item is-current"><span class="collapsible-preview-dot">1</span> Shipping details</li>',
        '    <li class="collapsible-preview-item"><span class="collapsible-preview-dot">2</span> Payment method</li>',
        '    <li class="collapsible-preview-item"><span class="collapsible-preview-dot">3</span> Confirmation</li>',
        '  </ol>',
        '</section>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'collapsible-overview-headless.component.css',
      code: [
        '.collapsible-preview-trigger {',
        '  border: 1px solid var(--tng-semantic-border-subtle);',
        '}',
        '',
        '.collapsible-preview-item.is-current {',
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
      title: 'collapsible-overview-plain-css.component.ts',
      code: [
        'readonly plainCssOpen = signal(false);',
        '',
        'onPlainCssOpenChange(nextOpen: boolean): void {',
        '  this.plainCssOpen.set(nextOpen);',
        '}',
        '',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'collapsible-overview-plain-css.component.html',
      code: [
        '<div class="collapsible-preview-shell collapsible-preview-shell--plain">',
        '  <tng-collapsible',
        '    title="Release pipeline"',
        '    ariaLabel="Release pipeline"',
        '    [open]="plainCssOpen()"',
        '    (openChange)="onPlainCssOpenChange($event)"',
        '  >',
        '    <ol class="collapsible-preview-list">',
        '      <li class="collapsible-preview-item is-complete"><span class="collapsible-preview-dot">✓</span> Draft</li>',
        '      <li class="collapsible-preview-item is-current"><span class="collapsible-preview-dot">2</span> Review</li>',
        '      <li class="collapsible-preview-item"><span class="collapsible-preview-dot">3</span> Publish</li>',
        '    </ol>',
        '  </tng-collapsible>',
        '</div>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'collapsible-overview-plain-css.component.css',
      code: [
        '.collapsible-preview-shell--plain {',
        '  border: 1px solid var(--tng-semantic-border-subtle);',
        '  border-radius: 0.8rem;',
        '  padding: 0.9rem 1rem;',
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
      title: 'collapsible-overview-tailwind.component.ts',
      code: [
        'readonly tailwindOpen = signal(false);',
        '',
        'onTailwindOpenChange(nextOpen: boolean): void {',
        '  this.tailwindOpen.set(nextOpen);',
        '}',
        '',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'collapsible-overview-tailwind.component.html',
      code: [
        '<div class="rounded-xl border border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">',
        '  <tng-collapsible',
        '    title="Release pipeline"',
        '    ariaLabel="Release pipeline"',
        '    [open]="tailwindOpen()"',
        '    (openChange)="onTailwindOpenChange($event)"',
        '  >',
        '    <ol class="collapsible-preview-list">',
        '      <li class="collapsible-preview-item is-complete"><span class="collapsible-preview-dot">✓</span> Draft</li>',
        '      <li class="collapsible-preview-item is-current"><span class="collapsible-preview-dot">2</span> Review</li>',
        '      <li class="collapsible-preview-item"><span class="collapsible-preview-dot">3</span> Publish</li>',
        '    </ol>',
        '  </tng-collapsible>',
        '</div>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'collapsible-overview-tailwind.component.css',
      code: '/* Tailwind utilities are applied directly in the template. */',
    },
  ]);

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }

  public onHeadlessOpenChange(nextOpen: boolean): void {
    this.headlessOpen.set(nextOpen);
  }

  public onPlainCssOpenChange(nextOpen: boolean): void {
    this.plainCssOpen.set(nextOpen);
  }

  public onTailwindOpenChange(nextOpen: boolean): void {
    this.tailwindOpen.set(nextOpen);
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
