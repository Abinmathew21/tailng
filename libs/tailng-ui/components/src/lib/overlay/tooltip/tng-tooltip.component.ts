import { booleanAttribute, Component, effect, input, output, signal } from '@angular/core';
import type { OnDestroy } from '@angular/core';
import { createTngIdFactory } from '@tailng-ui/cdk/core';
import {
  type TngTooltipSide,
  TngTooltipContent as TngTooltipContentPrimitive,
  TngTooltipTrigger as TngTooltipTriggerPrimitive,
} from '@tailng-ui/primitives';

type TngTooltipKeyboardEvent = Readonly<Pick<KeyboardEvent, 'key'>> &
  Readonly<{ preventDefault: () => void }>;

const tooltipIdFactory = createTngIdFactory('tng-tooltip');

export function normalizeTngTooltipDelay(value: number): number {
  if (!Number.isFinite(value) || value < 0) {
    return 0;
  }

  return value;
}

export function shouldCloseTngTooltipForKey(key: string): boolean {
  return key === 'Escape';
}

@Component({
  selector: 'tng-tooltip',
  imports: [TngTooltipTriggerPrimitive, TngTooltipContentPrimitive],
  templateUrl: './tng-tooltip.component.html',
  styleUrl: './tng-tooltip.component.css',
})
export class TngTooltipComponent implements OnDestroy {
  private closeTimerId: ReturnType<typeof setTimeout> | null = null;
  private openTimerId: ReturnType<typeof setTimeout> | null = null;

  public readonly ariaLabel = input<string | null>(null);
  public readonly closeDelay = input<number>(60);
  public readonly disabled = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly openDelay = input<number>(120);
  public readonly side = input<TngTooltipSide>('top');
  public readonly text = input<string>('More information');
  public readonly triggerLabel = input<string>('Info');

  public readonly openChange = output<boolean>();
  protected readonly open = signal(false);
  protected readonly tooltipId = tooltipIdFactory();

  private readonly syncDisabledState = effect(() => {
    if (this.disabled() && this.open()) {
      this.setOpen(false);
    }
  });

  public ngOnDestroy(): void {
    this.syncDisabledState.destroy();
    this.clearCloseTimer();
    this.clearOpenTimer();
  }

  protected onCloseIntent(): void {
    if (this.disabled()) {
      return;
    }

    this.clearOpenTimer();
    const delay = normalizeTngTooltipDelay(this.closeDelay());
    if (delay === 0) {
      this.setOpen(false);
      return;
    }

    this.closeTimerId = setTimeout(() => {
      this.closeTimerId = null;
      this.setOpen(false);
    }, delay);
  }

  protected onOpenIntent(): void {
    if (this.disabled()) {
      return;
    }

    this.clearCloseTimer();
    const delay = normalizeTngTooltipDelay(this.openDelay());
    if (delay === 0) {
      this.setOpen(true);
      return;
    }

    this.openTimerId = setTimeout(() => {
      this.openTimerId = null;
      this.setOpen(true);
    }, delay);
  }

  protected onTriggerKeydown(event: TngTooltipKeyboardEvent): void {
    if (this.disabled()) {
      return;
    }

    if (!shouldCloseTngTooltipForKey(event.key)) {
      return;
    }

    event.preventDefault();
    this.clearCloseTimer();
    this.clearOpenTimer();
    this.setOpen(false);
  }

  private clearCloseTimer(): void {
    if (this.closeTimerId !== null) {
      clearTimeout(this.closeTimerId);
      this.closeTimerId = null;
    }
  }

  private clearOpenTimer(): void {
    if (this.openTimerId !== null) {
      clearTimeout(this.openTimerId);
      this.openTimerId = null;
    }
  }

  private setOpen(nextOpen: boolean): void {
    if (this.open() === nextOpen) {
      return;
    }

    this.open.set(nextOpen);
    this.openChange.emit(nextOpen);
  }
}
