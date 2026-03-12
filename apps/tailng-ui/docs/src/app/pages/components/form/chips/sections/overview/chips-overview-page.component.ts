import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngChipsComponent, TngCodeBlockComponent } from '@tailng-ui/components';
import {
  TngChip,
  TngChipRemove,
  TngChips as TngChipsPrimitive,
} from '@tailng-ui/primitives';
import { type DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';

@Component({
  selector: 'app-chips-overview-page',
  imports: [
    TngCodeBlockComponent,
    TngChipsComponent,
    TngChipsPrimitive,
    TngChip,
    TngChipRemove,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './chips-overview-page.component.html',
  styleUrl: './chips-overview-page.component.css',
})
export class ChipsOverviewPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);
  private readonly colorSchemeObserver = this.observeCodeThemeChanges();

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    this.resolveCodeBlockTheme(),
  );

  protected readonly primitiveImportCode = [
    "import { TngChips, TngChip, TngChipRemove } from '@tailng-ui/primitives';",
    '',
  ].join('\n');

  protected readonly componentImportCode = [
    "import { TngChipsComponent } from '@tailng-ui/components';",
    "import { TngChip, TngChipRemove } from '@tailng-ui/primitives';",
    '',
  ].join('\n');

  protected readonly removableHeadlessValues = signal<readonly string[]>([
    'Angular',
    'CDK',
    'A11y',
  ]);
  protected readonly removablePlainValues = signal<readonly string[]>([
    'Input',
    'Select',
    'Menu',
  ]);
  protected readonly removableTailwindValues = signal<readonly string[]>([
    'Docs',
    'Registry',
    'CLI',
  ]);

  protected readonly disabledHeadlessValues = signal<readonly string[]>(['Release', 'Beta']);
  protected readonly disabledPlainValues = signal<readonly string[]>(['Stable', 'Preview']);
  protected readonly disabledTailwindValues = signal<readonly string[]>(['Locked', 'Active']);

  protected readonly removableHeadlessCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'chips-overview-removable-headless.component.ts',
      code: [
        "readonly tags = signal<readonly string[]>(['Angular', 'CDK', 'A11y']);",
        '',
        'onValuesChange(next: readonly unknown[]): void {',
        '  this.tags.set(next.filter((item): item is string => typeof item === "string"));',
        '}',
        '',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'chips-overview-removable-headless.component.html',
      code: [
        '<div',
        '  tngChips',
        '  class="chips-row"',
        '  tngChipsAriaLabel="Headless selected tags"',
        '  [tngChipsValues]="tags()"',
        '  (valuesChange)="onValuesChange($event)"',
        '>',
        '  @for (tag of tags(); track tag) {',
        '    <span tngChip [tngChipValue]="tag" [tngChipLabel]="tag" class="chip-pill">',
        '      <span>{{ tag }}</span>',
        '      <button tngChipRemove type="button" class="chip-pill-remove"></button>',
        '    </span>',
        '  }',
        '</div>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'chips-overview-removable-headless.component.css',
      code: [
        '.chip-pill {',
        '  border: 1px solid var(--tng-semantic-border-subtle);',
        '  border-radius: 999px;',
        '  display: inline-flex;',
        '  gap: 0.35rem;',
        '  padding: 0.35rem 0.75rem;',
        '}',
        '',
      ].join('\n'),
    },
  ]);

  protected readonly removablePlainCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'chips-overview-removable-plain-css.component.ts',
      code: [
        "readonly tags = signal<readonly string[]>(['Input', 'Select', 'Menu']);",
        '',
        'onValuesChange(next: readonly unknown[]): void {',
        '  this.tags.set(next.filter((item): item is string => typeof item === "string"));',
        '}',
        '',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'chips-overview-removable-plain-css.component.html',
      code: [
        '<tng-chips [values]="tags()" (valuesChange)="onValuesChange($event)">',
        '  <div class="chips-row">',
        '    @for (tag of tags(); track tag) {',
        '      <span tngChip [tngChipValue]="tag" [tngChipLabel]="tag" class="chip-pill">',
        '        <span>{{ tag }}</span>',
        '        <button tngChipRemove type="button" class="chip-pill-remove"></button>',
        '      </span>',
        '    }',
        '  </div>',
        '</tng-chips>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'chips-overview-removable-plain-css.component.css',
      code: [
        '.chips-preview-shell--plain {',
        '  border: 1px solid var(--tng-semantic-border-subtle);',
        '  border-radius: 0.8rem;',
        '  padding: 0.9rem 1rem;',
        '}',
        '',
      ].join('\n'),
    },
  ]);

  protected readonly removableTailwindCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'chips-overview-removable-tailwind.component.ts',
      code: [
        "readonly tags = signal<readonly string[]>(['Docs', 'Registry', 'CLI']);",
        '',
        'onValuesChange(next: readonly unknown[]): void {',
        '  this.tags.set(next.filter((item): item is string => typeof item === "string"));',
        '}',
        '',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'chips-overview-removable-tailwind.component.html',
      code: [
        '<div class="rounded-xl border border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">',
        '  <tng-chips [values]="tags()" (valuesChange)="onValuesChange($event)">',
        '    <div class="chips-row">',
        '      @for (tag of tags(); track tag) {',
        '        <span tngChip [tngChipValue]="tag" [tngChipLabel]="tag" class="chip-pill">',
        '          <span>{{ tag }}</span>',
        '          <button tngChipRemove type="button" class="chip-pill-remove"></button>',
        '        </span>',
        '      }',
        '    </div>',
        '  </tng-chips>',
        '</div>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'chips-overview-removable-tailwind.component.css',
      code: '/* Tailwind utilities are applied directly in the template. */',
    },
  ]);

  protected readonly disabledHeadlessCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'chips-overview-disabled-headless.component.ts',
      code: [
        "readonly tags = signal<readonly string[]>(['Release', 'Beta']);",
        '',
        'isDisabled(tag: string): boolean {',
        '  return tag === "Release";',
        '}',
        '',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'chips-overview-disabled-headless.component.html',
      code: [
        '<div tngChips [tngChipsValues]="tags()" (valuesChange)="onValuesChange($event)">',
        '  @for (tag of tags(); track tag) {',
        '    <span tngChip [tngChipValue]="tag" [tngChipLabel]="tag" [tngChipDisabled]="tag === "Release"" class="chip-pill">',
        '      <span>{{ tag }}</span>',
        '      <button tngChipRemove type="button" class="chip-pill-remove"></button>',
        '    </span>',
        '  }',
        '</div>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'chips-overview-disabled-headless.component.css',
      code: [
        '.chip-pill[data-disabled] {',
        '  opacity: 0.55;',
        '}',
        '',
      ].join('\n'),
    },
  ]);

  protected readonly disabledPlainCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'chips-overview-disabled-plain-css.component.ts',
      code: [
        "readonly tags = signal<readonly string[]>(['Stable', 'Preview']);",
        '',
        'isDisabled(tag: string): boolean {',
        '  return tag === "Stable";',
        '}',
        '',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'chips-overview-disabled-plain-css.component.html',
      code: [
        '<tng-chips [values]="tags()" (valuesChange)="onValuesChange($event)">',
        '  <div class="chips-row">',
        '    @for (tag of tags(); track tag) {',
        '      <span tngChip [tngChipValue]="tag" [tngChipLabel]="tag" [tngChipDisabled]="tag === "Stable"" class="chip-pill">',
        '        <span>{{ tag }}</span>',
        '        <button tngChipRemove type="button" class="chip-pill-remove"></button>',
        '      </span>',
        '    }',
        '  </div>',
        '</tng-chips>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'chips-overview-disabled-plain-css.component.css',
      code: [
        '.chips-preview-shell--plain {',
        '  border: 1px solid var(--tng-semantic-border-subtle);',
        '  border-radius: 0.8rem;',
        '  padding: 0.9rem 1rem;',
        '}',
        '',
      ].join('\n'),
    },
  ]);

  protected readonly disabledTailwindCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'chips-overview-disabled-tailwind.component.ts',
      code: [
        "readonly tags = signal<readonly string[]>(['Locked', 'Active']);",
        '',
        'isDisabled(tag: string): boolean {',
        '  return tag === "Locked";',
        '}',
        '',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'chips-overview-disabled-tailwind.component.html',
      code: [
        '<div class="rounded-xl border border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">',
        '  <tng-chips [values]="tags()" (valuesChange)="onValuesChange($event)">',
        '    <div class="chips-row">',
        '      @for (tag of tags(); track tag) {',
        '        <span tngChip [tngChipValue]="tag" [tngChipLabel]="tag" [tngChipDisabled]="tag === "Locked"" class="chip-pill">',
        '          <span>{{ tag }}</span>',
        '          <button tngChipRemove type="button" class="chip-pill-remove"></button>',
        '        </span>',
        '      }',
        '    </div>',
        '  </tng-chips>',
        '</div>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'chips-overview-disabled-tailwind.component.css',
      code: '/* Tailwind utilities are applied directly in the template. */',
    },
  ]);

  protected onRemovableHeadlessValuesChange(next: readonly unknown[]): void {
    this.removableHeadlessValues.set(this.toStringArray(next));
  }

  protected onRemovablePlainValuesChange(next: readonly unknown[]): void {
    this.removablePlainValues.set(this.toStringArray(next));
  }

  protected onRemovableTailwindValuesChange(next: readonly unknown[]): void {
    this.removableTailwindValues.set(this.toStringArray(next));
  }

  protected onDisabledHeadlessValuesChange(next: readonly unknown[]): void {
    this.disabledHeadlessValues.set(this.toStringArray(next));
  }

  protected onDisabledPlainValuesChange(next: readonly unknown[]): void {
    this.disabledPlainValues.set(this.toStringArray(next));
  }

  protected onDisabledTailwindValuesChange(next: readonly unknown[]): void {
    this.disabledTailwindValues.set(this.toStringArray(next));
  }

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }

  private toStringArray(values: readonly unknown[]): readonly string[] {
    return values.filter((item): item is string => typeof item === 'string');
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
