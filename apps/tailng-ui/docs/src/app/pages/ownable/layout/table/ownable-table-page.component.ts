import { Component } from '@angular/core';
import { DocsOwnableInstallSectionComponent } from '../../../../shared/ownable-install-section/docs-ownable-install-section.component';

@Component({
  selector: 'app-ownable-table-page',
  imports: [DocsOwnableInstallSectionComponent],
  template: `
    <div class="grid gap-8 pb-10">
      <section class="docs-section-anchor grid gap-4" id="table-overview">
        <h1 class="m-0 text-3xl font-semibold text-tng-fg-primary">Table</h1>
        <p class="m-0 max-w-4xl text-base leading-7 text-tng-fg-secondary">
          The ownable Table install gives your app local source for column rendering, empty states,
          density decisions, sticky cells, and product-specific row actions.
        </p>
      </section>

      <section class="docs-section-anchor grid gap-3" id="why-own-table">
        <h2 class="m-0 text-xl font-semibold text-tng-fg-primary">Why own Table locally</h2>
        <ul class="m-0 grid gap-2 pl-5 text-sm leading-6 text-tng-fg-secondary">
          <li>
            Keep column metadata, custom cell slots, and row action styling near your feature.
          </li>
          <li>Adapt loading, empty, and error states to the surrounding workflow.</li>
          <li>Version sticky columns, density, and sorting behavior beside the data model.</li>
        </ul>
      </section>

      <app-docs-ownable-install-section
        componentName="Table"
        registrySlug="table"
        [usageCode]="usageCode"
      />
    </div>
  `,
})
export class OwnableTablePageComponent {
  protected readonly usageCode = [
    '<tng-table',
    '  ariaLabel="Release services"',
    '  [columns]="columns"',
    '  [items]="rows"',
    '  [stickyHeader]="true"',
    '  (sortChange)="sortRows($event)"',
    '/>',
    '',
  ].join('\n');
}
