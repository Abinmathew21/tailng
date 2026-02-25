import { Component } from '@angular/core';
import { TngDrawerComponent } from '@tailng-ui/components';
import { TngDrawer as TngDrawerPrimitive } from '@tailng-ui/primitives';

@Component({
  selector: 'app-drawer-playground-page',
  imports: [TngDrawerPrimitive, TngDrawerComponent],
  templateUrl: './drawer-playground-page.component.html',
  styleUrl: './drawer-playground-page.component.css',
})
export class DrawerPlaygroundPageComponent {}
