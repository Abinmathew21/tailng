import {
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';

import {
  TngAutocomplete,
  TngAutocompleteTrigger,
  TngAutocompleteTriggerContainer,
  TngAutocompleteIcon,
  TngAutocompleteContent,
  TngAutocompleteOverlay,
  TngAutocompleteListbox,
  TngAutocompleteOption,
} from '@tailng-ui/primitives';

export type TngAutocompleteGetValue<O, V> = (opt: O) => V;
export type TngAutocompleteGetLabel<O> = (opt: O) => string;
export type TngAutocompleteIsDisabled<O> = (opt: O) => boolean;
export type TngAutocompleteTrackBy<O> = (index: number, opt: O) => unknown;

@Component({
  selector: 'tng-autocomplete',
  imports: [
    TngAutocompleteTrigger,
    TngAutocompleteTriggerContainer,
    TngAutocompleteIcon,
    TngAutocompleteContent,
    TngAutocompleteOverlay,
    TngAutocompleteListbox,
    TngAutocompleteOption,
  ],
  hostDirectives: [
    {
      directive: TngAutocomplete,
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
  templateUrl: './tng-autocomplete.component.html',
  styleUrl: './tng-autocomplete.component.css',
})
export class TngAutocompleteComponent<O = unknown, V = unknown> {
  protected readonly primitive = inject<TngAutocomplete<V>>(TngAutocomplete);

  readonly options = input<readonly O[]>([]);
  readonly placeholder = input<string>('Type to search…');

  readonly getOptionValue = input<TngAutocompleteGetValue<O, V>>(
    ((opt: unknown) => (opt as { value?: V })?.value) as TngAutocompleteGetValue<O, V>,
  );
  readonly getOptionLabel = input<TngAutocompleteGetLabel<O>>(
    ((opt: unknown) =>
      String(
        (opt as { label?: string; value?: unknown })?.label ??
          (opt as { value?: unknown })?.value ??
          opt,
      )) as TngAutocompleteGetLabel<O>,
  );
  readonly isOptionDisabled = input<TngAutocompleteIsDisabled<O>>(
    ((opt: unknown) => !!(opt as { disabled?: boolean })?.disabled) as TngAutocompleteIsDisabled<O>,
  );
  /** Default: track by value, id, or option (stable identity for async/replaced options). */
  readonly trackBy = input<TngAutocompleteTrackBy<O>>((_, opt) => {
    const o = opt as Record<string, unknown> | null | undefined;
    return o?.['value'] ?? o?.['id'] ?? opt;
  });

  readonly iconText = input<string>('▾');

  readonly ariaLabel = input<string>('Autocomplete');

  protected readonly query = signal('');

  constructor() {
    effect(() => {
      const v = this.primitive.value();
      const open = this.primitive.open();
      if (!open) {
        const opt = this.findOption(v);
        this.query.set(opt ? this.getOptionLabel()(opt) : '');
      }
    });
  }

  protected readonly selectedOption = computed<O | null>(() => {
    const v = this.primitive.value();
    if (v === null) return null;
    const getV = this.getOptionValue();
    for (const opt of this.options()) {
      if (Object.is(getV(opt), v)) return opt;
    }
    return null;
  });

  protected readonly selectedLabel = computed<string>(() => {
    const opt = this.selectedOption();
    return opt ? this.getOptionLabel()(opt) : '';
  });

  protected readonly filteredOptions = computed<readonly O[]>(() => {
    const q = this.query().toLowerCase().trim();
    const list = this.options();
    if (!q) return list;
    const getLabel = this.getOptionLabel();
    return list.filter((opt) =>
      getLabel(opt).toLowerCase().includes(q),
    );
  });

  protected readonly displayText = computed<string>(() =>
    this.primitive.open() ? this.query() : this.selectedLabel(),
  );

  protected onInput(ev: Event): void {
    const val = (ev.target as HTMLInputElement).value;
    this.query.set(val);
  }

  private findOption(value: V | null): O | null {
    if (value === null) return null;
    const getV = this.getOptionValue();
    for (const opt of this.options()) {
      if (Object.is(getV(opt), value)) return opt;
    }
    return null;
  }
}
