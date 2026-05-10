import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-input-field-api-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './input-field-api-page.component.html',
  styleUrls: ['../../../input/sections/api/input-api-page.component.css'],
})
export class InputFieldApiPageComponent {
  protected readonly inputFieldTemplateCode = [
    '<tng-input-field appearance="outline" size="md" tone="neutral">',
    '  <span tngInputFieldPrefix aria-hidden="true">Search</span>',
    '  <input tngInput type="search" placeholder="Search docs" />',
    '  <span tngInputFieldSuffix aria-hidden="true">Ctrl+K</span>',
    '</tng-input-field>',
    '',
  ].join('\n');

  protected readonly controlContractCode = [
    '<div class="docs-slug-shell">',
    '  <tng-input-field>',
    '    <input tngInput type="text" value="core-platform" />',
    '    <span tngInputFieldSuffix>.tailng.dev</span>',
    '  </tng-input-field>',
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
    '<tng-input-field>',
    '  <span tngInputLeading aria-hidden="true">$',
    '  </span>',
    '  <input tngInput type="text" />',
    '  <button tngInputTrailing type="button" aria-label="Clear value">Clear</button>',
    '</tng-input-field>',
    '',
  ].join('\n');

  protected readonly stateEscalationCode = [
    '<!-- Need state-specific shell selectors? Move to the headless primitive. -->',
    '<tng-input-group class="docs-search-group">',
    '  <span tngInputFieldPrefix aria-hidden="true">Search</span>',
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
