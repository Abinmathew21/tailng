import { Component, signal } from '@angular/core';
import { TngMenuComponent, TngMenubarComponent } from '@tailng-ui/components';
import {
  TngMenu,
  TngMenuGroupLabel,
  TngMenuItem,
  TngMenuSelectEvent,
  TngMenuSeparator,
  TngMenubar,
  TngMenubarItem,
} from '@tailng-ui/primitives';

@Component({
  selector: 'app-menubar-playground-page',
  imports: [
    TngMenuComponent,
    TngMenubarComponent,
    TngMenu,
    TngMenuGroupLabel,
    TngMenuItem,
    TngMenuSeparator,
    TngMenubar,
    TngMenubarItem,
  ],
  templateUrl: './menubar-playground-page.component.html',
  styleUrl: './menubar-playground-page.component.css',
})
export class MenubarPlaygroundPageComponent {
  readonly lastComponentCommand = signal('No component command yet');
  readonly lastComponentCascadeCommand = signal('No component cascaded command yet');
  readonly lastCommand = signal('No command yet');
  readonly lastCascadeCommand = signal('No cascaded command yet');

  onComponentCommandSelect(event: TngMenuSelectEvent): void {
    this.lastComponentCommand.set(String(event.value));
  }

  onComponentCascadeCommandSelect(event: TngMenuSelectEvent): void {
    this.lastComponentCascadeCommand.set(String(event.value));
  }

  onCommandSelect(event: TngMenuSelectEvent): void {
    this.lastCommand.set(String(event.value));
  }

  onCascadeCommandSelect(event: TngMenuSelectEvent): void {
    this.lastCascadeCommand.set(String(event.value));
  }
}
