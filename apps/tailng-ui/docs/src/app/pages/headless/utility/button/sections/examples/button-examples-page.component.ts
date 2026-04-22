import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngPress } from '@tailng-ui/primitives';
import { type DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';
import { observeDocsCodeThemeChanges, resolveDocsCodeBlockTheme } from '../../../../../../shared/util';

type HeadlessButtonExampleScope =
  | 'action-plain'
  | 'action-tailwind'
  | 'anchor-plain'
  | 'anchor-tailwind';

@Component({
  selector: 'app-headless-button-examples-page',
  imports: [TngPress, DocsExampleTabsSectionComponent, DocsExampleVariantDirective],
  templateUrl: './button-examples-page.component.html',
  styleUrl: './button-examples-page.component.css',
})
export class HeadlessButtonExamplesPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);
  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly actionCounts = signal<Record<'plain' | 'tailwind', number>>({
    plain: 0,
    tailwind: 0,
  });
  protected readonly menuOpen = signal<Record<'plain' | 'tailwind', boolean>>({
    plain: false,
    tailwind: false,
  });

  protected readonly actionPlainTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'headless-button-examples-action-plain-css.component.ts',
      code: [
        "import { Component, signal } from '@angular/core';",
        "import { TngPress } from '@tailng-ui/primitives';",
        '',
        '@Component({',
        "  selector: 'app-headless-button-examples-action-plain-css',",
        '  standalone: true,',
        '  imports: [TngPress],',
        "  templateUrl: './headless-button-examples-action-plain-css.component.html',",
        "  styleUrl: './headless-button-examples-action-plain-css.component.css',",
        '})',
        'export class HeadlessButtonExamplesActionPlainCssComponent {',
        '  protected readonly count = signal(0);',
        '}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'headless-button-examples-action-plain-css.component.html',
      code: [
        '<div class="headless-button-example-row">',
        '  <button',
        '    tngPress',
        '    type="button"',
        '    class="headless-button-trigger"',
        '    (click)="count.update((value) => value + 1)"',
        '  >',
        '    Save draft',
        '  </button>',
        '  <button tngPress type="button" class="headless-button-trigger headless-button-trigger--ghost">Cancel</button>',
        '  <button tngPress type="button" class="headless-button-trigger headless-button-trigger--danger" [disabled]="true">Delete</button>',
        '</div>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'headless-button-examples-action-plain-css.component.css',
      code: [
        '.headless-button-example-row {',
        '  display: flex;',
        '  flex-wrap: wrap;',
        '  gap: 0.75rem;',
        '}',
        '',
      ].join('\n'),
    },
  ]);

  protected readonly actionTailwindTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'headless-button-examples-action-tailwind.component.ts',
      code: [
        "import { Component, signal } from '@angular/core';",
        "import { TngPress } from '@tailng-ui/primitives';",
        '',
        '@Component({',
        "  selector: 'app-headless-button-examples-action-tailwind',",
        '  standalone: true,',
        '  imports: [TngPress],',
        "  templateUrl: './headless-button-examples-action-tailwind.component.html',",
        "  styleUrl: './headless-button-examples-action-tailwind.component.css',",
        '})',
        'export class HeadlessButtonExamplesActionTailwindComponent {',
        '  protected readonly count = signal(0);',
        '}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'headless-button-examples-action-tailwind.component.html',
      code: [
        '<div class="rounded-2xl border border-[var(--tng-semantic-border-subtle)] bg-[color-mix(in_srgb,var(--tng-semantic-background-surface)_88%,transparent)] p-4">',
        '  <div class="flex flex-wrap gap-3">',
        '    <button',
        '      tngPress',
        '      type="button"',
        '      class="inline-flex min-h-10 items-center justify-center rounded-xl border border-[color-mix(in_srgb,var(--tng-semantic-accent-success)_58%,transparent)] bg-[var(--tng-semantic-accent-success)] px-4 text-sm font-semibold text-[var(--tng-semantic-foreground-inverse)] transition hover:bg-[color-mix(in_srgb,var(--tng-semantic-accent-success)_88%,var(--tng-semantic-foreground-primary)_12%)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--tng-semantic-focus-ring)_40%,transparent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--tng-semantic-background-base)]"',
        '      (click)="count.update((value) => value + 1)"',
        '    >',
        '      Publish',
        '    </button>',
        '    <button',
        '      tngPress',
        '      type="button"',
        '      class="inline-flex min-h-10 items-center justify-center rounded-xl border border-[var(--tng-semantic-border-default)] px-4 text-sm font-semibold text-[var(--tng-semantic-foreground-primary)] transition hover:bg-[color-mix(in_srgb,var(--tng-semantic-foreground-primary)_6%,transparent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--tng-semantic-focus-ring)_40%,transparent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--tng-semantic-background-base)]"',
        '    >',
        '      Preview',
        '    </button>',
        '  </div>',
        '  <p class="mt-3 text-sm text-[var(--tng-semantic-foreground-secondary)]">clicked: {{ count() }}</p>',
        '</div>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'headless-button-examples-action-tailwind.component.css',
      code: '/* Tailwind utilities are applied directly in the template. */',
    },
  ]);

  protected readonly anchorPlainTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'headless-button-examples-anchor-plain-css.component.ts',
      code: [
        "import { Component, signal } from '@angular/core';",
        "import { TngPress } from '@tailng-ui/primitives';",
        '',
        '@Component({',
        "  selector: 'app-headless-button-examples-anchor-plain-css',",
        '  standalone: true,',
        '  imports: [TngPress],',
        "  templateUrl: './headless-button-examples-anchor-plain-css.component.html',",
        "  styleUrl: './headless-button-examples-anchor-plain-css.component.css',",
        '})',
        'export class HeadlessButtonExamplesAnchorPlainCssComponent {',
        '  protected readonly open = signal(false);',
        '}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'headless-button-examples-anchor-plain-css.component.html',
      code: [
        '<div class="headless-button-disclosure">',
        '  <a',
        '    tngPress',
        '    class="headless-button-trigger headless-button-trigger--disclosure"',
        '    [class.headless-button-trigger--disclosure-open]="open()"',
        '    [ariaHasPopup]="\'menu\'"',
        '    [ariaExpanded]="open()"',
        '    [ariaControls]="\'release-actions-plain\'"',
        '    (click)="open.set(!open())"',
        '  >',
        '    <span class="headless-button-disclosure-label">Release actions</span>',
        '    <svg class="headless-button-disclosure-caret" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">',
        '      <path fill-rule="evenodd" d="M5.22 7.22a.75.75 0 0 1 1.06 0L10 10.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 8.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />',
        '    </svg>',
        '  </a>',
        '  <div id="release-actions-plain" class="headless-button-menu" [hidden]="!open()">',
        '    <p class="headless-button-menu-title">Quick actions</p>',
        '    <ul class="headless-button-menu-list">',
        '      <li>Create release</li>',
        '      <li>Download artifacts</li>',
        '      <li>View audit log</li>',
        '    </ul>',
        '  </div>',
        '</div>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'headless-button-examples-anchor-plain-css.component.css',
      code: [
        '.headless-button-disclosure {',
        '  display: inline-grid;',
        '  gap: 0.25rem;',
        '  max-width: 16.5rem;',
        '}',
        '',
        '.headless-button-trigger--disclosure {',
        '  align-items: center;',
        '  background: color-mix(in srgb, var(--tng-semantic-background-base) 92%, var(--tng-semantic-accent-brand) 5%);',
        '  border: 1px solid var(--tng-semantic-border-default);',
        '  border-radius: 0.75rem;',
        '  box-shadow: inset 0 1px 0 color-mix(in srgb, var(--tng-semantic-background-surface) 65%, transparent);',
        '  color: var(--tng-semantic-foreground-primary);',
        '  gap: 0.45rem;',
        '  justify-content: space-between;',
        '  min-width: 11.5rem;',
        '  padding-inline: 0.75rem;',
        '  text-align: left;',
        '}',
        '',
        '.headless-button-trigger--disclosure-open {',
        '  border-color: color-mix(in srgb, var(--tng-semantic-accent-brand) 35%, var(--tng-semantic-border-default));',
        '}',
        '',
        '.headless-button-disclosure-caret {',
        '  flex-shrink: 0;',
        '  height: 1rem;',
        '  width: 1rem;',
        '}',
        '',
        '.headless-button-trigger--disclosure-open .headless-button-disclosure-caret {',
        '  transform: rotate(180deg);',
        '}',
        '',
        '.headless-button-menu {',
        '  background: var(--tng-semantic-background-base);',
        '  border: 1px solid var(--tng-semantic-border-subtle);',
        '  border-radius: 0.75rem;',
        '  box-shadow: 0 12px 28px -14px color-mix(in srgb, var(--tng-semantic-foreground-primary) 28%, transparent);',
        '  padding: 0.5rem 0;',
        '}',
        '',
        '.headless-button-menu-title {',
        '  border-bottom: 1px solid var(--tng-semantic-border-subtle);',
        '  color: var(--tng-semantic-foreground-muted);',
        '  font-size: 0.68rem;',
        '  font-weight: 650;',
        '  letter-spacing: 0.14em;',
        '  margin: 0;',
        '  padding: 0 0.75rem 0.5rem;',
        '  text-transform: uppercase;',
        '}',
        '',
        '.headless-button-menu-list {',
        '  list-style: none;',
        '  margin: 0;',
        '  padding: 0.25rem 0.25rem 0;',
        '}',
        '',
        '.headless-button-menu-list li {',
        '  border-radius: 0.5rem;',
        '  font-size: 0.875rem;',
        '  padding: 0.5rem 0.65rem;',
        '}',
        '',
        '.headless-button-menu-list li + li {',
        '  border-top: 1px solid color-mix(in srgb, var(--tng-semantic-border-subtle) 88%, transparent);',
        '}',
        '',
      ].join('\n'),
    },
  ]);

  protected readonly anchorTailwindTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'headless-button-examples-anchor-tailwind.component.ts',
      code: [
        "import { Component, signal } from '@angular/core';",
        "import { TngPress } from '@tailng-ui/primitives';",
        '',
        '@Component({',
        "  selector: 'app-headless-button-examples-anchor-tailwind',",
        '  standalone: true,',
        '  imports: [TngPress],',
        "  templateUrl: './headless-button-examples-anchor-tailwind.component.html',",
        "  styleUrl: './headless-button-examples-anchor-tailwind.component.css',",
        '})',
        'export class HeadlessButtonExamplesAnchorTailwindComponent {',
        '  protected readonly open = signal(false);',
        '}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'headless-button-examples-anchor-tailwind.component.html',
      code: [
        '<div class="rounded-2xl border border-[var(--tng-semantic-border-subtle)] bg-[color-mix(in_srgb,var(--tng-semantic-background-surface)_88%,transparent)] p-4">',
        '  <div class="inline-grid max-w-[16.5rem] gap-1">',
        '    <a',
        '      tngPress',
        '      class="inline-flex min-h-10 w-full min-w-[11.5rem] items-center justify-between gap-2 rounded-xl border border-[var(--tng-semantic-border-default)] bg-[color-mix(in_srgb,var(--tng-semantic-background-base)_92%,var(--tng-semantic-accent-brand)_5%)] px-3 py-2 text-left text-sm font-semibold text-[var(--tng-semantic-foreground-primary)] no-underline shadow-[inset_0_1px_0_color-mix(in_srgb,var(--tng-semantic-background-surface)_65%,transparent)] transition hover:border-[color-mix(in_srgb,var(--tng-semantic-accent-brand)_28%,var(--tng-semantic-border-default))] hover:bg-[color-mix(in_srgb,var(--tng-semantic-background-base)_88%,var(--tng-semantic-accent-brand)_8%)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--tng-semantic-focus-ring)_40%,transparent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color-mix(in_srgb,var(--tng-semantic-background-surface)_88%,transparent)] aria-[expanded=true]:border-[color-mix(in_srgb,var(--tng-semantic-accent-brand)_35%,var(--tng-semantic-border-default))]"',
        '      [ariaHasPopup]="\'menu\'"',
        '      [ariaExpanded]="open()"',
        '      [ariaControls]="\'release-actions-tailwind\'"',
        '      (click)="open.set(!open())"',
        '    >',
        '      <span>Release actions</span>',
        '      <svg class="h-4 w-4 shrink-0 opacity-70 transition-transform duration-200 ease-out" [class.rotate-180]="open()" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">',
        '        <path fill-rule="evenodd" d="M5.22 7.22a.75.75 0 0 1 1.06 0L10 10.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 8.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />',
        '      </svg>',
        '    </a>',
        '    <div',
        '      id="release-actions-tailwind"',
        '      class="rounded-xl border border-[var(--tng-semantic-border-subtle)] bg-[var(--tng-semantic-background-base)] py-2 text-[var(--tng-semantic-foreground-primary)] shadow-[0_12px_28px_-14px_color-mix(in_srgb,var(--tng-semantic-foreground-primary)_28%,transparent)]"',
        '      [hidden]="!open()"',
        '    >',
        '      <p class="border-b border-[var(--tng-semantic-border-subtle)] px-3 pb-2 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[var(--tng-semantic-foreground-muted)]">Quick actions</p>',
        '      <ul class="m-0 list-none divide-y divide-[color-mix(in_srgb,var(--tng-semantic-border-subtle)_88%,transparent)] px-1 py-1 text-sm">',
        '        <li class="rounded-lg px-2.5 py-2 text-[var(--tng-semantic-foreground-primary)]">Create release</li>',
        '        <li class="rounded-lg px-2.5 py-2 text-[var(--tng-semantic-foreground-primary)]">Download artifacts</li>',
        '        <li class="rounded-lg px-2.5 py-2 text-[var(--tng-semantic-foreground-primary)]">View audit log</li>',
        '      </ul>',
        '    </div>',
        '  </div>',
        '</div>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'headless-button-examples-anchor-tailwind.component.css',
      code: '/* Tailwind utilities are applied directly in the template. */',
    },
  ]);

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }

  protected increment(scope: 'plain' | 'tailwind'): void {
    this.actionCounts.update((current) => ({
      ...current,
      [scope]: current[scope] + 1,
    }));
  }

  protected count(scope: 'plain' | 'tailwind'): number {
    return this.actionCounts()[scope];
  }

  protected toggleAnchor(scope: 'plain' | 'tailwind'): void {
    this.menuOpen.update((current) => ({
      ...current,
      [scope]: !current[scope],
    }));
  }

  protected isAnchorOpen(scope: 'plain' | 'tailwind'): boolean {
    return this.menuOpen()[scope];
  }
}
