import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-headless-multi-autocomplete-api-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './headless-multi-autocomplete-api-page.component.html',
  styleUrl: './headless-multi-autocomplete-api-page.component.css',
})
export class HeadlessMultiAutocompleteApiPageComponent {
  protected readonly primitiveAttachmentCode = String.raw`<section
  tngMultiAutocomplete
  #multi="tngMultiAutocomplete"
  [open]="open()"
  (openChange)="open.set($event)"
  [query]="query()"
  (queryChange)="query.set($event)"
  [value]="selectedValues()"
  (valueChange)="selectedValues.set(toValueArray($event))"
>
  @for (value of selectedValues(); track value) {
    <span tngMultiAutocompleteChip [tngValue]="value">{{ resolveLabel(value) }}</span>
  }

  <input tngMultiAutocompleteTrigger type="text" [value]="query()" (input)="onInput($event)" />

  <div tngMultiAutocompleteContent class="contents">
    <div tngMultiAutocompleteOverlay>
      <ul tngMultiAutocompleteListbox [value]="multi.value()">
        @for (option of filteredOptions(); track option.id) {
          <li tngMultiAutocompleteOption [tngValue]="option.id">{{ option.label }}</li>
        }
      </ul>
    </div>
  </div>
</section>`;

  protected readonly partsCode = String.raw`[tngMultiAutocomplete]
[tngMultiAutocompleteTrigger]
[tngMultiAutocompleteChip]
[tngMultiAutocompleteContent]
[tngMultiAutocompleteOverlay]
[tngMultiAutocompleteListbox]
[tngMultiAutocompleteOption]`;
}
