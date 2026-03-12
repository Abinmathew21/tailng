import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-button-toggle-api-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './button-toggle-api-page.component.html',
  styleUrl: './button-toggle-api-page.component.css',
})
export class ButtonToggleApiPageComponent {
  protected readonly primitiveAttachmentCode = [
    '<div',
    '  tngButtonToggleGroup',
    '  [type]="\'single\'"',
    '  [tngButtonToggleValue]="value()"',
    '  (valueChange)="value.set($event)"',
    '>',
    '  <button tngButtonToggle tngButtonToggleValue="a">A</button>',
    '  <button tngButtonToggle tngButtonToggleValue="b">B</button>',
    '</div>',
    '',
  ].join('\n');

  protected readonly componentAttachmentCode = [
    '<tng-button-toggle-group [type]="\'multiple\'" (valuesChange)="styles = $event">',
    '  <tng-button-toggle value="bold">Bold</tng-button-toggle>',
    '  <tng-button-toggle value="italic">Italic</tng-button-toggle>',
    '</tng-button-toggle-group>',
    '',
  ].join('\n');
}
