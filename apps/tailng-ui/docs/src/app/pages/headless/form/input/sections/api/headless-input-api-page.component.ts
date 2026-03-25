import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-headless-input-api-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './headless-input-api-page.component.html',
  styleUrls: [
    '../../../../../components/form/input/sections/api/input-api-page.component.css',
  ],
})
export class HeadlessInputApiPageComponent {
  protected readonly directiveAttachCode = [
    '<input tngInput type="text" />',
    '',
  ].join('\n');

  protected readonly groupTemplateCode = [
    '<tng-input-group>',
    '  <span tngPrefix aria-hidden="true">Search</span>',
    '  <input tngInput type="search" />',
    '  <span tngSuffix aria-hidden="true">Ctrl+K</span>',
    '</tng-input-group>',
    '',
  ].join('\n');
}
