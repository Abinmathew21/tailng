import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';

interface ApiRow {
  readonly name: string;
  readonly type: string;
  readonly details: string;
}

const WRAPPER_ATTACHMENT_CODE = String.raw`<tng-autocomplete
  [options]="releaseOwners"
  [value]="selectedOwner()"
  (valueChange)="onSelectedOwnerChange($event)"
  [getOptionValue]="getOwnerValue"
  [getOptionLabel]="getOwnerLabel"
  [isOptionDisabled]="isOwnerDisabled"
  placeholder="Search release owners"
  [ariaLabel]="'Release owner'"
></tng-autocomplete>
`;

const ACCESSOR_CODE = String.raw`readonly getOwnerValue = (owner: ReleaseOwner) => owner.id;
readonly getOwnerLabel = (owner: ReleaseOwner) => owner.name;
readonly isOwnerDisabled = (owner: ReleaseOwner) => owner.disabled === true;
`;

@Component({
  selector: 'app-autocomplete-api-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './autocomplete-api-page.component.html',
  styleUrl: './autocomplete-api-page.component.css',
})
export class AutocompleteApiPageComponent {
  protected readonly wrapperAttachmentCode = WRAPPER_ATTACHMENT_CODE;
  protected readonly accessorCode = ACCESSOR_CODE;

  protected readonly wrapperRows: readonly ApiRow[] = Object.freeze([
    { name: 'options', type: 'readonly O[]', details: 'Source options rendered and filtered by the wrapper.' },
    { name: 'value', type: 'V | null', details: 'Committed selected value. Forwarded to the primitive host.' },
    { name: 'valueChange', type: 'EventEmitter<V | null>', details: 'Emitted when the committed option changes.' },
    { name: 'open', type: 'boolean', details: 'Optional controlled open state for the overlay.' },
    { name: 'openChange', type: 'EventEmitter<boolean>', details: 'Emitted when the overlay opens or closes.' },
    { name: 'placeholder', type: 'string', details: 'Placeholder text for the internal trigger input.' },
    { name: 'ariaLabel', type: 'string', details: 'Applied to the internal trigger when you do not provide labelledby ids.' },
    { name: 'disabled', type: 'boolean', details: 'Disables trigger focus, typing, and option selection.' },
    { name: 'loading', type: 'boolean', details: 'Marks the wrapper loading and reflects data-loading.' },
    { name: 'invalid', type: 'boolean', details: 'Marks the wrapper invalid and reflects data-invalid.' },
    { name: 'labelId', type: 'string | null', details: 'Forwarded to primitive aria-labelledby wiring.' },
    { name: 'descriptionId', type: 'string | null', details: 'Forwarded to primitive aria-describedby wiring.' },
    { name: 'errorId', type: 'string | null', details: 'Appended to aria-describedby when invalid.' },
    { name: 'iconText', type: 'string', details: 'Text affordance rendered in the wrapper icon slot. Default is a chevron.' },
  ]);

  protected readonly accessorRows: readonly ApiRow[] = Object.freeze([
    { name: 'getOptionValue', type: '(option: O) => V', details: 'Maps each option object to the committed value model.' },
    { name: 'getOptionLabel', type: '(option: O) => string', details: 'Maps each option object to visible label text and local filtering.' },
    { name: 'isOptionDisabled', type: '(option: O) => boolean', details: 'Disables specific options without removing them from the list.' },
    { name: 'trackBy', type: '(index: number, option: O) => unknown', details: 'Stabilizes wrapper rendering when async option arrays refresh.' },
  ]);

  protected readonly primitiveFoundationRows: readonly ApiRow[] = Object.freeze([
    { name: 'Local query state', type: 'Built in', details: 'The wrapper owns query state internally; consumers only bind options and committed value.' },
    { name: 'Free-form create', type: 'Headless only', details: 'Use the primitive root when you need allowCreate, strict=false, and create events.' },
    { name: 'Custom option markup', type: 'Headless only', details: 'The wrapper renders label-only options. Use headless autocomplete for avatars, badges, or richer row layouts.' },
    { name: 'Overlay composition', type: 'Headless only', details: 'Use the primitive parts when you need custom trigger shells, empty states, or portal-level markup.' },
  ]);
}
