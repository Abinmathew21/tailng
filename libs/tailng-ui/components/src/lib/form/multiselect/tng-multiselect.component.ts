import {
  Component,
  ContentChild,
  TemplateRef,
  computed,
  inject,
  input,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

import {
  TNG_SELECT_FORCE_MULTIPLE,
  TngSelect,
  TngSelectTrigger,
  TngSelectValue,
  TngSelectIcon,
  TngSelectContent,
  TngSelectOverlay,
  TngSelectListbox,
  TngSelectOption,
} from '@tailng-ui/primitives';

export type TngMultiSelectGetValue<O, V> = (opt: O) => V;
export type TngMultiSelectGetLabel<O> = (opt: O) => string;
export type TngMultiSelectIsDisabled<O> = (opt: O) => boolean;
export type TngMultiSelectTrackBy<O> = (index: number, opt: O) => unknown;

export type TngMultiSelectValueContext<O, V> = {
  $implicit: { value: readonly V[] | null; options: readonly O[]; label: string };
};
export type TngMultiSelectOptionContext<O, V> = {
  $implicit: { option: O; value: V; label: string; disabled: boolean; selected: boolean; active: boolean };
};

@Component({
  selector: 'tng-multiselect',
  standalone: true,
  imports: [
    NgTemplateOutlet,
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
      directive: TngSelect,
      inputs: [
        'open',
        'value',
        'disabled',
        'loading',
        'invalid',
        'labelId',
        'descriptionId',
        'errorId',
      ],
      outputs: ['openChange', 'valueChange'],
    },
  ],
  providers: [{ provide: TNG_SELECT_FORCE_MULTIPLE, useValue: true }],
  templateUrl: './tng-multiselect.component.html',
  styleUrl: './tng-multiselect.component.css',
})
export class TngMultiSelectComponent<O = unknown, V = unknown> {
  protected readonly primitive = inject<TngSelect<V>>(TngSelect);

  readonly options = input<readonly O[]>([]);
  readonly placeholder = input<string>('Select…');

  readonly getOptionValue = input<TngMultiSelectGetValue<O, V>>(
    ((opt: unknown) => (opt as { value?: V })?.value) as TngMultiSelectGetValue<O, V>,
  );
  readonly getOptionLabel = input<TngMultiSelectGetLabel<O>>(
    ((opt: unknown) => String((opt as { label?: string; value?: unknown })?.label ?? (opt as { value?: unknown })?.value ?? opt)) as TngMultiSelectGetLabel<O>,
  );
  readonly isOptionDisabled = input<TngMultiSelectIsDisabled<O>>(
    ((opt: unknown) => !!(opt as { disabled?: boolean })?.disabled) as TngMultiSelectIsDisabled<O>,
  );
  readonly trackBy = input<TngMultiSelectTrackBy<O>>((_, opt) => opt as unknown);

  readonly iconText = input<string>('▾');

  readonly multiple = input<boolean>(true);

  @ContentChild('tngMultiSelectValueTpl', { read: TemplateRef }) valueTpl?: TemplateRef<TngMultiSelectValueContext<O, V>>;
  @ContentChild('tngMultiSelectOptionTpl', { read: TemplateRef }) optionTpl?: TemplateRef<TngMultiSelectOptionContext<O, V>>;

  protected readonly selectedOptions = computed<readonly O[]>(() => {
    const v = this.primitive.value();
    if (v === null) return [];
    const arr = Array.isArray(v) ? v : [v];
    const getV = this.getOptionValue();
    const result: O[] = [];
    for (const opt of this.options()) {
      const optVal = getV(opt);
      if (arr.some((x) => Object.is(x, optVal))) result.push(opt);
    }
    return result;
  });

  protected readonly selectedLabel = computed<string>(() => {
    const opts = this.selectedOptions();
    if (opts.length === 0) return this.placeholder();
    return opts.map((o) => this.getOptionLabel()(o)).join(', ');
  });

  protected valueContext(): TngMultiSelectValueContext<O, V> {
    const opts = this.selectedOptions();
    const v = this.primitive.value();
    const label = opts.length > 0 ? opts.map((o) => this.getOptionLabel()(o)).join(', ') : this.placeholder();
    return { $implicit: { value: v as readonly V[] | null, options: opts, label } };
  }

  protected optionContext(opt: O): TngMultiSelectOptionContext<O, V> {
    const optVal = this.getOptionValue()(opt);
    const label = this.getOptionLabel()(opt);
    const disabled = this.isOptionDisabled()(opt);
    const v = this.primitive.value();
    const selected = v !== null && (Array.isArray(v) ? v.some((x) => Object.is(x, optVal)) : Object.is(v, optVal));

    return { $implicit: { option: opt, value: optVal, label, disabled, selected, active: false } };
  }
}
