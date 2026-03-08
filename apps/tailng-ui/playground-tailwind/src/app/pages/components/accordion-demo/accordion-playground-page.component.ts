import { Component } from '@angular/core';
import {
  TngAccordionComponent,
  TngAccordionItemComponent,
  TngAccordionPanelComponent,
  TngAccordionTriggerComponent,
} from '@tailng-ui/components';
import {
  TngAccordion as TngAccordionPrimitive,
  TngAccordionItem as TngAccordionItemPrimitive,
  TngAccordionPanel as TngAccordionPanelPrimitive,
  TngAccordionTrigger as TngAccordionTriggerPrimitive,
} from '@tailng-ui/primitives';

@Component({
  selector: 'app-accordion-playground-page',
  imports: [
    TngAccordionPrimitive,
    TngAccordionItemPrimitive,
    TngAccordionTriggerPrimitive,
    TngAccordionPanelPrimitive,
    TngAccordionComponent,
    TngAccordionItemComponent,
    TngAccordionTriggerComponent,
    TngAccordionPanelComponent,
  ],
  templateUrl: './accordion-playground-page.component.html',
})
export class AccordionPlaygroundPageComponent {}
