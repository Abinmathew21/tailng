import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-input-overview-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './input-overview-page.component.html',
  styleUrl: './input-overview-page.component.css',
})
export class InputOverviewPageComponent {
  protected readonly primitivesImportCode = [
    'import {',
    '  TngInput,',
    '  TngInputGroup,',
    '  TngInputLeading,',
    '  TngInputTrailing,',
    "} from '@tailng-ui/primitives';",
    '',
  ].join('\n');

  protected readonly directAttachmentCode = [
    '<input tngInput type="email" placeholder="team@tailng.dev" />',
    '<textarea tngInput rows="3" placeholder="Write notes..."></textarea>',
    '',
  ].join('\n');

  protected readonly groupedInputCode = [
    '<tng-input-group>',
    '  <span tngInputLeading aria-hidden="true">Search</span>',
    '  <input tngInput type="search" placeholder="Search..." />',
    '  <span tngInputTrailing aria-hidden="true">Ctrl+K</span>',
    '</tng-input-group>',
    '',
  ].join('\n');

  protected readonly ariaInvalidTestCode = '<input tngInput [ariaInvalid]="true" />';

  protected readonly nativeValidationCode = '<input tngInput required />';

  protected readonly searchWithHintCode = [
    '<tng-input-group class="demo-group">',
    '  <span tngInputLeading aria-hidden="true">Search</span>',
    '  <input tngInput type="search" placeholder="Search primitives" />',
    '  <span tngInputTrailing aria-hidden="true">Ctrl+K</span>',
    '</tng-input-group>',
    '',
  ].join('\n');

  protected readonly searchWithClearButtonCode = [
    '<tng-input-group class="demo-group">',
    '  <input tngInput type="search" placeholder="Search..." />',
    '  <button tngInputTrailing type="button" aria-label="Clear">X</button>',
    '</tng-input-group>',
    '',
  ].join('\n');

  protected readonly pitfallCorrectCode = [
    '<tng-input-group>',
    '  <input tngInput />',
    '</tng-input-group>',
    '',
  ].join('\n');

  protected readonly pitfallIncorrectCode = [
    '<tng-input-group>',
    '  <input />',
    '</tng-input-group>',
    '',
  ].join('\n');
}
