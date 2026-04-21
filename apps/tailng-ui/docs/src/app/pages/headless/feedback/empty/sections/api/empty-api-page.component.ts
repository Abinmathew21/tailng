import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-headless-empty-api-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './empty-api-page.component.html',
  styleUrl: './empty-api-page.component.css',
})
export class HeadlessEmptyApiPageComponent {
  protected readonly rootCode = [
    '<section tngEmpty class="report-empty">',
    '  <!-- owner-authored empty state -->',
    '</section>',
    '',
  ].join('\n');

  protected readonly partCode = [
    '<section tngEmpty>',
    '  <div tngEmptyIcon>📭</div>',
    '  <h3 tngEmptyTitle>No messages</h3>',
    '  <p tngEmptyDescription>You are all caught up.</p>',
    '  <div tngEmptyActions>',
    '    <button type="button">Invite team</button>',
    '  </div>',
    '</section>',
    '',
  ].join('\n');
}
