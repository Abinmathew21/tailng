import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-selectbox-api-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './selectbox-api-page.component.html',
  styleUrl: './selectbox-api-page.component.css',
})
export class SelectboxApiPageComponent {
  protected readonly primitiveAttachmentCode = [
    '<section tngSelect [value]="selectedPlanet" (valueChange)="selectedPlanet = toSingleValue($event)">',
    '  <button tngSelectTrigger type="button">',
    '    <span tngSelectValue>{{ selectedLabel }}</span>',
    '    <span tngSelectIcon aria-hidden="true">▾</span>',
    '  </button>',
    '  <div tngSelectContent>',
    '    <div tngSelectOverlay>',
    '      <ul tngSelectListbox>',
    '        @for (planet of planets; track planet.value) {',
    '          <li tngSelectOption [tngValue]="planet.value" [disabled]="planet.disabled === true">',
    '            {{ planet.label }}',
    '          </li>',
    '        }',
    '      </ul>',
    '    </div>',
    '  </div>',
    '</section>',
    '',
  ].join('\n');

  protected readonly wrapperUsageCode = [
    '<tng-select',
    '  [options]="planets"',
    '  [value]="selectedPlanet"',
    '  (valueChange)="selectedPlanet = toSingleValue($event)"',
    '  [getOptionValue]="getPlanetValue"',
    '  [getOptionLabel]="getPlanetLabel"',
    '  placeholder="Select a planet"',
    '></tng-select>',
    '',
  ].join('\n');
}
