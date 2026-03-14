import type { Routes } from '@angular/router';
import {
  COMPONENTS_FEEDBACK_GROUP,
  toComponentsDocsRouteData,
} from '../component-docs.data';

const group = COMPONENTS_FEEDBACK_GROUP;
const defaultItem = group.items[0];
if (defaultItem === undefined) {
  throw new Error('Components feedback docs are empty.');
}

const emptyItem = group.items.find((item) => item.slug === 'empty');
if (emptyItem === undefined) {
  throw new Error('Missing "empty" in components feedback docs group.');
}
const progressBarItem = group.items.find((item) => item.slug === 'progress-bar');
if (progressBarItem === undefined) {
  throw new Error('Missing "progress-bar" in components feedback docs group.');
}

const feedbackLandingSlugs = new Set([emptyItem.slug, progressBarItem.slug]);

export const COMPONENTS_FEEDBACK_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: defaultItem.slug,
  },
  {
    path: emptyItem.slug,
    loadChildren: () =>
      import('./empty/routes').then((module) => module.COMPONENTS_FEEDBACK_EMPTY_ROUTES),
  },
  {
    path: progressBarItem.slug,
    loadChildren: () =>
      import('./progress-bar/routes').then(
        (module) => module.COMPONENTS_FEEDBACK_PROGRESS_BAR_ROUTES,
      ),
  },
  ...group.items
    .filter((item) => !feedbackLandingSlugs.has(item.slug))
    .map((item) => ({
      path: item.slug,
      data: toComponentsDocsRouteData(group, item),
      loadComponent: () =>
        import('./landing/feedback-landing-page.component').then(
          (module) => module.FeedbackLandingPageComponent,
        ),
    })),
];
