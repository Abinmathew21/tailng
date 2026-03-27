import { DOCUMENT } from '@angular/common';
import { Component, computed, inject, signal, type OnDestroy } from '@angular/core';
import { observeDocsCodeThemeChanges, resolveDocsCodeBlockTheme } from '../../../../../../shared/util';
import { TngButtonToggleComponent } from '@tailng-ui/components';
import {
  TngButtonToggle as TngButtonTogglePrimitive,
  TngButtonToggleGroup as TngButtonToggleGroupPrimitive,
  type TngButtonToggleValue,
} from '@tailng-ui/primitives';
import { type DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';

type AlignmentOption = 'left' | 'center' | 'right';
type TextStyleOption = 'bold' | 'italic' | 'underline';

@Component({
  selector: 'app-button-toggle-examples-page',
  imports: [
    TngButtonToggleComponent,
    TngButtonTogglePrimitive,
    TngButtonToggleGroupPrimitive,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './button-toggle-examples-page.component.html',
  styleUrl: './button-toggle-examples-page.component.css',
})
export class ButtonToggleExamplesPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(this.documentRef, this.codeBlockTheme);

  protected readonly headlessAlign = signal<AlignmentOption>('center');
  protected readonly plainAlign = signal<AlignmentOption>('left');
  protected readonly tailwindAlign = signal<AlignmentOption>('right');

  protected readonly headlessStyles = signal<readonly TextStyleOption[]>(['bold']);
  protected readonly plainStyles = signal<readonly TextStyleOption[]>(['italic']);
  protected readonly tailwindStyles = signal<readonly TextStyleOption[]>(['bold', 'underline']);

  protected readonly headlessStylesSummary = computed(() =>
    this.renderStylesSummary(this.headlessStyles()),
  );
  protected readonly plainStylesSummary = computed(() =>
    this.renderStylesSummary(this.plainStyles()),
  );
  protected readonly tailwindStylesSummary = computed(() =>
    this.renderStylesSummary(this.tailwindStyles()),
  );

  protected readonly singleSelectHeadlessCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'alignment-headless-example.component.ts',
      code: [
        "readonly align = signal<'left' | 'center' | 'right'>('center');",
        '',
        'onAlignChange(value: string | number | null): void {',
        "  if (value === 'left' || value === 'center' || value === 'right') {",
        '    this.align.set(value);',
        '  }',
        '}',
        '',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'alignment-headless-example.component.html',
      code: [
        '<section',
        '  tngButtonToggleGroup',
        '  class="button-toggle-preview-group"',
        '  [tngButtonToggleValue]="align()"',
        '  (valueChange)="onAlignChange($event)"',
        '>',
        '  <button tngButtonToggle tngButtonToggleValue="left" class="button-toggle-preview-item">',
        '    Left',
        '  </button>',
        '  <button tngButtonToggle tngButtonToggleValue="center" class="button-toggle-preview-item">',
        '    Center',
        '  </button>',
        '  <button tngButtonToggle tngButtonToggleValue="right" class="button-toggle-preview-item">',
        '    Right',
        '  </button>',
        '</section>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'alignment-headless-example.component.css',
      code: [
        '.button-toggle-preview-group {',
        '  display: inline-flex;',
        '  flex-wrap: wrap;',
        '  gap: 0.55rem;',
        '}',
        '.button-toggle-preview-item {',
        '  border: 1px solid var(--tng-semantic-border-strong);',
        '  border-radius: 0.65rem;',
        '  padding: 0.4rem 0.9rem;',
        '}',
        '.button-toggle-preview-item[data-state="on"] {',
        '  background: var(--tng-semantic-accent-brand);',
        '  border-color: var(--tng-semantic-accent-brand);',
        '  color: var(--tng-color-white);',
        '}',
        '',
      ].join('\n'),
    },
  ]);

  protected readonly singleSelectPlainCssCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'alignment-plain-css-example.component.ts',
      code: [
        "readonly align = signal<'left' | 'center' | 'right'>('left');",
        '',
        "onAlignPressed(value: 'left' | 'center' | 'right', pressed: boolean): void {",
        '  if (pressed) {',
        '    this.align.set(value);',
        '  }',
        '}',
        '',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'alignment-plain-css-example.component.html',
      code: [
        '<div class="plain-button-toggle-card">',
        '  <div class="button-toggle-wrapper-row" role="group" aria-label="Alignment controls">',
        "    <tng-button-toggle [pressed]=\"align() === 'left'\" (pressedChange)=\"onAlignPressed('left', $event)\">",
        '      Left',
        '    </tng-button-toggle>',
        "    <tng-button-toggle [pressed]=\"align() === 'center'\" (pressedChange)=\"onAlignPressed('center', $event)\">",
        '      Center',
        '    </tng-button-toggle>',
        "    <tng-button-toggle [pressed]=\"align() === 'right'\" (pressedChange)=\"onAlignPressed('right', $event)\">",
        '      Right',
        '    </tng-button-toggle>',
        '  </div>',
        '</div>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'alignment-plain-css-example.component.css',
      code: [
        '.plain-button-toggle-card {',
        '  background: var(--tng-semantic-background-surface);',
        '  border: 1px solid var(--tng-semantic-border-subtle);',
        '  border-radius: 0.8rem;',
        '  padding: 0.9rem 1rem;',
        '}',
        '',
      ].join('\n'),
    },
  ]);

  protected readonly singleSelectTailwindCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'alignment-tailwind-example.component.ts',
      code: [
        "readonly align = signal<'left' | 'center' | 'right'>('right');",
        '',
        "onAlignPressed(value: 'left' | 'center' | 'right', pressed: boolean): void {",
        '  if (pressed) {',
        '    this.align.set(value);',
        '  }',
        '}',
        '',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'alignment-tailwind-example.component.html',
      code: [
        '<div',
        '  class="rounded-xl border border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60"',
        '>',
        '  <div class="button-toggle-wrapper-row" role="group" aria-label="Tailwind alignment controls">',
        "    <tng-button-toggle [pressed]=\"align() === 'left'\" (pressedChange)=\"onAlignPressed('left', $event)\">Left</tng-button-toggle>",
        "    <tng-button-toggle [pressed]=\"align() === 'center'\" (pressedChange)=\"onAlignPressed('center', $event)\">Center</tng-button-toggle>",
        "    <tng-button-toggle [pressed]=\"align() === 'right'\" (pressedChange)=\"onAlignPressed('right', $event)\">Right</tng-button-toggle>",
        '  </div>',
        '</div>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'alignment-tailwind-example.component.css',
      code: '/* Tailwind utilities are applied directly in the template. */',
    },
  ]);

  protected readonly multiSelectHeadlessCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'text-style-headless-example.component.ts',
      code: [
        "readonly styles = signal<readonly string[]>(['bold']);",
        '',
        'onStylesChange(values: readonly (string | number)[]): void {',
        "  this.styles.set(values.filter((value): value is string => typeof value === 'string'));",
        '}',
        '',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'text-style-headless-example.component.html',
      code: [
        '<section',
        '  tngButtonToggleGroup',
        '  type="multiple"',
        '  class="button-toggle-preview-group"',
        '  [tngButtonToggleValues]="styles()"',
        '  (valuesChange)="onStylesChange($event)"',
        '>',
        '  <button tngButtonToggle tngButtonToggleValue="bold" class="button-toggle-preview-item">',
        '    Bold',
        '  </button>',
        '  <button tngButtonToggle tngButtonToggleValue="italic" class="button-toggle-preview-item">',
        '    Italic',
        '  </button>',
        '  <button tngButtonToggle tngButtonToggleValue="underline" class="button-toggle-preview-item">',
        '    Underline',
        '  </button>',
        '</section>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'text-style-headless-example.component.css',
      code: [
        '.button-toggle-preview-item[data-state="on"] {',
        '  background: var(--tng-semantic-accent-brand);',
        '  color: var(--tng-color-white);',
        '}',
        '',
      ].join('\n'),
    },
  ]);

  protected readonly multiSelectPlainCssCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'text-style-plain-css-example.component.ts',
      code: [
        "readonly styles = signal<readonly string[]>(['italic']);",
        '',
        "onStylePressed(value: 'bold' | 'italic' | 'underline', pressed: boolean): void {",
        '  const next = new Set(this.styles());',
        '  if (pressed) {',
        '    next.add(value);',
        '  } else {',
        '    next.delete(value);',
        '  }',
        '  this.styles.set(Array.from(next));',
        '}',
        '',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'text-style-plain-css-example.component.html',
      code: [
        '<div class="plain-button-toggle-card">',
        '  <div class="button-toggle-wrapper-row" role="group" aria-label="Text style controls">',
        "    <tng-button-toggle [pressed]=\"styles().includes('bold')\" (pressedChange)=\"onStylePressed('bold', $event)\">Bold</tng-button-toggle>",
        "    <tng-button-toggle [pressed]=\"styles().includes('italic')\" (pressedChange)=\"onStylePressed('italic', $event)\">Italic</tng-button-toggle>",
        "    <tng-button-toggle [pressed]=\"styles().includes('underline')\" (pressedChange)=\"onStylePressed('underline', $event)\">Underline</tng-button-toggle>",
        '  </div>',
        '</div>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'text-style-plain-css-example.component.css',
      code: [
        '.button-toggle-wrapper-row {',
        '  display: inline-flex;',
        '  gap: 0.55rem;',
        '}',
        '',
      ].join('\n'),
    },
  ]);

  protected readonly multiSelectTailwindCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'text-style-tailwind-example.component.ts',
      code: [
        "readonly styles = signal<readonly string[]>(['bold', 'underline']);",
        '',
        "onStylePressed(value: 'bold' | 'italic' | 'underline', pressed: boolean): void {",
        '  const next = new Set(this.styles());',
        '  if (pressed) {',
        '    next.add(value);',
        '  } else {',
        '    next.delete(value);',
        '  }',
        '  this.styles.set(Array.from(next));',
        '}',
        '',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'text-style-tailwind-example.component.html',
      code: [
        '<div',
        '  class="rounded-xl border border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60"',
        '>',
        '  <div class="button-toggle-wrapper-row" role="group" aria-label="Tailwind text style controls">',
        "    <tng-button-toggle [pressed]=\"styles().includes('bold')\" (pressedChange)=\"onStylePressed('bold', $event)\">Bold</tng-button-toggle>",
        "    <tng-button-toggle [pressed]=\"styles().includes('italic')\" (pressedChange)=\"onStylePressed('italic', $event)\">Italic</tng-button-toggle>",
        "    <tng-button-toggle [pressed]=\"styles().includes('underline')\" (pressedChange)=\"onStylePressed('underline', $event)\">Underline</tng-button-toggle>",
        '  </div>',
        '</div>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'text-style-tailwind-example.component.css',
      code: '/* Tailwind utilities are applied directly in the template. */',
    },
  ]);

  protected onHeadlessAlignChange(value: TngButtonToggleValue | null): void {
    if (value === 'left' || value === 'center' || value === 'right') {
      this.headlessAlign.set(value);
    }
  }

  protected onPlainAlignPressed(value: AlignmentOption, pressed: boolean): void {
    if (pressed) {
      this.plainAlign.set(value);
    }
  }

  protected onTailwindAlignPressed(value: AlignmentOption, pressed: boolean): void {
    if (pressed) {
      this.tailwindAlign.set(value);
    }
  }

  protected onHeadlessStylesChange(values: readonly TngButtonToggleValue[]): void {
    this.headlessStyles.set(this.normalizeStyleValues(values));
  }

  protected onPlainStylePressed(value: TextStyleOption, pressed: boolean): void {
    this.plainStyles.set(this.toggleStyleValue(this.plainStyles(), value, pressed));
  }

  protected onTailwindStylePressed(value: TextStyleOption, pressed: boolean): void {
    this.tailwindStyles.set(this.toggleStyleValue(this.tailwindStyles(), value, pressed));
  }

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }

  private toggleStyleValue(
    current: readonly TextStyleOption[],
    value: TextStyleOption,
    pressed: boolean,
  ): readonly TextStyleOption[] {
    const next = new Set(current);
    if (pressed) {
      next.add(value);
    } else {
      next.delete(value);
    }

    return Array.from(next);
  }

  private normalizeStyleValues(values: readonly TngButtonToggleValue[]): readonly TextStyleOption[] {
    const next: TextStyleOption[] = [];
    for (const value of values) {
      if (value === 'bold' || value === 'italic' || value === 'underline') {
        next.push(value);
      }
    }

    return next;
  }

  private renderStylesSummary(values: readonly TextStyleOption[]): string {
    return values.length > 0 ? values.join(', ') : 'none';
  }

}
