import { DestroyRef, Directive, HostBinding, HostListener, inject } from '@angular/core';
import { TNG_SELECT } from './tng-select.tokens';
import type { TngSelect } from './tng-select';
import { createTngIdFactory } from '@tailng-ui/cdk';

const createId = createTngIdFactory('tng-select-content');


@Directive({
  selector: '[tngSelectTrigger]',
  exportAs: 'tngSelectTrigger',
  standalone: true,
})
export class TngSelectTrigger {
  protected readonly select: TngSelect = inject(TNG_SELECT);

  @HostBinding('attr.data-slot')
  protected readonly dataSlot: 'select-trigger' = 'select-trigger';

  // ✅ open/close interaction (pointer-first)
  @HostListener('pointerdown', ['$event'])
  protected onPointerDown(event: PointerEvent): void {
    if (this.select.disabled()) return;
    if (event.button !== 0) return;

    event.preventDefault();
    this.select.toggle();
  }

  // Optional: keyboard on trigger (Space/Enter)
  @HostListener('keydown', ['$event'])
  protected onKeydown(event: KeyboardEvent): void {
    if (this.select.disabled()) return;

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.select.toggle();
    }
  }
}

@Directive({
  selector: '[tngSelectValue]',
  exportAs: 'tngSelectValue',
  standalone: true,
})
export class TngSelectValue {
  protected readonly select: TngSelect = inject(TNG_SELECT);

  @HostBinding('attr.data-slot')
  protected readonly dataSlot: 'select-value' = 'select-value';
}

@Directive({
  selector: '[tngSelectIcon]',
  exportAs: 'tngSelectIcon',
  standalone: true,
})
export class TngSelectIcon {
  protected readonly select: TngSelect = inject(TNG_SELECT);

  @HostBinding('attr.data-slot')
  protected readonly dataSlot: 'select-icon' = 'select-icon';
}


const createContentId = createTngIdFactory('tng-select-content');

@Directive({
  selector: '[tngSelectContent]',
  exportAs: 'tngSelectContent',
  standalone: true,
})
export class TngSelectContent {
  protected readonly select: TngSelect = inject(TNG_SELECT);
  private readonly destroyRef = inject(DestroyRef);

  @HostBinding('attr.id')
  protected readonly id = createContentId();

  @HostBinding('attr.data-slot')
  protected readonly dataSlot: 'select-content' = 'select-content';

  @HostBinding('attr.data-state')
  protected get dataState(): 'open' | 'closed' {
    return this.select.open() ? 'open' : 'closed';
  }

  @HostBinding('attr.hidden')
  protected get hidden(): '' | null {
    return this.select.open() ? null : '';
  }

  constructor() {
    // register our id with the select host so it can set aria-controls
    this.select.setContentId(this.id);

    // ✅ cleanup: if content is destroyed/unmounted, clear aria-controls source
    this.destroyRef.onDestroy(() => {
      this.select.clearContentId(this.id);
    });
  }
}