import { Component } from '@angular/core';
import { TngContextMenu } from '@tailng-ui/components';
import { TngContextMenu as TngContextMenuPrimitive } from '@tailng-ui/primitives';

@Component({
  selector: 'app-context-menu-playground-page',
  imports: [TngContextMenuPrimitive, TngContextMenu],
  templateUrl: './context-menu-playground-page.component.html',
  styleUrl: './context-menu-playground-page.component.css',
})
export class ContextMenuPlaygroundPageComponent {}
