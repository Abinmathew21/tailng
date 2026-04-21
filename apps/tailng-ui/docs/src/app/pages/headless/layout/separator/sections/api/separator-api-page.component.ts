import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-headless-separator-api-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './separator-api-page.component.html',
  styleUrl: './separator-api-page.component.css',
})
export class HeadlessSeparatorApiPageComponent {
  protected readonly attachmentCode = [
    '<div tngSeparator></div>',
    '<div tngSeparator orientation="vertical"></div>',
    '<div tngSeparator [decorative]="false"></div>',
    '',
  ].join('\n');
}
