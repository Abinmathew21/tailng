import { Component, computed, signal } from '@angular/core';

// primitives
import {
  TngSelect,
  TngSelectTrigger,
  TngSelectValue,
  TngSelectIcon,
  TngSelectContent,
  TngSelectOverlay,
  TngSelectListbox,
  TngSelectOption,
  ListboxValue,
} from '@tailng-ui/primitives';

// components layer
import { TngSelectComponent } from '@tailng-ui/components';

type Opt = { value: string; label: string; disabled?: boolean };

@Component({
  selector: 'app-select-playground-page',
  standalone: true,
  imports: [
    // primitives
    TngSelect,
    TngSelectTrigger,
    TngSelectValue,
    TngSelectIcon,
    TngSelectContent,
    TngSelectOverlay,
    TngSelectListbox,
    TngSelectOption,

    // components wrapper
    TngSelectComponent,
  ],
  templateUrl: './select-playground-page.component.html',
  styleUrl: './select-playground-page.component.css',
})
export class SelectPlaygroundPageComponent {
  readonly options: Opt[] = [
    { value: 'comfortable', label: 'Comfortable' },
    { value: 'compact', label: 'Compact' },
    { value: 'dense', label: 'Dense', disabled: true },
  ];

  labelFor(v: string | null): string {
    return this.options.find(o => o.value === v)?.label ?? 'Select…';
  }

  // Demo A (normal)
  readonly valueA = signal<string | null>('compact');

  // Demo B (inside scroll view)
  readonly valueB = signal<string | null>('comfortable');

  // Components demo (wrapper) – just to show it exists
  readonly valueC = signal<string | null>('compact');

  // If you want optional debug labels
  readonly valueALabel = computed(() => this.labelFor(this.valueA()));
  readonly valueBLabel = computed(() => this.labelFor(this.valueB()));
  readonly valueCLabel = computed(() => this.labelFor(this.valueC()));

  onValueChangeA(next: ListboxValue<string>) {
    this.valueA.set(this.coerceSingle(next));
  }

  onValueChangeB(next: ListboxValue<string>) {
    this.valueB.set(this.coerceSingle(next));
  }

  onValueChangeC(next: ListboxValue<string>) {
    this.valueC.set(this.coerceSingle(next));
  }

  private coerceSingle(next: ListboxValue<string>): string | null {
    return next === null ? null : Array.isArray(next) ? (next[0] ?? null) : next as string | null;
  }
}