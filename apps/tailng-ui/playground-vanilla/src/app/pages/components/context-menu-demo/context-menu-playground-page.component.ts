import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TngContextMenu } from '@tailng-ui/components';
import { TngContextMenu as TngContextMenuPrimitive } from '@tailng-ui/primitives';

@Component({
  selector: 'app-context-menu-playground-page',
  imports: [RouterLink, TngContextMenuPrimitive, TngContextMenu],
  templateUrl: './context-menu-playground-page.component.html',
  styleUrl: './context-menu-playground-page.component.css',
})
export class ContextMenuPlaygroundPageComponent {}
