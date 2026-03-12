import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-chips-overview-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './chips-overview-page.component.html',
  styleUrl: './chips-overview-page.component.css',
})
export class ChipsOverviewPageComponent {
  protected readonly primitiveImportCode = [
    'import { TngChips, TngChip, TngChipRemove } from "@tailng-ui/primitives";',
    '',
  ].join('\n');

  protected readonly componentImportCode = [
    'import { TngChipsComponent } from "@tailng-ui/components";',
    'import { TngChip, TngChipRemove } from "@tailng-ui/primitives";',
    '',
  ].join('\n');

  protected readonly primitiveUsageCode = [
    '<div tngChips [tngChipsValues]="tags()" (valuesChange)="tags.set($event)">',
    '  @for (tag of tags(); track tag) {',
    '    <span tngChip [tngChipValue]="tag" [tngChipLabel]="tag">',
    '      <span>{{ tag }}</span>',
    '      <button tngChipRemove type="button">×</button>',
    '    </span>',
    '  }',
    '</div>',
    '',
  ].join('\n');

  protected readonly componentUsageCode = [
    '<tng-chips [values]="tags()" (valuesChange)="tags.set($event)">',
    '  @for (tag of tags(); track tag) {',
    '    <span tngChip [tngChipValue]="tag" [tngChipLabel]="tag">',
    '      <span>{{ tag }}</span>',
    '      <button tngChipRemove type="button">×</button>',
    '    </span>',
    '  }',
    '</tng-chips>',
    '',
  ].join('\n');
}
