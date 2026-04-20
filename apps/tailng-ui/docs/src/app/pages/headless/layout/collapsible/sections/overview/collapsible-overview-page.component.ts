import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import {
  TngCollapsible,
  TngCollapsibleContent,
  TngCollapsibleTrigger,
} from '@tailng-ui/primitives';
import type { DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';
import {
  observeDocsCodeThemeChanges,
  resolveDocsCodeBlockTheme,
} from '../../../../../../shared/util';

const plainContentId = 'headless-collapsible-overview-plain-content';
const tailwindContentId = 'headless-collapsible-overview-tailwind-content';

@Component({
  selector: 'app-headless-collapsible-overview-page',
  imports: [
    TngCodeBlockComponent,
    TngCollapsible,
    TngCollapsibleTrigger,
    TngCollapsibleContent,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './collapsible-overview-page.component.html',
  styleUrls: ['./collapsible-overview-page.component.css'],
})
export class HeadlessCollapsibleOverviewPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  public readonly plainContentId = plainContentId;
  public readonly tailwindContentId = tailwindContentId;
  public readonly plainOpen = signal(true);
  public readonly tailwindOpen = signal(false);

  protected readonly importCode = [
    'import {',
    '  TngCollapsible,',
    '  TngCollapsibleTrigger,',
    '  TngCollapsibleContent,',
    "} from '@tailng-ui/primitives';",
    '',
  ].join('\n');

  protected readonly usageCode = [
    '<section tngCollapsible [open]="detailsOpen()">',
    '  <button',
    '    tngCollapsibleTrigger',
    '    [open]="detailsOpen()"',
    '    [contentId]="detailsContentId"',
    '    (click)="detailsOpen.set(!detailsOpen())"',
    '  >',
    '    Release checklist',
    '  </button>',
    '',
    '  <ol',
    '    tngCollapsibleContent',
    '    [id]="detailsContentId"',
    '    [open]="detailsOpen()"',
    '    aria-label="Release checklist"',
    '  >',
    '    <li>Draft</li>',
    '    <li>Review</li>',
    '    <li>Publish</li>',
    '  </ol>',
    '</section>',
    '',
  ].join('\n');

  protected readonly plainCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'headless-collapsible-overview-plain.component.ts',
      code: [
        "import { Component, signal } from '@angular/core';",
        "import {",
        "  TngCollapsible,",
        "  TngCollapsibleContent,",
        "  TngCollapsibleTrigger,",
        "} from '@tailng-ui/primitives';",
        '',
        "const contentId = 'release-readiness-content';",
        '',
        '@Component({',
        "  selector: 'app-headless-collapsible-overview-plain',",
        '  standalone: true,',
        '  imports: [TngCollapsible, TngCollapsibleTrigger, TngCollapsibleContent],',
        "  templateUrl: './headless-collapsible-overview-plain.component.html',",
        "  styleUrl: './headless-collapsible-overview-plain.component.css',",
        '})',
        'export class HeadlessCollapsibleOverviewPlainComponent {',
        '  readonly open = signal(true);',
        '  readonly contentId = contentId;',
        '}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'headless-collapsible-overview-plain.component.html',
      code: [
        '<section tngCollapsible class="headless-collapsible-shell" [open]="open()">',
        '  <button',
        '    tngCollapsibleTrigger',
        '    class="headless-collapsible-trigger"',
        '    [open]="open()"',
        '    [contentId]="contentId"',
        '    (click)="open.set(!open())"',
        '  >',
        '    Release readiness',
        '  </button>',
        '',
        '  <ol',
        '    tngCollapsibleContent',
        '    class="headless-collapsible-list"',
        '    [id]="contentId"',
        '    [open]="open()"',
        '    aria-label="Release readiness"',
        '  >',
        '    <li class="headless-collapsible-item is-complete"><span class="headless-collapsible-dot">✓</span> Notes approved</li>',
        '    <li class="headless-collapsible-item is-current"><span class="headless-collapsible-dot">2</span> QA sign-off</li>',
        '    <li class="headless-collapsible-item"><span class="headless-collapsible-dot">3</span> Publish</li>',
        '  </ol>',
        '</section>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'headless-collapsible-overview-plain.component.css',
      code: [
        '.headless-collapsible-shell {',
        '  border: 1px solid var(--tng-semantic-border-subtle);',
        '  border-radius: 1rem;',
        '  overflow: hidden;',
        '}',
        '',
        '.headless-collapsible-trigger {',
        '  width: 100%;',
        '  border: 0;',
        '  background: var(--tng-semantic-background-surface);',
        '  padding: 0.85rem 1rem;',
        '  text-align: left;',
        '}',
      ].join('\n'),
    },
  ]);

  protected readonly tailwindCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'headless-collapsible-overview-tailwind.component.ts',
      code: [
        "import { Component, signal } from '@angular/core';",
        "import {",
        "  TngCollapsible,",
        "  TngCollapsibleContent,",
        "  TngCollapsibleTrigger,",
        "} from '@tailng-ui/primitives';",
        '',
        "const contentId = 'release-readiness-tailwind-content';",
        '',
        '@Component({',
        "  selector: 'app-headless-collapsible-overview-tailwind',",
        '  standalone: true,',
        '  imports: [TngCollapsible, TngCollapsibleTrigger, TngCollapsibleContent],',
        "  templateUrl: './headless-collapsible-overview-tailwind.component.html',",
        "  styleUrl: './headless-collapsible-overview-tailwind.component.css',",
        '})',
        'export class HeadlessCollapsibleOverviewTailwindComponent {',
        '  readonly open = signal(false);',
        '  readonly contentId = contentId;',
        '}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'headless-collapsible-overview-tailwind.component.html',
      code: [
        '<section tngCollapsible class="overflow-hidden rounded-2xl border border-[var(--tng-semantic-border-subtle)] bg-[var(--tng-semantic-background-surface)]" [open]="open()">',
        '  <button',
        '    tngCollapsibleTrigger',
        '    class="flex w-full items-center justify-between border-0 bg-transparent px-4 py-3 text-left font-medium text-[var(--tng-semantic-foreground-primary)]"',
        '    [open]="open()"',
        '    [contentId]="contentId"',
        '    (click)="open.set(!open())"',
        '  >',
        '    Deployment checklist',
        '  </button>',
        '',
        '  <ol',
        '    tngCollapsibleContent',
        '    class="m-0 grid list-none gap-3 border-t border-[var(--tng-semantic-border-subtle)] bg-[var(--tng-semantic-background-canvas)] px-4 py-4"',
        '    [id]="contentId"',
        '    [open]="open()"',
        '    aria-label="Deployment checklist"',
        '  >',
        '    <li class="flex items-center gap-3 rounded-xl border border-[color-mix(in_srgb,var(--tng-semantic-accent-success)_55%,transparent)] px-3 py-2 text-[var(--tng-semantic-foreground-secondary)]"><span class="grid h-7 w-7 place-items-center rounded-full bg-[var(--tng-semantic-accent-success)] text-white">✓</span> Build approved</li>',
        '    <li class="flex items-center gap-3 rounded-xl border border-[color-mix(in_srgb,var(--tng-semantic-accent-brand)_55%,transparent)] bg-[color-mix(in_srgb,var(--tng-semantic-accent-brand)_12%,var(--tng-semantic-background-canvas))] px-3 py-2 text-[var(--tng-semantic-foreground-primary)]"><span class="grid h-7 w-7 place-items-center rounded-full bg-[var(--tng-semantic-accent-brand)] text-white">2</span> Traffic ramp</li>',
        '    <li class="flex items-center gap-3 rounded-xl border border-[var(--tng-semantic-border-subtle)] px-3 py-2 text-[var(--tng-semantic-foreground-secondary)]"><span class="grid h-7 w-7 place-items-center rounded-full bg-[var(--tng-semantic-background-muted)] text-[var(--tng-semantic-foreground-secondary)]">3</span> Post-release review</li>',
        '  </ol>',
        '</section>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'headless-collapsible-overview-tailwind.component.css',
      code: '/* Tailwind utilities are applied directly in the template. */',
    },
  ]);

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
