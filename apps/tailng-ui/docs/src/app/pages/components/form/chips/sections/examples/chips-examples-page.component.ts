import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-chips-examples-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './chips-examples-page.component.html',
  styleUrl: './chips-examples-page.component.css',
})
export class ChipsExamplesPageComponent {
  protected readonly removableChipsCode = [
    "readonly tags = signal<readonly string[]>(['Angular', 'CDK', 'A11y']);",
    '',
    '<div',
    '  tngChips',
    '  [tngChipsValues]="tags()"',
    '  (valuesChange)="tags.set($event as readonly string[])"',
    '>',
    '  @for (tag of tags(); track tag) {',
    '    <span tngChip [tngChipValue]="tag" [tngChipLabel]="tag">',
    '      <span>{{ tag }}</span>',
    '      <button tngChipRemove type="button">×</button>',
    '    </span>',
    '  }',
    '</div>',
    '',
  ].join('\n');

  protected readonly disabledChipCode = [
    '<div tngChips tngChipsAriaLabel="Readonly tags">',
    '  <span tngChip tngChipValue="release" tngChipLabel="Release" [tngChipDisabled]="true">',
    '    <span>Release</span>',
    '    <button tngChipRemove type="button"></button>',
    '  </span>',
    '  <span tngChip tngChipValue="beta" tngChipLabel="Beta">',
    '    <span>Beta</span>',
    '    <button tngChipRemove type="button"></button>',
    '  </span>',
    '</div>',
    '',
  ].join('\n');
}
