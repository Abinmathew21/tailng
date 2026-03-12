import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-autocomplete-api-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './autocomplete-api-page.component.html',
  styleUrl: './autocomplete-api-page.component.css',
})
export class AutocompleteApiPageComponent {
  protected readonly primitiveAttachmentCode = [
    '<div tngAutocomplete [value]="value()" (valueChange)="value.set($event)">',
    '  <input tngAutocompleteTrigger />',
    '  <div tngAutocompleteContent>',
    '    <div tngAutocompleteOverlay>',
    '      <ul tngAutocompleteListbox [value]="value()">',
    '        <li tngAutocompleteOption [tngValue]="\'india\'">India</li>',
    '      </ul>',
    '    </div>',
    '  </div>',
    '</div>',
    '',
  ].join('\n');

  protected readonly componentAttachmentCode = [
    '<tng-autocomplete',
    '  [options]="countries"',
    '  [value]="selectedCountry"',
    '  (valueChange)="selectedCountry = $event"',
    '  [getOptionValue]="getCountryValue"',
    '  [getOptionLabel]="getCountryLabel"',
    '></tng-autocomplete>',
    '',
  ].join('\n');
}
