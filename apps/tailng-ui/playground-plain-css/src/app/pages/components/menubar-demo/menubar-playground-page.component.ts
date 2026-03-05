import { Component, signal } from '@angular/core';
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
  imports: [TngMenu, TngMenuGroupLabel, TngMenuItem, TngMenuSeparator, TngMenubar, TngMenubarItem],
  templateUrl: './menubar-playground-page.component.html',
  styleUrl: './menubar-playground-page.component.css',
})
export class MenubarPlaygroundPageComponent {
  readonly lastCommand = signal('No command yet');
  readonly lastCascadeCommand = signal('No cascaded command yet');

  onCommandSelect(event: TngMenuSelectEvent): void {
    this.lastCommand.set(String(event.value));
  }

  onCascadeCommandSelect(event: TngMenuSelectEvent): void {
    this.lastCascadeCommand.set(String(event.value));
  }
}
