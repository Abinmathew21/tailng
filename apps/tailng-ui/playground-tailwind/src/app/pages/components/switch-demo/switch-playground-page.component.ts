import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TngSwitchComponent } from '@tailng-ui/components';
import { TngSwitch as TngSwitchPrimitive } from '@tailng-ui/primitives';

@Component({
  selector: 'app-switch-playground-page',
  imports: [RouterLink, TngSwitchPrimitive, TngSwitchComponent],
  templateUrl: './switch-playground-page.component.html',
  styleUrl: './switch-playground-page.component.css',
})
export class SwitchPlaygroundPageComponent {
  protected readonly airplaneModeEnabled = signal(false);
  protected readonly primitiveChecked = signal(false);
  protected readonly notificationsEnabled = signal(false);

  protected onAirplaneModeChange(value: boolean): void {
    this.airplaneModeEnabled.set(value);
  }

  protected onNotificationsEnabledChange(value: boolean): void {
    this.notificationsEnabled.set(value);
  }

  protected onPrimitiveSwitchToggle(): void {
    this.primitiveChecked.update((checked) => !checked);
  }
}
