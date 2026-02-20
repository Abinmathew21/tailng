import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TngDrawer } from '@tailng-ui/components';
import { TngDrawer as TngDrawerPrimitive } from '@tailng-ui/primitives';

@Component({
  selector: 'app-drawer-playground-page',
  imports: [RouterLink, TngDrawerPrimitive, TngDrawer],
  templateUrl: './drawer-playground-page.component.html',
  styleUrl: './drawer-playground-page.component.css',
})
export class DrawerPlaygroundPageComponent {}
