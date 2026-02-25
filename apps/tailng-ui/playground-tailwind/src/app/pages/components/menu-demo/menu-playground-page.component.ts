import { Component } from '@angular/core';
import { TngMenuComponent, TngMenuTriggerFor } from '@tailng-ui/components';
import { TngMenu as TngMenuPrimitive } from '@tailng-ui/primitives';

@Component({
  selector: 'app-menu-playground-page',
  imports: [TngMenuPrimitive, TngMenuComponent, TngMenuTriggerFor],
  templateUrl: './menu-playground-page.component.html',
  styleUrl: './menu-playground-page.component.css',
})
export class MenuPlaygroundPageComponent {}
