import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-empty-api-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './empty-api-page.component.html',
  styleUrl: './empty-api-page.component.css',
})
export class EmptyApiPageComponent {
  protected readonly primitiveAttachmentCode = [
    '<section tngEmpty>',
    '  <div tngEmptyIcon>📭</div>',
    '  <h3 tngEmptyTitle>No data</h3>',
    '  <p tngEmptyDescription>Load data to continue.</p>',
    '  <div tngEmptyActions>',
    '    <button type="button">Retry</button>',
    '  </div>',
    '</section>',
    '',
  ].join('\n');

  protected readonly componentAttachmentCode = [
    '<tng-empty align="start">',
    '  <tng-empty-icon>🔎</tng-empty-icon>',
    '  <tng-empty-title>No matching records</tng-empty-title>',
    '  <tng-empty-description>',
    '    Try broadening your search criteria.',
    '  </tng-empty-description>',
    '</tng-empty>',
    '',
  ].join('\n');
}
