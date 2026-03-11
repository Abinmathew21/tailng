import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-toggle-api-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './toggle-api-page.component.html',
  styleUrl: './toggle-api-page.component.css',
})
export class ToggleApiPageComponent {
  protected readonly primitiveAttachmentCode = [
    '<button tngToggle [pressed]="isBold()" (pressedChange)="isBold.set($event)">',
    '  Bold',
    '</button>',
    '',
  ].join('\n');

  protected readonly componentAttachmentCode = [
    '<tng-toggle [pressed]="pressed" (pressedChange)="pressed = $event">',
    '  <span offIcon>grid</span>',
    '  <span onIcon>grid</span>',
    '</tng-toggle>',
    '',
  ].join('\n');

  protected readonly reactiveFormCode = [
    'readonly compactModeControl = new FormControl<boolean>(false, { nonNullable: true });',
    '',
    '<form [formGroup]="form">',
    '  <tng-toggle formControlName="compactMode">Compact mode</tng-toggle>',
    '</form>',
    '',
  ].join('\n');
}
