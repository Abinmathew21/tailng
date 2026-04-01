import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-headless-switch-api-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './headless-switch-api-page.component.html',
  styleUrl: './headless-switch-api-page.component.css',
})
export class HeadlessSwitchApiPageComponent {
  protected readonly primitiveAttachmentCode = [
    '<button',
    '  tngSwitch',
    '  [checked]="releaseReady()"',
    '  ariaLabel="Release ready"',
    '  (click)="releaseReady.update(value => !value)"',
    '>',
    '  <span class="switch-thumb" aria-hidden="true"></span>',
    '</button>',
    '',
  ].join('\n');

  protected readonly labeledPatternCode = [
    '<div class="switch-row">',
    '  <button',
    '    tngSwitch',
    '    [checked]="notificationsEnabled()"',
    '    ariaLabel="Notifications"',
    '    (click)="notificationsEnabled.update(value => !value)"',
    '  >',
    '    <span class="switch-thumb" aria-hidden="true"></span>',
    '  </button>',
    '  <div class="switch-copy">',
    '    <span class="switch-copy__title">Notifications</span>',
    '    <span class="switch-copy__meta">Send release alerts to the on-call team.</span>',
    '  </div>',
    '</div>',
    '',
  ].join('\n');

  protected readonly changeHandlingCode = [
    "import { signal } from '@angular/core';",
    '',
    'readonly notificationsEnabled = signal(false);',
    '',
    'onNotificationsToggle(): void {',
    '  this.notificationsEnabled.update((value) => !value);',
    '}',
    '',
  ].join('\n');
}
