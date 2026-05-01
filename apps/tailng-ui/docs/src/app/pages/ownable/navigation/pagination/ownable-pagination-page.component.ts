import { Component } from '@angular/core';
import { DocsOwnableInstallSectionComponent } from '../../../../shared/ownable-install-section/docs-ownable-install-section.component';

@Component({
  selector: 'app-ownable-pagination-page',
  imports: [DocsOwnableInstallSectionComponent],
  template: `
    <div class="grid gap-8 pb-10">
      <section class="docs-section-anchor grid gap-4" id="pagination-overview">
        <h1 class="m-0 text-3xl font-semibold text-tng-fg-primary">Pagination</h1>
        <p class="m-0 max-w-4xl text-base leading-7 text-tng-fg-secondary">
          The ownable Pagination install is meant for teams that want local control over range copy,
          compact mobile controls, page-size menus, and server-pagination affordances.
        </p>
      </section>

      <section class="docs-section-anchor grid gap-3" id="why-own-pagination">
        <h2 class="m-0 text-xl font-semibold text-tng-fg-primary">Why own Pagination locally</h2>
        <ul class="m-0 grid gap-2 pl-5 text-sm leading-6 text-tng-fg-secondary">
          <li>Adapt range labels and disabled-state copy to your data product.</li>
          <li>Keep page-size options and server-mode behavior near the API integration.</li>
          <li>
            Swap icons, density, and responsive controls without waiting on a package release.
          </li>
        </ul>
      </section>

      <app-docs-ownable-install-section
        componentName="Pagination"
        registrySlug="pagination"
        [usageCode]="usageCode"
      />
    </div>
  `,
})
export class OwnablePaginationPageComponent {
  protected readonly usageCode = [
    '<tng-paginator',
    '  ariaLabel="Invoice result pages"',
    '  [totalItems]="128"',
    '  [pageSizeOptions]="[10, 25, 50]"',
    '  (pageChange)="loadPage($event)"',
    '/>',
    '',
  ].join('\n');
}
