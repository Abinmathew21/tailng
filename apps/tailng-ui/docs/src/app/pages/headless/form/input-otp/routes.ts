import type { Routes } from '@angular/router';
import { HEADLESS_FORM_GROUP, toHeadlessDocsRouteData } from '../../headless-docs.data';

const group = HEADLESS_FORM_GROUP;
const item = group.items.find((entry) => entry.slug === 'input-otp');
if (item === undefined) {
  throw new Error('Missing "input-otp" in headless form docs group.');
}

export const HEADLESS_FORM_INPUT_OTP_ROUTES: Routes = [
  {
    path: '',
    data: toHeadlessDocsRouteData(group, item),
    loadComponent: () =>
      import('./input-otp-page.component').then((module) => module.HeadlessInputOtpPageComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'overview',
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('./sections/overview/input-otp-overview-page.component').then(
            (module) => module.HeadlessInputOtpOverviewPageComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('./sections/api/input-otp-api-page.component').then(
            (module) => module.HeadlessInputOtpApiPageComponent,
          ),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('./sections/styling/input-otp-styling-page.component').then(
            (module) => module.HeadlessInputOtpStylingPageComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('./sections/examples/input-otp-examples-page.component').then(
            (module) => module.HeadlessInputOtpExamplesPageComponent,
          ),
      },
      {
        path: '**',
        redirectTo: 'overview',
      },
    ],
  },
];
