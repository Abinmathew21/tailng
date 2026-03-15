import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent, TngTextareaComponent } from '@tailng-ui/components';
import { TngInput, TngInputGroup } from '@tailng-ui/primitives';
import { type DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';

@Component({
  selector: 'app-textarea-overview-page',
  imports: [
    TngCodeBlockComponent,
    TngTextareaComponent,
    TngInputGroup,
    TngInput,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './textarea-overview-page.component.html',
  styleUrl: './textarea-overview-page.component.css',
})
export class TextareaOverviewPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);
  private readonly colorSchemeObserver = this.observeCodeThemeChanges();

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    this.resolveCodeBlockTheme(),
  );

  protected readonly headlessValue = signal('Error logs now include request IDs for faster triage.');
  protected readonly plainValue = signal('Add concise release highlights for the weekly digest.');
  protected readonly tailwindValue = signal('Ship notes in both plain language and changelog format.');

  protected readonly primitiveImportCode = [
    "import { TngInput, TngInputGroup } from '@tailng-ui/primitives';",
    "// Compatibility alias (optional): import { TngTextarea } from '@tailng-ui/primitives';",
    '',
  ].join('\n');

  protected readonly componentImportCode =
    "import { TngTextareaComponent } from '@tailng-ui/components';\n";

  protected readonly headlessCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'textarea-overview-headless.component.ts',
      code: [
        "import { TngInput, TngInputGroup } from '@tailng-ui/primitives';",
        '',
        "readonly notes = signal('');",
        '',
        'onNotesInput(event: Event): void {',
        '  const target = event.target as HTMLTextAreaElement | null;',
        '  this.notes.set(target?.value ?? \"\");',
        '}',
        '',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'textarea-overview-headless.component.html',
      code: [
        '<div class="textarea-preview-field">',
        '  <label class="textarea-preview-label" for="overview-headless-textarea">Release notes</label>',
        '  <div tngInputGroup class="textarea-preview-shell">',
        '    <textarea',
        '      id="overview-headless-textarea"',
        '      tngInput',
        '      rows="4"',
        '      placeholder="Write release notes"',
        '      [value]="notes()"',
        '      (input)="onNotesInput($event)"',
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
      title: 'textarea-overview-headless.component.css',
      code: [
        '.textarea-preview-shell[data-slot="input-group"] {',
        '  align-items: flex-start;',
        '  border: 1px solid var(--tng-semantic-border-strong);',
        '  border-radius: 0.8rem;',
        '  min-height: 7.5rem;',
        '  padding: 0.7rem 0.85rem;',
        '}',
        '',
        '.textarea-preview-shell [data-slot="input"] {',
        '  border: 0;',
        '  min-height: 6rem;',
        '  resize: vertical;',
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
      title: 'textarea-overview-plain-css.component.ts',
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
      title: 'textarea-overview-plain-css.component.html',
      code: [
        '<div class="textarea-preview-shell textarea-preview-shell--plain">',
        '  <tng-textarea',
        '    [rows]="4"',
        '    [placeholder]="\'Summarize this sprint\'"',
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
      title: 'textarea-overview-plain-css.component.css',
      code: [
        '.textarea-preview-shell--plain {',
        '  border: 1px solid var(--tng-semantic-border-subtle);',
        '  border-radius: 0.9rem;',
        '  padding: 0.85rem;',
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
      title: 'textarea-overview-tailwind.component.ts',
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
      title: 'textarea-overview-tailwind.component.html',
      code: [
        '<div class="rounded-xl border border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">',
        '  <tng-textarea',
        '    [rows]="4"',
        '    [placeholder]="\'Write a customer-facing summary\'"',
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
      title: 'textarea-overview-tailwind.component.css',
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
