import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-input-api-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './input-api-page.component.html',
  styleUrl: './input-api-page.component.css',
})
export class InputApiPageComponent {
  protected readonly directiveAttachCode = [
    '<input tngInput type="text" />',
    '<textarea tngInput rows="3"></textarea>',
    '',
  ].join('\n');

  protected readonly groupTemplateCode = [
    '<tng-input-group>',
    '  <span tngInputLeading aria-hidden="true">Search</span>',
    '  <input tngInput type="search" />',
    '  <span tngInputTrailing aria-hidden="true">Ctrl+K</span>',
    '</tng-input-group>',
    '',
  ].join('\n');
}
