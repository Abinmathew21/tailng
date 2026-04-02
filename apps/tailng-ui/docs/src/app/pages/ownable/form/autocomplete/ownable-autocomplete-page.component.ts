import { Component } from '@angular/core';
import { DocsOwnableInstallSectionComponent } from '../../../../shared/ownable-install-section/docs-ownable-install-section.component';

@Component({
  selector: 'app-ownable-autocomplete-page',
  imports: [DocsOwnableInstallSectionComponent],
  templateUrl: './ownable-autocomplete-page.component.html',
})
export class OwnableAutocompletePageComponent {
  protected readonly usageCode = [
    '<tng-autocomplete',
    '  [options]="releaseOwners"',
    '  [value]="selectedOwner()"',
    '  (valueChange)="selectedOwner.set($event)"',
    '  [getOptionValue]="getOwnerValue"',
    '  [getOptionLabel]="getOwnerLabel"',
    '  placeholder="Search release owners"',
    '  [ariaLabel]="\'Release owner\'"',
    '></tng-autocomplete>',
    '',
  ].join('\n');
}
