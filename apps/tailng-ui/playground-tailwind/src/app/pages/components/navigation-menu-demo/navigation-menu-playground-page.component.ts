import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TngNavigationMenu } from '@tailng-ui/components';
import { TngNavigationMenu as TngNavigationMenuPrimitive } from '@tailng-ui/primitives';

@Component({
  selector: 'app-navigation-menu-playground-page',
  imports: [RouterLink, TngNavigationMenuPrimitive, TngNavigationMenu],
  templateUrl: './navigation-menu-playground-page.component.html',
  styleUrl: './navigation-menu-playground-page.component.css',
})
export class NavigationMenuPlaygroundPageComponent {}
