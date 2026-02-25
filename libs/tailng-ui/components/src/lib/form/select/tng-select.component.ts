import { Component, HostBinding, input } from '@angular/core';
import { TngSelect as TngSelectPrimitive } from '@tailng-ui/primitives';

@Component({
  selector: 'tng-select',
  standalone: true,
  // Attach the primitive directive to the component host.
  // This keeps markup clean: <tng-select ...>...</tng-select>
  hostDirectives: [
    {
      directive: TngSelectPrimitive,
      // Re-expose primitive API on the component
      inputs: ['open', 'value', 'disabled'],
      outputs: ['openChange', 'valueChange'],
    },
  ],
  templateUrl: './tng-select.component.html',
})
export class TngSelect {
  /** Optional a11y label for the whole control (host). */
  readonly ariaLabel = input<string>('Select');

  @HostBinding('attr.aria-label')
  protected get hostAriaLabel(): string {
    return this.ariaLabel();
  }
}