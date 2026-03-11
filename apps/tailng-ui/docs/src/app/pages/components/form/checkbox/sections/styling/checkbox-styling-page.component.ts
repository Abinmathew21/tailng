import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngCheckboxComponent } from '@tailng-ui/components';
import { TngCheckbox as TngCheckboxPrimitive } from '@tailng-ui/primitives';
import { type DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';

@Component({
  selector: 'app-checkbox-styling-page',
  imports: [
    TngCheckboxComponent,
    TngCheckboxPrimitive,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './checkbox-styling-page.component.html',
  styleUrl: './checkbox-styling-page.component.css',
})
export class CheckboxStylingPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    this.resolveCodeBlockTheme(),
  );
  private readonly colorSchemeObserver = this.observeCodeThemeChanges();

  protected readonly headlessCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'checkbox-styles-headless.component.html',
      code: [
        '<label class="policy-row">',
        '  <input tngCheckbox [checked]="true" />',
        '  <span>Release checklist complete</span>',
        '</label>',
        '<label class="policy-row">',
        '  <input tngCheckbox [indeterminate]="true" />',
        '  <span>Deployment approvals (partial)</span>',
        '</label>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'checkbox-styles-headless.component.css',
      code: [
        '.policy-row {',
        '  align-items: center;',
        '  color: var(--tng-semantic-foreground-primary);',
        '  display: inline-flex;',
        '  gap: 0.55rem;',
        '}',
        '.policy-row input[data-state="mixed"] {',
        '  accent-color: var(--tng-semantic-accent-warning);',
        '}',
        '',
      ].join('\n'),
    },
  ]);

  protected readonly plainCssCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'checkbox-styles-plain.component.html',
      code: [
        '<div class="settings-panel">',
        '  <tng-checkbox [checked]="true">Release checklist complete</tng-checkbox>',
        '  <tng-checkbox [indeterminate]="true">Deployment approvals (partial)</tng-checkbox>',
        '  <tng-checkbox [invalid]="true">Security review required</tng-checkbox>',
        '</div>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'checkbox-styles-plain.component.css',
      code: [
        '.settings-panel {',
        '  background: var(--tng-semantic-background-surface);',
        '  border: 1px solid var(--tng-semantic-border-subtle);',
        '  border-radius: 0.8rem;',
        '  display: grid;',
        '  gap: 0.75rem;',
        '  padding: 0.9rem 1rem;',
        '}',
        '',
      ].join('\n'),
    },
  ]);

  protected readonly tailwindCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'checkbox-styles-tailwind.component.html',
      code: [
        '<div class="grid gap-3 rounded-xl border border-slate-300 bg-white/80 p-4">',
        '  <tng-checkbox [checked]="true" class="text-slate-900">Release checklist complete</tng-checkbox>',
        '  <tng-checkbox [indeterminate]="true" class="text-slate-900">Deployment approvals (partial)</tng-checkbox>',
        '  <tng-checkbox [invalid]="true" class="text-slate-900">Security review required</tng-checkbox>',
        '</div>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'checkbox-styles-tailwind.component.css',
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
