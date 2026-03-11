import { Component, signal } from '@angular/core';
import { TngToggleComponent, TngToggleGroupComponent } from '@tailng-ui/components';
import { TngIcon } from '@tailng-ui/icons';
import { TngToggle as TngTogglePrimitive } from '@tailng-ui/primitives';

@Component({
  selector: 'app-toggle-playground-page',
  imports: [TngTogglePrimitive, TngToggleComponent, TngToggleGroupComponent, TngIcon],
  templateUrl: './toggle-playground-page.component.html',
  styleUrl: './toggle-playground-page.component.css',
})
export class TogglePlaygroundPageComponent {
  protected readonly primitivePressed = signal(false);
  protected readonly primitiveUncontrolled = signal(true);
  protected readonly componentPressed = signal(false);
  protected readonly gridMode = signal(true);
  protected readonly listMode = signal(false);

  protected onPrimitiveToggle(): void {
    this.primitivePressed.update((pressed) => !pressed);
  }

  protected onPrimitiveUncontrolledChange(pressed: boolean): void {
    this.primitiveUncontrolled.set(pressed);
  }

  protected onComponentToggle(pressed: boolean): void {
    this.componentPressed.set(pressed);
  }

  protected onGridToggle(pressed: boolean): void {
    this.gridMode.set(pressed);
  }

  protected onListToggle(pressed: boolean): void {
    this.listMode.set(pressed);
  }
}
