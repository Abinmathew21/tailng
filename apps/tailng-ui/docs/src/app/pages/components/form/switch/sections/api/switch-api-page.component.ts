import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-switch-api-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './switch-api-page.component.html',
  styleUrl: './switch-api-page.component.css',
})
export class SwitchApiPageComponent {
  protected readonly primitiveAttachmentCode = [
    '<button',
    '  tngSwitch',
    '  [checked]="checked()"',
    '  ariaLabel="Enable dark mode"',
    '  (click)="onToggle()"',
    '>',
    '  <span class="thumb"></span>',
    '</button>',
    '',
  ].join('\n');

  protected readonly componentAttachmentCode = [
    '<tng-switch [checked]="checked" (checkedChange)="checked = $event">',
    '  Enable dark mode',
    '</tng-switch>',
    '',
  ].join('\n');

  protected readonly reactiveFormCode = [
    "readonly darkModeControl = new FormControl<boolean>(false);",
    '',
    '<form [formGroup]="form">',
    '  <tng-switch formControlName="darkMode">Dark mode</tng-switch>',
    '</form>',
    '',
  ].join('\n');
}
