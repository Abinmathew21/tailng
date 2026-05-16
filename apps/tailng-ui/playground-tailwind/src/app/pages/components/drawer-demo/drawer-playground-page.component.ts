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
  protected readonly drawerOpen = signal(false);
  protected readonly drawerMode = signal<TngDrawerMode>('overlay');
  protected readonly drawerDirection = signal<TngDrawerDirection>('ltr');
  protected readonly drawerPosition = signal<TngDrawerPosition>('start');

  protected readonly componentDrawerOpen = signal(false);

  protected readonly dualDrawerOpenStart = signal(false);
  protected readonly dualDrawerOpenEnd = signal(false);
  protected readonly dualDrawerCloseOthersOnOpen = signal(false);

  protected readonly sidenavOpen = signal(true);
}
