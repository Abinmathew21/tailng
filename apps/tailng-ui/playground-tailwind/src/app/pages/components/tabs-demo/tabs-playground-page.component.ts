import { Component } from '@angular/core';
import { TngTabsComponent } from '@tailng-ui/components';
import { TngTabs as TngTabsPrimitive } from '@tailng-ui/primitives';

@Component({
  selector: 'app-tabs-playground-page',
  imports: [TngTabsPrimitive, TngTabsComponent],
  templateUrl: './tabs-playground-page.component.html',
  styleUrl: './tabs-playground-page.component.css',
})
export class TabsPlaygroundPageComponent {}
