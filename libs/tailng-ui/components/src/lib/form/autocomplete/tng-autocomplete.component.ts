import { NgTemplateOutlet } from '@angular/common';
import type {
  TemplateRef} from '@angular/core';
import {
  Component,
  ViewEncapsulation,
  computed,
  contentChild,
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

export type TngAutocompleteOptionContext<O, V> = {
  $implicit: O;
  option: O;
  value: V;
  label: string;
  selected: boolean;
  disabled: boolean;
};

export type TngAutocompleteSelectedContext<O, V> = {
  $implicit: O;
  option: O;
  value: V | null;
  label: string;
};

@Component({
  selector: 'tng-autocomplete',
  imports: [
    NgTemplateOutlet,
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
  encapsulation: ViewEncapsulation.None,
})
export class TngAutocompleteComponent<O = unknown, V = unknown> {
  protected readonly primitive = inject<TngAutocomplete<V>>(TngAutocomplete);

  protected readonly optionTemplate =
    contentChild<TemplateRef<TngAutocompleteOptionContext<O, V>>>('tngAutocompleteOptionTpl');

  protected readonly selectedOptionTemplate =
    contentChild<TemplateRef<TngAutocompleteSelectedContext<O, V>>>('tngAutocompleteSelectedTpl');

  protected readonly Object = Object;

  public readonly options = input<readonly O[]>([]);
  public readonly placeholder = input<string>('Type to search…');

  public readonly getOptionValue = input<TngAutocompleteGetValue<O, V>>(
    ((opt: unknown) => (opt as { value?: V })?.value) as TngAutocompleteGetValue<O, V>,
  );

  public readonly getOptionLabel = input<TngAutocompleteGetLabel<O>>(
    ((opt: unknown) =>
      String(
        (opt as { label?: string; value?: unknown })?.label ??
          (opt as { value?: unknown })?.value ??
          opt,
      )) as TngAutocompleteGetLabel<O>,
  );

  public readonly isOptionDisabled = input<TngAutocompleteIsDisabled<O>>(
    ((opt: unknown) => !!(opt as { disabled?: boolean })?.disabled) as TngAutocompleteIsDisabled<O>,
  );

  public readonly trackBy = input<TngAutocompleteTrackBy<O>>((_, opt) => {
    const o = opt as Record<string, unknown> | null | undefined;
    return o?.['value'] ?? o?.['id'] ?? opt;
  });

  public readonly iconText = input<string>('▾');
  public readonly ariaLabel = input<string>('Autocomplete');

  protected readonly query = signal('');

  public constructor() {
    effect(() => {
      const value = this.primitive.value();
      const open = this.primitive.open();

      if (!open) {
        const option = this.findOption(value);
        this.query.set(option ? this.getOptionLabel()(option) : '');
      }
    });
  }

  protected readonly selectedOption = computed<O | null>(() => {
    const value = this.primitive.value();

    if (value === null) {
      return null;
    }

    const getValue = this.getOptionValue();

    for (const option of this.options()) {
      if (Object.is(getValue(option), value)) {
        return option;
      }
    }

    return null;
  });

  protected readonly selectedLabel = computed<string>(() => {
    const option = this.selectedOption();

    return option ? this.getOptionLabel()(option) : '';
  });

  protected readonly filteredOptions = computed<readonly O[]>(() => {
    const query = this.query().toLowerCase().trim();
    const list = this.options();

    if (!query) {
      return list;
    }

    const getLabel = this.getOptionLabel();

    return list.filter((option) => getLabel(option).toLowerCase().includes(query));
  });

  protected readonly displayText = computed<string>(() =>
    this.primitive.open() ? this.query() : this.selectedLabel(),
  );

  protected onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.query.set(value);
  }

  private findOption(value: V | null): O | null {
    if (value === null) {
      return null;
    }

    const getValue = this.getOptionValue();

    for (const option of this.options()) {
      if (Object.is(getValue(option), value)) {
        return option;
      }
    }

    return null;
  }
}