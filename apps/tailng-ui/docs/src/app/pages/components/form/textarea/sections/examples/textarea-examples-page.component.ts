import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngTextareaComponent } from '@tailng-ui/components';
import { TngInput, TngInputGroup } from '@tailng-ui/primitives';
import { type DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';

@Component({
  selector: 'app-textarea-examples-page',
  imports: [
    TngTextareaComponent,
    TngInputGroup,
    TngInput,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './textarea-examples-page.component.html',
  styleUrl: './textarea-examples-page.component.css',
})
export class TextareaExamplesPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);
  private readonly colorSchemeObserver = this.observeCodeThemeChanges();

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    this.resolveCodeBlockTheme(),
  );

  protected readonly headlessValue = signal('Users can now pin dashboards and export CSV snapshots.');
  protected readonly plainValue = signal('Block-level announcement draft for internal release channels.');
  protected readonly tailwindValue = signal('Follow-up note with owner, ETA, and mitigation plan.');

  protected readonly headlessCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'textarea-examples-headless.component.ts',
      code: [
        "import { TngInput, TngInputGroup } from '@tailng-ui/primitives';",
        '',
        "readonly value = signal('');",
        '',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'textarea-examples-headless.component.html',
      code: [
        '<div class="textarea-example-shell">',
        '  <label for="headless-summary">Incident summary</label>',
        '  <div tngInputGroup>',
        '    <textarea',
        '      id="headless-summary"',
        '      tngInput',
        '      [rows]="5"',
        '      [value]="value()"',
        '      (input)="onInput($event)"',
        '    ></textarea>',
        '  </div>',
        '</div>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'textarea-examples-headless.component.css',
      code: [
        '.textarea-example-shell [data-slot="input-group"] {',
        '  align-items: flex-start;',
        '  min-height: 8rem;',
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
      title: 'textarea-examples-plain-css.component.ts',
      code: [
        "import { TngTextareaComponent } from '@tailng-ui/components';",
        '',
        "readonly value = signal('');",
        '',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'textarea-examples-plain-css.component.html',
      code: [
        '<div class="textarea-example-shell textarea-example-shell--plain">',
        '  <tng-textarea',
        '    [rows]="5"',
        '    [resize]="\'none\'"',
        '    [placeholder]="\'Postmortem summary\'"',
        '    [value]="value()"',
        '    (valueChange)="value.set($event)"',
        '  ></tng-textarea>',
        '</div>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'textarea-examples-plain-css.component.css',
      code: [
        '.textarea-example-shell--plain {',
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
      title: 'textarea-examples-tailwind.component.ts',
      code: [
        "import { TngTextareaComponent } from '@tailng-ui/components';",
        '',
        "readonly value = signal('');",
        '',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'textarea-examples-tailwind.component.html',
      code: [
        '<div class="rounded-xl border border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">',
        '  <tng-textarea',
        '    [rows]="5"',
        '    [resize]="\'vertical\'"',
        '    [placeholder]="\'Customer update\'"',
        '    [value]="value()"',
        '    (valueChange)="value.set($event)"',
        '  ></tng-textarea>',
        '</div>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'textarea-examples-tailwind.component.css',
      code: '/* Tailwind utilities are applied directly in the template. */',
    },
  ]);

  protected onHeadlessInput(event: Event): void {
    const target = event.target;
    if (!(target instanceof HTMLTextAreaElement)) {
      return;
    }

    this.headlessValue.set(target.value);
  }

  protected onPlainValueChange(value: string): void {
    this.plainValue.set(value);
  }

  protected onTailwindValueChange(value: string): void {
    this.tailwindValue.set(value);
  }

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

    if (computedColorScheme?.includes('dark') === true) {
      return 'github-dark';
    }

    return root.classList.contains('dark') ? 'github-dark' : 'github-light';
  }
}
