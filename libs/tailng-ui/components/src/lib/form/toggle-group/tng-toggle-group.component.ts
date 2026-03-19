import { Component } from '@angular/core';
import { TngToggleGroup as TngToggleGroupPrimitive } from '@tailng-ui/primitives';

@Component({
  standalone: true,
  selector: 'tng-toggle-group',
  templateUrl: './tng-toggle-group.component.html',
  styleUrl: './tng-toggle-group.component.css',
  host: {
    class: 'tng-toggle-group',
  },
  hostDirectives: [
    {
      directive: TngToggleGroupPrimitive,
      inputs: [
        'ariaLabel',
        'ariaLabelledby',
        'orientation',
        'selectionMode',
        'disabled',
        'value',
        'values',
        'defaultValue',
        'defaultValues',
      ],
      outputs: ['valueChange', 'valuesChange'],
    },
  ],
})
export class TngToggleGroupComponent {}
