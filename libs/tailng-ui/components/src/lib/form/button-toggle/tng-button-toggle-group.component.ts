import { Component, HostBinding, input } from '@angular/core';
import {
  TngButtonToggleGroup as TngButtonToggleGroupPrimitive,
} from '@tailng-ui/primitives';

@Component({
  selector: 'tng-button-toggle-group',
  hostDirectives: [
    {
      directive: TngButtonToggleGroupPrimitive,
      inputs: [
        'type',
        'activation',
        'orientation',
        'dir',
        'allowEmpty',
        'disabled',
        'loop',
        'tngButtonToggleValue',
        'tngButtonToggleValues',
        'tngButtonToggleDefaultValue',
        'tngButtonToggleDefaultValues',
        'value',
        'values',
        'defaultValue',
        'defaultValues',
      ],
      outputs: ['valueChange', 'valuesChange', 'toggleChange', 'focusChange'],
    },
  ],
  templateUrl: './tng-button-toggle-group.component.html',
  styleUrl: './tng-button-toggle-group.component.css',
  host: {
    class: 'tng-button-toggle-group',
  },
})
export class TngButtonToggleGroupComponent {
  public readonly ariaLabel = input<string>('Button Toggle Group');

  @HostBinding('attr.aria-label')
  protected get hostAriaLabel(): string {
    return this.ariaLabel();
  }
}
