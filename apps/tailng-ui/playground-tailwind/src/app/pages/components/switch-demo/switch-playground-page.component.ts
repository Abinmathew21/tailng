import { Component, signal } from '@angular/core';
import { TngSwitchComponent } from '@tailng-ui/components';
import { TngSwitch as TngSwitchPrimitive } from '@tailng-ui/primitives';

@Component({
  selector: 'app-switch-playground-page',
  imports: [TngSwitchPrimitive, TngSwitchComponent],
  templateUrl: './switch-playground-page.component.html',
  styleUrl: './switch-playground-page.component.css',
})
export class SwitchPlaygroundPageComponent {
  protected readonly airplaneModeEnabled = signal(false);
  protected readonly darkModeEnabled = signal(false);
  protected readonly primitiveChecked = signal(false);
  protected readonly notificationsEnabled = signal(false);

  protected readonly headlessWifi = signal(true);
  protected readonly headlessBluetooth = signal(false);
  protected readonly headlessDnd = signal(false);

  protected onAirplaneModeChange(value: boolean): void {
    this.airplaneModeEnabled.set(value);
  }

  protected onNotificationsEnabledChange(value: boolean): void {
    this.notificationsEnabled.set(value);
  }

  protected onDarkModeChange(value: boolean): void {
    this.darkModeEnabled.set(value);
  }

  protected onPrimitiveSwitchToggle(): void {
    this.primitiveChecked.update((checked) => !checked);
  }

  protected onHeadlessToggle(sig: typeof this.headlessWifi): void {
    sig.update((v) => !v);
  }
}
