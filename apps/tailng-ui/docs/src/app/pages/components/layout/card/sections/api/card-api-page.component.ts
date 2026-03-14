import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-card-api-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './card-api-page.component.html',
  styleUrl: './card-api-page.component.css',
})
export class CardApiPageComponent {
  protected readonly primitiveAttachmentCode = [
    '<article tngCard>',
    '  <header tngCardHeader>',
    '    <h3 tngCardTitle>Card title</h3>',
    '    <p tngCardDescription>Card description</p>',
    '  </header>',
    '  <section tngCardContent>Body content</section>',
    '  <footer tngCardFooter>',
    '    <div tngCardActions>',
    '      <button type="button">Action</button>',
    '    </div>',
    '  </footer>',
    '</article>',
    '',
  ].join('\n');

  protected readonly componentAttachmentCode = [
    '<tng-card variant="outline" tone="neutral" padding="md">',
    '  <tng-card-header>',
    '    <tng-card-title>Card title</tng-card-title>',
    '    <tng-card-description>Card description</tng-card-description>',
    '  </tng-card-header>',
    '  <tng-card-content>Body content</tng-card-content>',
    '  <tng-card-footer>',
    '    <tng-card-actions>',
    '      <button type="button">Action</button>',
    '    </tng-card-actions>',
    '  </tng-card-footer>',
    '</tng-card>',
    '',
  ].join('\n');
}
