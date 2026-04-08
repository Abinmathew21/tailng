import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';

interface ApiRow {
  readonly details: string;
  readonly name: string;
  readonly type: string;
}

const ROOT_ATTACHMENT_CODE = String.raw`<section
  tngChips
  [tngChipsValues]="selectedTopics()"
  (valuesChange)="onSelectedTopicsChange($event)"
  [tngChipsAriaLabel]="'Selected topics'"
>
  @for (topic of selectedTopics(); track topic) {
    <span tngChip [tngChipValue]="topic" [tngChipLabel]="topic">
      <span>{{ topic }}</span>
      <button tngChipRemove type="button">&times;</button>
    </span>
  }
</section>`;

const REFLECTED_STATE_CODE = String.raw`<section tngChips data-slot="chips" role="list">
  <span tngChip data-slot="chip" role="listitem" data-value="docs">Docs</span>
  <button tngChipRemove data-slot="chip-remove" data-focused></button>
</section>`;

@Component({
  selector: 'app-headless-chips-api-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './chips-api-page.component.html',
  styleUrl: './chips-api-page.component.css',
})
export class HeadlessChipsApiPageComponent {
  protected readonly rootAttachmentCode = ROOT_ATTACHMENT_CODE;
  protected readonly reflectedStateCode = REFLECTED_STATE_CODE;

  protected readonly rootRows: readonly ApiRow[] = Object.freeze([
    {
      name: 'tngChipsValues',
      type: 'readonly unknown[] | undefined',
      details: 'Controlled values array used when the root should emit a next array after a remove action.',
    },
    {
      name: 'tngChipsDefaultValues',
      type: 'readonly unknown[]',
      details: 'Seeds the primitive for uncontrolled setups when you want the root to track its own values.',
    },
    {
      name: 'tngChipsDisabled',
      type: 'boolean',
      details: 'Disables the whole chip list and blocks projected remove actions.',
    },
    {
      name: 'tngChipsAriaLabel',
      type: 'string | null',
      details: 'Sets the accessible label on the list root.',
    },
    {
      name: 'valuesChange',
      type: 'output<readonly unknown[]>',
      details: 'Emits the next values array after a successful remove action.',
    },
    {
      name: 'chipRemove',
      type: 'output<unknown>',
      details: 'Emits the removed chip value whenever a chip successfully removes itself.',
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
      details: 'Accessible label used for the auto-generated remove button copy.',
    },
    {
      name: 'tngChipDisabled',
      type: 'boolean',
      details: 'Marks the chip disabled and blocks pointer or keyboard removal.',
    },
    {
      name: 'tngChipRemovable',
      type: 'boolean',
      details: 'Lets you keep the chip visible while opting it out of removal.',
    },
  ]);

  protected readonly removeRows: readonly ApiRow[] = Object.freeze([
    {
      name: 'tngChipRemoveAriaLabel',
      type: 'string | null',
      details: 'Overrides the default “Remove <label>” aria-label when you need custom copy.',
    },
    {
      name: 'Enter / Space',
      type: 'Keyboard behavior',
      details: 'Press Enter or Space on the remove control to remove the owning chip when removal is allowed.',
    },
    {
      name: 'data-focused',
      type: 'State hook',
      details: 'Applied while the remove control is focused so you can draw a ring without extra JavaScript.',
    },
  ]);

  protected readonly reflectedRows: readonly ApiRow[] = Object.freeze([
    {
      name: 'data-slot="chips"',
      type: 'Root',
      details: 'Stable hook for the list container.',
    },
    {
      name: 'data-slot="chip"',
      type: 'Item',
      details: 'Stable hook for each projected chip body.',
    },
    {
      name: 'data-slot="chip-remove"',
      type: 'Remove control',
      details: 'Stable hook for the projected remove button.',
    },
    {
      name: 'data-disabled',
      type: 'Root / item / remove',
      details: 'Reflected on disabled roots and chips so you can style them consistently.',
    },
  ]);
}
