import { Component, signal } from '@angular/core';
import { TngToggle } from '@tailng-ui/components';
import { TngToggle as TngTogglePrimitive } from '@tailng-ui/primitives';
import { TngIcon } from '@tailng-ui/icons';

@Component({
  selector: 'app-toggle-playground-page',
  imports: [TngTogglePrimitive, TngToggle, TngIcon],
  templateUrl: './toggle-playground-page.component.html',
  styleUrl: './toggle-playground-page.component.css',
})
export class TogglePlaygroundPageComponent {
  protected readonly primitivePressed = signal(false);
  protected readonly componentPressed = signal(false);

  protected onPrimitiveToggle(): void {
    this.primitivePressed.update((pressed) => !pressed);
  }

  protected onComponentToggle(pressed: boolean): void {
    this.componentPressed.set(pressed);
  }
}
