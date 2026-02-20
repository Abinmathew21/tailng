import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TngTree } from '@tailng-ui/components';
import { TngTree as TngTreePrimitive } from '@tailng-ui/primitives';

@Component({
  selector: 'app-tree-playground-page',
  imports: [RouterLink, TngTreePrimitive, TngTree],
  templateUrl: './tree-playground-page.component.html',
  styleUrl: './tree-playground-page.component.css',
})
export class TreePlaygroundPageComponent {}
