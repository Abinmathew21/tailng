import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-headless-toast-api-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './toast-api-page.component.html',
  styleUrl: './toast-api-page.component.css',
})
export class HeadlessToastApiPageComponent {
  protected readonly viewportCode = [
    '<section tngToastViewport class="release-toast-stack">',
    '  <!-- owner positions and spaces the stack -->',
    '</section>',
    '',
  ].join('\n');

  protected readonly itemCode = [
    '<article tngToastItem [tone]="tone" [open]="open" class="release-toast-card">',
    '  <strong>{{ title }}</strong>',
    '  <p>{{ message }}</p>',
    '</article>',
    '',
  ].join('\n');
}
