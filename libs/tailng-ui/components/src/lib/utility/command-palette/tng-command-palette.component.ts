import { NgTemplateOutlet } from '@angular/common';
import {
  afterNextRender,
  booleanAttribute,
  Component,
  computed,
  contentChild,
  effect,
  inject,
  Injector,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import type { ElementRef, TemplateRef } from '@angular/core';
import {
  TngDialog,
  TngDialogBackdrop,
  TngDialogPanel,
  TngInput,
  TngListboxDirective,
  TngOptionDirective,
  TngInputFieldPrefix,
  TngInputFieldSuffix,
  type ListboxValue,
} from '@tailng-ui/primitives';

import { TngInputFieldComponent } from '../../form/input-field/tng-input-field.component';

export type TngCommandPaletteGetValue<O, V> = (option: O) => V;
export type TngCommandPaletteGetLabel<O> = (option: O) => string;
export type TngCommandPaletteGetDescription<O> = (option: O) => string | null | undefined;
export type TngCommandPaletteIsDisabled<O> = (option: O) => boolean;
export type TngCommandPaletteTrackBy<O> = (index: number, option: O) => unknown;

export type TngCommandPaletteOptionSelect<O, V> = Readonly<{
  option: O;
  value: V;
  label: string;
}>;

export type TngCommandPaletteOptionContext<O, V> = Readonly<{
  $implicit: O;
  option: O;
  value: V;
  label: string;
  description: string | null;
  disabled: boolean;
  active: boolean;
  selected: boolean;
}>;

type TngCommandPaletteKeyboardEvent = Readonly<{
  key: string;
  preventDefault: () => void;
}>;

const valueKeys = ['value', 'id', 'key', 'code'] as const;
const labelKeys = ['label', 'title', 'name', 'value', 'id', 'key', 'code'] as const;
const descriptionKeys = ['description', 'copy', 'supportingText', 'details'] as const;

function readInputValue(event: unknown): string | null {
  if (!(event instanceof Event)) {
    return null;
  }

  const target = event.target;
  return target instanceof HTMLInputElement ? target.value : null;
}

function toOptionRecord(option: unknown): Readonly<Record<string, unknown>> | null {
  return typeof option === 'object' && option !== null
    ? (option as Readonly<Record<string, unknown>>)
    : null;
}

function firstRecordValue(
  record: Readonly<Record<string, unknown>> | null,
  keys: readonly string[],
): unknown {
  if (record === null) {
    return undefined;
  }

  for (const key of keys) {
    const value = record[key];
    if (value !== undefined && value !== null) {
      return value;
    }
  }

  return undefined;
}

function defaultGetOptionValue(option: unknown): unknown {
  return firstRecordValue(toOptionRecord(option), valueKeys) ?? option;
}

function defaultGetOptionLabel(option: unknown): string {
  return String(firstRecordValue(toOptionRecord(option), labelKeys) ?? option);
}

function defaultGetOptionDescription(option: unknown): string | null {
  const value = firstRecordValue(toOptionRecord(option), descriptionKeys);
  return typeof value === 'string' ? value : null;
}

function defaultIsOptionDisabled(option: unknown): boolean {
  const record = toOptionRecord(option);
  return record?.['disabled'] === true || record?.['unavailable'] === true;
}

function normalizeDescription(value: string | null | undefined): string | null {
  const normalized = value?.trim() ?? '';
  return normalized.length > 0 ? normalized : null;
}

function normalizeListboxValue<TValue>(value: ListboxValue<TValue>): TValue | null {
  if (value === null) {
    return null;
  }

  if (Array.isArray(value)) {
    const values = value as readonly TValue[];
    return values[0] ?? null;
  }

  return value as TValue;
}

@Component({
  selector: 'tng-command-palette',
  imports: [
    NgTemplateOutlet,
    TngDialog,
    TngDialogBackdrop,
    TngDialogPanel,
    TngInputFieldComponent,
    TngInput,
    TngListboxDirective,
    TngOptionDirective,
    TngInputFieldPrefix,
    TngInputFieldSuffix,
  ],
  templateUrl: './tng-command-palette.component.html',
  styleUrl: './tng-command-palette.component.css',
})
export class TngCommandPaletteComponent<O = unknown, V = unknown> {
  public readonly open = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly query = input<string>('');
  public readonly options = input<readonly O[]>([]);
  public readonly loading = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly placeholder = input<string>('Search...');
  public readonly ariaLabel = input<string>('Command search');
  public readonly emptyText = input<string>('No results found');
  public readonly loadingText = input<string>('Loading...');
  public readonly footerText = input<string>('↑ ↓ Navigate · Enter Select · Esc Close');
  public readonly closeOnSelect = input<boolean, boolean | string>(true, {
    transform: booleanAttribute,
  });
  public readonly showClearButton = input<boolean, boolean | string>(true, {
    transform: booleanAttribute,
  });

  public readonly getOptionValue = input<TngCommandPaletteGetValue<O, V>>(
    defaultGetOptionValue as TngCommandPaletteGetValue<O, V>,
  );
  public readonly getOptionLabel = input<TngCommandPaletteGetLabel<O>>(
    defaultGetOptionLabel as TngCommandPaletteGetLabel<O>,
  );
  public readonly getOptionDescription = input<TngCommandPaletteGetDescription<O>>(
    defaultGetOptionDescription as TngCommandPaletteGetDescription<O>,
  );
  public readonly isOptionDisabled = input<TngCommandPaletteIsDisabled<O>>(
    defaultIsOptionDisabled as TngCommandPaletteIsDisabled<O>,
  );
  public readonly trackBy = input<TngCommandPaletteTrackBy<O>>((_, option) => option);

  public readonly openChange = output<boolean>();
  public readonly queryChange = output<string>();
  public readonly optionSelect = output<TngCommandPaletteOptionSelect<O, V>>();

  protected readonly inputPrefixTpl =
    contentChild<TemplateRef<unknown>>('tngCommandPaletteInputPrefixTpl');
  protected readonly inputSuffixTpl =
    contentChild<TemplateRef<unknown>>('tngCommandPaletteInputSuffixTpl');
  protected readonly optionTpl =
    contentChild<TemplateRef<TngCommandPaletteOptionContext<O, V>>>('tngCommandPaletteOptionTpl');
  protected readonly emptyTpl = contentChild<TemplateRef<unknown>>('tngCommandPaletteEmptyTpl');
  protected readonly loadingTpl = contentChild<TemplateRef<unknown>>('tngCommandPaletteLoadingTpl');
  protected readonly footerTpl = contentChild<TemplateRef<unknown>>('tngCommandPaletteFooterTpl');

  private readonly injector = inject(Injector);
  private readonly inputRef = viewChild<ElementRef<HTMLInputElement>>('inputRef');
  private readonly listboxRef = viewChild<TngListboxDirective<V>>(TngListboxDirective);

  protected readonly selectedValue = signal<V | null>(null);
  protected readonly activeValue = signal<V | null>(null);
  protected readonly hasOptions = computed(() => this.options().length > 0);
  protected readonly hasQuery = computed(() => this.query().length > 0);

  public constructor() {
    effect(() => {
      if (!this.open()) {
        this.activeValue.set(null);
        return;
      }

      afterNextRender(
        () => {
          this.inputRef()?.nativeElement.focus();
        },
        { injector: this.injector },
      );
    });
  }

  protected onDialogOpenChange(open: boolean): void {
    this.openChange.emit(open);
  }

  protected onInput(event: unknown): void {
    const value = readInputValue(event);
    if (value === null) {
      return;
    }

    this.queryChange.emit(value);
  }

  protected onInputKeydown(event: TngCommandPaletteKeyboardEvent): void {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.openChange.emit(false);
      return;
    }

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      const listbox = this.listboxRef();
      if (listbox === undefined) {
        return;
      }

      listbox.handleKeyFromCombobox(event.key);
      this.syncActiveValue();
      return;
    }

    if (event.key === 'Enter') {
      event.preventDefault();
      this.selectActiveOption();
    }
  }

  protected clearQuery(): void {
    this.queryChange.emit('');
    afterNextRender(
      () => {
        this.inputRef()?.nativeElement.focus();
      },
      { injector: this.injector },
    );
  }

  protected onListboxValueChange(value: ListboxValue<V>): void {
    const nextValue = normalizeListboxValue(value);
    if (nextValue === null) {
      return;
    }

    this.selectValue(nextValue);
  }

  protected optionContext(option: O): TngCommandPaletteOptionContext<O, V> {
    const value = this.getOptionValue()(option);
    return {
      $implicit: option,
      option,
      value,
      label: this.getOptionLabel()(option),
      description: this.resolveOptionDescription(option),
      disabled: this.isOptionDisabled()(option),
      active: this.isActiveValue(value),
      selected: this.isSelectedValue(value),
    };
  }

  protected resolveOptionDescription(option: O): string | null {
    return normalizeDescription(this.getOptionDescription()(option));
  }

  protected isActiveValue(value: V): boolean {
    return this.activeValue() !== null && Object.is(this.activeValue(), value);
  }

  protected isSelectedValue(value: V): boolean {
    return this.selectedValue() !== null && Object.is(this.selectedValue(), value);
  }

  private syncActiveValue(): void {
    this.activeValue.set(this.listboxRef()?.getActiveValue() ?? null);
  }

  private selectActiveOption(): void {
    const value = this.listboxRef()?.getActiveValue();
    if (value === undefined) {
      return;
    }

    this.selectValue(value);
  }

  private selectValue(value: V): void {
    const option = this.findOptionByValue(value);
    if (option === null || this.isOptionDisabled()(option)) {
      return;
    }

    this.selectedValue.set(value);
    this.activeValue.set(value);
    this.optionSelect.emit({
      option,
      value,
      label: this.getOptionLabel()(option),
    });

    if (this.closeOnSelect()) {
      this.openChange.emit(false);
    }
  }

  private findOptionByValue(value: V): O | null {
    const getValue = this.getOptionValue();
    for (const option of this.options()) {
      if (Object.is(getValue(option), value)) {
        return option;
      }
    }

    return null;
  }
}

export { TngCommandPaletteComponent as TngCommandPalette };
