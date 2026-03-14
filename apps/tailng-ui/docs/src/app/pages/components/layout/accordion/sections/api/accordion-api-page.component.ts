import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-accordion-api-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './accordion-api-page.component.html',
  styleUrl: './accordion-api-page.component.css',
})
export class AccordionApiPageComponent {
  protected readonly primitiveAttachmentCode = [
    '<section tngAccordion [defaultValue]="\'overview\'" [collapsible]="true">',
    '  <article tngAccordionItem value="overview">',
    '    <button tngAccordionTrigger type="button">Overview</button>',
    '    <div tngAccordionPanel>Overview content</div>',
    '  </article>',
    '  <article tngAccordionItem value="api">',
    '    <button tngAccordionTrigger type="button">API</button>',
    '    <div tngAccordionPanel>API content</div>',
    '  </article>',
    '</section>',
    '',
  ].join('\n');

  protected readonly componentAttachmentCode = [
    '<tng-accordion ariaLabel="Documentation" [defaultValue]="\'install\'">',
    '  <tng-accordion-item value="install">',
    '    <tng-accordion-trigger>Installation</tng-accordion-trigger>',
    '    <tng-accordion-panel>Install instructions.</tng-accordion-panel>',
    '  </tng-accordion-item>',
    '  <tng-accordion-item value="migration">',
    '    <tng-accordion-trigger>Migration</tng-accordion-trigger>',
    '    <tng-accordion-panel>Upgrade notes.</tng-accordion-panel>',
    '  </tng-accordion-item>',
    '</tng-accordion>',
    '',
  ].join('\n');

  protected readonly eventsCode = [
    '<section',
    '  tngAccordion',
    '  [type]="\'multiple\'"',
    '  (valueChange)="onValueChange($event)"',
    '  (expandedChange)="onExpandedChange($event)"',
    '></section>',
    '',
  ].join('\n');
}
