import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-listbox-api-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './listbox-api-page.component.html',
  styleUrl: './listbox-api-page.component.css',
})
export class ListboxApiPageComponent {
  protected readonly wrapperAttachmentCode = [
    '<tng-listbox',
    '  ariaLabel="Release channels"',
    '  [options]="channelOptions"',
    '  [value]="selectedChannel()"',
    '  (valueChange)="onSelectedChannelChange($event)"',
    '></tng-listbox>',
    '',
  ].join('\n');

  protected readonly customTemplateCode = [
    '<tng-listbox',
    '  ariaLabel="Release channels"',
    '  [options]="channelOptions"',
    '  [getOptionValue]="getChannelValue"',
    '  [getOptionLabel]="getChannelLabel"',
    '  [getOptionDescription]="getChannelDescription"',
    '  [isOptionDisabled]="isChannelDisabled"',
    '  [value]="selectedChannel()"',
    '  (valueChange)="onSelectedChannelChange($event)"',
    '>',
    '  <ng-template #tngListboxOptionTpl let-item>',
    '    <span class="channel-option__title">{{ item.label }}</span>',
    '    @if (item.description; as description) {',
    '      <span class="channel-option__description">{{ description }}</span>',
    '    }',
    '  </ng-template>',
    '</tng-listbox>',
    '',
  ].join('\n');
}
