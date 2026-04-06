import type { Routes } from '@angular/router';
import { HEADLESS_FORM_GROUP, toHeadlessDocsRouteData } from '../../headless-docs.data';

const group = HEADLESS_FORM_GROUP;
const multiAutocompleteItem = group.items.find((item) => item.slug === 'multi-autocomplete');
if (multiAutocompleteItem === undefined) {
  throw new Error('Missing "multi-autocomplete" in headless form docs group.');
}

export const HEADLESS_FORM_MULTI_AUTOCOMPLETE_ROUTES: Routes = [
  {
    path: '',
    data: toHeadlessDocsRouteData(group, multiAutocompleteItem),
    loadComponent: () =>
      import('./multi-autocomplete-page.component').then(
        (module) => module.HeadlessMultiAutocompletePageComponent,
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
          import('./sections/overview/headless-multi-autocomplete-overview-page.component').then(
            (module) => module.HeadlessMultiAutocompleteOverviewPageComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('./sections/api/headless-multi-autocomplete-api-page.component').then(
            (module) => module.HeadlessMultiAutocompleteApiPageComponent,
          ),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('./sections/styling/headless-multi-autocomplete-styling-page.component').then(
            (module) => module.HeadlessMultiAutocompleteStylingPageComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('./sections/examples/headless-multi-autocomplete-examples-page.component').then(
            (module) => module.HeadlessMultiAutocompleteExamplesPageComponent,
          ),
      },
      {
        path: '**',
        redirectTo: 'overview',
      },
    ],
  },
];
