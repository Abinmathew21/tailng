import { Component } from '@angular/core';
import { TngToggleGroupComponent } from '@tailng-ui/components';
import { TngToggleGroup as TngToggleGroupPrimitive } from '@tailng-ui/primitives';

@Component({
  selector: 'app-toggle-group-playground-page',
  imports: [TngToggleGroupPrimitive, TngToggleGroupComponent],
  templateUrl: './toggle-group-playground-page.component.html',
  styleUrl: './toggle-group-playground-page.component.css',
})
export class ToggleGroupPlaygroundPageComponent {}
