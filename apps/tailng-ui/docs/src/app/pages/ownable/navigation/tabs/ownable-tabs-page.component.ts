import { Component } from '@angular/core';
import { DocsOwnableInstallSectionComponent } from '../../../../shared/ownable-install-section/docs-ownable-install-section.component';

@Component({
  selector: 'app-ownable-tabs-page',
  imports: [DocsOwnableInstallSectionComponent],
  templateUrl: './ownable-tabs-page.component.html',
})
export class OwnableTabsPageComponent {
  protected readonly usageCode = [
    '<tng-tabs ariaLabel="Project sections" defaultValue="overview">',
    '  <div tngTabList ariaLabel="Project sections">',
    '    <button type="button" tngTab value="overview">Overview</button>',
    '    <button type="button" tngTab value="activity">Activity</button>',
    '  </div>',
    '',
    '  <section tngTabPanel value="overview">Overview content</section>',
    '  <section tngTabPanel value="activity">Activity content</section>',
    '</tng-tabs>',
    '',
  ].join('\n');
}
