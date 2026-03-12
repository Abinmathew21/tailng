import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-chips-api-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './chips-api-page.component.html',
  styleUrl: './chips-api-page.component.css',
})
export class ChipsApiPageComponent {
  protected readonly chipsRootApi = [
    'tngChips inputs',
    '- tngChipsValues?: readonly unknown[]',
    '- tngChipsDefaultValues?: readonly unknown[]',
    '- tngChipsDisabled?: boolean',
    '- tngChipsAriaLabel?: string | null',
    '',
    'tngChips outputs',
    '- valuesChange: readonly unknown[]',
    '- chipRemove: unknown',
    '',
    'Host attributes',
    '- role="list"',
    '- data-slot="chips"',
    '- data-disabled (when disabled)',
    '',
  ].join('\n');

  protected readonly chipItemApi = [
    'tngChip inputs',
    '- tngChipValue: unknown',
    '- tngChipLabel?: string | null',
    '- tngChipDisabled?: boolean',
    '- tngChipRemovable?: boolean (default true)',
    '',
    'tngChip outputs',
    '- chipRemove: unknown',
    '',
    'Host attributes',
    '- role="listitem"',
    '- data-slot="chip"',
    '- data-value="<serialized value>"',
    '- data-disabled (when disabled)',
    '',
  ].join('\n');

  protected readonly chipRemoveApi = [
    'tngChipRemove inputs',
    '- tngChipRemoveAriaLabel?: string | null',
    '',
    'Behavior',
    '- Click removes the parent chip (unless disabled)',
    '- Enter/Space removes the parent chip',
    '- For button hosts, type defaults to "button"',
    '',
    'Host attributes',
    '- data-slot="chip-remove"',
    '- data-focused (while focused)',
    '- data-disabled and disabled (when chip/group disabled)',
    '- aria-label (auto: "Remove <label>")',
    '',
  ].join('\n');
}
