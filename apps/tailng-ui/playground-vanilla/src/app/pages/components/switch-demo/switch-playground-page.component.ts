import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TngSwitch } from '@tailng-ui/components';
import { TngSwitch as TngSwitchPrimitive } from '@tailng-ui/primitives';

@Component({
  selector: 'app-switch-playground-page',
  imports: [RouterLink, TngSwitchPrimitive, TngSwitch],
  templateUrl: './switch-playground-page.component.html',
  styleUrl: './switch-playground-page.component.css',
})
export class SwitchPlaygroundPageComponent {
  protected readonly notificationsEnabled = signal(false);

  protected onNotificationsEnabledChange(value: boolean): void {
    this.notificationsEnabled.set(value);
  }
}
