import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import {
  observeDocsCodeThemeChanges,
  resolveDocsCodeBlockTheme,
} from '../../../../../../shared/util';

@Component({
  selector: 'app-number-range-api-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './number-range-api-page.component.html',
  styleUrl: './number-range-api-page.component.css',
})
export class NumberRangeApiPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly componentTemplateCode = [
    "import { Component, signal } from '@angular/core';",
    "import { TngNumberRangeComponent } from '@tailng-ui/components';",
    "import type { TngNumberRangeValue, TngNumberRangeChangeEvent } from '@tailng-ui/primitives';",
    '',
    '@Component({',
    "  selector: 'app-doc-cmp-nr-api-example',",
    '  standalone: true,',
    '  imports: [TngNumberRangeComponent],',
    '  template: `',
    '    <tng-number-range',
    '      [min]="0"',
    '      [max]="1000"',
    '      [step]="10"',
    '      [value]="range()"',
    '      minPlaceholder="Min price"',
    '      maxPlaceholder="Max price"',
    '      ariaLabel="Price range"',
    '      minAriaLabel="Minimum price"',
    '      maxAriaLabel="Maximum price"',
    '      (valueChange)="range.set($event)"',
    '      (rangeChange)="onRangeChange($event)"',
    '    ></tng-number-range>',
    '  `,',
    '})',
    'export class DocCmpNrApiExampleComponent {',
    '  protected readonly range = signal<TngNumberRangeValue>({ min: 100, max: 500 });',
    '',
    '  protected onRangeChange(event: TngNumberRangeChangeEvent): void {',
    '    console.log(event.source, event.value, event.valid);',
    '  }',
    '}',
    '',
  ].join('\n');

  protected readonly slotCustomizationCode = [
    '<tng-number-range',
    '  ariaLabel="Price range"',
    '  [slot]="{',
    "    root: 'my-range-root',",
    "    group: 'my-range-group',",
    "    minInput: 'my-range-min',",
    "    separator: 'my-range-sep',",
    "    maxInput: 'my-range-max'",
    '  }"',
    '></tng-number-range>',
    '',
  ].join('\n');

  protected readonly typesCode = [
    '/** The value object held and emitted by the component. */',
    'type TngNumberRangeValue = {',
    '  min: number | null;',
    '  max: number | null;',
    '};',
    '',
    '/** Which input triggered the change. */',
    "type TngNumberRangeSource = 'min' | 'max';",
    '',
    '/** Full change event including source and validity. */',
    'type TngNumberRangeChangeEvent = {',
    '  value: TngNumberRangeValue;',
    '  source: TngNumberRangeSource;',
    '  valid: boolean;',
    '};',
    '',
    '/** CSS class override targets. */',
    "type TngNumberRangeSlots = 'root' | 'group' | 'minInput' | 'separator' | 'maxInput';",
    '',
  ].join('\n');

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
