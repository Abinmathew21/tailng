import type { Routes } from '@angular/router';
import { HEADLESS_FORM_GROUP, toHeadlessDocsRouteData } from '../../headless-docs.data';

const group = HEADLESS_FORM_GROUP;
const textareaItem = group.items.find((item) => item.slug === 'textarea');
if (textareaItem === undefined) {
  throw new Error('Missing "textarea" in headless form docs group.');
}

export const HEADLESS_FORM_TEXTAREA_ROUTES: Routes = [
  {
    path: '',
    data: toHeadlessDocsRouteData(group, textareaItem),
    loadComponent: () =>
      import('./textarea-page.component').then((module) => module.HeadlessTextareaPageComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'overview',
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('./sections/overview/headless-textarea-overview-page.component').then(
            (module) => module.HeadlessTextareaOverviewPageComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('./sections/api/headless-textarea-api-page.component').then(
            (module) => module.HeadlessTextareaApiPageComponent,
          ),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('./sections/styling/headless-textarea-styling-page.component').then(
            (module) => module.HeadlessTextareaStylingPageComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('./sections/examples/headless-textarea-examples-page.component').then(
            (module) => module.HeadlessTextareaExamplesPageComponent,
          ),
      },
      {
        path: '**',
        redirectTo: 'overview',
      },
    ],
  },
];
