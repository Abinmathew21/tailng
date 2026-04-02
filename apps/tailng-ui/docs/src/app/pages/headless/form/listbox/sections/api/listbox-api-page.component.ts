import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-headless-listbox-api-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './listbox-api-page.component.html',
  styleUrl: './listbox-api-page.component.css',
})
export class HeadlessListboxApiPageComponent {
  protected readonly primitiveAttachmentCode = [
    '<div',
    '  tngListbox',
    '  tabindex="0"',
    '  [multiple]="true"',
    '  [value]="selectedChannels()"',
    '  (valueChange)="onSelectedChannelsChange($event)"',
    '>',
    '  @for (channel of channels; track channel.id) {',
    '    <div',
    '      tngOption',
    '      [tngValue]="channel.id"',
    '      [disabled]="channel.disabled === true"',
    '    >',
    '      {{ channel.label }}',
    '    </div>',
    '  }',
    '</div>',
    '',
  ].join('\n');

  protected readonly reflectedAttributesCode = [
    '<div',
    '  role="listbox"',
    '  aria-activedescendant="tng-option-..."',
    '  aria-multiselectable="true"',
    '>',
    '  <div',
    '    role="option"',
    '    aria-selected="true"',
    '    data-active',
    '    data-selected',
    '  >',
    '    Docs',
    '  </div>',
    '</div>',
    '',
  ].join('\n');

  protected readonly changeHandlingCode = [
    'type ListboxValue = string | readonly string[] | null;',
    '',
    "readonly selectedChannels = signal<readonly string[]>(['docs']);",
    '',
    'onSelectedChannelsChange(value: ListboxValue): void {',
    '  if (value === null) {',
    '    this.selectedChannels.set([]);',
    '    return;',
    '  }',
    '',
    "  this.selectedChannels.set(typeof value === 'string' ? [value] : value);",
    '}',
    '',
  ].join('\n');
}
