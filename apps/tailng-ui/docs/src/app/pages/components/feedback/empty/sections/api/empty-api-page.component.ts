import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-empty-api-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './empty-api-page.component.html',
  styleUrl: './empty-api-page.component.css',
})
export class EmptyApiPageComponent {
  protected readonly rootUsageCode = [
    '<tng-empty align="start">',
    '  <tng-empty-icon>🔎</tng-empty-icon>',
    '  <tng-empty-title>No matching records</tng-empty-title>',
    '  <tng-empty-description>',
    '    Try broadening your search criteria.',
    '  </tng-empty-description>',
    '</tng-empty>',
    '',
  ].join('\n');

  protected readonly partUsageCode = [
    '<tng-empty>',
    '  <tng-empty-icon>📭</tng-empty-icon>',
    '  <tng-empty-title>No messages</tng-empty-title>',
    '  <tng-empty-description>',
    '    You are all caught up. Invite your team to start new conversations.',
    '  </tng-empty-description>',
    '  <tng-empty-actions>',
    '    <button type="button">Invite team</button>',
    '  </tng-empty-actions>',
    '</tng-empty>',
    '',
  ].join('\n');
}
