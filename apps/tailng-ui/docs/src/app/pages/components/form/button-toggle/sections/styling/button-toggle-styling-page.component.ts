import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
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
import {
  observeDocsCodeThemeChanges,
  resolveDocsCodeBlockTheme,
} from '../../../../../../shared/util';
import { stackblitzTailwindUrl, stackblitzVanillaUrl } from '../../button-toggle.util';

type ReleaseTarget = 'review' | 'ship-now';

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
  selector: 'app-button-toggle-styling-page',
  imports: [
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
    TngButtonToggleComponent,
    TngButtonToggleGroupComponent,
  ],
  templateUrl: './button-toggle-styling-page.component.html',
  styleUrl: './button-toggle-styling-page.component.css',
})
export class ButtonToggleStylingPageComponent implements OnDestroy {
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

  protected readonly plainCssReleaseTarget = signal<ReleaseTarget>('review');
  protected readonly tailwindReleaseTarget = signal<ReleaseTarget>('review');

  protected readonly plainCssCodeTabs = createCodeTabs({
    baseName: 'doc-cmp-button-toggle-styling-plain',
    tsCode: [
      "import { Component, signal } from '@angular/core';",
      "import { TngButtonToggleComponent, TngButtonToggleGroupComponent } from '@tailng-ui/components';",
      "import type { TngButtonToggleValue } from '@tailng-ui/primitives';",
      '',
      "type PlainReleaseTarget = 'review' | 'ship-now';",
      '',
      '@Component({',
      "  selector: 'app-doc-cmp-button-toggle-styling-plain',",
      '  standalone: true,',
      '  imports: [TngButtonToggleComponent, TngButtonToggleGroupComponent],',
      "  templateUrl: './doc-cmp-button-toggle-styling-plain.component.html',",
      "  styleUrl: './doc-cmp-button-toggle-styling-plain.component.css',",
      '})',
      'export class DocCmpButtonToggleStylingPlainComponent {',
      "  readonly selectedPlainReleaseTarget = signal<PlainReleaseTarget>('review');",
      '',
      '  onPlainReleaseTargetChange(value: TngButtonToggleValue | null): void {',
      "    if (value === 'review' || value === 'ship-now') {",
      '      this.selectedPlainReleaseTarget.set(value);',
      '    }',
      '  }',
      '}',
      '',
    ].join('\n'),
    htmlCode: [
      '<section class="doc-cmp-button-toggle-release-card">',
      '  <div class="doc-cmp-button-toggle-release-card__header">',
      '    <h3 class="doc-cmp-button-toggle-release-card__title">Release target</h3>',
      '    <p class="doc-cmp-button-toggle-release-card__body">Use host-level semantic tokens when one action needs stronger emphasis.</p>',
      '  </div>',
      '  <div class="doc-cmp-button-toggle-release-group">',
      '    <tng-button-toggle-group',
      '      ariaLabel="Release target"',
      '      [value]="selectedPlainReleaseTarget()"',
      '      (valueChange)="onPlainReleaseTargetChange($event)"',
      '    >',
      `      <tng-button-toggle [tngButtonToggleValue]="'ship-now'">Ship now</tng-button-toggle>`,
      `      <div class="doc-cmp-button-toggle-release-item--critical"><tng-button-toggle [tngButtonToggleValue]="'review'">Compliance review</tng-button-toggle></div>`,
      '    </tng-button-toggle-group>',
      '  </div>',
      '</section>',
      '',
    ].join('\n'),
    cssCode: [
      '.doc-cmp-button-toggle-release-card {',
      '  display: grid;',
      '  gap: 0.85rem;',
      '  inline-size: min(100%, 32rem);',
      '  margin-inline: auto;',
      '  padding: 1rem;',
      '  border: 1px solid var(--tng-semantic-border-subtle);',
      '  border-radius: 1rem;',
      '  background: var(--tng-semantic-background-surface);',
      '  box-shadow: 0 20px 40px -32px rgba(15, 23, 42, 0.28);',
      '}',
      '',
      '.doc-cmp-button-toggle-release-card__header {',
      '  display: grid;',
      '  gap: 0.35rem;',
      '}',
      '',
      '.doc-cmp-button-toggle-release-card__title {',
      '  margin: 0;',
      '  color: var(--tng-semantic-foreground-primary);',
      '  font-size: 1rem;',
      '  font-weight: 700;',
      '}',
      '',
      '.doc-cmp-button-toggle-release-card__body {',
      '  margin: 0;',
      '  color: var(--tng-semantic-foreground-secondary);',
      '  font-size: 0.92rem;',
      '  line-height: 1.6;',
      '}',
      '',
      '.doc-cmp-button-toggle-release-group {',
      '  --tng-semantic-border-subtle: color-mix(in srgb, var(--tng-semantic-border-subtle) 88%, var(--tng-semantic-background-surface) 12%);',
      '  background: color-mix(in srgb, var(--tng-semantic-background-muted) 78%, var(--tng-semantic-background-surface) 22%);',
      '  border-radius: 1rem;',
      '}',
      '',
      '.doc-cmp-button-toggle-release-item--critical {',
      '  --tng-semantic-background-surface: color-mix(in srgb, var(--tng-semantic-accent-danger) 8%, var(--tng-semantic-background-surface) 92%);',
      '  --tng-semantic-background-muted: color-mix(in srgb, var(--tng-semantic-accent-danger) 14%, var(--tng-semantic-background-surface) 86%);',
      '  --tng-semantic-border-subtle: color-mix(in srgb, var(--tng-semantic-accent-danger) 26%, var(--tng-semantic-border-subtle) 74%);',
      '  --tng-semantic-accent-brand: var(--tng-semantic-accent-danger);',
      '  --tng-semantic-foreground-primary: var(--tng-semantic-accent-danger);',
      '}',
      '',
    ].join('\n'),
  });

  protected readonly tailwindCodeTabs = createCodeTabs({
    baseName: 'doc-cmp-button-toggle-styling-tailwind',
    tsCode: [
      "import { Component, signal } from '@angular/core';",
      "import { TngButtonToggleComponent, TngButtonToggleGroupComponent } from '@tailng-ui/components';",
      "import type { TngButtonToggleValue } from '@tailng-ui/primitives';",
      '',
      "type TailwindReleaseTarget = 'review' | 'ship-now';",
      '',
      '@Component({',
      "  selector: 'app-doc-cmp-button-toggle-styling-tailwind',",
      '  standalone: true,',
      '  imports: [TngButtonToggleComponent, TngButtonToggleGroupComponent],',
      "  templateUrl: './doc-cmp-button-toggle-styling-tailwind.component.html',",
      '})',
      'export class DocCmpButtonToggleStylingTailwindComponent {',
      "  readonly selectedTailwindReleaseTarget = signal<TailwindReleaseTarget>('review');",
      '',
      '  onTailwindReleaseTargetChange(value: TngButtonToggleValue | null): void {',
      "    if (value === 'review' || value === 'ship-now') {",
      '      this.selectedTailwindReleaseTarget.set(value);',
      '    }',
      '  }',
      '}',
      '',
    ].join('\n'),
    htmlCode: [
      '<section class="grid w-full max-w-[32rem] gap-3 rounded-2xl border border-[var(--tng-semantic-border-subtle)] bg-[var(--tng-semantic-background-surface)] p-4 text-[var(--tng-semantic-foreground-primary)] shadow-sm">',
      '  <div class="grid gap-1">',
      '    <h3 class="m-0 text-base font-semibold text-[var(--tng-semantic-foreground-primary)]">Release target</h3>',
      '    <p class="m-0 text-sm leading-6 text-[var(--tng-semantic-foreground-secondary)]">Use host-level semantic tokens when one action needs stronger emphasis.</p>',
      '  </div>',
      '  <div class="inline-flex flex-wrap gap-2 rounded-2xl border border-[var(--tng-semantic-border-subtle)] bg-[color-mix(in_srgb,var(--tng-semantic-background-muted)_78%,var(--tng-semantic-background-surface)_22%)] p-2.5">',
      '    <tng-button-toggle-group',
      '      ariaLabel="Release target"',
      '      [value]="selectedTailwindReleaseTarget()"',
      '      (valueChange)="onTailwindReleaseTargetChange($event)"',
      '    >',
      `      <tng-button-toggle [tngButtonToggleValue]="'ship-now'">Ship now</tng-button-toggle>`,
      `      <div class="[--tng-semantic-background-surface:color-mix(in_srgb,var(--tng-semantic-accent-danger)_8%,var(--tng-semantic-background-surface)_92%)] [--tng-semantic-background-muted:color-mix(in_srgb,var(--tng-semantic-accent-danger)_14%,var(--tng-semantic-background-surface)_86%)] [--tng-semantic-border-subtle:color-mix(in_srgb,var(--tng-semantic-accent-danger)_26%,var(--tng-semantic-border-subtle)_74%)] [--tng-semantic-accent-brand:var(--tng-semantic-accent-danger)] [--tng-semantic-foreground-primary:var(--tng-semantic-accent-danger)] [--tng-color-white:var(--tng-color-white)]"><tng-button-toggle [tngButtonToggleValue]="'review'">Compliance review</tng-button-toggle></div>`,
      '    </tng-button-toggle-group>',
      '  </div>',
      '</section>',
      '',
    ].join('\n'),
    cssCode: '/* Tailwind utilities are applied directly in the template. */',
  });

  protected onPlainCssReleaseTargetChange(value: TngButtonToggleValue | null): void {
    if (value === 'review' || value === 'ship-now') {
      this.plainCssReleaseTarget.set(value);
    }
  }

  protected onTailwindReleaseTargetChange(value: TngButtonToggleValue | null): void {
    if (value === 'review' || value === 'ship-now') {
      this.tailwindReleaseTarget.set(value);
    }
  }

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
