import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-form-field-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './form-field-styling-page.component.html',
  styleUrl: './form-field-styling-page.component.css',
})
export class FormFieldStylingPageComponent {
  protected readonly slotCode = [
    '<tng-form-field',
    '  [slot]="{',
    "    root: 'docs-field',",
    "    label: 'docs-field-label',",
    "    controlRow: 'docs-field-control-row',",
    "    messages: 'docs-field-messages'",
    '  }"',
    '>',
    '  <tng-label forId="slug">Slug</tng-label>',
    '  <input tngInput id="slug" />',
    '  <p tngHint>Used in public URLs.</p>',
    '</tng-form-field>',
    '',
  ].join('\n');

  protected readonly tokenCode = [
    '.docs-field {',
    '  --tng-form-field-gap: 0.6rem;',
    '  --tng-form-field-label-fg: var(--tng-semantic-foreground-primary);',
    '  --tng-form-field-message-fg: var(--tng-semantic-foreground-secondary);',
    '}',
    '',
  ].join('\n');
}
