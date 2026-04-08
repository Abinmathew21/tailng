import { Component } from '@angular/core';
import { DocsOwnableInstallSectionComponent } from '../../../../shared/ownable-install-section/docs-ownable-install-section.component';

@Component({
  selector: 'app-ownable-chips-page',
  imports: [DocsOwnableInstallSectionComponent],
  templateUrl: './ownable-chips-page.component.html',
})
export class OwnableChipsPageComponent {
  protected readonly usageCode = [
    '<tng-chips',
    '  [values]="selectedTags()"',
    '  (valuesChange)="selectedTags.set($event)"',
    '  ariaLabel="Selected tags"',
    '>',
    '  @for (tag of selectedTags(); track tag) {',
    '    <span tngChip [tngChipValue]="tag" [tngChipLabel]="tag">',
    '      <span>{{ tag }}</span>',
    '      <button tngChipRemove type="button">&times;</button>',
    '    </span>',
    '  }',
    '</tng-chips>',
    '',
  ].join('\n');
}
