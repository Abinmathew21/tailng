import type { Routes } from '@angular/router';
import { HEADLESS_LAYOUT_GROUP, toHeadlessDocsRouteData } from '../../headless-docs.data';

const group = HEADLESS_LAYOUT_GROUP;
const accordionItem = group.items.find((item) => item.slug === 'accordion');
if (accordionItem === undefined) {
  throw new Error('Missing "accordion" in headless layout docs group.');
}

export const HEADLESS_LAYOUT_ACCORDION_ROUTES: Routes = [
  {
    path: '',
    data: toHeadlessDocsRouteData(group, accordionItem),
    loadComponent: () =>
      import('./accordion-page.component').then((module) => module.HeadlessAccordionPageComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'overview',
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('./sections/overview/accordion-overview-page.component').then(
            (module) => module.HeadlessAccordionOverviewPageComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('./sections/api/accordion-api-page.component').then(
            (module) => module.HeadlessAccordionApiPageComponent,
          ),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('./sections/styling/accordion-styling-page.component').then(
            (module) => module.HeadlessAccordionStylingPageComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('./sections/examples/accordion-examples-page.component').then(
            (module) => module.HeadlessAccordionExamplesPageComponent,
          ),
      },
      {
        path: '**',
        redirectTo: 'overview',
      },
    ],
  },
];
