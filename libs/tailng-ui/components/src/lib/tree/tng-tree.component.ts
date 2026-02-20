import { Component, input } from '@angular/core';
import { TngTree as TngTreePrimitive } from '@tailng-ui/primitives';

@Component({
  selector: 'tng-tree',
  imports: [TngTreePrimitive],
  templateUrl: './tng-tree.component.html',
  styleUrl: './tng-tree.component.css',
})
export class TngTree {
  public readonly ariaLabel = input<string>('Tree');
}
