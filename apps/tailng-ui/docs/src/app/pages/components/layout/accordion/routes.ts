import type { Routes } from '@angular/router';
import { COMPONENTS_LAYOUT_GROUP, toComponentsDocsRouteData } from '../../component-docs.data';

const group = COMPONENTS_LAYOUT_GROUP;
const accordionItem = group.items.find((item) => item.slug === 'accordion');
if (accordionItem === undefined) {
  throw new Error('Missing "accordion" in components layout docs group.');
}

export const COMPONENTS_LAYOUT_ACCORDION_ROUTES: Routes = [
  {
    path: '',
    data: toComponentsDocsRouteData(group, accordionItem),
    loadComponent: () =>
      import('./accordion-page.component').then((module) => module.AccordionPageComponent),
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
            (module) => module.AccordionOverviewPageComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('./sections/api/accordion-api-page.component').then(
            (module) => module.AccordionApiPageComponent,
          ),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('./sections/styling/accordion-styling-page.component').then(
            (module) => module.AccordionStylingPageComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('./sections/examples/accordion-examples-page.component').then(
            (module) => module.AccordionExamplesPageComponent,
          ),
      },
      {
        path: 'ownable-install',
        data: {
          componentName: 'Accordion',
          componentSymbol: 'TngAccordionComponent',
          primitiveSymbol: 'TngAccordion',
          registrySlug: 'accordion',
          usageCode: [
            '<tng-accordion [defaultValue]="\'item-1\'">',
            '  <tng-accordion-item value="item-1">',
            '    <tng-accordion-trigger>Section one</tng-accordion-trigger>',
            '    <tng-accordion-panel>Panel one content</tng-accordion-panel>',
            '  </tng-accordion-item>',
            '  <tng-accordion-item value="item-2">',
            '    <tng-accordion-trigger>Section two</tng-accordion-trigger>',
            '    <tng-accordion-panel>Panel two content</tng-accordion-panel>',
            '  </tng-accordion-item>',
            '</tng-accordion>',
            '',
          ].join('\n'),
        },
        loadComponent: () =>
          import('../../../../shared/ownable-install-section/docs-ownable-install-section.component').then(
            (module) => module.DocsOwnableInstallSectionComponent,
          ),
      },
      {
        path: '**',
        redirectTo: 'overview',
      },
    ],
  },
];
