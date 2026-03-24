import type { Routes } from '@angular/router';
import { COMPONENTS_FORM_GROUP, toComponentsDocsRouteData } from '../../component-docs.data';

const group = COMPONENTS_FORM_GROUP;
const item = group.items.find((entry) => entry.slug === 'multi-autocomplete');
if (item === undefined) {
  throw new Error('Missing "multi-autocomplete" in components form docs group.');
}

export const COMPONENTS_FORM_MULTI_AUTOCOMPLETE_ROUTES: Routes = [
  {
    path: '',
    data: toComponentsDocsRouteData(group, item),
    loadComponent: () =>
      import('./multi-autocomplete-page.component').then(
        (module) => module.MultiAutocompletePageComponent,
      ),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'overview',
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('./sections/overview/multi-autocomplete-overview-page.component').then(
            (module) => module.MultiAutocompleteOverviewPageComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('./sections/api/multi-autocomplete-api-page.component').then(
            (module) => module.MultiAutocompleteApiPageComponent,
          ),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('./sections/styling/multi-autocomplete-styling-page.component').then(
            (module) => module.MultiAutocompleteStylingPageComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('./sections/examples/multi-autocomplete-examples-page.component').then(
            (module) => module.MultiAutocompleteExamplesPageComponent,
          ),
      },
      {
        path: '**',
        redirectTo: 'overview',
      },
    ],
  },
];
