import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngButtonComponent, TngCodeBlockComponent, TngToastComponent } from '@tailng-ui/components';
import {
  TngToastItem,
  TngToastViewport,
  type TngToastTone,
} from '@tailng-ui/primitives';
import type { DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';

const toneTitleByTone: Readonly<Record<TngToastTone, string>> = Object.freeze({
  danger: 'Error',
  neutral: 'Info',
  success: 'Success',
  warning: 'Warning',
});

type HeadlessToastRecord = Readonly<{
  id: string;
  message: string;
  tone: TngToastTone;
  title: string;
}>;

@Component({
  selector: 'app-toast-overview-page',
  imports: [
    TngButtonComponent,
    TngCodeBlockComponent,
    TngToastComponent,
    TngToastItem,
    TngToastViewport,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './toast-overview-page.component.html',
  styleUrl: './toast-overview-page.component.css',
})
export class ToastOverviewPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);
  private readonly colorSchemeObserver = this.observeCodeThemeChanges();
  private previewCounter = 0;
  private headlessCounter = 0;
  private readonly headlessTimeoutById = new Map<string, ReturnType<typeof setTimeout>>();

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    this.resolveCodeBlockTheme(),
  );
  protected readonly actionEvents = signal<readonly string[]>([]);
  protected readonly headlessToasts = signal<readonly HeadlessToastRecord[]>([]);

  protected readonly primitiveImportCode = [
    "import { TngToastViewport, TngToastItem } from '@tailng-ui/primitives';",
    '',
  ].join('\n');

  protected readonly componentImportCode = [
    "import { TngToastComponent, TngButtonComponent } from '@tailng-ui/components';",
    '',
  ].join('\n');

  protected readonly headlessCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'toast-overview-headless.component.ts',
      code: [
        "import { signal } from '@angular/core';",
        "import { TngToastViewport, TngToastItem } from '@tailng-ui/primitives';",
        '',
        'readonly toasts = signal<ReadonlyArray<{ id: string; title: string; message: string; tone: TngToastTone }>>([]);',
        '',
        'showToast(): void {',
        '  const id = crypto.randomUUID();',
        '  this.toasts.update((current) => [...current, {',
        '    id,',
        "    title: 'Success',",
        "    message: 'Build completed and artifacts were published.',",
        "    tone: 'success',",
        '  }]);',
        '}',
        '',
        'dismissToast(id: string): void {',
        '  this.toasts.update((current) => current.filter((toast) => toast.id !== id));',
        '}',
        '',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'toast-overview-headless.component.html',
      code: [
        '<section class="toast-preview-static">',
        '  <button type="button" class="toast-headless-trigger" (click)="showHeadlessToast()">',
        '    Show headless toast',
        '  </button>',
        '',
        '  <section tngToastViewport class="toast-headless-viewport">',
        '    @for (toast of headlessToasts(); track toast.id) {',
        '      <article tngToastItem [tone]="toast.tone" class="toast-preview-static-item">',
        '        <div class="toast-preview-static-content">',
        '          <strong>{{ toast.title }}</strong>',
        '          <p>{{ toast.message }}</p>',
        '        </div>',
        '        <button type="button" class="toast-headless-dismiss" (click)="dismissHeadlessToast(toast.id)">',
        '          Dismiss',
        '        </button>',
        '      </article>',
        '    }',
        '  </section>',
        '',
        '  <p class="toast-headless-status">active toasts: {{ headlessToasts().length }}</p>',
        '</section>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'toast-overview-headless.component.css',
      code: [
        '.toast-preview-static {',
        '  display: grid;',
        '  gap: 0.65rem;',
        '}',
        '',
        '.toast-headless-viewport {',
        '  display: grid;',
        '  gap: 0.65rem;',
        '  position: fixed;',
        '  right: 1.25rem;',
        '  top: 5rem;',
        '  width: min(24rem, calc(100vw - 2rem));',
        '}',
        '',
        '.toast-preview-static-item {',
        '  background: var(--tng-semantic-background-surface);',
        '  border: 1px solid var(--tng-semantic-border-subtle);',
        '  border-radius: 0.85rem;',
        '  display: grid;',
        '  gap: 0.7rem;',
        '  grid-template-columns: 1fr auto;',
        '  pointer-events: auto;',
        '  padding: 0.75rem 0.85rem;',
        '}',
        '',
      ].join('\n'),
    },
  ]);

  protected readonly plainCssCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'toast-overview-plain-css.component.ts',
      code: this.componentImportCode,
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'toast-overview-plain-css.component.html',
      code: [
        '<tng-toast #toast position="bottom-right"></tng-toast>',
        '<div class="controls">',
        '  <tng-button (click)="showDemoToast(toast, \'success\')">Show success</tng-button>',
        '  <tng-button tone="danger" (click)="showDemoToast(toast, \'danger\')">Show error</tng-button>',
        '  <tng-button tone="success" (click)="showActionToast(toast, \'undo\')">Show undo toast</tng-button>',
        '  <tng-button tone="neutral" (click)="showActionToast(toast, \'retry\')">Show retry snackbar</tng-button>',
        '</div>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'toast-overview-plain-css.component.css',
      code: [
        '.controls {',
        '  display: flex;',
        '  flex-wrap: wrap;',
        '  gap: 0.55rem;',
        '}',
        '',
      ].join('\n'),
    },
  ]);

  protected readonly tailwindCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'toast-overview-tailwind.component.ts',
      code: this.componentImportCode,
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'toast-overview-tailwind.component.html',
      code: [
        '<tng-toast #toast position="bottom-right"></tng-toast>',
        '<div class="flex flex-wrap gap-2 rounded-xl border border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">',
        '  <tng-button (click)="showDemoToast(toast, \'neutral\')">Show info</tng-button>',
        '  <tng-button tone="success" (click)="showDemoToast(toast, \'success\')">Show success</tng-button>',
        '  <tng-button tone="danger" (click)="showDemoToast(toast, \'danger\')">Show error</tng-button>',
        '  <tng-button tone="success" (click)="showActionToast(toast, \'undo\')">Show undo toast</tng-button>',
        '  <tng-button tone="neutral" (click)="showActionToast(toast, \'retry\')">Show retry snackbar</tng-button>',
        '</div>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'toast-overview-tailwind.component.css',
      code: '/* Tailwind utilities are applied directly in the template. */',
    },
  ]);

  protected showDemoToast(toast: TngToastComponent, tone: TngToastTone): void {
    this.previewCounter += 1;
    toast.show(`Toast preview #${this.previewCounter}`, {
      duration: tone === 'danger' ? 0 : 4200,
      title: toneTitleByTone[tone],
      tone,
    });
  }

  protected showActionToast(toast: TngToastComponent, kind: 'retry' | 'undo'): void {
    this.previewCounter += 1;
    if (kind === 'undo') {
      toast.show(`Saved draft #${this.previewCounter}`, {
        action: {
          label: 'Undo',
          onSelect: (id): void => {
            this.actionEvents.update((events) => [`Undo selected for ${id}`, ...events].slice(0, 6));
          },
        },
        duration: 5200,
        title: 'Saved',
        tone: 'success',
      });
      return;
    }

    toast.show(`Publish run #${this.previewCounter} requires another attempt.`, {
      action: {
        dismissOnSelect: false,
        label: 'Retry',
        onSelect: (id): void => {
          this.actionEvents.update((events) => [`Retry selected for ${id}`, ...events].slice(0, 6));
        },
      },
      duration: 0,
      title: 'Action required',
      tone: 'warning',
    });
  }

  protected showHeadlessToast(): void {
    this.headlessCounter += 1;
    const id = `headless-toast-${this.headlessCounter}`;
    const nextToast: HeadlessToastRecord = {
      id,
      message: `Headless toast #${this.headlessCounter}: Build completed and artifacts were published.`,
      tone: 'success',
      title: 'Success',
    };

    this.headlessToasts.update((current) => [...current, nextToast]);

    const timeoutId = setTimeout(() => {
      this.dismissHeadlessToast(id);
    }, 4200);
    this.headlessTimeoutById.set(id, timeoutId);
  }

  protected dismissHeadlessToast(id: string): void {
    const timeoutId = this.headlessTimeoutById.get(id);
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
      this.headlessTimeoutById.delete(id);
    }

    this.headlessToasts.update((current) => current.filter((toast) => toast.id !== id));
  }

  public ngOnDestroy(): void {
    for (const timeoutId of this.headlessTimeoutById.values()) {
      clearTimeout(timeoutId);
    }
    this.headlessTimeoutById.clear();
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
