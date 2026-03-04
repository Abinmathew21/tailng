import { Component, signal } from '@angular/core';
import {
  TngMenu,
  TngMenuBackdrop,
  TngMenuGroupLabel,
  TngMenuItem,
  TngMenuSelectEvent,
  TngMenuSeparator,
  TngMenuTrigger,
} from '@tailng-ui/primitives';

@Component({
  selector: 'app-menu-playground-page',
  imports: [
    TngMenu,
    TngMenuBackdrop,
    TngMenuGroupLabel,
    TngMenuItem,
    TngMenuSeparator,
    TngMenuTrigger,
  ],
  templateUrl: './menu-playground-page.component.html',
  styleUrl: './menu-playground-page.component.css',
})
export class MenuPlaygroundPageComponent {
  readonly lastAction = signal('No action yet');
  readonly lastPreference = signal('No preference selected yet');

  onActionSelect(event: TngMenuSelectEvent): void {
    this.lastAction.set(String(event.value));
  }

  onPreferenceSelect(event: TngMenuSelectEvent): void {
    this.lastPreference.set(String(event.value));
  }
}
