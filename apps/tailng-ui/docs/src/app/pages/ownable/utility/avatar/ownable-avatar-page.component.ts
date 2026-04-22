import { Component } from '@angular/core';
import { DocsOwnableInstallSectionComponent } from '../../../../shared/ownable-install-section/docs-ownable-install-section.component';

@Component({
  selector: 'app-ownable-avatar-page',
  imports: [DocsOwnableInstallSectionComponent],
  templateUrl: './ownable-avatar-page.component.html',
})
export class OwnableAvatarPageComponent {
  protected readonly usageCode = [
    '<tng-avatar',
    '  [src]="userPhotoUrl"',
    '  fallback="Tail Ng"',
    '  shape="circle"',
    '  size="md"',
    '></tng-avatar>',
    '',
  ].join('\n');
}
