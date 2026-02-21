import { Component } from '@angular/core';
import { TngAccordion } from '@tailng-ui/components';
import { TngAccordion as TngAccordionPrimitive } from '@tailng-ui/primitives';

@Component({
  selector: 'app-accordion-playground-page',
  imports: [TngAccordionPrimitive, TngAccordion],
  templateUrl: './accordion-playground-page.component.html',
  styleUrl: './accordion-playground-page.component.css',
})
export class AccordionPlaygroundPageComponent {}
