import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { TngToastItem, TngToastViewport, type TngToastTone } from '@tailng-ui/primitives';
import type { DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';
import {
  observeDocsCodeThemeChanges,
  resolveDocsCodeBlockTheme,
} from '../../../../../../shared/util';

type OverviewToastRecord = Readonly<{
  id: string;
  message: string;
  title: string;
  tone: TngToastTone;
}>;

@Component({
  selector: 'app-headless-toast-overview-page',
  imports: [
    TngCodeBlockComponent,
    TngToastItem,
    TngToastViewport,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './toast-overview-page.component.html',
  styleUrl: './toast-overview-page.component.css',
})
export class HeadlessToastOverviewPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);
  private readonly timeoutByToastId = new Map<string, ReturnType<typeof setTimeout>>();
  private counter = 0;

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly plainToasts = signal<readonly OverviewToastRecord[]>([]);
  protected readonly tailwindToasts = signal<readonly OverviewToastRecord[]>([]);

  protected readonly importCode = [
    'import {',
    '  TngToastItem,',
    '  TngToastViewport,',
    "  type TngToastTone,",
    "} from '@tailng-ui/primitives';",
    '',
  ].join('\n');

  protected readonly compositionCode = [
    '<section class="toast-stage">',
    '  <button type="button" class="toast-trigger" (click)="queueToast()">Show toast</button>',
    '',
    '  <section tngToastViewport class="toast-viewport">',
    '    @for (toast of toasts(); track toast.id) {',
    '      <article tngToastItem [tone]="toast.tone" class="toast-item">',
    '        <div class="toast-content">',
    '          <strong>{{ toast.title }}</strong>',
    '          <p>{{ toast.message }}</p>',
    '        </div>',
    '        <button type="button" class="toast-dismiss" (click)="dismissToast(toast.id)">Dismiss</button>',
    '      </article>',
    '    }',
    '  </section>',
    '</section>',
    '',
  ].join('\n');

  protected readonly plainCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'headless-toast-overview-plain.component.ts',
      code: [
        "import { Component, signal, type OnDestroy } from '@angular/core';",
        'import { TngToastItem, TngToastViewport, type TngToastTone } from \'@tailng-ui/primitives\';',
        '',
        'type ToastRecord = Readonly<{',
        '  id: string;',
        '  message: string;',
        '  title: string;',
        '  tone: TngToastTone;',
        '}>;',
        '',
        '@Component({',
        "  selector: 'app-headless-toast-overview-plain',",
        '  standalone: true,',
        '  imports: [TngToastItem, TngToastViewport],',
        "  templateUrl: './headless-toast-overview-plain.component.html',",
        "  styleUrl: './headless-toast-overview-plain.component.css',",
        '})',
        'export class HeadlessToastOverviewPlainComponent implements OnDestroy {',
        '  private counter = 0;',
        '  private readonly timeoutByToastId = new Map<string, ReturnType<typeof setTimeout>>();',
        '',
        '  protected readonly toasts = signal<readonly ToastRecord[]>([]);',
        '',
        '  protected queueToast(): void {',
        '    this.counter += 1;',
        '    const id = `toast-${this.counter}`;',
        '    this.toasts.update((current) => [',
        '      ...current,',
        '      {',
        '        id,',
        "        message: 'Build completed and artifacts were published.',",
        "        title: 'Success',",
        "        tone: 'success',",
        '      },',
        '    ]);',
        '',
        '    const timeoutId = setTimeout(() => this.dismissToast(id), 4200);',
        '    this.timeoutByToastId.set(id, timeoutId);',
        '  }',
        '',
        '  protected dismissToast(id: string): void {',
        '    const timeoutId = this.timeoutByToastId.get(id);',
        '    if (timeoutId !== undefined) {',
        '      clearTimeout(timeoutId);',
        '      this.timeoutByToastId.delete(id);',
        '    }',
        '',
        '    this.toasts.update((current) => current.filter((toast) => toast.id !== id));',
        '  }',
        '',
        '  public ngOnDestroy(): void {',
        '    for (const timeoutId of this.timeoutByToastId.values()) {',
        '      clearTimeout(timeoutId);',
        '    }',
        '    this.timeoutByToastId.clear();',
        '  }',
        '}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'headless-toast-overview-plain.component.html',
      code: [
        '<section class="headless-toast-overview-stage">',
        '  <button type="button" class="headless-toast-overview-trigger" (click)="queueToast()">',
        '    Show success toast',
        '  </button>',
        '',
        '  <section tngToastViewport class="headless-toast-overview-viewport">',
        '    @for (toast of toasts(); track toast.id) {',
        '      <article tngToastItem [tone]="toast.tone" class="headless-toast-overview-item">',
        '        <div class="headless-toast-overview-copy">',
        '          <strong>{{ toast.title }}</strong>',
        '          <p>{{ toast.message }}</p>',
        '        </div>',
        '        <button',
        '          type="button"',
        '          class="headless-toast-overview-dismiss"',
        '          (click)="dismissToast(toast.id)"',
        '        >',
        '          Dismiss',
        '        </button>',
        '      </article>',
        '    }',
        '  </section>',
        '</section>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'headless-toast-overview-plain.component.css',
      code: [
        '.headless-toast-overview-stage {',
        '  background: color-mix(in srgb, var(--tng-semantic-background-canvas) 72%, transparent);',
        '  border: 1px solid var(--tng-semantic-border-subtle);',
        '  border-radius: 1rem;',
        '  min-height: 13rem;',
        '  padding: 1rem;',
        '  position: relative;',
        '}',
        '',
        '.headless-toast-overview-copy strong {',
        '  color: var(--tng-semantic-accent-success);',
        '}',
        '',
        '.headless-toast-overview-viewport {',
        '  display: grid;',
        '  gap: 0.65rem;',
        '  position: absolute;',
        '  right: 1rem;',
        '  top: 4.4rem;',
        '  width: min(24rem, calc(100% - 2rem));',
        '}',
        '',
        '.headless-toast-overview-item {',
        '  background: var(--tng-semantic-background-surface);',
        '  border: 1px solid var(--tng-semantic-border-default);',
        '  border-radius: 0.85rem;',
        '  color: var(--tng-semantic-foreground-primary);',
        '  display: grid;',
        '  gap: 0.6rem;',
        '  grid-template-columns: 1fr auto;',
        '  padding: 0.75rem 0.85rem;',
        '}',
        '',
        '.headless-toast-overview-item[hidden] {',
        '  display: none !important;',
        '}',
      ].join('\n'),
    },
  ]);

  protected readonly tailwindCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'headless-toast-overview-tailwind.component.ts',
      code: [
        "import { Component, signal, type OnDestroy } from '@angular/core';",
        'import { TngToastItem, TngToastViewport, type TngToastTone } from \'@tailng-ui/primitives\';',
        '',
        'type ToastRecord = Readonly<{',
        '  id: string;',
        '  message: string;',
        '  title: string;',
        '  tone: TngToastTone;',
        '}>;',
        '',
        '@Component({',
        "  selector: 'app-headless-toast-overview-tailwind',",
        '  standalone: true,',
        '  imports: [TngToastItem, TngToastViewport],',
        "  templateUrl: './headless-toast-overview-tailwind.component.html',",
        "  styleUrl: './headless-toast-overview-tailwind.component.css',",
        '})',
        'export class HeadlessToastOverviewTailwindComponent implements OnDestroy {',
        '  private counter = 0;',
        '  private readonly timeoutByToastId = new Map<string, ReturnType<typeof setTimeout>>();',
        '',
        '  protected readonly toasts = signal<readonly ToastRecord[]>([]);',
        '',
        '  protected queueToast(): void {',
        '    this.counter += 1;',
        '    const id = `toast-${this.counter}`;',
        '    this.toasts.update((current) => [',
        '      ...current,',
        '      {',
        '        id,',
        "        message: 'Build completed and artifacts were published.',",
        "        title: 'Success',",
        "        tone: 'success',",
        '      },',
        '    ]);',
        '',
        '    const timeoutId = setTimeout(() => this.dismissToast(id), 4200);',
        '    this.timeoutByToastId.set(id, timeoutId);',
        '  }',
        '',
        '  protected dismissToast(id: string): void {',
        '    const timeoutId = this.timeoutByToastId.get(id);',
        '    if (timeoutId !== undefined) {',
        '      clearTimeout(timeoutId);',
        '      this.timeoutByToastId.delete(id);',
        '    }',
        '',
        '    this.toasts.update((current) => current.filter((toast) => toast.id !== id));',
        '  }',
        '',
        '  public ngOnDestroy(): void {',
        '    for (const timeoutId of this.timeoutByToastId.values()) {',
        '      clearTimeout(timeoutId);',
        '    }',
        '    this.timeoutByToastId.clear();',
        '  }',
        '}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'headless-toast-overview-tailwind.component.html',
      code: [
        '<div',
        '  class="rounded-2xl border border-[var(--tng-semantic-border-subtle)] bg-[color-mix(in_srgb,var(--tng-semantic-background-surface)_88%,transparent)] p-4"',
        '>',
        '  <section class="relative grid min-h-52 content-start gap-3">',
        '    <button',
        '      type="button"',
        '      class="inline-flex justify-self-start rounded-lg border border-[color-mix(in_srgb,var(--tng-semantic-accent-brand)_62%,transparent)] bg-[var(--tng-semantic-accent-brand)] px-3.5 py-2 text-sm font-semibold text-[var(--tng-semantic-foreground-inverse)] shadow-[0_8px_18px_color-mix(in_srgb,var(--tng-semantic-accent-brand)_28%,transparent)] transition hover:bg-[color-mix(in_srgb,var(--tng-semantic-accent-brand)_86%,var(--tng-semantic-foreground-primary)_14%)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[color-mix(in_srgb,var(--tng-semantic-focus-ring)_40%,transparent)]"',
        '      (click)="queueToast()"',
        '    >',
        '      Show success toast',
        '    </button>',
        '',
        '    <section tngToastViewport class="absolute right-0 top-14 grid w-full max-w-sm gap-3">',
        '      @for (toast of toasts(); track toast.id) {',
        '        <article',
        '          tngToastItem',
        '          [tone]="toast.tone"',
        '          class="grid grid-cols-[1fr_auto] gap-3 rounded-2xl border border-[color-mix(in_srgb,var(--tng-semantic-accent-success)_42%,var(--tng-semantic-border-default))] bg-[var(--tng-semantic-background-surface)] p-4 text-[var(--tng-semantic-foreground-primary)] shadow-[0_16px_30px_color-mix(in_srgb,var(--tng-semantic-foreground-primary)_18%,transparent)]"',
        '        >',
        '          <div class="grid gap-1">',
        '            <strong class="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--tng-semantic-accent-success)]">',
        '              {{ toast.title }}',
        '            </strong>',
        '            <p class="m-0 text-sm leading-6 text-[var(--tng-semantic-foreground-secondary)]">{{ toast.message }}</p>',
        '          </div>',
        '          <button',
        '            type="button"',
        '            class="rounded-lg border border-[var(--tng-semantic-border-subtle)] bg-[color-mix(in_srgb,var(--tng-semantic-background-canvas)_86%,transparent)] px-2.5 py-1 text-xs font-semibold text-[var(--tng-semantic-foreground-primary)] transition hover:border-[var(--tng-semantic-border-default)] hover:bg-[color-mix(in_srgb,var(--tng-semantic-background-muted)_68%,transparent)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[color-mix(in_srgb,var(--tng-semantic-focus-ring)_35%,transparent)]"',
        '            (click)="dismissToast(toast.id)"',
        '          >',
        '            Dismiss',
        '          </button>',
        '        </article>',
        '      }',
        '    </section>',
        '  </section>',
        '</div>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'headless-toast-overview-tailwind.component.css',
      code: '/* Tailwind utilities are applied directly in the template. */',
    },
  ]);

  protected queueToast(scope: 'plain' | 'tailwind'): void {
    this.counter += 1;
    const id = `${scope}-${this.counter}`;
    const nextToast: OverviewToastRecord = {
      id,
      message: 'Build completed and artifacts were published.',
      title: 'Success',
      tone: 'success',
    };

    this.updateToasts(scope, (toasts) => [...toasts, nextToast]);

    const timeoutId = setTimeout(() => {
      this.dismissToast(scope, id);
    }, 4200);
    this.timeoutByToastId.set(id, timeoutId);
  }

  protected dismissToast(scope: 'plain' | 'tailwind', id: string): void {
    const timeoutId = this.timeoutByToastId.get(id);
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
      this.timeoutByToastId.delete(id);
    }

    this.updateToasts(scope, (toasts) => toasts.filter((toast) => toast.id !== id));
  }

  public ngOnDestroy(): void {
    for (const timeoutId of this.timeoutByToastId.values()) {
      clearTimeout(timeoutId);
    }
    this.timeoutByToastId.clear();
    this.colorSchemeObserver?.disconnect();
  }

  private updateToasts(
    scope: 'plain' | 'tailwind',
    updater: (toasts: readonly OverviewToastRecord[]) => readonly OverviewToastRecord[],
  ): void {
    const target = scope === 'plain' ? this.plainToasts : this.tailwindToasts;
    target.update((toasts) => updater(toasts));
  }
}
