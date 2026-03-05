import { Component, signal } from '@angular/core';
import { TngMenuComponent, TngMenuTriggerFor } from '@tailng-ui/components';
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
    TngMenuComponent,
    TngMenuTriggerFor,
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
  readonly lastComponentAction = signal('No component action yet');
  readonly lastComponentCascadeAction = signal('No component cascaded action yet');
  readonly lastAction = signal('No action yet');
  readonly lastPreference = signal('No preference selected yet');
  readonly lastCascadeAction = signal('No cascaded action yet');

  onComponentSelect(event: TngMenuSelectEvent): void {
    this.lastComponentAction.set(String(event.value));
  }

  onComponentCascadeSelect(event: TngMenuSelectEvent): void {
    this.lastComponentCascadeAction.set(String(event.value));
  }

  onActionSelect(event: TngMenuSelectEvent): void {
    this.lastAction.set(String(event.value));
  }

  onPreferenceSelect(event: TngMenuSelectEvent): void {
    this.lastPreference.set(String(event.value));
  }

  onCascadeSelect(event: TngMenuSelectEvent): void {
    this.lastCascadeAction.set(String(event.value));
  }
}
