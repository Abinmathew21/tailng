import { Component, signal } from '@angular/core';
import { TngToggleComponent } from '@tailng-ui/components';
import { TngIcon } from '@tailng-ui/icons';
import { TngToggle as TngTogglePrimitive } from '@tailng-ui/primitives';

@Component({
  selector: 'app-toggle-playground-page',
  imports: [TngIcon, TngTogglePrimitive, TngToggleComponent],
  templateUrl: './toggle-playground-page.component.html',
  styleUrl: './toggle-playground-page.component.css',
})
export class TogglePlaygroundPageComponent {
  protected readonly primitivePressed = signal(false);
  protected readonly themeModeEnabled = signal(false);

  protected onPrimitiveToggle(): void {
    this.primitivePressed.update((pressed) => !pressed);
  }

  protected onThemeModeChange(pressed: boolean): void {
    this.themeModeEnabled.set(pressed);
  }
}
