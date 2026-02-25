import { Component } from '@angular/core';
import { TngTagComponent } from '@tailng-ui/components';
import { TngTag as TngTagPrimitive } from '@tailng-ui/primitives';

@Component({
  selector: 'app-tag-playground-page',
  imports: [TngTagPrimitive, TngTagComponent],
  templateUrl: './tag-playground-page.component.html',
  styleUrl: './tag-playground-page.component.css',
})
export class TagPlaygroundPageComponent {}
