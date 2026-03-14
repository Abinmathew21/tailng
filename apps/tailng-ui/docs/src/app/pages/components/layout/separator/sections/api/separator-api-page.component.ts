import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-separator-api-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './separator-api-page.component.html',
  styleUrl: './separator-api-page.component.css',
})
export class SeparatorApiPageComponent {
  protected readonly primitiveAttachmentCode = [
    '<div tngSeparator></div>',
    '<div tngSeparator orientation="vertical"></div>',
    '<div tngSeparator [decorative]="false"></div>',
    '',
  ].join('\n');

  protected readonly componentAttachmentCode = [
    '<tng-separator></tng-separator>',
    '<tng-separator orientation="vertical"></tng-separator>',
    '<tng-separator [decorative]="false"></tng-separator>',
    '',
  ].join('\n');
}
