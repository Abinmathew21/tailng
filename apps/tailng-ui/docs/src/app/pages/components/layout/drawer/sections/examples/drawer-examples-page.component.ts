import { Component, signal } from '@angular/core';
import { TngDrawerComponent } from '@tailng-ui/components';
import {
  TngDrawer as TngDrawerPrimitive,
  TngDrawerContainer as TngDrawerContainerPrimitive,
  TngDrawerContent as TngDrawerContentPrimitive,
} from '@tailng-ui/primitives';

@Component({
  selector: 'app-drawer-examples-page',
  imports: [
    TngDrawerComponent,
    TngDrawerPrimitive,
    TngDrawerContainerPrimitive,
    TngDrawerContentPrimitive,
  ],
  templateUrl: './drawer-examples-page.component.html',
  styleUrl: './drawer-examples-page.component.css',
})
export class DrawerExamplesPageComponent {
  public readonly sideNavOpen = signal(true);
  public readonly endPanelOpen = signal(false);
  public readonly pushDrawerOpen = signal(false);

  public onToggleSideNav(): void {
    this.sideNavOpen.update((v) => !v);
  }

  public onToggleEndPanel(): void {
    this.endPanelOpen.update((v) => !v);
  }

  public onTogglePushDrawer(): void {
    this.pushDrawerOpen.update((v) => !v);
  }
}
