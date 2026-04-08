import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';

interface ApiRow {
  readonly name: string;
  readonly type: string;
  readonly details: string;
}

const WRAPPER_ATTACHMENT_CODE = String.raw`<tng-chips
  [values]="selectedTopics()"
  (valuesChange)="onSelectedTopicsChange($event)"
  [ariaLabel]="'Selected topics'"
>
  <div class="topic-chip-row">
    @for (topic of selectedTopics(); track topic) {
      <span tngChip [tngChipValue]="topic" [tngChipLabel]="topic">
        <span>{{ topic }}</span>
        <button tngChipRemove type="button">&times;</button>
      </span>
    }
  </div>
</tng-chips>`;

const PRIMITIVE_PARTS_CODE = String.raw`<span
  tngChip
  [tngChipValue]="topic"
  [tngChipLabel]="topic"
  [tngChipDisabled]="topic === 'Locked'"
>
  <span>{{ topic }}</span>
  <button tngChipRemove type="button">&times;</button>
</span>`;

@Component({
  selector: 'app-chips-api-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './chips-api-page.component.html',
  styleUrl: './chips-api-page.component.css',
})
export class ChipsApiPageComponent {
  protected readonly wrapperAttachmentCode = WRAPPER_ATTACHMENT_CODE;
  protected readonly primitivePartsCode = PRIMITIVE_PARTS_CODE;

  protected readonly wrapperRows: readonly ApiRow[] = Object.freeze([
    {
      name: 'ariaLabel',
      type: 'string | null',
      details: 'Sets the accessible label on the projected chips list root.',
    },
    {
      name: 'disabled',
      type: 'boolean',
      details: 'Disables the whole list and blocks projected remove actions.',
    },
    {
      name: 'values',
      type: 'readonly unknown[] | undefined',
      details: 'Controlled values array used when the wrapper should emit a next array after remove actions.',
    },
    {
      name: 'defaultValues',
      type: 'readonly unknown[]',
      details: 'Seeds the primitive root for uncontrolled setups, though most wrapper usage stays controlled.',
    },
    {
      name: 'chipRemove',
      type: 'output<unknown>',
      details: 'Emits the removed chip value whenever a projected chip successfully removes itself.',
    },
    {
      name: 'valuesChange',
      type: 'output<readonly unknown[]>',
      details: 'Emits the next controlled value array after a successful remove action.',
    },
  ]);

  protected readonly chipRows: readonly ApiRow[] = Object.freeze([
    {
      name: 'tngChipValue',
      type: 'unknown',
      details: 'Identity for the chip item and the value emitted when it is removed.',
    },
    {
      name: 'tngChipLabel',
      type: 'string | null',
      details: 'Accessible label used for the auto-generated remove button label.',
    },
    {
      name: 'tngChipDisabled',
      type: 'boolean',
      details: 'Marks the chip disabled and blocks pointer or keyboard removal.',
    },
    {
      name: 'tngChipRemovable',
      type: 'boolean',
      details: 'Opts a projected chip out of removal without disabling the whole row.',
    },
  ]);

  protected readonly removeRows: readonly ApiRow[] = Object.freeze([
    {
      name: 'tngChipRemoveAriaLabel',
      type: 'string | null',
      details: 'Overrides the default “Remove <label>” aria-label when you need custom copy.',
    },
    {
      name: 'Keyboard behavior',
      type: 'Enter / Space',
      details: 'Pressing Enter or Space on the remove control removes the owning chip when removal is allowed.',
    },
    {
      name: 'Focus hook',
      type: 'data-focused',
      details: 'Applied while the remove control is focused so you can draw a ring without extra JS.',
    },
  ]);

  protected readonly foundationRows: readonly ApiRow[] = Object.freeze([
    {
      name: 'Root shell',
      type: 'Wrapper-owned',
      details: 'The wrapper only owns the outer chips container and forwards the primitive state inputs.',
    },
    {
      name: 'Chip markup',
      type: 'Projected primitives',
      details: 'You still provide the chip body and the remove button markup through projected content.',
    },
    {
      name: 'Headless escape hatch',
      type: 'Available',
      details: 'Drop to headless when you need to own the root element or coordinate chip removal with surrounding inputs.',
    },
  ]);
}
