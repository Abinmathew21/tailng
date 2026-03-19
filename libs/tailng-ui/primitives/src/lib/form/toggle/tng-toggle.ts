import {
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  OnInit,
  booleanAttribute,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { TngToggleGroup } from '../toggle-group/tng-toggle-group';

type NullableBooleanInput = '' | 'false' | 'true' | boolean | null | undefined;

function normalizeStringValue(value: string | null | undefined): string | null {
  if (value === undefined || value === null) {
    return null;
  }

  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
}

export function coerceTngToggleNullableBoolean(value: NullableBooleanInput): boolean | null {
  if (value === undefined || value === null) {
    return null;
  }

  if (value === '' || value === true || value === 'true') {
    return true;
  }

  if (value === false || value === 'false') {
    return false;
  }

  return null;
}

export function resolveTngToggleAriaPressed(pressed: boolean): 'false' | 'true' {
  return pressed ? 'true' : 'false';
}

export function resolveTngToggleDataState(pressed: boolean): 'off' | 'on' {
  return pressed ? 'on' : 'off';
}

@Directive({
  selector: 'button[tngToggle]',
  exportAs: 'tngToggle',
  standalone: true,
})
export class TngToggle implements OnInit {
  private readonly elementRef = inject<ElementRef<HTMLButtonElement>>(ElementRef);
  private readonly group = inject(TngToggleGroup, { optional: true });
  private readonly internalPressed = signal(false);
  private suppressNextClickFromKeyboard = false;
  private focused = false;
  private focusVisible = false;

  public readonly ariaLabel = input<string | null>(null);
  public readonly ariaLabelledby = input<string | null>(null);
  public readonly ariaDescribedBy = input<string | null>(null);
  public readonly value = input<string | null>(null, { alias: 'tngToggleValue' });

  public readonly pressed = input<boolean | null, NullableBooleanInput>(null, {
    transform: coerceTngToggleNullableBoolean,
  });
  public readonly defaultPressed = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly disabled = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });

  public readonly pressedChange = output<boolean>();

  private readonly resolvedDisabled = computed(() => {
    return this.disabled() || this.group?.isGroupDisabled() === true;
  });

  private readonly resolvedPressed = computed(() => {
    const groupItemValue = this.groupItemValue();
    if (groupItemValue !== null && this.group !== null) {
      return this.group.isItemSelected(groupItemValue);
    }

    const controlledPressed = this.pressed();
    if (controlledPressed !== null) {
      return controlledPressed;
    }

    return this.internalPressed();
  });

  public ngOnInit(): void {
    this.internalPressed.set(this.defaultPressed());
  }

  @HostBinding('attr.aria-describedby')
  protected get ariaDescribedByAttr(): string | null {
    return normalizeStringValue(this.ariaDescribedBy());
  }

  @HostBinding('attr.aria-disabled')
  protected get ariaDisabledAttr(): 'true' | null {
    return this.resolvedDisabled() ? 'true' : null;
  }

  @HostBinding('attr.aria-label')
  protected get ariaLabelAttr(): string | null {
    return normalizeStringValue(this.ariaLabel());
  }

  @HostBinding('attr.aria-labelledby')
  protected get ariaLabelledbyAttr(): string | null {
    return normalizeStringValue(this.ariaLabelledby());
  }

  @HostBinding('attr.aria-pressed')
  protected get ariaPressedAttr(): 'false' | 'true' {
    return resolveTngToggleAriaPressed(this.resolvedPressed());
  }

  @HostBinding('attr.data-disabled')
  protected get dataDisabledAttr(): '' | null {
    return this.resolvedDisabled() ? '' : null;
  }

  @HostBinding('attr.data-focused')
  protected get dataFocusedAttr(): '' | null {
    return this.focused ? '' : null;
  }

  @HostBinding('attr.data-focus-visible')
  protected get dataFocusVisibleAttr(): '' | null {
    return this.focusVisible ? '' : null;
  }

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'toggle' as const;

  @HostBinding('attr.data-state')
  protected get dataStateAttr(): 'off' | 'on' {
    return resolveTngToggleDataState(this.resolvedPressed());
  }

  @HostBinding('attr.disabled')
  protected get disabledAttr(): '' | null {
    return this.resolvedDisabled() ? '' : null;
  }

  @HostBinding('attr.type')
  protected readonly typeAttr = 'button' as const;

  @HostListener('blur')
  public onBlur(): void {
    this.focused = false;
    this.focusVisible = false;
  }

  @HostListener('click', ['$event'])
  public onClick(event: MouseEvent): void {
    if (this.resolvedDisabled()) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    if (this.suppressNextClickFromKeyboard && event.detail === 0) {
      this.suppressNextClickFromKeyboard = false;
      return;
    }

    this.suppressNextClickFromKeyboard = false;
    this.toggleFromInteraction();
  }

  @HostListener('focus')
  public onFocus(): void {
    this.focused = true;
    this.focusVisible = this.elementRef.nativeElement.matches(':focus-visible');
  }

  @HostListener('keydown', ['$event'])
  public onKeydown(event: KeyboardEvent): void {
    if (this.resolvedDisabled()) {
      return;
    }

    if (event.key !== ' ' && event.key !== 'Enter') {
      return;
    }

    event.preventDefault();
    this.suppressNextClickFromKeyboard = true;
    this.toggleFromInteraction();
  }

  private groupItemValue(): string | null {
    return normalizeStringValue(this.value());
  }

  private toggleFromInteraction(): void {
    const groupItemValue = this.groupItemValue();
    if (groupItemValue !== null && this.group !== null) {
      const nextValue = this.group.toggleItem(groupItemValue);
      this.pressedChange.emit(nextValue);
      return;
    }

    const nextValue = !this.resolvedPressed();
    if (this.pressed() === null) {
      this.internalPressed.set(nextValue);
    }

    this.pressedChange.emit(nextValue);
  }
}
