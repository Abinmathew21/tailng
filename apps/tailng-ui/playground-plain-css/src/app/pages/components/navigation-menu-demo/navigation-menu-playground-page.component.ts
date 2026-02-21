import { Component } from '@angular/core';
import { TngNavigationMenu } from '@tailng-ui/components';
import { TngNavigationMenu as TngNavigationMenuPrimitive } from '@tailng-ui/primitives';

@Component({
  selector: 'app-navigation-menu-playground-page',
  imports: [TngNavigationMenuPrimitive, TngNavigationMenu],
  templateUrl: './navigation-menu-playground-page.component.html',
  styleUrl: './navigation-menu-playground-page.component.css',
})
export class NavigationMenuPlaygroundPageComponent {}
