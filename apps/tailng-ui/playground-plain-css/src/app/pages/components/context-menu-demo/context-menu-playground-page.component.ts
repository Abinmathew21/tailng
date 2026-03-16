import { Component, signal } from '@angular/core';
import { TngContextMenu as TngContextMenuComponent } from '@tailng-ui/components';
import {
  TngContextMenu as TngContextMenuPrimitive,
  TngContextMenuTrigger,
  TngMenu,
  TngMenuGroupLabel,
  TngMenuItem,
  TngMenuSelectEvent,
  TngMenuSeparator,
} from '@tailng-ui/primitives';

@Component({
  selector: 'app-context-menu-playground-page',
  imports: [
    TngContextMenuPrimitive,
    TngContextMenuComponent,
    TngContextMenuTrigger,
    TngMenu,
    TngMenuGroupLabel,
    TngMenuItem,
    TngMenuSeparator,
  ],
  templateUrl: './context-menu-playground-page.component.html',
  styleUrl: './context-menu-playground-page.component.css',
})
export class ContextMenuPlaygroundPageComponent {
  readonly lastHeadlessAction = signal('No headless action yet');
  readonly lastComponentAction = signal('No wrapper action yet');

  onHeadlessSelect(event: TngMenuSelectEvent): void {
    this.lastHeadlessAction.set(String(event.value));
  }

  onComponentSelect(event: TngMenuSelectEvent): void {
    this.lastComponentAction.set(String(event.value));
  }
}
