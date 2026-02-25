import {
  Component,
  ContentChild,
  HostBinding,
  computed,
  inject,
  input,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

import {
  TngSelect as TngSelectPrimitive,
  TngSelectTrigger,
  TngSelectValue,
  TngSelectIcon,
  TngSelectContent,
  TngSelectOverlay,
  TngSelectListbox,
  TngSelectOption,
} from '@tailng-ui/primitives';

import {
  TngSelectOptionTpl,
  TngSelectTriggerTpl,
} from './tng-select.slots';

@Component({
  selector: 'tng-select',
  standalone: true,
  imports: [
    NgTemplateOutlet,

    // primitive parts
    TngSelectTrigger,
    TngSelectValue,
    TngSelectIcon,
    TngSelectContent,
    TngSelectOverlay,
    TngSelectListbox,
    TngSelectOption,
  ],
  hostDirectives: [
    {
      directive: TngSelectPrimitive,
      inputs: ['open', 'value', 'disabled'],
      outputs: ['openChange', 'valueChange'],
    },
  ],
  templateUrl: './tng-select.component.html',
})
export class TngSelectComponent<O = unknown, V = unknown> {
  private readonly primitive = inject(TngSelectPrimitive<V>);

  // ---- a11y / base config ----
  readonly ariaLabel = input<string>('Select');

  /** Placeholder shown when value is null or not found in options. */
  readonly placeholder = input<string>('Select…');

  // ---- accessor API (power-user friendly) ----
  readonly options = input<readonly O[]>([]);

  /** Required: map option -> value (stored in primitive). */
  readonly getOptionValue = input<(opt: O) => V>(
    // default: assume option itself is value (works for primitives)
    (opt: O) => opt as unknown as V,
  );

  /** Required: map option -> display label. */
  readonly getOptionLabel = input<(opt: O) => string>(
    (opt: O) => String(opt),
  );

  /** Optional: compare values (defaults to Object.is). */
  readonly compareWith = input<(a: V, b: V) => boolean>(
    (a: V, b: V) => Object.is(a, b),
  );

  // ---- slots (optional) ----
  @ContentChild(TngSelectTriggerTpl) triggerTpl?: TngSelectTriggerTpl<O, V>;
  @ContentChild(TngSelectOptionTpl) optionTpl?: TngSelectOptionTpl<O, V>;

  @HostBinding('attr.aria-label')
  protected get hostAriaLabel(): string {
    return this.ariaLabel();
  }

  // ---- derived state ----
  readonly selectedOption = computed<O | null>(() => {
    const v = this.primitive.value();
    if (v == null) return null;

    const opts = this.options();
    const getV = this.getOptionValue();
    const eq = this.compareWith();

    for (const o of opts) {
      if (eq(getV(o), v)) return o;
    }
    return null;
  });

  readonly selectedLabel = computed(() => {
    const opt = this.selectedOption();
    return opt ? this.getOptionLabel()(opt) : this.placeholder();
  });

  // Context builders (keep template clean)
  triggerContext = computed(() => {
    const opt = this.selectedOption();
    return {
      value: this.primitive.value(),
      option: opt,
      label: this.selectedLabel(),
      placeholder: this.placeholder(),
      open: this.primitive.open(),
      disabled: this.primitive.disabled(),
    };
  });

  optionContext(opt: O) {
    const getV = this.getOptionValue();
    const getL = this.getOptionLabel();
    const v = getV(opt);

    // these attributes are set by primitives on the <li>,
    // but we also provide booleans to slot templates.
    // In most cases, consumers can rely on data-* styling hooks.
    return {
      $implicit: opt,
      option: opt,
      value: v,
      label: getL(opt),
      selected: this.primitive.value() != null && this.compareWith()(v, this.primitive.value() as V),
      active: false,   // prefer data-active on the element for accuracy
      disabled: false, // prefer data-disabled / [disabled] binding below
    } as const;
  }

  trackByValue = (_: number, opt: O) => this.getOptionValue()(opt) as unknown as string;
}