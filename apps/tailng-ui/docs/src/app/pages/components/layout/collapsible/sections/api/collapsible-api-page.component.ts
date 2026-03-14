import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-collapsible-api-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './collapsible-api-page.component.html',
  styleUrl: './collapsible-api-page.component.css',
})
export class CollapsibleApiPageComponent {
  protected readonly primitiveAttachmentCode = [
    '<ol tngCollapsible aria-label="Release flow">',
    '  <li data-state="completed"><span>✓</span> Draft</li>',
    '  <li data-state="current"><span>2</span> Review</li>',
    '  <li data-state="upcoming"><span>3</span> Publish</li>',
    '</ol>',
    '',
  ].join('\n');

  protected readonly componentAttachmentCode = [
    "readonly open = signal(false);",
    '',
    'onOpenChange(nextOpen: boolean): void {',
    '  this.open.set(nextOpen);',
    '}',
    '',
    '<tng-collapsible',
    '  title="Checkout steps"',
    '  ariaLabel="Checkout steps"',
    '  [open]="open()"',
    '  (openChange)="onOpenChange($event)"',
    '>',
    '  <ol>',
    '    <li data-state="current"><span>1</span> Shipping</li>',
    '    <li data-state="upcoming"><span>2</span> Payment</li>',
    '    <li data-state="upcoming"><span>3</span> Confirmation</li>',
    '  </ol>',
    '</tng-collapsible>',
    '',
  ].join('\n');
}
