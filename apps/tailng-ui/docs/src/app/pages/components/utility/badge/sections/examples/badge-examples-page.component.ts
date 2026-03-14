import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngBadge } from '@tailng-ui/components';
import { type TngBadgePosition } from '@tailng-ui/primitives';
import { type DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';

type ExampleVariant = 'headless' | 'plain' | 'tailwind';

function createCodeTabs(
  baseName: string,
  tsCode: string,
  htmlCode: string,
  cssCode: string,
): readonly DocsExampleCodeTab[] {
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
  selector: 'app-badge-examples-page',
  imports: [TngBadge, DocsExampleTabsSectionComponent, DocsExampleVariantDirective],
  templateUrl: './badge-examples-page.component.html',
  styleUrl: './badge-examples-page.component.css',
})
export class BadgeExamplesPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    this.resolveCodeBlockTheme(),
  );
  private readonly colorSchemeObserver = this.observeCodeThemeChanges();

  protected readonly headlessCount = signal(5);
  protected readonly plainCount = signal(12);
  protected readonly tailwindCount = signal(21);

  protected readonly headlessPosition = signal<TngBadgePosition>('top-end');
  protected readonly plainPosition = signal<TngBadgePosition>('top-end');
  protected readonly tailwindPosition = signal<TngBadgePosition>('top-end');

  protected readonly headlessHidden = signal(false);
  protected readonly plainHidden = signal(false);
  protected readonly tailwindHidden = signal(false);

  protected readonly headlessWidth = signal(176);
  protected readonly plainWidth = signal(176);
  protected readonly tailwindWidth = signal(176);

  protected readonly headlessHeight = signal(56);
  protected readonly plainHeight = signal(56);
  protected readonly tailwindHeight = signal(56);

  protected readonly notificationsHeadlessCodeTabs = createCodeTabs(
    'badge-example-notifications-headless',
    [
      "import { Component, signal } from '@angular/core';",
      "import { TngBadge } from '@tailng-ui/primitives';",
      '',
      'export class BadgeNotificationsHeadlessComponent {',
      '  protected readonly count = signal(5);',
      '}',
      '',
    ].join('\n'),
    [
      '<button type="button" [tngBadge]="count()" class="badge-host">Inbox</button>',
      '<button type="button" [tngBadge]="count() * 10" [tngBadgeMax]="99" class="badge-host">Alerts</button>',
      '',
    ].join('\n'),
    [
      '.badge-host {',
      '  border: 1px solid var(--tng-semantic-border-strong);',
      '  border-radius: 0.6rem;',
      '  min-height: 2.4rem;',
      '  padding: 0 1rem;',
      '}',
      '',
    ].join('\n'),
  );

  protected readonly notificationsPlainCodeTabs = createCodeTabs(
    'badge-example-notifications-plain',
    [
      "import { Component, signal } from '@angular/core';",
      "import { TngBadge } from '@tailng-ui/components';",
      '',
      'export class BadgeNotificationsPlainComponent {',
      '  protected readonly count = signal(12);',
      '}',
      '',
    ].join('\n'),
    [
      '<button type="button" [tngBadge]="count()" tngBadgeTone="info" class="badge-host">Inbox</button>',
      '<button type="button" [tngBadge]="count() * 6" tngBadgeTone="danger" [tngBadgeMax]="99" class="badge-host">Alerts</button>',
      '',
    ].join('\n'),
    [
      '.badge-shell {',
      '  background: var(--tng-semantic-background-surface);',
      '  border: 1px solid var(--tng-semantic-border-subtle);',
      '  border-radius: 0.85rem;',
      '  padding: 1rem;',
      '}',
      '',
    ].join('\n'),
  );

  protected readonly notificationsTailwindCodeTabs = createCodeTabs(
    'badge-example-notifications-tailwind',
    [
      "import { Component, signal } from '@angular/core';",
      "import { TngBadge } from '@tailng-ui/components';",
      '',
      'export class BadgeNotificationsTailwindComponent {',
      '  protected readonly count = signal(21);',
      '}',
      '',
    ].join('\n'),
    [
      '<button type="button" [tngBadge]="count()" class="rounded-lg border border-slate-300 px-4 py-2 text-sm dark:border-slate-600">Inbox</button>',
      '<button type="button" [tngBadge]="count() * 4" [tngBadgeMax]="99" class="rounded-lg border border-slate-300 px-4 py-2 text-sm dark:border-slate-600">Alerts</button>',
      '',
    ].join('\n'),
    '/* Tailwind utilities are applied directly in the template. */',
  );

  protected readonly runtimeHeadlessCodeTabs = createCodeTabs(
    'badge-example-runtime-headless',
    [
      "import { Component, signal } from '@angular/core';",
      "import { TngBadge, type TngBadgePosition } from '@tailng-ui/primitives';",
      '',
      'export class BadgeRuntimeHeadlessComponent {',
      '  protected readonly count = signal(5);',
      "  protected readonly position = signal<TngBadgePosition>('top-end');",
      '  protected readonly hidden = signal(false);',
      '}',
      '',
    ].join('\n'),
    [
      '<button',
      '  type="button"',
      '  [tngBadge]="count()"',
      '  [tngBadgeHidden]="hidden()"',
      '  [tngBadgePosition]="position()"',
      '  class="badge-runtime-host"',
      '>',
      '  Runtime host',
      '</button>',
      '',
    ].join('\n'),
    [
      '.badge-runtime-host {',
      '  min-width: 11rem;',
      '  min-height: 3.5rem;',
      '}',
      '',
    ].join('\n'),
  );

  protected readonly runtimePlainCodeTabs = createCodeTabs(
    'badge-example-runtime-plain',
    [
      "import { Component, signal } from '@angular/core';",
      "import { TngBadge, type TngBadgePosition } from '@tailng-ui/components';",
      '',
      'export class BadgeRuntimePlainComponent {',
      "  protected readonly position = signal<TngBadgePosition>('top-end');",
      '}',
      '',
    ].join('\n'),
    [
      '<button type="button" [tngBadge]="14" [tngBadgePosition]="position()" class="badge-runtime-host">',
      '  Runtime host',
      '</button>',
      '',
    ].join('\n'),
    [
      '.badge-runtime-shell {',
      '  border: 1px dashed var(--tng-semantic-border-subtle);',
      '  border-radius: 0.85rem;',
      '  padding: 1rem;',
      '}',
      '',
    ].join('\n'),
  );

  protected readonly runtimeTailwindCodeTabs = createCodeTabs(
    'badge-example-runtime-tailwind',
    [
      "import { Component, signal } from '@angular/core';",
      "import { TngBadge, type TngBadgePosition } from '@tailng-ui/components';",
      '',
      'export class BadgeRuntimeTailwindComponent {',
      "  protected readonly position = signal<TngBadgePosition>('top-end');",
      '}',
      '',
    ].join('\n'),
    [
      '<button',
      '  type="button"',
      '  [tngBadge]="14"',
      '  [tngBadgePosition]="position()"',
      '  class="inline-flex min-h-14 min-w-44 items-center rounded-lg border border-slate-300 px-4 py-2 text-sm dark:border-slate-600"',
      '>',
      '  Runtime host',
      '</button>',
      '',
    ].join('\n'),
    '/* Tailwind utilities are applied directly in the template. */',
  );

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }

  protected adjustCount(scope: ExampleVariant, delta: number): void {
    this.setCount(scope, this.readCount(scope) + delta);
  }

  protected clearCount(scope: ExampleVariant): void {
    this.setCount(scope, 0);
  }

  protected setPosition(scope: ExampleVariant, position: TngBadgePosition): void {
    if (scope === 'headless') {
      this.headlessPosition.set(position);
      return;
    }

    if (scope === 'plain') {
      this.plainPosition.set(position);
      return;
    }

    this.tailwindPosition.set(position);
  }

  protected toggleHidden(scope: ExampleVariant, event: Event): void {
    const input = event.target as HTMLInputElement;
    if (scope === 'headless') {
      this.headlessHidden.set(input.checked);
      return;
    }

    if (scope === 'plain') {
      this.plainHidden.set(input.checked);
      return;
    }

    this.tailwindHidden.set(input.checked);
  }

  protected updateWidth(scope: ExampleVariant, event: Event): void {
    const input = event.target as HTMLInputElement;
    const next = Number(input.value);
    if (scope === 'headless') {
      this.headlessWidth.set(next);
      return;
    }

    if (scope === 'plain') {
      this.plainWidth.set(next);
      return;
    }

    this.tailwindWidth.set(next);
  }

  protected updateHeight(scope: ExampleVariant, event: Event): void {
    const input = event.target as HTMLInputElement;
    const next = Number(input.value);
    if (scope === 'headless') {
      this.headlessHeight.set(next);
      return;
    }

    if (scope === 'plain') {
      this.plainHeight.set(next);
      return;
    }

    this.tailwindHeight.set(next);
  }

  protected count(scope: ExampleVariant): number {
    return this.readCount(scope);
  }

  protected position(scope: ExampleVariant): TngBadgePosition {
    if (scope === 'headless') {
      return this.headlessPosition();
    }

    if (scope === 'plain') {
      return this.plainPosition();
    }

    return this.tailwindPosition();
  }

  protected hidden(scope: ExampleVariant): boolean {
    if (scope === 'headless') {
      return this.headlessHidden();
    }

    if (scope === 'plain') {
      return this.plainHidden();
    }

    return this.tailwindHidden();
  }

  protected width(scope: ExampleVariant): number {
    if (scope === 'headless') {
      return this.headlessWidth();
    }

    if (scope === 'plain') {
      return this.plainWidth();
    }

    return this.tailwindWidth();
  }

  protected height(scope: ExampleVariant): number {
    if (scope === 'headless') {
      return this.headlessHeight();
    }

    if (scope === 'plain') {
      return this.plainHeight();
    }

    return this.tailwindHeight();
  }

  protected runtimeSummary(scope: ExampleVariant): string {
    return `count: ${this.count(scope)} | position: ${this.position(scope)} | hidden: ${this.hidden(scope) ? 'yes' : 'no'}`;
  }

  private readCount(scope: ExampleVariant): number {
    if (scope === 'headless') {
      return this.headlessCount();
    }

    if (scope === 'plain') {
      return this.plainCount();
    }

    return this.tailwindCount();
  }

  private setCount(scope: ExampleVariant, value: number): void {
    const next = Math.max(0, value);
    if (scope === 'headless') {
      this.headlessCount.set(next);
      return;
    }

    if (scope === 'plain') {
      this.plainCount.set(next);
      return;
    }

    this.tailwindCount.set(next);
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
