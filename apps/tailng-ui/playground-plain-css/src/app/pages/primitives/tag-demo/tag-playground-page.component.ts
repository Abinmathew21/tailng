import { Component } from '@angular/core';
import { TngTag } from '@tailng-ui/components';
import { TngTag as TngTagPrimitive } from '@tailng-ui/primitives';

@Component({
  selector: 'app-tag-playground-page',
  imports: [TngTagPrimitive, TngTag],
  templateUrl: './tag-playground-page.component.html',
  styleUrl: './tag-playground-page.component.css',
})
export class TagPlaygroundPageComponent {}
