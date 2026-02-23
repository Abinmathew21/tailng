import {
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  booleanAttribute,
  inject,
  input,
} from '@angular/core';

type TngButtonToggleAction = 'first' | 'last' | 'next' | 'prev';
type TngButtonToggleKeyboardEvent = Readonly<{
  key: string;
  preventDefault: () => void;
}>;
type TngToggleButtonElement = HTMLButtonElement;

function resolveTngButtonToggleAction(key: string): TngButtonToggleAction | null {
  switch (key) {
    case 'ArrowDown':
    case 'ArrowRight':
      return 'next';
    case 'ArrowLeft':
    case 'ArrowUp':
      return 'prev';
    case 'Home':
      return 'first';
    case 'End':
      return 'last';
    default:
      return null;
  }
}

function resolveNextToggleIndex(
  currentIndex: number,
  total: number,
  action: TngButtonToggleAction,
): number {
  if (action === 'first') {
    return 0;
  }

  if (action === 'last') {
    return total - 1;
  }

  if (action === 'next') {
    return currentIndex < 0 || currentIndex + 1 >= total ? 0 : currentIndex + 1;
  }

  return currentIndex < 0 || currentIndex - 1 < 0 ? total - 1 : currentIndex - 1;
}

export function resolveTngButtonToggleAriaPressed(pressed: boolean): 'false' | 'true' {
  return pressed ? 'true' : 'false';
}

export function resolveTngButtonToggleDataState(pressed: boolean): 'off' | 'on' {
  return pressed ? 'on' : 'off';
}

@Directive({
  selector: 'button[tngButtonToggle]',
  exportAs: 'tngButtonToggle',
})
export class TngButtonToggle {
  public readonly disabled = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly pressed = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });

  @HostBinding('attr.aria-pressed')
  protected get ariaPressedAttr(): 'false' | 'true' {
    return resolveTngButtonToggleAriaPressed(this.pressed());
  }

  @HostBinding('attr.data-disabled')
  protected get dataDisabledAttr(): '' | null {
    return this.disabled() ? '' : null;
  }

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'button-toggle' as const;

  @HostBinding('attr.data-state')
  protected get dataStateAttr(): 'off' | 'on' {
    return resolveTngButtonToggleDataState(this.pressed());
  }

  @HostBinding('attr.disabled')
  protected get disabledAttr(): '' | null {
    return this.disabled() ? '' : null;
  }

  @HostBinding('attr.type')
  protected readonly typeAttr = 'button' as const;
}

@Directive({
  selector: '[tngButtonToggleGroup]',
  exportAs: 'tngButtonToggleGroup',
})
export class TngButtonToggleGroup {
  private readonly hostRef = inject<ElementRef<HTMLElement>>(ElementRef);

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'button-toggle-group' as const;

  @HostBinding('attr.role')
  protected readonly roleAttr = 'group' as const;

  @HostListener('keydown', ['$event'])
  protected onKeydown(event: TngButtonToggleKeyboardEvent): void {
    const action = resolveTngButtonToggleAction(event.key);
    if (action === null) {
      return;
    }

    const buttons = this.getEnabledToggleButtons();
    if (buttons.length === 0) {
      return;
    }

    let currentIndex = -1;
    for (let index = 0; index < buttons.length; index += 1) {
      if (buttons[index] === document.activeElement) {
        currentIndex = index;
        break;
      }
    }

    const nextIndex = resolveNextToggleIndex(currentIndex, buttons.length, action);
    buttons[nextIndex]?.focus();
    event.preventDefault();
  }

  private getEnabledToggleButtons(): readonly TngToggleButtonElement[] {
    const enabledButtons: TngToggleButtonElement[] = [];
    const allButtons = this.hostRef.nativeElement.querySelectorAll('button[tngButtonToggle]');
    for (let index = 0; index < allButtons.length; index += 1) {
      const candidate = allButtons.item(index);
      if (!(candidate instanceof HTMLButtonElement) || candidate.disabled) {
        continue;
      }

      enabledButtons.push(candidate);
    }

    return enabledButtons;
  }
}
