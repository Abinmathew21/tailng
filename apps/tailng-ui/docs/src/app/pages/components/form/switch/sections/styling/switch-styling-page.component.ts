import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent, TngSwitchComponent } from '@tailng-ui/components';
import type { DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';
import {
  observeDocsCodeThemeChanges,
  resolveDocsCodeBlockTheme,
} from '../../../../../../shared/util';
import { stackblitzTailwindUrl, stackblitzVanillaUrl } from '../../switch.util';

function createCodeTabs(
  baseName: string,
  tsCode: string,
  htmlCode: string,
  cssCode: string,
): readonly DocsExampleCodeTab[] {
  return Object.freeze([
    { value: 'ts', label: 'TS', language: 'ts', title: `${baseName}.component.ts`, code: tsCode },
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
  selector: 'app-switch-styling-page',
  imports: [TngCodeBlockComponent, TngSwitchComponent, DocsExampleTabsSectionComponent, DocsExampleVariantDirective],
  templateUrl: './switch-styling-page.component.html',
  styleUrl: './switch-styling-page.component.css',
})
export class SwitchStylingPageComponent implements OnDestroy {
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

  protected readonly plainCssReviewGate = signal(true);
  protected readonly tailwindReviewGate = signal(true);

  protected readonly tokenOverrideSnippet = [
    'tng-switch {',
    '  --tng-semantic-accent-brand: #2563eb;',
    '  --tng-semantic-border-subtle: #cbd5e1;',
    '  --tng-semantic-focus-ring: rgba(37, 99, 235, 0.25);',
    '  --tng-semantic-foreground-primary: var(--tng-semantic-foreground-primary);',
    '}',
    '',
  ].join('\n');

  protected readonly plainCssCodeTabs = createCodeTabs(
    'component-switch-styling-plain',
    [
      "import { Component, signal } from '@angular/core';",
      "import { TngSwitchComponent } from '@tailng-ui/components';",
      '',
      '@Component({',
      "  selector: 'app-component-switch-styling-plain',",
      '  standalone: true,',
      '  imports: [TngSwitchComponent],',
      "  templateUrl: './component-switch-styling-plain.component.html',",
      "  styleUrl: './component-switch-styling-plain.component.css',",
      '})',
      'export class ComponentSwitchStylingPlainComponent {',
      '  readonly requireReview = signal(true);',
      '}',
      '',
    ].join('\n'),
    [
      '<section class="component-switch-review-card">',
      '  <div class="component-switch-review-card__header">',
      '    <h3 class="component-switch-review-card__title">Release gate</h3>',
      '    <p class="component-switch-review-card__meta">Require human sign-off before publish.</p>',
      '  </div>',
      '  <tng-switch',
      '    [checked]="requireReview()"',
      '    (checkedChange)="requireReview.set($event)"',
      '  >',
      '    Require review',
      '  </tng-switch>',
      '</section>',
      '',
    ].join('\n'),
    [
      '.component-switch-review-card {',
      '  display: grid;',
      '  gap: 0.9rem;',
      '  inline-size: min(100%, 30rem);',
      '  margin-inline: auto;',
      '  padding: 1rem;',
      '  border: 1px solid var(--tng-semantic-border-subtle);',
      '  border-radius: 1rem;',
      '  background: var(--tng-semantic-background-surface);',
      '  color: var(--tng-semantic-foreground-primary);',
      '  color-scheme: light;',
      '}',
      '',
      '.component-switch-review-card__header {',
      '  display: grid;',
      '  gap: 0.25rem;',
      '}',
      '',
      '.component-switch-review-card__title {',
      '  margin: 0;',
      '  color: var(--tng-semantic-foreground-primary);',
      '  font-size: 1rem;',
      '  font-weight: 700;',
      '}',
      '',
      '.component-switch-review-card__meta {',
      '  margin: 0;',
      '  color: var(--tng-semantic-foreground-secondary);',
      '  font-size: 0.84rem;',
      '}',
      '',
      '.component-switch-review-card tng-switch {',
      '  --tng-semantic-accent-brand: #2563eb;',
      '  --tng-semantic-border-subtle: #cbd5e1;',
      '  --tng-semantic-focus-ring: rgba(37, 99, 235, 0.25);',
      '  --tng-semantic-foreground-primary: var(--tng-semantic-foreground-primary);',
      '}',
      '',
    ].join('\n'),
  );

  protected readonly tailwindCodeTabs = createCodeTabs(
    'component-switch-styling-tailwind',
    [
      "import { Component, signal } from '@angular/core';",
      "import { TngSwitchComponent } from '@tailng-ui/components';",
      '',
      '@Component({',
      "  selector: 'app-component-switch-styling-tailwind',",
      '  standalone: true,',
      '  imports: [TngSwitchComponent],',
      "  templateUrl: './component-switch-styling-tailwind.component.html',",
      '})',
      'export class ComponentSwitchStylingTailwindComponent {',
      '  readonly requireReview = signal(true);',
      '}',
      '',
    ].join('\n'),
    [
      '<section class="grid w-full max-w-[30rem] gap-4 rounded-2xl border border-[var(--tng-semantic-border-subtle)] bg-[var(--tng-semantic-background-surface)] p-4 text-[var(--tng-semantic-foreground-primary)] shadow-sm">',
      '  <div class="grid gap-1">',
      '    <h3 class="m-0 text-base font-semibold text-[var(--tng-semantic-foreground-primary)]">Release gate</h3>',
      '    <p class="m-0 text-sm text-[var(--tng-semantic-foreground-secondary)]">Require human sign-off before publish.</p>',
      '  </div>',
      '  <tng-switch',
      '    [checked]="requireReview()"',
      '    (checkedChange)="requireReview.set($event)"',
      '  >',
      '    Require review',
      '  </tng-switch>',
      '</section>',
      '',
    ].join('\n'),
    '/* Tailwind utilities are applied directly in the template. */',
  );

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
