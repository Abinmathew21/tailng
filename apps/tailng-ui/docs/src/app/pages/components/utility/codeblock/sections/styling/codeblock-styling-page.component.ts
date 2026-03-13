import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-codeblock-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './codeblock-styling-page.component.html',
  styleUrl: './codeblock-styling-page.component.css',
})
export class CodeblockStylingPageComponent {
  protected readonly stylingExampleCode = [
    '.docs-codeblock[data-slot="code-block"] {',
    '  --tng-code-block-radius: 0.9rem;',
    '  --tng-code-block-border: color-mix(in srgb, var(--tng-semantic-border-subtle) 75%, #fff);',
    '}',
    '',
    '.docs-codeblock [data-slot="line-numbers"] {',
    '  min-width: 3.25rem;',
    '}',
    '',
    '.docs-codeblock [data-slot="line"][class*="highlight"] {',
    '  background: color-mix(in srgb, var(--tng-semantic-accent-brand) 16%, transparent);',
    '}',
    '',
  ].join('\n');
}
