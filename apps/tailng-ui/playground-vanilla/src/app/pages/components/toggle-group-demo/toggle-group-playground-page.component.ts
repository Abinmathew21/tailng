import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TngToggleGroup } from '@tailng-ui/components';
import { TngToggleGroup as TngToggleGroupPrimitive } from '@tailng-ui/primitives';

@Component({
  selector: 'app-toggle-group-playground-page',
  imports: [RouterLink, TngToggleGroupPrimitive, TngToggleGroup],
  templateUrl: './toggle-group-playground-page.component.html',
  styleUrl: './toggle-group-playground-page.component.css',
})
export class ToggleGroupPlaygroundPageComponent {}
