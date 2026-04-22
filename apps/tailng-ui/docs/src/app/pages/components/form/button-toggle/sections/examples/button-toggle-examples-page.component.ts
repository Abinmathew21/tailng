import { DOCUMENT } from '@angular/common';
import { Component, computed, inject, signal, type OnDestroy } from '@angular/core';
import {
  TngButtonToggleComponent,
  TngButtonToggleGroupComponent,
} from '@tailng-ui/components';
import type { TngButtonToggleValue } from '@tailng-ui/primitives';
import type { DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';
import { DocsFormDemoShellComponent } from '../../../../../../shared/form-demo-shell/docs-form-demo-shell.component';
import {
  observeDocsCodeThemeChanges,
  resolveDocsCodeBlockTheme,
} from '../../../../../../shared/util';
import { stackblitzTailwindUrl, stackblitzVanillaUrl } from '../../button-toggle.util';

type AlignmentOption = 'left' | 'center' | 'right';
type TextStyleOption = 'bold' | 'italic' | 'underline';

type CreateCodeTabsOptions = {
  readonly baseName: string;
  readonly cssCode: string;
  readonly htmlCode: string;
  readonly tsCode: string;
};

function createCodeTabs({
  baseName,
  cssCode,
  htmlCode,
  tsCode,
}: CreateCodeTabsOptions): readonly DocsExampleCodeTab[] {
  return Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: `${baseName}.component.ts`,
      code: tsCode,
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: `${baseName}.component.html`,
      code: htmlCode,
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: `${baseName}.component.css`,
      code: cssCode,
    },
  ]);
}

@Component({
  selector: 'app-button-toggle-examples-page',
  imports: [
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
    DocsFormDemoShellComponent,
    TngButtonToggleComponent,
    TngButtonToggleGroupComponent,
  ],
  templateUrl: './button-toggle-examples-page.component.html',
  styleUrl: './button-toggle-examples-page.component.css',
})
export class ButtonToggleExamplesPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly stackblitzVanillaUrl = stackblitzVanillaUrl;
  protected readonly stackblitzTailwindUrl = stackblitzTailwindUrl;

  protected readonly plainAlignment = signal<AlignmentOption>('center');
  protected readonly tailwindAlignment = signal<AlignmentOption>('right');
  protected readonly plainTextStyles = signal<readonly TextStyleOption[]>(['italic']);
  protected readonly tailwindTextStyles = signal<readonly TextStyleOption[]>(['bold', 'underline']);

  protected readonly plainTextStylesSummary = computed(() =>
    this.renderStylesSummary(this.plainTextStyles()),
  );
  protected readonly tailwindTextStylesSummary = computed(() =>
    this.renderStylesSummary(this.tailwindTextStyles()),
  );

  protected readonly singleSelectPlainCssCodeTabs = createCodeTabs({
    baseName: 'doc-cmp-button-toggle-alignment-plain',
    tsCode: [
      "import { Component, signal } from '@angular/core';",
      "import { TngButtonToggleComponent, TngButtonToggleGroupComponent } from '@tailng-ui/components';",
      "import type { TngButtonToggleValue } from '@tailng-ui/primitives';",
      '',
      "type PlainAlignmentOption = 'left' | 'center' | 'right';",
      '',
      '@Component({',
      "  selector: 'app-doc-cmp-button-toggle-alignment-plain',",
      '  standalone: true,',
      '  imports: [TngButtonToggleComponent, TngButtonToggleGroupComponent],',
      "  templateUrl: './doc-cmp-button-toggle-alignment-plain.component.html',",
      "  styleUrl: './doc-cmp-button-toggle-alignment-plain.component.css',",
      '})',
      'export class DocCmpButtonToggleAlignmentPlainComponent {',
      "  readonly selectedPlainAlignment = signal<PlainAlignmentOption>('center');",
      '',
      '  onPlainAlignmentChange(value: TngButtonToggleValue | null): void {',
      "    if (value === 'left' || value === 'center' || value === 'right') {",
      '      this.selectedPlainAlignment.set(value);',
      '    }',
      '  }',
      '}',
      '',
    ].join('\n'),
    htmlCode: [
      '<section class="doc-cmp-button-toggle-alignment-card">',
      '  <h3 class="doc-cmp-button-toggle-alignment-card__title">Text alignment</h3>',
      '  <div class="doc-cmp-button-toggle-alignment-group">',
      '    <tng-button-toggle-group',
      '      ariaLabel="Text alignment"',
      '      [value]="selectedPlainAlignment()"',
      '      (valueChange)="onPlainAlignmentChange($event)"',
      '    >',
      `      <tng-button-toggle [tngButtonToggleValue]="'left'">Left</tng-button-toggle>`,
      `      <tng-button-toggle [tngButtonToggleValue]="'center'">Center</tng-button-toggle>`,
      `      <tng-button-toggle [tngButtonToggleValue]="'right'">Right</tng-button-toggle>`,
      '    </tng-button-toggle-group>',
      '  </div>',
      '  <p class="doc-cmp-button-toggle-alignment-card__summary">Selected: {{ selectedPlainAlignment() }}</p>',
      '</section>',
      '',
    ].join('\n'),
    cssCode: [
      '.doc-cmp-button-toggle-alignment-card {',
      '  display: grid;',
      '  gap: 0.8rem;',
      '  inline-size: min(100%, 30rem);',
      '  margin-inline: auto;',
      '  padding: 1rem;',
      '  border: 1px solid var(--tng-semantic-border-subtle);',
      '  border-radius: 1rem;',
      '  background: var(--tng-semantic-background-surface);',
      '  box-shadow: 0 20px 40px -32px rgba(15, 23, 42, 0.28);',
      '}',
      '',
      '.doc-cmp-button-toggle-alignment-card__title {',
      '  margin: 0;',
      '  color: var(--tng-semantic-foreground-primary);',
      '  font-size: 1rem;',
      '  font-weight: 700;',
      '}',
      '',
      '.doc-cmp-button-toggle-alignment-group {',
      '  --tng-semantic-border-subtle: color-mix(in srgb, var(--tng-semantic-border-subtle) 88%, var(--tng-semantic-background-surface) 12%);',
      '  background: color-mix(in srgb, var(--tng-semantic-background-muted) 78%, var(--tng-semantic-background-surface) 22%);',
      '  border-radius: 1rem;',
      '}',
      '',
      '.doc-cmp-button-toggle-alignment-card__summary {',
      '  margin: 0;',
      '  color: var(--tng-semantic-foreground-secondary);',
      '  font-size: 0.82rem;',
      '  text-transform: capitalize;',
      '}',
      '',
    ].join('\n'),
  });

  protected readonly singleSelectTailwindCodeTabs = createCodeTabs({
    baseName: 'doc-cmp-button-toggle-alignment-tailwind',
    tsCode: [
      "import { Component, signal } from '@angular/core';",
      "import { TngButtonToggleComponent, TngButtonToggleGroupComponent } from '@tailng-ui/components';",
      "import type { TngButtonToggleValue } from '@tailng-ui/primitives';",
      '',
      "type TailwindAlignmentOption = 'left' | 'center' | 'right';",
      '',
      '@Component({',
      "  selector: 'app-doc-cmp-button-toggle-alignment-tailwind',",
      '  standalone: true,',
      '  imports: [TngButtonToggleComponent, TngButtonToggleGroupComponent],',
      "  templateUrl: './doc-cmp-button-toggle-alignment-tailwind.component.html',",
      '})',
      'export class DocCmpButtonToggleAlignmentTailwindComponent {',
      "  readonly selectedTailwindAlignment = signal<TailwindAlignmentOption>('right');",
      '',
      '  onTailwindAlignmentChange(value: TngButtonToggleValue | null): void {',
      "    if (value === 'left' || value === 'center' || value === 'right') {",
      '      this.selectedTailwindAlignment.set(value);',
      '    }',
      '  }',
      '}',
      '',
    ].join('\n'),
    htmlCode: [
      '<section class="grid w-full max-w-[30rem] gap-3 rounded-2xl border border-[var(--tng-semantic-border-subtle)] bg-[var(--tng-semantic-background-surface)] p-4 text-[var(--tng-semantic-foreground-primary)] shadow-sm">',
      '  <h3 class="m-0 text-base font-semibold text-[var(--tng-semantic-foreground-primary)]">Text alignment</h3>',
      '  <div class="inline-flex flex-wrap gap-2 rounded-2xl border border-[var(--tng-semantic-border-subtle)] bg-[color-mix(in_srgb,var(--tng-semantic-background-muted)_78%,var(--tng-semantic-background-surface)_22%)] p-2.5">',
      '    <tng-button-toggle-group',
      '      ariaLabel="Text alignment"',
      '      [value]="selectedTailwindAlignment()"',
      '      (valueChange)="onTailwindAlignmentChange($event)"',
      '    >',
      `      <tng-button-toggle [tngButtonToggleValue]="'left'">Left</tng-button-toggle>`,
      `      <tng-button-toggle [tngButtonToggleValue]="'center'">Center</tng-button-toggle>`,
      `      <tng-button-toggle [tngButtonToggleValue]="'right'">Right</tng-button-toggle>`,
      '    </tng-button-toggle-group>',
      '  </div>',
      '  <p class="m-0 text-xs text-[var(--tng-semantic-foreground-secondary)]">Selected: {{ selectedTailwindAlignment() }}</p>',
      '</section>',
      '',
    ].join('\n'),
    cssCode: '/* Tailwind utilities are applied directly in the template. */',
  });

  protected readonly multiSelectPlainCssCodeTabs = createCodeTabs({
    baseName: 'doc-cmp-button-toggle-formatting-plain',
    tsCode: [
      "import { Component, signal } from '@angular/core';",
      "import { TngButtonToggleComponent, TngButtonToggleGroupComponent } from '@tailng-ui/components';",
      '',
      "type PlainTextStyleOption = 'bold' | 'italic' | 'underline';",
      '',
      '@Component({',
      "  selector: 'app-doc-cmp-button-toggle-formatting-plain',",
      '  standalone: true,',
      '  imports: [TngButtonToggleComponent, TngButtonToggleGroupComponent],',
      "  templateUrl: './doc-cmp-button-toggle-formatting-plain.component.html',",
      "  styleUrl: './doc-cmp-button-toggle-formatting-plain.component.css',",
      '})',
      'export class DocCmpButtonToggleFormattingPlainComponent {',
      "  readonly selectedPlainTextStyles = signal<readonly PlainTextStyleOption[]>(['italic']);",
      '',
      '  onPlainTextStylesChange(values: readonly (string | number)[]): void {',
      '    this.selectedPlainTextStyles.set(',
      "      values.filter((value): value is PlainTextStyleOption => value === 'bold' || value === 'italic' || value === 'underline'),",
      '    );',
      '  }',
      '}',
      '',
    ].join('\n'),
    htmlCode: [
      '<section class="doc-cmp-button-toggle-formatting-card">',
      '  <h3 class="doc-cmp-button-toggle-formatting-card__title">Formatting toolbar</h3>',
      '  <div class="doc-cmp-button-toggle-formatting-group">',
      '    <tng-button-toggle-group',
      '      ariaLabel="Formatting toolbar"',
      '      type="multiple"',
      '      [values]="selectedPlainTextStyles()"',
      '      (valuesChange)="onPlainTextStylesChange($event)"',
      '    >',
      `      <tng-button-toggle [tngButtonToggleValue]="'bold'">Bold</tng-button-toggle>`,
      `      <tng-button-toggle [tngButtonToggleValue]="'italic'">Italic</tng-button-toggle>`,
      `      <tng-button-toggle [tngButtonToggleValue]="'underline'">Underline</tng-button-toggle>`,
      '    </tng-button-toggle-group>',
      '  </div>',
      '  <p class="doc-cmp-button-toggle-formatting-card__summary">Active: {{ selectedPlainTextStyles().join(", ") }}</p>',
      '</section>',
      '',
    ].join('\n'),
    cssCode: [
      '.doc-cmp-button-toggle-formatting-card {',
      '  display: grid;',
      '  gap: 0.8rem;',
      '  inline-size: min(100%, 30rem);',
      '  margin-inline: auto;',
      '  padding: 1rem;',
      '  border: 1px solid var(--tng-semantic-border-subtle);',
      '  border-radius: 1rem;',
      '  background: var(--tng-semantic-background-surface);',
      '  box-shadow: 0 20px 40px -32px rgba(15, 23, 42, 0.28);',
      '}',
      '',
      '.doc-cmp-button-toggle-formatting-card__title {',
      '  margin: 0;',
      '  color: var(--tng-semantic-foreground-primary);',
      '  font-size: 1rem;',
      '  font-weight: 700;',
      '}',
      '',
      '.doc-cmp-button-toggle-formatting-group {',
      '  --tng-semantic-border-subtle: color-mix(in srgb, var(--tng-semantic-border-subtle) 88%, var(--tng-semantic-background-surface) 12%);',
      '  background: color-mix(in srgb, var(--tng-semantic-background-muted) 78%, var(--tng-semantic-background-surface) 22%);',
      '  border-radius: 1rem;',
      '}',
      '',
      '.doc-cmp-button-toggle-formatting-card__summary {',
      '  margin: 0;',
      '  color: var(--tng-semantic-foreground-secondary);',
      '  font-size: 0.82rem;',
      '}',
      '',
    ].join('\n'),
  });

  protected readonly multiSelectTailwindCodeTabs = createCodeTabs({
    baseName: 'doc-cmp-button-toggle-formatting-tailwind',
    tsCode: [
      "import { Component, signal } from '@angular/core';",
      "import { TngButtonToggleComponent, TngButtonToggleGroupComponent } from '@tailng-ui/components';",
      '',
      "type TailwindTextStyleOption = 'bold' | 'italic' | 'underline';",
      '',
      '@Component({',
      "  selector: 'app-doc-cmp-button-toggle-formatting-tailwind',",
      '  standalone: true,',
      '  imports: [TngButtonToggleComponent, TngButtonToggleGroupComponent],',
      "  templateUrl: './doc-cmp-button-toggle-formatting-tailwind.component.html',",
      '})',
      'export class DocCmpButtonToggleFormattingTailwindComponent {',
      "  readonly selectedTailwindTextStyles = signal<readonly TailwindTextStyleOption[]>(['bold', 'underline']);",
      '',
      '  onTailwindTextStylesChange(values: readonly (string | number)[]): void {',
      '    this.selectedTailwindTextStyles.set(',
      "      values.filter((value): value is TailwindTextStyleOption => value === 'bold' || value === 'italic' || value === 'underline'),",
      '    );',
      '  }',
      '}',
      '',
    ].join('\n'),
    htmlCode: [
      '<section class="grid w-full max-w-[30rem] gap-3 rounded-2xl border border-[var(--tng-semantic-border-subtle)] bg-[var(--tng-semantic-background-surface)] p-4 text-[var(--tng-semantic-foreground-primary)] shadow-sm">',
      '  <h3 class="m-0 text-base font-semibold text-[var(--tng-semantic-foreground-primary)]">Formatting toolbar</h3>',
      '  <div class="inline-flex flex-wrap gap-2 rounded-2xl border border-[var(--tng-semantic-border-subtle)] bg-[color-mix(in_srgb,var(--tng-semantic-background-muted)_78%,var(--tng-semantic-background-surface)_22%)] p-2.5">',
      '    <tng-button-toggle-group',
      '      ariaLabel="Formatting toolbar"',
      '      type="multiple"',
      '      [values]="selectedTailwindTextStyles()"',
      '      (valuesChange)="onTailwindTextStylesChange($event)"',
      '    >',
      `      <tng-button-toggle [tngButtonToggleValue]="'bold'">Bold</tng-button-toggle>`,
      `      <tng-button-toggle [tngButtonToggleValue]="'italic'">Italic</tng-button-toggle>`,
      `      <tng-button-toggle [tngButtonToggleValue]="'underline'">Underline</tng-button-toggle>`,
      '    </tng-button-toggle-group>',
      '  </div>',
      '  <p class="m-0 text-xs text-[var(--tng-semantic-foreground-secondary)]">Active: {{ selectedTailwindTextStyles().join(", ") }}</p>',
      '</section>',
      '',
    ].join('\n'),
    cssCode: '/* Tailwind utilities are applied directly in the template. */',
  });

  protected onPlainAlignmentChange(value: TngButtonToggleValue | null): void {
    if (value === 'left' || value === 'center' || value === 'right') {
      this.plainAlignment.set(value as AlignmentOption);
    }
  }

  protected onTailwindAlignmentChange(value: TngButtonToggleValue | null): void {
    if (value === 'left' || value === 'center' || value === 'right') {
      this.tailwindAlignment.set(value as AlignmentOption);
    }
  }

  protected onPlainTextStylesChange(values: readonly TngButtonToggleValue[]): void {
    this.plainTextStyles.set(
      values.filter(
        (value): value is TextStyleOption =>
          value === 'bold' || value === 'italic' || value === 'underline',
      ),
    );
  }

  protected onTailwindTextStylesChange(values: readonly TngButtonToggleValue[]): void {
    this.tailwindTextStyles.set(
      values.filter(
        (value): value is TextStyleOption =>
          value === 'bold' || value === 'italic' || value === 'underline',
      ),
    );
  }

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }

  private renderStylesSummary(values: readonly TextStyleOption[]): string {
    if (values.length === 0) {
      return 'none';
    }

    return values.join(', ');
  }
}
