import { Component } from '@angular/core';
import { TngToolbar } from '@tailng-ui/components';
import { TngToolbar as TngToolbarPrimitive } from '@tailng-ui/primitives';

@Component({
  selector: 'app-toolbar-playground-page',
  imports: [TngToolbarPrimitive, TngToolbar],
  templateUrl: './toolbar-playground-page.component.html',
  styleUrl: './toolbar-playground-page.component.css',
})
export class ToolbarPlaygroundPageComponent {}
