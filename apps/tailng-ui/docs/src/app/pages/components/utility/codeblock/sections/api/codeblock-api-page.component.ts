import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-codeblock-api-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './codeblock-api-page.component.html',
  styleUrl: './codeblock-api-page.component.css',
})
export class CodeblockApiPageComponent {
  protected readonly primitiveAttachmentCode = [
    '<section tngCodeBlock>',
    '  <header tngCodeBlockHeader>...</header>',
    '  <div tngCodeBlockBody>',
    '    <ol tngCodeBlockGutter></ol>',
    '    <pre><code tngCodeBlockCode>...</code></pre>',
    '  </div>',
    '</section>',
    '',
  ].join('\n');

  protected readonly componentAttachmentCode = [
    '<tng-code-block',
    '  title="app.config.ts"',
    '  language="ts"',
    '  [code]="snippet"',
    '  [lineNumbers]="true"',
    '  [copy]="true"',
    '  [highlightLines]="[4, [8, 10]]"',
    '></tng-code-block>',
    '',
  ].join('\n');
}
