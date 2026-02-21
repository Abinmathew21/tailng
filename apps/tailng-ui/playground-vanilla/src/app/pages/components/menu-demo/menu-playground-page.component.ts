import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TngMenu } from '@tailng-ui/components';
import { TngMenu as TngMenuPrimitive } from '@tailng-ui/primitives';

@Component({
  selector: 'app-menu-playground-page',
  imports: [RouterLink, TngMenuPrimitive, TngMenu],
  templateUrl: './menu-playground-page.component.html',
  styleUrl: './menu-playground-page.component.css',
})
export class MenuPlaygroundPageComponent {}
