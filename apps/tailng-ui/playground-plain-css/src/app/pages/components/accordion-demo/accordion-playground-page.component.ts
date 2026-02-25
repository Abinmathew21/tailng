import { Component } from '@angular/core';
import { TngAccordionComponent } from '@tailng-ui/components';
import { TngAccordion as TngAccordionPrimitive } from '@tailng-ui/primitives';

@Component({
  selector: 'app-accordion-playground-page',
  imports: [TngAccordionPrimitive, TngAccordionComponent],
  templateUrl: './accordion-playground-page.component.html',
  styleUrl: './accordion-playground-page.component.css',
})
export class AccordionPlaygroundPageComponent {}
