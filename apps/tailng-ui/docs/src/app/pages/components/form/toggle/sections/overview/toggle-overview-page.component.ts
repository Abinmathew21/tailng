import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngToggleComponent, TngCodeBlockComponent } from '@tailng-ui/components';
import { TngToggle as TngTogglePrimitive } from '@tailng-ui/primitives';
import { type DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';

@Component({
  selector: 'app-toggle-overview-page',
  imports: [
    TngCodeBlockComponent,
    TngToggleComponent,
    TngTogglePrimitive,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './toggle-overview-page.component.html',
  styleUrl: './toggle-overview-page.component.css',
})
export class ToggleOverviewPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    this.resolveCodeBlockTheme(),
  );
  private readonly colorSchemeObserver = this.observeCodeThemeChanges();

  protected readonly headlessBold = signal(true);
  protected readonly headlessItalic = signal(false);
  protected readonly plainBold = signal(true);
  protected readonly plainItalic = signal(false);
  protected readonly tailwindGrid = signal(true);
  protected readonly tailwindList = signal(false);

  protected readonly primitiveImportCode = "import { TngToggle } from '@tailng-ui/primitives';";

  protected readonly componentImportCode =
    "import { TngToggleComponent } from '@tailng-ui/components';";

  protected readonly primitiveUsageCode = [
    '<button tngToggle [pressed]="isBold()" (pressedChange)="isBold.set($event)">',
    '  Bold',
    '</button>',
    '',
  ].join('\n');

  protected readonly componentUsageCode = [
    '<tng-toggle',
    '  [pressed]="notificationsEnabled()"',
    '  pressedLabel="Disable notifications"',
    '  unpressedLabel="Enable notifications"',
    '  (pressedChange)="notificationsEnabled.set($event)"',
    '>',
    '  <span offIcon>🔔</span>',
    '  <span onIcon>🔕</span>',
    '</tng-toggle>',
    '',
  ].join('\n');

  protected readonly headlessCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'toggle-headless-example.component.html',
      code: [
        '<div class="toggle-stack">',
        '  <button',
        '    tngToggle',
        '    class="toggle-preview-control"',
        '    [pressed]="headlessBold()"',
        '    (pressedChange)="headlessBold.set($event)"',
        '  >',
        '    Bold',
        '  </button>',
        '  <button',
        '    tngToggle',
        '    class="toggle-preview-control"',
        '    [pressed]="headlessItalic()"',
        '    (pressedChange)="headlessItalic.set($event)"',
        '  >',
        '    Italic',
        '  </button>',
        '  <button tngToggle class="toggle-preview-control" [disabled]="true">Disabled</button>',
        '</div>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'toggle-headless-example.component.css',
      code: [
        '.toggle-stack { display: grid; gap: 0.7rem; }',
        '.toggle-preview-control {',
        '  align-items: center;',
        '  background: var(--tng-semantic-background-surface);',
        '  border: 1px solid var(--tng-semantic-border-strong);',
        '  border-radius: 0.65rem;',
        '  color: var(--tng-semantic-foreground-primary);',
        '  cursor: pointer;',
        '  display: inline-flex;',
        '  font-size: 0.86rem;',
        '  font-weight: 600;',
        '  justify-content: center;',
        '  min-height: 2rem;',
        '  min-width: 5.5rem;',
        '  padding: 0.35rem 0.8rem;',
        '  transition: background-color 150ms ease, border-color 150ms ease, color 150ms ease;',
        '}',
        '.toggle-preview-control[data-state="on"] {',
        '  background: var(--tng-semantic-accent-brand);',
        '  border-color: var(--tng-semantic-accent-brand);',
        '  color: var(--tng-color-white);',
        '}',
        '.toggle-preview-control[data-disabled] {',
        '  cursor: not-allowed;',
        '  opacity: 0.6;',
        '}',
        '',
      ].join('\n'),
    },
  ]);

  protected readonly plainCssCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'toggle-plain-css-example.component.html',
      code: [
        '<div class="plain-toggle-card">',
        '  <tng-toggle',
        '    [pressed]="plainBold()"',
        '    pressedLabel="Disable bold"',
        '    unpressedLabel="Enable bold"',
        '    (pressedChange)="plainBold.set($event)"',
        '  >',
        '    <span offIcon>B</span>',
        '    <span onIcon>B</span>',
        '  </tng-toggle>',
        '  <tng-toggle',
        '    [pressed]="plainItalic()"',
        '    pressedLabel="Disable italic"',
        '    unpressedLabel="Enable italic"',
        '    (pressedChange)="plainItalic.set($event)"',
        '  >',
        '    <span offIcon>I</span>',
        '    <span onIcon>I</span>',
        '  </tng-toggle>',
        '  <tng-toggle [disabled]="true">Disabled</tng-toggle>',
        '</div>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'toggle-plain-css-example.component.css',
      code: [
        '.plain-toggle-card {',
        '  background: var(--tng-semantic-background-surface);',
        '  border: 1px solid var(--tng-semantic-border-subtle);',
        '  border-radius: 0.8rem;',
        '  display: grid;',
        '  gap: 0.75rem;',
        '  padding: 0.9rem 1rem;',
        '}',
        '',
      ].join('\n'),
    },
  ]);

  protected readonly tailwindCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'toggle-tailwind-example.component.html',
      code: [
        '<div',
        '  class="grid gap-3 rounded-xl border border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60"',
        '>',
        '  <tng-toggle',
        '    [pressed]="tailwindGrid()"',
        '    class="text-slate-900 dark:text-slate-100"',
        '    (pressedChange)="tailwindGrid.set($event)"',
        '  >',
        '    <span offIcon>grid</span>',
        '    <span onIcon>grid</span>',
        '  </tng-toggle>',
        '  <tng-toggle',
        '    [pressed]="tailwindList()"',
        '    class="text-slate-900 dark:text-slate-100"',
        '    (pressedChange)="tailwindList.set($event)"',
        '  >',
        '    <span offIcon>list</span>',
        '    <span onIcon>list</span>',
        '  </tng-toggle>',
        '  <tng-toggle [disabled]="true" class="text-slate-900 dark:text-slate-100">disabled</tng-toggle>',
        '</div>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'toggle-tailwind-example.component.css',
      code: '/* Tailwind utilities are applied directly in the template. */',
    },
  ]);

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

    return computedColorScheme?.includes('dark') ? 'github-dark' : 'github-light';
  }
}
