import { Component } from '@angular/core';
import { DocsOwnableInstallSectionComponent } from '../../../../shared/ownable-install-section/docs-ownable-install-section.component';

@Component({
  selector: 'app-ownable-breadcrumb-page',
  imports: [DocsOwnableInstallSectionComponent],
  templateUrl: './ownable-breadcrumb-page.component.html',
})
export class OwnableBreadcrumbPageComponent {
  protected readonly usageCode = [
    '<tng-breadcrumb ariaLabel="Navigation path" separator="›">',
    '  <tng-breadcrumb-item href="/">Home</tng-breadcrumb-item>',
    '  <tng-breadcrumb-item href="/docs">Docs</tng-breadcrumb-item>',
    '  <tng-breadcrumb-item [current]="true">Breadcrumb</tng-breadcrumb-item>',
    '</tng-breadcrumb>',
    '',
  ].join('\n');
}
