import { Component } from '@angular/core';
import { TngDropdownMenu } from '@tailng-ui/components';
import { TngDropdownMenu as TngDropdownMenuPrimitive } from '@tailng-ui/primitives';

@Component({
  selector: 'app-dropdown-menu-playground-page',
  imports: [TngDropdownMenuPrimitive, TngDropdownMenu],
  templateUrl: './dropdown-menu-playground-page.component.html',
  styleUrl: './dropdown-menu-playground-page.component.css',
})
export class DropdownMenuPlaygroundPageComponent {}
