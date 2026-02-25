import { Component, computed, signal } from '@angular/core';

// primitives (adjust the import path to match your barrel)
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

type Opt = { value: string; label: string; disabled?: boolean };

@Component({
  selector: 'app-select-playground-page',
  standalone: true,
  imports: [
    TngSelect,
    TngSelectTrigger,
    TngSelectValue,
    TngSelectIcon,
    TngSelectContent,
    TngSelectOverlay,
    TngSelectListbox,
    TngSelectOption,
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

  // controlled value
  readonly value = signal<string | null>('compact');

  // label shown in trigger
  readonly valueLabel = computed(() => {
    const v = this.value();
    return this.options.find(o => o.value === v)?.label ?? 'Select…';
  });

  onValueChange(next: ListboxValue<string>) {
    // ListboxValue is usually: T | readonly T[] | null
    const v = next === null ? null : Array.isArray(next) ? (next[0] ?? null) : next;
    this.value.set(v);
  }
}