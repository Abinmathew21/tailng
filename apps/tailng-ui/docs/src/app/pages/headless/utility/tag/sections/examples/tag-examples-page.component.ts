import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngTag, TngTagClose, TngTagIcon } from '@tailng-ui/primitives';
import { type DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';
import { observeDocsCodeThemeChanges, resolveDocsCodeBlockTheme } from '../../../../../../shared/util';

type TagTone = 'danger' | 'info' | 'neutral' | 'success' | 'warning';
type ExampleVariant = 'plain' | 'tailwind';
type TagItem = Readonly<{ id: string; label: string; tone: TagTone }>;

const FILTER_DEFAULTS: readonly TagItem[] = Object.freeze([
  { id: 'angular', label: 'Angular', tone: 'info' },
  { id: 'a11y', label: 'A11y', tone: 'success' },
  { id: 'design', label: 'Design', tone: 'warning' },
]);

const STATUS_DEFAULTS: readonly TagItem[] = Object.freeze([
  { id: 'new', label: 'New', tone: 'info' },
  { id: 'beta', label: 'Beta', tone: 'warning' },
  { id: 'blocked', label: 'Blocked', tone: 'danger' },
  { id: 'stable', label: 'Stable', tone: 'success' },
]);

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
  selector: 'app-headless-tag-examples-page',
  imports: [TngTag, TngTagIcon, TngTagClose, DocsExampleTabsSectionComponent, DocsExampleVariantDirective],
  templateUrl: './tag-examples-page.component.html',
  styleUrl: './tag-examples-page.component.css',
})
export class HeadlessTagExamplesPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly filterPlain = signal<readonly TagItem[]>(FILTER_DEFAULTS);
  protected readonly filterTailwind = signal<readonly TagItem[]>(FILTER_DEFAULTS);

  protected readonly filterPlainTabs = createCodeTabs(
    'headless-tag-examples-filter-plain-css',
    [
      "import { Component, signal } from '@angular/core';",
      "import { TngTag, TngTagClose, TngTagIcon } from '@tailng-ui/primitives';",
      '',
      '@Component({',
      "  selector: 'app-headless-tag-examples-filter-plain-css',",
      '  standalone: true,',
      '  imports: [TngTag, TngTagIcon, TngTagClose],',
      "  templateUrl: './headless-tag-examples-filter-plain-css.component.html',",
      "  styleUrl: './headless-tag-examples-filter-plain-css.component.css',",
      '})',
      'export class HeadlessTagExamplesFilterPlainCssComponent {',
      "  protected readonly tags = signal(['Angular', 'A11y', 'Design']);",
      '}',
    ].join('\n'),
    [
      '<span tngTag [tngTagLabel]="tag" [tngTagRemovable]="true" class="tag-chip">',
      '  <span tngTagIcon aria-hidden="true">●</span>',
      '  {{ tag }}',
      '  <button type="button" tngTagClose><span aria-hidden="true">×</span></button>',
      '</span>',
      '',
    ].join('\n'),
    '.tag-example-row { display: flex; flex-wrap: wrap; gap: 0.75rem; }',
  );

  protected readonly filterTailwindTabs = createCodeTabs(
    'headless-tag-examples-filter-tailwind',
    [
      "import { Component, signal } from '@angular/core';",
      "import { TngTag, TngTagClose, TngTagIcon } from '@tailng-ui/primitives';",
      '',
      "type TagTone = 'danger' | 'info' | 'neutral' | 'success' | 'warning';",
      "type TagItem = Readonly<{ id: string; label: string; tone: TagTone }>;",
      '',
      'const FILTER_TAGS: readonly TagItem[] = [',
      "  { id: 'angular', label: 'Angular', tone: 'info' },",
      "  { id: 'a11y', label: 'A11y', tone: 'success' },",
      "  { id: 'design', label: 'Design', tone: 'warning' },",
      '];',
      '',
      '@Component({',
      "  selector: 'app-headless-tag-examples-filter-tailwind',",
      '  standalone: true,',
      '  imports: [TngTag, TngTagIcon, TngTagClose],',
      "  templateUrl: './headless-tag-examples-filter-tailwind.component.html',",
      "  styleUrl: './headless-tag-examples-filter-tailwind.component.css',",
      '})',
      'export class HeadlessTagExamplesFilterTailwindComponent {',
      '  protected readonly tags = signal<readonly TagItem[]>(FILTER_TAGS);',
      '',
      '  protected chipTailwindHostClass(tone: TagTone): string {',
      "    const layout = 'inline-flex items-center gap-1 rounded-full border border-transparent px-[0.65rem] py-1 text-xs font-semibold min-h-[1.65rem]';",
      "    switch (tone) {",
      "      case 'neutral':",
      "        return `${layout} bg-tng-bg-muted text-tng-fg-primary`;",
      "      case 'info':",
      "        return `${layout} bg-[color-mix(in_srgb,var(--tng-semantic-accent-brand)_20%,transparent)] text-tng-accent-brand`;",
      "      case 'success':",
      "        return `${layout} bg-[color-mix(in_srgb,var(--tng-semantic-accent-success)_20%,transparent)] text-tng-accent-success`;",
      "      case 'warning':",
      "        return `${layout} bg-[color-mix(in_srgb,var(--tng-semantic-foreground-secondary)_20%,transparent)] text-tng-fg-secondary`;",
      "      case 'danger':",
      "        return `${layout} bg-[color-mix(in_srgb,var(--tng-semantic-accent-danger)_20%,transparent)] text-tng-accent-danger`;",
      '    }',
      '  }',
      '',
      '  protected removeTag(tagId: string): void {',
      '    this.tags.update((items) => items.filter((tag) => tag.id !== tagId));',
      '  }',
      '',
      '  protected resetFilters(): void {',
      '    this.tags.set(FILTER_TAGS);',
      '  }',
      '}',
    ].join('\n'),
    [
      '<div class="flex flex-col gap-3 rounded-2xl border border-tng-border-subtle bg-tng-bg-surface p-4 text-tng-fg-primary shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--tng-semantic-border-subtle)_55%,transparent)]">',
      '  <div class="flex flex-wrap gap-3">',
      '    @for (tag of tags(); track tag.id) {',
      '      <span tngTag [tngTagLabel]="tag.label" [tngTagRemovable]="true" [class]="chipTailwindHostClass(tag.tone)" (tngTagRemoved)="removeTag(tag.id)">',
      '        <span tngTagIcon aria-hidden="true" class="text-[0.7em]">●</span>',
      '        {{ tag.label }}',
      '        <button type="button" tngTagClose class="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-current opacity-80 transition hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--tng-semantic-focus-ring)_40%,transparent)] focus-visible:ring-offset-1 focus-visible:ring-offset-[color-mix(in_srgb,var(--tng-semantic-background-surface)_70%,transparent)]">',
      '          <span aria-hidden="true">×</span>',
      '        </button>',
      '      </span>',
      '    }',
      '  </div>',
      '  <button type="button" class="inline-flex w-fit min-h-8 items-center rounded-md border border-[var(--tng-semantic-border-default)] px-3 text-xs font-semibold text-tng-fg-primary transition hover:bg-tng-bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--tng-semantic-focus-ring)_40%,transparent)] focus-visible:ring-offset-2 focus-visible:ring-offset-tng-bg-surface" (click)="resetFilters()">Reset filters</button>',
      '</div>',
      '',
    ].join('\n'),
    '/* Tailwind utilities are applied directly in the template. */',
  );

  protected readonly statusPlainTabs = createCodeTabs(
    'headless-tag-examples-status-plain-css',
    [
      "import { Component } from '@angular/core';",
      "import { TngTag } from '@tailng-ui/primitives';",
      '',
      '@Component({',
      "  selector: 'app-headless-tag-examples-status-plain-css',",
      '  standalone: true,',
      '  imports: [TngTag],',
      "  templateUrl: './headless-tag-examples-status-plain-css.component.html',",
      "  styleUrl: './headless-tag-examples-status-plain-css.component.css',",
      '})',
      'export class HeadlessTagExamplesStatusPlainCssComponent {}',
    ].join('\n'),
    [
      '<span tngTag class="tag-chip" data-tone="info">New</span>',
      '<span tngTag class="tag-chip" data-tone="warning">Beta</span>',
      '<span tngTag class="tag-chip" data-tone="danger">Blocked</span>',
      '<span tngTag class="tag-chip" data-tone="success">Stable</span>',
      '',
    ].join('\n'),
    '.tag-example-row { display: flex; flex-wrap: wrap; gap: 0.75rem; }',
  );

  protected readonly statusTailwindTabs = createCodeTabs(
    'headless-tag-examples-status-tailwind',
    [
      "import { Component } from '@angular/core';",
      "import { TngTag } from '@tailng-ui/primitives';",
      '',
      '@Component({',
      "  selector: 'app-headless-tag-examples-status-tailwind',",
      '  standalone: true,',
      '  imports: [TngTag],',
      "  templateUrl: './headless-tag-examples-status-tailwind.component.html',",
      "  styleUrl: './headless-tag-examples-status-tailwind.component.css',",
      '})',
      'export class HeadlessTagExamplesStatusTailwindComponent {}',
    ].join('\n'),
    [
      '<div class="flex flex-col gap-3 rounded-2xl border border-tng-border-subtle bg-tng-bg-surface p-4 text-tng-fg-primary shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--tng-semantic-border-subtle)_55%,transparent)]">',
      '  <div class="flex flex-wrap gap-3">',
      '    <span tngTag class="inline-flex rounded-full border border-transparent bg-[color-mix(in_srgb,var(--tng-semantic-accent-brand)_20%,transparent)] px-3 py-1 text-xs font-semibold text-tng-accent-brand">New</span>',
      '    <span tngTag class="inline-flex rounded-full border border-transparent bg-[color-mix(in_srgb,var(--tng-semantic-foreground-secondary)_20%,transparent)] px-3 py-1 text-xs font-semibold text-tng-fg-secondary">Beta</span>',
      '    <span tngTag class="inline-flex rounded-full border border-transparent bg-[color-mix(in_srgb,var(--tng-semantic-accent-danger)_20%,transparent)] px-3 py-1 text-xs font-semibold text-tng-accent-danger">Blocked</span>',
      '    <span tngTag class="inline-flex rounded-full border border-transparent bg-tng-accent-success px-3 py-1 text-xs font-semibold text-tng-fg-inverse">Stable</span>',
      '  </div>',
      '</div>',
      '',
    ].join('\n'),
    '/* Tailwind utilities are applied directly in the template. */',
  );

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }

  protected removeFilter(scope: ExampleVariant, tagId: string): void {
    if (scope === 'plain') {
      this.filterPlain.update((tags) => tags.filter((tag) => tag.id !== tagId));
      return;
    }

    this.filterTailwind.update((tags) => tags.filter((tag) => tag.id !== tagId));
  }

  protected resetFilters(scope: ExampleVariant): void {
    if (scope === 'plain') {
      this.filterPlain.set(FILTER_DEFAULTS);
      return;
    }

    this.filterTailwind.set(FILTER_DEFAULTS);
  }

  protected readonly statuses = STATUS_DEFAULTS;

  protected chipTailwindHostClass(tone: TagTone): string {
    const layout =
      'inline-flex items-center gap-1 rounded-full border border-transparent px-[0.65rem] py-1 text-xs font-semibold min-h-[1.65rem]';
    switch (tone) {
      case 'neutral':
        return `${layout} bg-tng-bg-muted text-tng-fg-primary`;
      case 'info':
        return `${layout} bg-[color-mix(in_srgb,var(--tng-semantic-accent-brand)_20%,transparent)] text-tng-accent-brand`;
      case 'success':
        return `${layout} bg-[color-mix(in_srgb,var(--tng-semantic-accent-success)_20%,transparent)] text-tng-accent-success`;
      case 'warning':
        return `${layout} bg-[color-mix(in_srgb,var(--tng-semantic-foreground-secondary)_20%,transparent)] text-tng-fg-secondary`;
      case 'danger':
        return `${layout} bg-[color-mix(in_srgb,var(--tng-semantic-accent-danger)_20%,transparent)] text-tng-accent-danger`;
    }
  }
}
