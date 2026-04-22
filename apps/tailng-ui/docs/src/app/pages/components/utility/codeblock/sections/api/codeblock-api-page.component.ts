import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-codeblock-api-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './codeblock-api-page.component.html',
  styleUrl: './codeblock-api-page.component.css',
})
export class CodeblockApiPageComponent {
  protected readonly wrapperUsageCode = [
    '<tng-code-block',
    '  title="review.ts"',
    '  language="ts"',
    '  [code]="snippet"',
    '  [lineNumbers]="true"',
    '  [highlightLines]="[3, [4, 4]]"',
    '  [focusLines]="true"',
    '  [wrap]="true"',
    '  [copy]="true"',
    '  caption="Focused review shell"',
    '></tng-code-block>',
    '',
  ].join('\n');

  protected readonly primitiveUsageCode = [
    '<section tngCodeBlock>',
    '  <header tngCodeBlockHeader>...</header>',
    '  <div tngCodeBlockBody>',
    '    <ol tngCodeBlockGutter aria-hidden="true"></ol>',
    '    <pre><code tngCodeBlockCode>...</code></pre>',
    '  </div>',
    '</section>',
    '',
  ].join('\n');
}
