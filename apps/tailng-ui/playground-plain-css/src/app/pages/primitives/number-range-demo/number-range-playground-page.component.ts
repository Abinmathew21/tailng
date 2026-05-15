import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TngNumberRangeComponent } from '@tailng-ui/components';
import type { TngNumberRangeValue } from '@tailng-ui/components';

@Component({
  selector: 'app-number-range-playground-page',
  imports: [TngNumberRangeComponent, ReactiveFormsModule],
  templateUrl: './number-range-playground-page.component.html',
  styleUrl: './number-range-playground-page.component.css',
})
export class NumberRangePlaygroundPageComponent {
  // ── A) Basic uncontrolled ──────────────────────────────────────────────────
  public readonly lastBasicEvent = signal<string>('—');

  public onBasicChange(value: TngNumberRangeValue): void {
    this.lastBasicEvent.set(`min: ${value.min ?? 'null'}  max: ${value.max ?? 'null'}`);
  }

  // ── B) Controlled with signal ─────────────────────────────────────────────
  public readonly priceRange = signal<TngNumberRangeValue>({ min: null, max: null });

  public onPriceChange(value: TngNumberRangeValue): void {
    this.priceRange.set(value);
  }

  public resetPrice(): void {
    this.priceRange.set({ min: null, max: null });
  }

  // ── C) With min/max boundaries ────────────────────────────────────────────
  public readonly boundedRange = signal<TngNumberRangeValue>({ min: null, max: null });

  public onBoundedChange(value: TngNumberRangeValue): void {
    this.boundedRange.set(value);
  }

  // ── D) Reactive form ──────────────────────────────────────────────────────
  public readonly form = new FormGroup({
    budget: new FormControl<TngNumberRangeValue | null>(null),
  });

  public get budgetControl(): FormControl<TngNumberRangeValue | null> {
    return this.form.get('budget') as FormControl<TngNumberRangeValue | null>;
  }

  public resetForm(): void {
    this.form.reset();
  }

  // ── E) Invalid / external validation ─────────────────────────────────────
  public readonly invalidRange = signal<TngNumberRangeValue>({ min: 500, max: 100 });
  public readonly forceInvalid = signal(false);

  public onInvalidRangeChange(value: TngNumberRangeValue): void {
    this.invalidRange.set(value);
  }

  // ── F) Slot customization ─────────────────────────────────────────────────
  public readonly slotRange = signal<TngNumberRangeValue>({ min: null, max: null });

  public onSlotChange(value: TngNumberRangeValue): void {
    this.slotRange.set(value);
  }
}
