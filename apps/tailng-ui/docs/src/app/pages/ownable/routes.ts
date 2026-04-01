import type { Routes } from '@angular/router';
import {
  DEFAULT_OWNABLE_DOCS_SEGMENT,
  OWNABLE_FORM_GROUP,
  OWNABLE_GETTING_STARTED_GROUP,
  OWNABLE_RELEASE_GROUP,
  OWNABLE_TOOLING_GROUP,
  toOwnableDocsRouteData,
  type OwnableDocsGroup,
} from './ownable-docs.data';

function requireOwnableItem(
  group: OwnableDocsGroup,
  slug: string,
): OwnableDocsGroup['items'][number] {
  const item = group.items.find((candidate) => candidate.slug === slug);
  if (item === undefined) {
    throw new Error(`Missing "${slug}" in ownable docs group "${group.id}".`);
  }

  return item;
}

const overviewItem = requireOwnableItem(OWNABLE_GETTING_STARTED_GROUP, 'overview');
const quickStartItem = requireOwnableItem(OWNABLE_GETTING_STARTED_GROUP, 'quick-start');
const checkboxItem = requireOwnableItem(OWNABLE_FORM_GROUP, 'checkbox');
const radioItem = requireOwnableItem(OWNABLE_FORM_GROUP, 'radio');
const inputItem = requireOwnableItem(OWNABLE_FORM_GROUP, 'input');
const textareaItem = requireOwnableItem(OWNABLE_FORM_GROUP, 'textarea');
const switchItem = requireOwnableItem(OWNABLE_FORM_GROUP, 'switch');
const labelItem = requireOwnableItem(OWNABLE_FORM_GROUP, 'label');
const cliItem = requireOwnableItem(OWNABLE_TOOLING_GROUP, 'cli');
const registryItem = requireOwnableItem(OWNABLE_TOOLING_GROUP, 'registry');
const workflowItem = requireOwnableItem(OWNABLE_RELEASE_GROUP, 'workflow');

export const OWNABLE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./landing/ownable-page.component').then((m) => m.OwnablePageComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: DEFAULT_OWNABLE_DOCS_SEGMENT,
      },
      {
        path: 'getting-started/overview',
        data: toOwnableDocsRouteData(OWNABLE_GETTING_STARTED_GROUP, overviewItem),
        loadComponent: () =>
          import('./getting-started/overview/ownable-overview-page.component').then(
            (m) => m.OwnableOverviewPageComponent,
          ),
      },
      {
        path: 'getting-started/quick-start',
        data: toOwnableDocsRouteData(OWNABLE_GETTING_STARTED_GROUP, quickStartItem),
        loadComponent: () =>
          import('./getting-started/quick-start/ownable-quick-start-page.component').then(
            (m) => m.OwnableQuickStartPageComponent,
          ),
      },
      {
        path: 'form/checkbox',
        data: toOwnableDocsRouteData(OWNABLE_FORM_GROUP, checkboxItem),
        loadComponent: () =>
          import('./form/checkbox/ownable-checkbox-page.component').then(
            (m) => m.OwnableCheckboxPageComponent,
          ),
      },
      {
        path: 'form/radio',
        data: toOwnableDocsRouteData(OWNABLE_FORM_GROUP, radioItem),
        loadComponent: () =>
          import('./form/radio/ownable-radio-page.component').then(
            (m) => m.OwnableRadioPageComponent,
          ),
      },
      {
        path: 'form/input',
        data: toOwnableDocsRouteData(OWNABLE_FORM_GROUP, inputItem),
        loadComponent: () =>
          import('./form/input/ownable-input-page.component').then(
            (m) => m.OwnableInputPageComponent,
          ),
      },
      {
        path: 'form/textarea',
        data: toOwnableDocsRouteData(OWNABLE_FORM_GROUP, textareaItem),
        loadComponent: () =>
          import('./form/textarea/ownable-textarea-page.component').then(
            (m) => m.OwnableTextareaPageComponent,
          ),
      },
      {
        path: 'form/switch',
        data: toOwnableDocsRouteData(OWNABLE_FORM_GROUP, switchItem),
        loadComponent: () =>
          import('./form/switch/ownable-switch-page.component').then(
            (m) => m.OwnableSwitchPageComponent,
          ),
      },
      {
        path: 'form/label',
        data: toOwnableDocsRouteData(OWNABLE_FORM_GROUP, labelItem),
        loadComponent: () =>
          import('./form/label/ownable-label-page.component').then(
            (m) => m.OwnableLabelPageComponent,
          ),
      },
      {
        path: 'tooling/cli',
        data: toOwnableDocsRouteData(OWNABLE_TOOLING_GROUP, cliItem),
        loadComponent: () =>
          import('./tooling/cli/ownable-cli-page.component').then(
            (m) => m.OwnableCliPageComponent,
          ),
      },
      {
        path: 'tooling/registry',
        data: toOwnableDocsRouteData(OWNABLE_TOOLING_GROUP, registryItem),
        loadComponent: () =>
          import('./tooling/registry/ownable-registry-page.component').then(
            (m) => m.OwnableRegistryPageComponent,
          ),
      },
      {
        path: 'release/workflow',
        data: toOwnableDocsRouteData(OWNABLE_RELEASE_GROUP, workflowItem),
        loadComponent: () =>
          import('./release/workflow/ownable-release-workflow-page.component').then(
            (m) => m.OwnableReleaseWorkflowPageComponent,
          ),
      },
      {
        path: '**',
        redirectTo: DEFAULT_OWNABLE_DOCS_SEGMENT,
      },
    ],
  },
];
