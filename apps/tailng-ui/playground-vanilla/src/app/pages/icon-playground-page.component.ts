import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

type CountryPopulationRow = Readonly<{
  gdpLabel: string;
  iso2: string;
  landAreaLabel: string;
  name: string;
  peopleMarkers: readonly number[];
  populationLabel: string;
  rank: number;
}>;

function createPeopleMarkers(count: number): readonly number[] {
  return Array.from({ length: count }, (_, index) => index);
}

const topPopulationCountries: readonly CountryPopulationRow[] = [
  {
    gdpLabel: '$4.3T',
    iso2: 'in',
    landAreaLabel: '3.29M km²',
    name: 'India',
    peopleMarkers: createPeopleMarkers(5),
    populationLabel: '1.46B',
    rank: 1,
  },
  {
    gdpLabel: '$18.7T',
    iso2: 'cn',
    landAreaLabel: '9.39M km²',
    name: 'China',
    peopleMarkers: createPeopleMarkers(5),
    populationLabel: '1.41B',
    rank: 2,
  },
  {
    gdpLabel: '$29.2T',
    iso2: 'us',
    landAreaLabel: '9.15M km²',
    name: 'United States',
    peopleMarkers: createPeopleMarkers(4),
    populationLabel: '347M',
    rank: 3,
  },
  {
    gdpLabel: '$1.5T',
    iso2: 'id',
    landAreaLabel: '1.81M km²',
    name: 'Indonesia',
    peopleMarkers: createPeopleMarkers(4),
    populationLabel: '286M',
    rank: 4,
  },
  {
    gdpLabel: '$0.37T',
    iso2: 'pk',
    landAreaLabel: '0.77M km²',
    name: 'Pakistan',
    peopleMarkers: createPeopleMarkers(3),
    populationLabel: '255M',
    rank: 5,
  },
  {
    gdpLabel: '$0.27T',
    iso2: 'ng',
    landAreaLabel: '0.91M km²',
    name: 'Nigeria',
    peopleMarkers: createPeopleMarkers(3),
    populationLabel: '238M',
    rank: 6,
  },
  {
    gdpLabel: '$2.3T',
    iso2: 'br',
    landAreaLabel: '8.36M km²',
    name: 'Brazil',
    peopleMarkers: createPeopleMarkers(2),
    populationLabel: '213M',
    rank: 7,
  },
  {
    gdpLabel: '$0.47T',
    iso2: 'bd',
    landAreaLabel: '0.13M km²',
    name: 'Bangladesh',
    peopleMarkers: createPeopleMarkers(2),
    populationLabel: '176M',
    rank: 8,
  },
  {
    gdpLabel: '$2.1T',
    iso2: 'ru',
    landAreaLabel: '16.38M km²',
    name: 'Russia',
    peopleMarkers: createPeopleMarkers(1),
    populationLabel: '144M',
    rank: 9,
  },
  {
    gdpLabel: '$1.9T',
    iso2: 'mx',
    landAreaLabel: '1.94M km²',
    name: 'Mexico',
    peopleMarkers: createPeopleMarkers(1),
    populationLabel: '132M',
    rank: 10,
  },
];

@Component({
  selector: 'app-icon-playground-page',
  imports: [RouterLink, NgClass],
  templateUrl: './icon-playground-page.component.html',
  styleUrl: './icon-playground-page.component.css',
})
export class IconPlaygroundPageComponent {
  public readonly countries = topPopulationCountries;
}
