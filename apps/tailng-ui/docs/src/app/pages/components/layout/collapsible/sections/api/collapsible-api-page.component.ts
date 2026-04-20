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
    '<section tngCollapsible [open]="open()">',
    '  <button',
    '    tngCollapsibleTrigger',
    '    [open]="open()"',
    '    [contentId]="contentId"',
    '    (click)="open.set(!open())"',
    '  >',
    '    Release flow',
    '  </button>',
    '',
    '  <ol',
    '    tngCollapsibleContent',
    '    [id]="contentId"',
    '    [open]="open()"',
    '    aria-label="Release flow"',
    '  >',
    '    <li>Draft</li>',
    '    <li>Review</li>',
    '    <li>Publish</li>',
    '  </ol>',
    '</section>',
    '',
  ].join('\n');

  protected readonly componentTsCode = [
    "import { Component, signal } from '@angular/core';",
    "import { TngCollapsibleComponent } from '@tailng-ui/components';",
    '',
    '@Component({',
    "  selector: 'app-collapsible-api-demo',",
    '  standalone: true,',
    '  imports: [TngCollapsibleComponent],',
    "  templateUrl: './collapsible-api-demo.component.html',",
    '})',
        'export class CollapsibleApiDemoComponent {',
        '  readonly open = signal(false);',
        '}',
  ].join('\n');

  protected readonly componentHtmlCode = [
    '<tng-collapsible title="Checkout steps" [open]="open()" (openChange)="open.set($event)">',
    '  <ol>',
    '    <li data-state="current"><span>1</span> Shipping</li>',
    '    <li data-state="upcoming"><span>2</span> Payment</li>',
    '    <li data-state="upcoming"><span>3</span> Confirmation</li>',
    '  </ol>',
    '</tng-collapsible>',
    '',
  ].join('\n');
}
