import type { Routes } from '@angular/router';
import { HEADLESS_LAYOUT_GROUP, toHeadlessDocsRouteData } from '../../headless-docs.data';

const group = HEADLESS_LAYOUT_GROUP;
const stepperItem = group.items.find((item) => item.slug === 'stepper');
if (stepperItem === undefined) {
  throw new Error('Missing "stepper" in headless layout docs group.');
}

export const HEADLESS_LAYOUT_STEPPER_ROUTES: Routes = [
  {
    path: '',
    data: toHeadlessDocsRouteData(group, stepperItem),
    loadComponent: () =>
      import('./stepper-page.component').then((module) => module.HeadlessStepperPageComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'overview',
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('./sections/overview/stepper-overview-page.component').then(
            (module) => module.HeadlessStepperOverviewPageComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('./sections/api/stepper-api-page.component').then(
            (module) => module.HeadlessStepperApiPageComponent,
          ),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('./sections/styling/stepper-styling-page.component').then(
            (module) => module.HeadlessStepperStylingPageComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('./sections/examples/stepper-examples-page.component').then(
            (module) => module.HeadlessStepperExamplesPageComponent,
          ),
      },
      {
        path: '**',
        redirectTo: 'overview',
      },
    ],
  },
];
