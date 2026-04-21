import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-form-field-api-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './form-field-api-page.component.html',
  styleUrls: ['../../../input/sections/api/input-api-page.component.css'],
})
export class FormFieldApiPageComponent {
  protected readonly formFieldTemplateCode = [
    '<tng-form-field appearance="outline" size="md" tone="neutral">',
    '  <span tngPrefix aria-hidden="true">Search</span>',
    '  <input tngInput type="search" placeholder="Search docs" />',
    '  <span tngSuffix aria-hidden="true">Ctrl+K</span>',
    '</tng-form-field>',
    '',
  ].join('\n');

  protected readonly controlContractCode = [
    '<div class="docs-slug-shell">',
    '  <tng-form-field>',
    '    <input tngInput type="text" value="core-platform" />',
    '    <span tngSuffix>.tailng.dev</span>',
    '  </tng-form-field>',
    '</div>',
    '',
    '.docs-slug-shell {',
    '  --tng-input-border: #cbd5e1;',
    '  --tng-input-radius: 0.85rem;',
    '  --tng-input-min-height: 2.75rem;',
    '}',
    '',
  ].join('\n');

  protected readonly slotsCode = [
    '<tng-form-field>',
    '  <span tngInputLeading aria-hidden="true">$',
    '  </span>',
    '  <input tngInput type="text" />',
    '  <button tngInputTrailing type="button" aria-label="Clear value">Clear</button>',
    '</tng-form-field>',
    '',
  ].join('\n');

  protected readonly stateEscalationCode = [
    '<!-- Need state-specific shell selectors? Move to the headless primitive. -->',
    '<tng-input-group class="docs-search-group">',
    '  <span tngPrefix aria-hidden="true">Search</span>',
    '  <input tngInput type="search" />',
    '</tng-input-group>',
    '',
    '.docs-search-group[data-focused] {',
    '  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.18);',
    '}',
    '',
    '.docs-search-group[data-invalid] {',
    '  border-color: #dc2626;',
    '}',
    '',
  ].join('\n');
}
