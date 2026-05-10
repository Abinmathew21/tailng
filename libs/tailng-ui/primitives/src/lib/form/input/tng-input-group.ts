import type { AfterContentInit, OnDestroy, QueryList } from '@angular/core';
import {
  Component,
  ContentChildren,
  ElementRef,
  HostBinding,
  HostListener,
  inject,
  input,
  isDevMode,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

import { TngInputFieldPrefix, TngInputFieldSuffix } from './tng-adornment';
import { TngInput } from './tng-input';

function containsProjectedContent(childElementCount: number, textContent: string | null): boolean {
  return childElementCount > 0 || (textContent ?? '').trim().length > 0;
}

@Component({
  selector: 'tng-input-group, [tngInputGroup]',
  exportAs: 'tngInputGroup',
  template: `
    @if (hasLeadingSlot()) {
      <span class="tng-input-group-leading" data-slot="input-group-leading">
        <ng-content select="[tngInputFieldPrefix], [tngInputLeading], [data-tng-input-prefix-proxy]"></ng-content>
      </span>
    }

    <span class="tng-input-group-control" data-slot="input-group-control">
      <ng-content select="input[tngInput], textarea[tngInput], textarea[tngTextarea], [data-tng-input-control-proxy]"></ng-content>
    </span>

    @if (hasTrailingSlot()) {
      <span class="tng-input-group-trailing" data-slot="input-group-trailing">
        <ng-content select="[tngInputFieldSuffix], [tngInputTrailing], [data-tng-input-suffix-proxy]"></ng-content>
      </span>
    }
  `,
  styles: [
    `
      :host {
        display: flex;
        align-items: center;
        min-width: 0;
      }

      .tng-input-group-leading,
      .tng-input-group-trailing {
        flex: 0 0 auto;
        display: inline-flex;
        align-items: center;
        min-width: 0;
      }

      .tng-input-group-control {
        flex: 1 1 auto;
        display: flex;
        align-items: center;
        min-width: 0;
      }
    `,
  ],
})
export class TngInputGroup implements AfterContentInit, OnDestroy {
  public readonly hasLeading = input<boolean | null>(null);
  public readonly hasTrailing = input<boolean | null>(null);
  public readonly disabled = input<boolean | null>(null);
  public readonly invalid = input<boolean | null>(null);
  public readonly readonly = input<boolean | null>(null);
  public readonly controlCount = input<number | null>(null);

  @ContentChildren(TngInput, { descendants: true })
  protected controls!: QueryList<TngInput>;

  @ContentChildren(TngInputFieldPrefix, { descendants: true })
  protected prefixSlots!: QueryList<TngInputFieldPrefix>;

  @ContentChildren(TngInputFieldSuffix, { descendants: true })
  protected suffixSlots!: QueryList<TngInputFieldSuffix>;

  private readonly hostElement: HTMLElement = inject(ElementRef<HTMLElement>).nativeElement as HTMLElement;
  private focused = false;
  private readonly destroyed$ = new Subject<void>();

  private validateSingleControl(): void {
    if (!isDevMode()) return;
    if (!this.controls) return;

    const queriedCount = this.controls.length;
    const domCount = this.hostElement.querySelectorAll(
      '[data-tng-input-control-proxy] input, [data-tng-input-control-proxy] textarea, input[tngInput], textarea[tngInput], textarea[tngTextarea]',
    ).length;

    const count = this.controlCount() ?? (queriedCount > 0 ? queriedCount : domCount);

    if (count !== 1) {
      globalThis.console.warn(
        `[tngInputGroup] Expected exactly 1 control (input/textarea with tngInput or textarea with tngTextarea), but found ${count}.`,
        this.hostElement,
      );
    }
  }

  public ngAfterContentInit(): void {
    queueMicrotask(() => this.validateSingleControl());

    this.controls.changes.pipe(takeUntil(this.destroyed$)).subscribe(() => this.validateSingleControl());
  }

  public ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'input-group' as const;

  @HostBinding('attr.data-has-leading')
  protected get dataHasLeading(): '' | null {
    return this.effectiveHasLeading() ? '' : null;
  }

  @HostBinding('attr.data-has-trailing')
  protected get dataHasTrailing(): '' | null {
    return this.effectiveHasTrailing() ? '' : null;
  }

  @HostBinding('attr.data-disabled')
  protected get dataDisabled(): '' | null {
    const override = this.disabled();
    if (override !== null) return override ? '' : null;

    const control = this.primaryControl();
    if (control !== null) return control.disabled() ? '' : null;

    const element = this.primaryControlElement();
    if (element === null) return null;
    return element.hasAttribute('disabled') ? '' : null;
  }

  @HostBinding('attr.data-invalid')
  protected get dataInvalid(): '' | null {
    const override = this.invalid();
    if (override !== null) return override ? '' : null;

    const control = this.primaryControl();
    if (control !== null) return control.isInvalid() ? '' : null;

    const element = this.primaryControlElement();
    if (element === null) return null;
    if (element.getAttribute('aria-invalid') === 'true') return '';
    return element.matches(':invalid') ? '' : null;
  }

  @HostBinding('attr.data-readonly')
  protected get dataReadonly(): '' | null {
    const override = this.readonly();
    if (override !== null) return override ? '' : null;

    const control = this.primaryControl();
    if (control !== null) return control.readonly() ? '' : null;

    const element = this.primaryControlElement();
    if (element === null) return null;
    return element.hasAttribute('readonly') ? '' : null;
  }

  @HostBinding('attr.data-focused')
  protected get dataFocused(): '' | null {
    return this.focused ? '' : null;
  }

  @HostListener('focusin')
  protected onFocusIn(): void {
    this.focused = true;
  }

  @HostListener('focusout', ['$event.relatedTarget'])
  protected onFocusOut(nextTarget: Readonly<EventTarget> | null): void {
    if (nextTarget instanceof Node && this.hostElement.contains(nextTarget)) return;

    this.focused = false;
  }

  protected hasLeadingSlot(): boolean {
    const proxy = this.hostElement.querySelector('[data-tng-input-prefix-proxy]');
    if (
      proxy instanceof HTMLElement &&
      containsProjectedContent(proxy.childElementCount, proxy.textContent)
    ) {
      return true;
    }

    const slots = this.prefixSlots?.toArray() ?? [];
    for (const slot of slots) {
      const hostElement = slot.hostElement;
      if (containsProjectedContent(hostElement.childElementCount, hostElement.textContent)) {
        return true;
      }
    }

    return false;
  }

  protected hasTrailingSlot(): boolean {
    const proxy = this.hostElement.querySelector('[data-tng-input-suffix-proxy]');
    if (
      proxy instanceof HTMLElement &&
      containsProjectedContent(proxy.childElementCount, proxy.textContent)
    ) {
      return true;
    }

    const slots = this.suffixSlots?.toArray() ?? [];
    for (const slot of slots) {
      const hostElement = slot.hostElement;
      if (containsProjectedContent(hostElement.childElementCount, hostElement.textContent)) {
        return true;
      }
    }

    return false;
  }

  protected effectiveHasLeading(): boolean {
    const override = this.hasLeading();
    if (override !== null) return override;
    return this.hasLeadingSlot();
  }

  protected effectiveHasTrailing(): boolean {
    const override = this.hasTrailing();
    if (override !== null) return override;
    return this.hasTrailingSlot();
  }

  protected primaryControl(): TngInput | null {
    const controls = this.controls?.toArray() ?? [];
    return controls[0] ?? null;
  }

  protected primaryControlElement(): HTMLInputElement | HTMLTextAreaElement | null {
    const element = this.hostElement.querySelector(
      '[data-tng-input-control-proxy] input, [data-tng-input-control-proxy] textarea, input[tngInput], textarea[tngInput], textarea[tngTextarea]',
    );

    if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
      return element;
    }

    return null;
  }
}
