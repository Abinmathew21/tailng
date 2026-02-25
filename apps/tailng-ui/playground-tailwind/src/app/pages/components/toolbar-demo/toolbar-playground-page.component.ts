import { Component } from '@angular/core';
import { TngToolbarComponent } from '@tailng-ui/components';
import { TngToolbar as TngToolbarPrimitive } from '@tailng-ui/primitives';

@Component({
  selector: 'app-toolbar-playground-page',
  imports: [TngToolbarPrimitive, TngToolbarComponent],
  templateUrl: './toolbar-playground-page.component.html',
  styleUrl: './toolbar-playground-page.component.css',
})
export class ToolbarPlaygroundPageComponent {}
