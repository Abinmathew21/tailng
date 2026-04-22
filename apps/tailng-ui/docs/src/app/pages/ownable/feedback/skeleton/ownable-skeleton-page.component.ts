import { Component } from '@angular/core';
import { DocsOwnableInstallSectionComponent } from '../../../../shared/ownable-install-section/docs-ownable-install-section.component';

@Component({
  selector: 'app-ownable-skeleton-page',
  imports: [DocsOwnableInstallSectionComponent],
  templateUrl: './ownable-skeleton-page.component.html',
})
export class OwnableSkeletonPageComponent {
  protected readonly usageCode = [
    '<section class="grid gap-3">',
    '  <tng-skeleton width="62%" height="1.2rem"></tng-skeleton>',
    '  <tng-skeleton width="100%" height="0.95rem"></tng-skeleton>',
    '  <tng-skeleton width="74%" height="0.95rem"></tng-skeleton>',
    '  <tng-skeleton width="100%" height="7rem" [rounded]="false"></tng-skeleton>',
    '</section>',
    '',
  ].join('\n');
}
