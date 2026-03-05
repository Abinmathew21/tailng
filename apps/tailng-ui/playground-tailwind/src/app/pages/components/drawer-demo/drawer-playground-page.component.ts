import { Component, signal } from '@angular/core';
import { TngDrawerComponent } from '@tailng-ui/components';
import {
  TngDrawer,
  TngDrawerContainer,
  TngDrawerContent,
  TngSidenav,
  TngSidenavContainer,
  TngSidenavContent,
} from '@tailng-ui/primitives';
import type { TngDrawerDirection, TngDrawerMode, TngDrawerPosition } from '@tailng-ui/primitives';

@Component({
  selector: 'app-drawer-playground-page',
  imports: [
    TngDrawerComponent,
    TngDrawerContainer,
    TngDrawer,
    TngDrawerContent,
    TngSidenavContainer,
    TngSidenav,
    TngSidenavContent,
  ],
  templateUrl: './drawer-playground-page.component.html',
})
export class DrawerPlaygroundPageComponent {
  readonly drawerOpen = signal(false);
  readonly drawerMode = signal<TngDrawerMode>('overlay');
  readonly drawerDirection = signal<TngDrawerDirection>('ltr');
  readonly drawerPosition = signal<TngDrawerPosition>('start');

  readonly componentDrawerOpen = signal(false);

  readonly dualDrawerOpenStart = signal(false);
  readonly dualDrawerOpenEnd = signal(false);
  readonly dualDrawerCloseOthersOnOpen = signal(false);

  readonly sidenavOpen = signal(true);
}
