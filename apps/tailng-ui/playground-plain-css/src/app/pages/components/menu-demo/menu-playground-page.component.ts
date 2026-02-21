import { Component } from '@angular/core';
import { TngMenu, TngMenuTriggerFor } from '@tailng-ui/components';
import { TngMenu as TngMenuPrimitive } from '@tailng-ui/primitives';

@Component({
  selector: 'app-menu-playground-page',
  imports: [TngMenuPrimitive, TngMenu, TngMenuTriggerFor],
  templateUrl: './menu-playground-page.component.html',
  styleUrl: './menu-playground-page.component.css',
})
export class MenuPlaygroundPageComponent {}
