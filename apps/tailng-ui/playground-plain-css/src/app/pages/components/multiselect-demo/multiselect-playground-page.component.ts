import { Component, signal } from '@angular/core';

import {
  TngSelect,
  TngSelectTrigger,
  TngSelectValue,
  TngSelectIcon,
  TngSelectContent,
  TngSelectOverlay,
  TngSelectListbox,
  TngSelectOption,
  type ListboxValue,
} from '@tailng-ui/primitives';

import { TngMultiSelectComponent } from '@tailng-ui/components';

type Opt = { value: string; label: string; disabled?: boolean };

@Component({
  selector: 'app-multiselect-playground-page',
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
    TngMultiSelectComponent,
  ],
  templateUrl: './multiselect-playground-page.component.html',
  styleUrl: './multiselect-playground-page.component.css',
})
export class MultiselectPlaygroundPageComponent {
  readonly options: Opt[] = [
    { value: 'mercury', label: 'Mercury' },
    { value: 'venus', label: 'Venus' },
    { value: 'earth', label: 'Earth' },
    { value: 'mars', label: 'Mars' },
    { value: 'jupiter', label: 'Jupiter', disabled: true },
    { value: 'saturn', label: 'Saturn', disabled: true },
    { value: 'uranus', label: 'Uranus' },
    { value: 'neptune', label: 'Neptune' },
  ];

  readonly valueMultiA = signal<readonly string[]>([]);
  readonly valueMultiB = signal<readonly string[]>(['earth', 'mars']);
  readonly valueMultiC = signal<readonly string[]>(['venus', 'uranus']);

  labelFor(v: string | readonly string[] | null): string {
    if (v === null) return 'Select…';
    const arr = Array.isArray(v) ? v : [v];
    if (arr.length === 0) return 'Select…';
    const labels = arr.map((x) => this.options.find((o) => o.value === x)?.label).filter(Boolean);
    return labels.length > 0 ? labels.join(', ') : 'Select…';
  }

  coerceMulti(next: ListboxValue<string>): readonly string[] {
    if (next === null) return [];
    const arr = Array.isArray(next) ? next : [next];
    return [...arr];
  }
}
