import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-multi-autocomplete-api-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './multi-autocomplete-api-page.component.html',
  styleUrl: './multi-autocomplete-api-page.component.css',
})
export class MultiAutocompleteApiPageComponent {
  protected readonly primitiveAttachmentCode = [
    '<section',
    '  tngMultiAutocomplete',
    '  [query]="query()"',
    '  [value]="selectedValues()"',
    '  (queryChange)="query.set($event)"',
    '  (valueChange)="selectedValues.set(toValueArray($event))"',
    '>',
    '  @for (code of selectedValues(); track code) {',
    '    <span tngMultiAutocompleteChip [tngValue]="code">{{ resolveLabel(code) }}</span>',
    '  }',
    '',
    '  <input tngMultiAutocompleteTrigger />',
    '  <div tngMultiAutocompleteContent>',
    '    <div tngMultiAutocompleteOverlay>',
    '      <ul tngMultiAutocompleteListbox>',
    '        <li tngMultiAutocompleteOption [tngValue]="\'in\'">India</li>',
    '      </ul>',
    '    </div>',
    '  </div>',
    '</section>',
    '',
  ].join('\n');

  protected readonly componentAttachmentCode = [
    '<tng-multi-autocomplete',
    '  [options]="countries"',
    '  [value]="selectedCountries"',
    '  (valueChange)="selectedCountries = toValueArray($event)"',
    '  [getOptionValue]="getCountryValue"',
    '  [getOptionLabel]="getCountryLabel"',
    '></tng-multi-autocomplete>',
    '',
  ].join('\n');
}
