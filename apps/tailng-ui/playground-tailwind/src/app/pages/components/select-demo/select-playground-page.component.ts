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

import { TngSelectComponent } from '@tailng-ui/components';

type Opt = { value: string; label: string; disabled?: boolean };

@Component({
  selector: 'app-select-playground-page',
  imports: [
    TngSelect,
    TngSelectTrigger,
    TngSelectValue,
    TngSelectIcon,
    TngSelectContent,
    TngSelectOverlay,
    TngSelectListbox,
    TngSelectOption,
    TngSelectComponent,
  ],
  templateUrl: './select-playground-page.component.html',
  styleUrl: './select-playground-page.component.css',
})
export class SelectPlaygroundPageComponent {
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

  readonly valueC = signal<string | null>('earth');

  labelFor(v: string | readonly string[] | null): string {
    if (v === null) return 'Select…';
    const arr = Array.isArray(v) ? v : [v];
    if (arr.length === 0) return 'Select…';
    const labels = arr.map((x) => this.options.find((o) => o.value === x)?.label).filter(Boolean);
    return labels.length > 0 ? labels.join(', ') : 'Select…';
  }

  coerceSingle(next: ListboxValue<string>): string | null {
    return next === null ? null : (Array.isArray(next) ? next[0] ?? null : (next as string | null));
  }
}
