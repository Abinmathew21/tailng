import type { Routes } from '@angular/router';
import { HEADLESS_FORM_GROUP, toHeadlessDocsRouteData } from '../../headless-docs.data';

const group = HEADLESS_FORM_GROUP;
const autocompleteItem = group.items.find((item) => item.slug === 'autocomplete');
if (autocompleteItem === undefined) {
  throw new Error('Missing "autocomplete" in headless form docs group.');
}

export const HEADLESS_FORM_AUTOCOMPLETE_ROUTES: Routes = [
  {
    path: '',
    data: toHeadlessDocsRouteData(group, autocompleteItem),
    loadComponent: () =>
      import('./autocomplete-page.component').then((module) => module.HeadlessAutocompletePageComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'overview',
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('./sections/overview/headless-autocomplete-overview-page.component').then(
            (module) => module.HeadlessAutocompleteOverviewPageComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('./sections/api/headless-autocomplete-api-page.component').then(
            (module) => module.HeadlessAutocompleteApiPageComponent,
          ),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('./sections/styling/headless-autocomplete-styling-page.component').then(
            (module) => module.HeadlessAutocompleteStylingPageComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('./sections/examples/headless-autocomplete-examples-page.component').then(
            (module) => module.HeadlessAutocompleteExamplesPageComponent,
          ),
      },
      {
        path: '**',
        redirectTo: 'overview',
      },
    ],
  },
];
