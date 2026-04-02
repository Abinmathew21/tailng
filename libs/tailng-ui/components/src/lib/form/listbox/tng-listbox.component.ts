import { NgTemplateOutlet } from '@angular/common';
import {
  Component,
  ContentChild,
  HostBinding,
  TemplateRef,
  computed,
  inject,
  input,
} from '@angular/core';

import { TngListboxDirective, TngOptionDirective, type ListboxValue } from '@tailng-ui/primitives';

export type TngListboxGetValue<O, V> = (option: O) => V;
export type TngListboxGetLabel<O> = (option: O) => string;
export type TngListboxGetDescription<O> = (option: O) => string | null | undefined;
export type TngListboxIsDisabled<O> = (option: O) => boolean;
export type TngListboxTrackBy<O> = (index: number, option: O) => unknown;

export type TngListboxOptionContext<O, V> = {
  $implicit: {
    option: O;
    value: V;
    label: string;
    description: string | null;
    disabled: boolean;
    selected: boolean;
    active: boolean;
  };
};

function normalizeAttr(value: string | null | undefined): string | null {
  if (value == null) {
    return null;
  }

  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
}

@Component({
  selector: 'tng-listbox',
  standalone: true,
  imports: [NgTemplateOutlet, TngOptionDirective],
  hostDirectives: [
    {
      directive: TngListboxDirective,
      inputs: ['multiple', 'orientation', 'direction', 'disabled', 'loop', 'typeahead', 'value'],
      outputs: ['valueChange'],
    },
  ],
  templateUrl: './tng-listbox.component.html',
  styleUrl: './tng-listbox.component.css',
})
export class TngListboxComponent<O = unknown, V = unknown> {
  protected readonly primitive = inject<TngListboxDirective<V>>(TngListboxDirective);

  public readonly options = input<readonly O[]>([]);
  public readonly ariaLabel = input<string | null>(null);
  public readonly ariaLabelledby = input<string | null>(null);
  public readonly ariaDescribedBy = input<string | null>(null);

  public readonly getOptionValue = input<TngListboxGetValue<O, V>>(
    ((option: any) =>
      option?.value ??
      option?.id ??
      option?.key ??
      option?.code ??
      option) as TngListboxGetValue<O, V>,
  );
  public readonly getOptionLabel = input<TngListboxGetLabel<O>>(
    ((option: any) =>
      String(
        option?.label ??
          option?.title ??
          option?.name ??
          option?.value ??
          option?.id ??
          option?.key ??
          option?.code ??
          option,
      )) as TngListboxGetLabel<O>,
  );
  public readonly getOptionDescription = input<TngListboxGetDescription<O>>(
    ((option: any) =>
      option?.description ??
      option?.copy ??
      option?.supportingText ??
      option?.details ??
      null) as TngListboxGetDescription<O>,
  );
  public readonly isOptionDisabled = input<TngListboxIsDisabled<O>>(
    ((option: any) =>
      option?.disabled === true ||
      option?.unavailable === true) as TngListboxIsDisabled<O>,
  );
  public readonly trackBy = input<TngListboxTrackBy<O>>((_, option) => option as unknown);

  @ContentChild('tngListboxOptionTpl', { read: TemplateRef })
  protected optionTpl?: TemplateRef<TngListboxOptionContext<O, V>>;

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'listbox-component' as const;

  @HostBinding('attr.data-orientation')
  protected get dataOrientation(): 'horizontal' | 'vertical' {
    return this.primitive.orientation();
  }

  @HostBinding('attr.data-disabled')
  protected get dataDisabled(): '' | null {
    return this.primitive.disabled() ? '' : null;
  }

  @HostBinding('attr.aria-label')
  protected get hostAriaLabel(): string | null {
    return normalizeAttr(this.ariaLabel());
  }

  @HostBinding('attr.aria-labelledby')
  protected get hostAriaLabelledby(): string | null {
    return normalizeAttr(this.ariaLabelledby());
  }

  @HostBinding('attr.aria-describedby')
  protected get hostAriaDescribedBy(): string | null {
    return normalizeAttr(this.ariaDescribedBy());
  }

  @HostBinding('attr.tabindex')
  protected get hostTabIndex(): '0' | '-1' {
    return this.primitive.disabled() ? '-1' : '0';
  }

  protected readonly hasOptions = computed(() => this.options().length > 0);

  protected resolveOptionDescription(option: O): string | null {
    const description = this.getOptionDescription()(option);
    if (description == null) {
      return null;
    }

    const normalized = description.trim();
    return normalized.length > 0 ? normalized : null;
  }

  protected optionContext(option: O): TngListboxOptionContext<O, V> {
    const value = this.getOptionValue()(option);
    return {
      $implicit: {
        option,
        value,
        label: this.getOptionLabel()(option),
        description: this.resolveOptionDescription(option),
        disabled: this.isOptionDisabled()(option),
        selected: this.isSelectedValue(value),
        active: false,
      },
    };
  }

  private isSelectedValue(value: V): boolean {
    const current = this.primitive.value() as ListboxValue<V>;

    if (current === null) {
      return false;
    }

    if (Array.isArray(current)) {
      return current.some((entry) => Object.is(entry, value));
    }

    return Object.is(current, value);
  }
}
