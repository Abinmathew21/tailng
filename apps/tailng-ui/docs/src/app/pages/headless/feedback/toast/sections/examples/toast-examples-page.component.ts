import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
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

type HeadlessToastRecord = Readonly<{
  id: number;
  message: string;
  title: string;
  tone: TngToastTone;
}>;

type ToastScope =
  | 'fixedPlain'
  | 'fixedTailwind'
  | 'escalationPlain'
  | 'escalationTailwind'
  | 'streamPlain'
  | 'streamTailwind';

@Component({
  selector: 'app-headless-toast-examples-page',
  imports: [TngToastItem, TngToastViewport, DocsExampleTabsSectionComponent, DocsExampleVariantDirective],
  templateUrl: './toast-examples-page.component.html',
  styleUrl: './toast-examples-page.component.css',
})
export class HeadlessToastExamplesPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);
  private readonly timerByScopeId = new Map<string, ReturnType<typeof setTimeout>>();
  private counter = 0;

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly streamPlainToasts = signal<readonly HeadlessToastRecord[]>([]);
  protected readonly streamTailwindToasts = signal<readonly HeadlessToastRecord[]>([]);
  protected readonly fixedPlainToasts = signal<readonly HeadlessToastRecord[]>([]);
  protected readonly fixedTailwindToasts = signal<readonly HeadlessToastRecord[]>([]);
  protected readonly escalationPlainToasts = signal<readonly HeadlessToastRecord[]>([]);
  protected readonly escalationTailwindToasts = signal<readonly HeadlessToastRecord[]>([]);

  protected readonly streamPlainCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'headless-toast-stream-plain.component.ts',
      code: [
        "import { Component, signal, type OnDestroy } from '@angular/core';",
        "import { TngToastItem, TngToastViewport, type TngToastTone } from '@tailng-ui/primitives';",
        '',
        'type ToastRecord = Readonly<{',
        '  id: number;',
        '  message: string;',
        '  title: string;',
        '  tone: TngToastTone;',
        '}>;',
        '',
        '@Component({',
        "  selector: 'app-headless-toast-stream-plain',",
        '  standalone: true,',
        '  imports: [TngToastItem, TngToastViewport],',
        "  templateUrl: './headless-toast-stream-plain.component.html',",
        "  styleUrl: './headless-toast-stream-plain.component.css',",
        '})',
        'export class HeadlessToastStreamPlainComponent implements OnDestroy {',
        '  private counter = 0;',
        '  private readonly timeoutByToastId = new Map<number, ReturnType<typeof setTimeout>>();',
        '',
        '  protected readonly toasts = signal<readonly ToastRecord[]>([]);',
        '',
        '  protected showToast(tone: \'neutral\' | \'success\'): void {',
        '    this.counter += 1;',
        '    const id = this.counter;',
        '    this.toasts.update((current) => [',
        '      ...current,',
        '      {',
        '        id,',
        "        message: tone === 'success' ? 'Release note published to customer portal.' : 'Autosave completed for the deployment checklist.',",
        "        title: tone === 'success' ? 'Success' : 'Info',",
        '        tone,',
        '      },',
        '    ]);',
        '',
        '    const timeoutId = setTimeout(() => this.dismissToast(id), 4200);',
        '    this.timeoutByToastId.set(id, timeoutId);',
        '  }',
        '',
        '  protected dismissToast(id: number): void {',
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
      title: 'headless-toast-stream-plain.component.html',
      code: [
        '<section class="headless-toast-example-stage">',
        '  <div class="headless-toast-example-toolbar">',
        '    <button type="button" class="headless-toast-example-trigger" (click)="showToast(\'neutral\')">',
        '      Show info toast',
        '    </button>',
        '    <button type="button" class="headless-toast-example-trigger" (click)="showToast(\'success\')">',
        '      Show success toast',
        '    </button>',
        '  </div>',
        '',
        '  <section tngToastViewport class="headless-toast-example-viewport">',
        '    @for (toast of toasts(); track toast.id) {',
        '      <article tngToastItem [tone]="toast.tone" class="headless-toast-example-item">',
        '        <strong>{{ toast.title }}</strong>',
        '        <p>{{ toast.message }}</p>',
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
      title: 'headless-toast-stream-plain.component.css',
      code: [
        '.headless-toast-example-stage {',
        '  background: color-mix(in srgb, var(--tng-semantic-background-canvas) 72%, transparent);',
        '  border: 1px solid var(--tng-semantic-border-subtle);',
        '  border-radius: 1rem;',
        '  min-height: 13rem;',
        '  padding: 1rem;',
        '  position: relative;',
        '}',
        '',
        '.headless-toast-example-viewport {',
        '  display: grid;',
        '  gap: 0.65rem;',
        '  position: absolute;',
        '  right: 1rem;',
        '  top: 4.5rem;',
        '  width: min(24rem, calc(100% - 2rem));',
        '}',
        '',
        '.headless-toast-example-item {',
        '  background: var(--tng-semantic-background-surface);',
        '  border: 1px solid var(--tng-semantic-border-default);',
        '  border-radius: 0.85rem;',
        '  color: var(--tng-semantic-foreground-primary);',
        '  display: grid;',
        '  gap: 0.35rem;',
        '  padding: 0.8rem 0.85rem;',
        '}',
        '',
        '.headless-toast-example-item strong {',
        '  color: var(--tng-semantic-foreground-secondary);',
        '}',
        '',
        '.headless-toast-example-item[data-tone="success"] strong {',
        '  color: var(--tng-semantic-accent-success);',
        '}',
      ].join('\n'),
    },
  ]);

  protected readonly streamTailwindCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'headless-toast-stream-tailwind.component.ts',
      code: [
        "import { Component, signal, type OnDestroy } from '@angular/core';",
        "import { TngToastItem, TngToastViewport, type TngToastTone } from '@tailng-ui/primitives';",
        '',
        'type ToastRecord = Readonly<{',
        '  id: number;',
        '  message: string;',
        '  title: string;',
        '  tone: TngToastTone;',
        '}>;',
        '',
        '@Component({',
        "  selector: 'app-headless-toast-stream-tailwind',",
        '  standalone: true,',
        '  imports: [TngToastItem, TngToastViewport],',
        "  templateUrl: './headless-toast-stream-tailwind.component.html',",
        "  styleUrl: './headless-toast-stream-tailwind.component.css',",
        '})',
        'export class HeadlessToastStreamTailwindComponent implements OnDestroy {',
        '  private counter = 0;',
        '  private readonly timeoutByToastId = new Map<number, ReturnType<typeof setTimeout>>();',
        '',
        '  protected readonly toasts = signal<readonly ToastRecord[]>([]);',
        '',
        '  protected showToast(tone: \'neutral\' | \'success\'): void {',
        '    this.counter += 1;',
        '    const id = this.counter;',
        '    this.toasts.update((current) => [',
        '      ...current,',
        '      {',
        '        id,',
        "        message: tone === 'success' ? 'Release note published to customer portal.' : 'Autosave completed for the deployment checklist.',",
        "        title: tone === 'success' ? 'Success' : 'Info',",
        '        tone,',
        '      },',
        '    ]);',
        '',
        '    const timeoutId = setTimeout(() => this.dismissToast(id), 4200);',
        '    this.timeoutByToastId.set(id, timeoutId);',
        '  }',
        '',
        '  protected dismissToast(id: number): void {',
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
      title: 'headless-toast-stream-tailwind.component.html',
      code: [
        '<div',
        '  class="rounded-2xl border border-[var(--tng-semantic-border-subtle)] bg-[color-mix(in_srgb,var(--tng-semantic-background-surface)_88%,transparent)] p-4"',
        '>',
        '  <section class="relative grid min-h-56 content-start gap-3">',
        '    <div class="flex flex-wrap gap-2">',
        '      <button',
        '        type="button"',
        '        class="rounded-lg border border-[var(--tng-semantic-border-subtle)] bg-[color-mix(in_srgb,var(--tng-semantic-background-canvas)_90%,transparent)] px-3 py-2 text-sm font-semibold text-[var(--tng-semantic-foreground-primary)] transition hover:bg-[color-mix(in_srgb,var(--tng-semantic-background-muted)_58%,transparent)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[color-mix(in_srgb,var(--tng-semantic-focus-ring)_38%,transparent)]"',
        '        (click)="showToast(\'neutral\')"',
        '      >',
        '        Show info toast',
        '      </button>',
        '      <button',
        '        type="button"',
        '        class="rounded-lg border border-[color-mix(in_srgb,var(--tng-semantic-accent-success)_58%,transparent)] bg-[var(--tng-semantic-accent-success)] px-3 py-2 text-sm font-semibold text-[var(--tng-semantic-foreground-inverse)] transition hover:bg-[color-mix(in_srgb,var(--tng-semantic-accent-success)_88%,var(--tng-semantic-foreground-primary)_12%)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[color-mix(in_srgb,var(--tng-semantic-accent-success)_35%,transparent)]"',
        '        (click)="showToast(\'success\')"',
        '      >',
        '        Show success toast',
        '      </button>',
        '    </div>',
        '',
        '    <section tngToastViewport class="absolute right-0 top-14 grid w-full max-w-sm gap-3">',
        '      @for (toast of toasts(); track toast.id) {',
        '        <article',
        '          tngToastItem',
        '          [tone]="toast.tone"',
        '          class="group grid gap-1 rounded-2xl border border-[var(--tng-semantic-border-default)] bg-[var(--tng-semantic-background-surface)] p-4 text-[var(--tng-semantic-foreground-primary)] shadow-[0_16px_30px_color-mix(in_srgb,var(--tng-semantic-foreground-primary)_18%,transparent)] data-[tone=success]:border-[color-mix(in_srgb,var(--tng-semantic-accent-success)_45%,var(--tng-semantic-border-default))]"',
        '        >',
        '          <strong class="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--tng-semantic-foreground-secondary)] group-data-[tone=success]:text-[var(--tng-semantic-accent-success)]">{{ toast.title }}</strong>',
        '          <p class="m-0 text-sm leading-6 text-[var(--tng-semantic-foreground-secondary)]">{{ toast.message }}</p>',
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
      title: 'headless-toast-stream-tailwind.component.css',
      code: '/* Tailwind utilities are applied directly in the template. */',
    },
  ]);

  protected readonly escalationPlainCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'headless-toast-escalation-plain.component.ts',
      code: [
        "import { Component, signal, type OnDestroy } from '@angular/core';",
        "import { TngToastItem, TngToastViewport, type TngToastTone } from '@tailng-ui/primitives';",
        '',
        'type ToastRecord = Readonly<{',
        '  id: number;',
        '  message: string;',
        '  title: string;',
        '  tone: TngToastTone;',
        '}>;',
        '',
        '@Component({',
        "  selector: 'app-headless-toast-escalation-plain',",
        '  standalone: true,',
        '  imports: [TngToastItem, TngToastViewport],',
        "  templateUrl: './headless-toast-escalation-plain.component.html',",
        "  styleUrl: './headless-toast-escalation-plain.component.css',",
        '})',
        'export class HeadlessToastEscalationPlainComponent implements OnDestroy {',
        '  private counter = 0;',
        '  private readonly timeoutByToastId = new Map<number, ReturnType<typeof setTimeout>>();',
        '',
        '  protected readonly toasts = signal<readonly ToastRecord[]>([]);',
        '',
        '  protected showToast(tone: \'warning\' | \'danger\'): void {',
        '    this.counter += 1;',
        '    const id = this.counter;',
        '    this.toasts.update((current) => [',
        '      ...current,',
        '      {',
        '        id,',
        "        message: tone === 'danger' ? 'Rollback required. Manual approval is pending.' : 'Validation skipped for an optional security policy.',",
        "        title: tone === 'danger' ? 'Error' : 'Warning',",
        '        tone,',
        '      },',
        '    ]);',
        '',
        "    if (tone === 'danger') {",
        '      return;',
        '    }',
        '',
        '    const timeoutId = setTimeout(() => this.dismissToast(id), 4200);',
        '    this.timeoutByToastId.set(id, timeoutId);',
        '  }',
        '',
        '  protected dismissToast(id: number): void {',
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
      title: 'headless-toast-escalation-plain.component.html',
      code: [
        '<section class="headless-toast-example-stage">',
        '  <div class="headless-toast-example-toolbar">',
        '    <button',
        '      type="button"',
        '      class="headless-toast-example-trigger headless-toast-example-trigger--warning"',
        '      (click)="showToast(\'warning\')"',
        '    >',
        '      Show warning toast',
        '    </button>',
        '    <button',
        '      type="button"',
        '      class="headless-toast-example-trigger headless-toast-example-trigger--danger"',
        '      (click)="showToast(\'danger\')"',
        '    >',
        '      Show persistent error',
        '    </button>',
        '  </div>',
        '',
        '  <section tngToastViewport class="headless-toast-example-viewport">',
        '    @for (toast of toasts(); track toast.id) {',
        '      <article tngToastItem [tone]="toast.tone" class="headless-toast-example-item">',
        '        <strong>{{ toast.title }}</strong>',
        '        <p>{{ toast.message }}</p>',
        '        @if (toast.tone === \'danger\') {',
        '          <button type="button" class="headless-toast-example-dismiss" (click)="dismissToast(toast.id)">',
        '            Dismiss',
        '          </button>',
        '        }',
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
      title: 'headless-toast-escalation-plain.component.css',
      code: [
        '.headless-toast-example-item {',
        '  color: var(--tng-semantic-foreground-primary);',
        '}',
        '',
        '.headless-toast-example-item strong {',
        '  color: var(--tng-semantic-foreground-secondary);',
        '}',
        '',
        '.headless-toast-example-item[data-tone="warning"] strong {',
        '  color: var(--tng-semantic-accent-warning);',
        '}',
        '',
        '.headless-toast-example-item[data-tone="danger"] strong {',
        '  color: var(--tng-semantic-accent-danger);',
        '}',
        '',
        '.headless-toast-example-item[data-tone="warning"] {',
        '  border-color: color-mix(in srgb, var(--tng-semantic-accent-warning) 72%, transparent);',
        '}',
        '',
        '.headless-toast-example-item[data-tone="danger"] {',
        '  border-color: color-mix(in srgb, var(--tng-semantic-accent-danger) 72%, transparent);',
        '}',
        '',
        '.headless-toast-example-dismiss {',
        '  justify-self: start;',
        '}',
      ].join('\n'),
    },
  ]);

  protected readonly fixedPlainCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'headless-toast-fixed-plain.component.ts',
      code: [
        "import { Component, signal, type OnDestroy } from '@angular/core';",
        "import { TngToastItem, TngToastViewport, type TngToastTone } from '@tailng-ui/primitives';",
        '',
        'type ToastRecord = Readonly<{',
        '  id: number;',
        '  message: string;',
        '  title: string;',
        '  tone: TngToastTone;',
        '}>;',
        '',
        '@Component({',
        "  selector: 'app-headless-toast-fixed-plain',",
        '  standalone: true,',
        '  imports: [TngToastItem, TngToastViewport],',
        "  templateUrl: './headless-toast-fixed-plain.component.html',",
        "  styleUrl: './headless-toast-fixed-plain.component.css',",
        '})',
        'export class HeadlessToastFixedPlainComponent implements OnDestroy {',
        '  private counter = 0;',
        '  private readonly timeoutByToastId = new Map<number, ReturnType<typeof setTimeout>>();',
        '',
        '  protected readonly toasts = signal<readonly ToastRecord[]>([]);',
        '',
        '  protected showToast(): void {',
        '    this.counter += 1;',
        '    const id = this.counter;',
        '    this.toasts.update((current) => [',
        '      ...current,',
        '      {',
        '        id,',
        "        message: 'Saved filters to the shared release dashboard.',",
        "        title: 'Saved',",
        "        tone: 'success',",
        '      },',
        '    ]);',
        '',
        '    const timeoutId = setTimeout(() => this.dismissToast(id), 4200);',
        '    this.timeoutByToastId.set(id, timeoutId);',
        '  }',
        '',
        '  protected dismissToast(id: number): void {',
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
      title: 'headless-toast-fixed-plain.component.html',
      code: [
        '<section class="headless-toast-example-stage headless-toast-example-stage--compact">',
        '  <button type="button" class="headless-toast-example-trigger" (click)="showToast()">',
        '    Show bottom-right toast',
        '  </button>',
        '',
        '  <p class="headless-toast-example-note">',
        '    This viewport is fixed to the real window corner, not contained by the preview box.',
        '  </p>',
        '',
        '  <section tngToastViewport class="headless-toast-example-viewport headless-toast-example-viewport--fixed">',
        '    @for (toast of toasts(); track toast.id) {',
        '      <article tngToastItem [tone]="toast.tone" class="headless-toast-example-item">',
        '        <strong>{{ toast.title }}</strong>',
        '        <p>{{ toast.message }}</p>',
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
      title: 'headless-toast-fixed-plain.component.css',
      code: [
        '.headless-toast-example-stage {',
        '  background: color-mix(in srgb, var(--tng-semantic-background-canvas) 72%, transparent);',
        '}',
        '',
        '.headless-toast-example-item strong {',
        '  color: var(--tng-semantic-accent-success);',
        '}',
        '',
        '.headless-toast-example-viewport--fixed {',
        '  bottom: 1rem;',
        '  position: fixed;',
        '  right: 1rem;',
        '  top: auto;',
        '  width: min(24rem, calc(100vw - 2rem));',
        '  z-index: 80;',
        '}',
      ].join('\n'),
    },
  ]);

  protected readonly fixedTailwindCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'headless-toast-fixed-tailwind.component.ts',
      code: [
        "import { Component, signal, type OnDestroy } from '@angular/core';",
        "import { TngToastItem, TngToastViewport, type TngToastTone } from '@tailng-ui/primitives';",
        '',
        'type ToastRecord = Readonly<{',
        '  id: number;',
        '  message: string;',
        '  title: string;',
        '  tone: TngToastTone;',
        '}>;',
        '',
        '@Component({',
        "  selector: 'app-headless-toast-fixed-tailwind',",
        '  standalone: true,',
        '  imports: [TngToastItem, TngToastViewport],',
        "  templateUrl: './headless-toast-fixed-tailwind.component.html',",
        "  styleUrl: './headless-toast-fixed-tailwind.component.css',",
        '})',
        'export class HeadlessToastFixedTailwindComponent implements OnDestroy {',
        '  private counter = 0;',
        '  private readonly timeoutByToastId = new Map<number, ReturnType<typeof setTimeout>>();',
        '',
        '  protected readonly toasts = signal<readonly ToastRecord[]>([]);',
        '',
        '  protected showToast(): void {',
        '    this.counter += 1;',
        '    const id = this.counter;',
        '    this.toasts.update((current) => [',
        '      ...current,',
        '      {',
        '        id,',
        "        message: 'Saved filters to the shared release dashboard.',",
        "        title: 'Saved',",
        "        tone: 'success',",
        '      },',
        '    ]);',
        '',
        '    const timeoutId = setTimeout(() => this.dismissToast(id), 4200);',
        '    this.timeoutByToastId.set(id, timeoutId);',
        '  }',
        '',
        '  protected dismissToast(id: number): void {',
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
      title: 'headless-toast-fixed-tailwind.component.html',
      code: [
        '<div',
        '  class="rounded-2xl border border-[var(--tng-semantic-border-subtle)] bg-[color-mix(in_srgb,var(--tng-semantic-background-surface)_88%,transparent)] p-4"',
        '>',
        '  <section class="grid min-h-32 content-start gap-3">',
        '    <button',
        '      type="button"',
        '      class="inline-flex justify-self-start rounded-lg border border-[color-mix(in_srgb,var(--tng-semantic-accent-brand)_62%,transparent)] bg-[var(--tng-semantic-accent-brand)] px-3.5 py-2 text-sm font-semibold text-[var(--tng-semantic-foreground-inverse)] shadow-[0_8px_18px_color-mix(in_srgb,var(--tng-semantic-accent-brand)_28%,transparent)] transition hover:bg-[color-mix(in_srgb,var(--tng-semantic-accent-brand)_86%,var(--tng-semantic-foreground-primary)_14%)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[color-mix(in_srgb,var(--tng-semantic-focus-ring)_40%,transparent)]"',
        '      (click)="showToast()"',
        '    >',
        '      Show bottom-right toast',
        '    </button>',
        '    <p class="m-0 max-w-xl text-sm leading-6 text-[var(--tng-semantic-foreground-secondary)]">',
        '      This viewport is fixed to the real window corner, not contained by the preview box.',
        '    </p>',
        '',
        '    <section tngToastViewport class="fixed bottom-4 right-4 z-[80] grid w-[min(24rem,calc(100vw-2rem))] gap-3">',
        '      @for (toast of toasts(); track toast.id) {',
        '        <article',
        '          tngToastItem',
        '          [tone]="toast.tone"',
        '          class="grid gap-1 rounded-2xl border border-[color-mix(in_srgb,var(--tng-semantic-accent-success)_42%,var(--tng-semantic-border-default))] bg-[var(--tng-semantic-background-surface)] p-4 text-[var(--tng-semantic-foreground-primary)] shadow-[0_16px_30px_color-mix(in_srgb,var(--tng-semantic-foreground-primary)_18%,transparent)]"',
        '        >',
        '          <strong class="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--tng-semantic-accent-success)]">{{ toast.title }}</strong>',
        '          <p class="m-0 text-sm leading-6 text-[var(--tng-semantic-foreground-secondary)]">{{ toast.message }}</p>',
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
      title: 'headless-toast-fixed-tailwind.component.css',
      code: '/* Tailwind utilities are applied directly in the template. */',
    },
  ]);

  protected readonly escalationTailwindCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'headless-toast-escalation-tailwind.component.ts',
      code: [
        "import { Component, signal, type OnDestroy } from '@angular/core';",
        "import { TngToastItem, TngToastViewport, type TngToastTone } from '@tailng-ui/primitives';",
        '',
        'type ToastRecord = Readonly<{',
        '  id: number;',
        '  message: string;',
        '  title: string;',
        '  tone: TngToastTone;',
        '}>;',
        '',
        '@Component({',
        "  selector: 'app-headless-toast-escalation-tailwind',",
        '  standalone: true,',
        '  imports: [TngToastItem, TngToastViewport],',
        "  templateUrl: './headless-toast-escalation-tailwind.component.html',",
        "  styleUrl: './headless-toast-escalation-tailwind.component.css',",
        '})',
        'export class HeadlessToastEscalationTailwindComponent implements OnDestroy {',
        '  private counter = 0;',
        '  private readonly timeoutByToastId = new Map<number, ReturnType<typeof setTimeout>>();',
        '',
        '  protected readonly toasts = signal<readonly ToastRecord[]>([]);',
        '',
        '  protected showToast(tone: \'warning\' | \'danger\'): void {',
        '    this.counter += 1;',
        '    const id = this.counter;',
        '    this.toasts.update((current) => [',
        '      ...current,',
        '      {',
        '        id,',
        "        message: tone === 'danger' ? 'Rollback required. Manual approval is pending.' : 'Validation skipped for an optional security policy.',",
        "        title: tone === 'danger' ? 'Error' : 'Warning',",
        '        tone,',
        '      },',
        '    ]);',
        '',
        "    if (tone === 'danger') {",
        '      return;',
        '    }',
        '',
        '    const timeoutId = setTimeout(() => this.dismissToast(id), 4200);',
        '    this.timeoutByToastId.set(id, timeoutId);',
        '  }',
        '',
        '  protected dismissToast(id: number): void {',
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
      title: 'headless-toast-escalation-tailwind.component.html',
      code: [
        '<div',
        '  class="rounded-2xl border border-[var(--tng-semantic-border-subtle)] bg-[color-mix(in_srgb,var(--tng-semantic-background-surface)_88%,transparent)] p-4"',
        '>',
        '  <section class="relative grid min-h-56 content-start gap-3">',
        '    <div class="flex flex-wrap gap-2">',
        '      <button',
        '        type="button"',
        '        class="rounded-lg border border-[color-mix(in_srgb,var(--tng-semantic-accent-warning)_52%,var(--tng-semantic-border-subtle))] bg-[color-mix(in_srgb,var(--tng-semantic-accent-warning)_14%,var(--tng-semantic-background-canvas))] px-3 py-2 text-sm font-semibold text-[var(--tng-semantic-foreground-primary)] transition hover:bg-[color-mix(in_srgb,var(--tng-semantic-accent-warning)_22%,var(--tng-semantic-background-muted))] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[color-mix(in_srgb,var(--tng-semantic-accent-warning)_32%,transparent)]"',
        '        (click)="showToast(\'warning\')"',
        '      >',
        '        Show warning toast',
        '      </button>',
        '      <button',
        '        type="button"',
        '        class="rounded-lg border border-[color-mix(in_srgb,var(--tng-semantic-accent-danger)_58%,transparent)] bg-[var(--tng-semantic-accent-danger)] px-3 py-2 text-sm font-semibold text-[var(--tng-semantic-foreground-inverse)] transition hover:bg-[color-mix(in_srgb,var(--tng-semantic-accent-danger)_88%,var(--tng-semantic-foreground-primary)_12%)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[color-mix(in_srgb,var(--tng-semantic-accent-danger)_35%,transparent)]"',
        '        (click)="showToast(\'danger\')"',
        '      >',
        '        Show persistent error',
        '      </button>',
        '    </div>',
        '',
        '    <section tngToastViewport class="absolute right-0 top-14 grid w-full max-w-sm gap-3">',
        '      @for (toast of toasts(); track toast.id) {',
        '        <article',
        '          tngToastItem',
        '          [tone]="toast.tone"',
        '          class="group grid gap-3 rounded-2xl border border-[var(--tng-semantic-border-default)] bg-[var(--tng-semantic-background-surface)] p-4 text-[var(--tng-semantic-foreground-primary)] shadow-[0_16px_30px_color-mix(in_srgb,var(--tng-semantic-foreground-primary)_18%,transparent)] data-[tone=warning]:border-[color-mix(in_srgb,var(--tng-semantic-accent-warning)_48%,var(--tng-semantic-border-default))] data-[tone=danger]:border-[color-mix(in_srgb,var(--tng-semantic-accent-danger)_48%,var(--tng-semantic-border-default))]"',
        '        >',
        '          <div class="grid gap-1">',
        '            <strong class="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--tng-semantic-foreground-secondary)] group-data-[tone=warning]:text-[var(--tng-semantic-accent-warning)] group-data-[tone=danger]:text-[var(--tng-semantic-accent-danger)]">{{ toast.title }}</strong>',
        '            <p class="m-0 text-sm leading-6 text-[var(--tng-semantic-foreground-secondary)]">{{ toast.message }}</p>',
        '          </div>',
        '          @if (toast.tone === \'danger\') {',
        '            <button',
        '              type="button"',
        '              class="justify-self-start rounded-lg border border-[var(--tng-semantic-border-subtle)] bg-[color-mix(in_srgb,var(--tng-semantic-background-canvas)_86%,transparent)] px-2.5 py-1 text-xs font-semibold text-[var(--tng-semantic-foreground-primary)] transition hover:border-[var(--tng-semantic-border-default)] hover:bg-[color-mix(in_srgb,var(--tng-semantic-background-muted)_68%,transparent)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[color-mix(in_srgb,var(--tng-semantic-focus-ring)_35%,transparent)]"',
        '              (click)="dismissToast(toast.id)"',
        '            >',
        '              Dismiss',
        '            </button>',
        '          }',
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
      title: 'headless-toast-escalation-tailwind.component.css',
      code: '/* Tailwind utilities are applied directly in the template. */',
    },
  ]);

  protected showStreamToast(variant: 'plain' | 'tailwind', tone: 'neutral' | 'success'): void {
    const scope: ToastScope = variant === 'plain' ? 'streamPlain' : 'streamTailwind';
    const message =
      tone === 'success'
        ? 'Release note published to customer portal.'
        : 'Autosave completed for the deployment checklist.';

    this.pushToast(scope, tone, tone === 'success' ? 'Success' : 'Info', message, true);
  }

  protected showEscalationToast(variant: 'plain' | 'tailwind', tone: 'warning' | 'danger'): void {
    const scope: ToastScope = variant === 'plain' ? 'escalationPlain' : 'escalationTailwind';
    const message =
      tone === 'danger'
        ? 'Rollback required. Manual approval is pending.'
        : 'Validation skipped for an optional security policy.';

    this.pushToast(scope, tone, tone === 'danger' ? 'Error' : 'Warning', message, tone !== 'danger');
  }

  protected showFixedToast(variant: 'plain' | 'tailwind'): void {
    const scope: ToastScope = variant === 'plain' ? 'fixedPlain' : 'fixedTailwind';
    this.pushToast(
      scope,
      'success',
      'Saved',
      'Saved filters to the shared release dashboard.',
      true,
    );
  }

  protected dismissToast(scope: ToastScope, id: number): void {
    this.clearTimer(scope, id);
    this.updateToasts(scope, (toasts) => toasts.filter((toast) => toast.id !== id));
  }

  public ngOnDestroy(): void {
    for (const timeoutId of this.timerByScopeId.values()) {
      clearTimeout(timeoutId);
    }
    this.timerByScopeId.clear();
    this.colorSchemeObserver?.disconnect();
  }

  private pushToast(
    scope: ToastScope,
    tone: TngToastTone,
    title: string,
    message: string,
    autoDismiss: boolean,
  ): void {
    this.counter += 1;
    const id = this.counter;
    const nextToast: HeadlessToastRecord = {
      id,
      message,
      title,
      tone,
    };

    this.updateToasts(scope, (toasts) => [...toasts, nextToast]);

    if (!autoDismiss) {
      return;
    }

    const timerId = setTimeout(() => {
      this.dismissToast(scope, id);
    }, 4200);
    this.timerByScopeId.set(`${scope}:${id}`, timerId);
  }

  private clearTimer(scope: ToastScope, id: number): void {
    const timerKey = `${scope}:${id}`;
    const timeoutId = this.timerByScopeId.get(timerKey);
    if (timeoutId === undefined) {
      return;
    }

    clearTimeout(timeoutId);
    this.timerByScopeId.delete(timerKey);
  }

  private updateToasts(
    scope: ToastScope,
    updater: (toasts: readonly HeadlessToastRecord[]) => readonly HeadlessToastRecord[],
  ): void {
    switch (scope) {
      case 'fixedPlain':
        this.fixedPlainToasts.update((toasts) => updater(toasts));
        return;
      case 'fixedTailwind':
        this.fixedTailwindToasts.update((toasts) => updater(toasts));
        return;
      case 'streamPlain':
        this.streamPlainToasts.update((toasts) => updater(toasts));
        return;
      case 'streamTailwind':
        this.streamTailwindToasts.update((toasts) => updater(toasts));
        return;
      case 'escalationPlain':
        this.escalationPlainToasts.update((toasts) => updater(toasts));
        return;
      case 'escalationTailwind':
        this.escalationTailwindToasts.update((toasts) => updater(toasts));
        return;
    }
  }
}
