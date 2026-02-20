import type { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home-page.component').then((module) => module.HomePageComponent),
  },
  {
    path: 'theme',
    loadComponent: () =>
      import('./pages/theme/theme-playground-page.component').then(
        (module) => module.ThemePlaygroundPageComponent,
      ),
  },
  {
    path: 'button',
    loadComponent: () =>
      import('./pages/primitives/button-demo/button-playground-page.component').then(
        (module) => module.ButtonPlaygroundPageComponent,
      ),
  },
  {
    path: 'accordion',
    loadComponent: () =>
      import('./pages/components/accordion-demo/accordion-playground-page.component').then(
        (module) => module.AccordionPlaygroundPageComponent,
      ),
  },
  {
    path: 'menu',
    loadComponent: () =>
      import('./pages/components/menu-demo/menu-playground-page.component').then(
        (module) => module.MenuPlaygroundPageComponent,
      ),
  },
  {
    path: 'dropdown-menu',
    loadComponent: () =>
      import(
        './pages/components/dropdown-menu-demo/dropdown-menu-playground-page.component'
      ).then((module) => module.DropdownMenuPlaygroundPageComponent),
  },
  {
    path: 'avatar',
    loadComponent: () =>
      import('./pages/primitives/avatar-demo/avatar-playground-page.component').then(
        (module) => module.AvatarPlaygroundPageComponent,
      ),
  },
  {
    path: 'card',
    loadComponent: () =>
      import('./pages/primitives/card-demo/card-playground-page.component').then(
        (module) => module.CardPlaygroundPageComponent,
      ),
  },
  {
    path: 'tag',
    loadComponent: () =>
      import('./pages/primitives/tag-demo/tag-playground-page.component').then(
        (module) => module.TagPlaygroundPageComponent,
      ),
  },
  {
    path: 'separator',
    loadComponent: () =>
      import('./pages/primitives/separator-demo/separator-playground-page.component').then(
        (module) => module.SeparatorPlaygroundPageComponent,
      ),
  },
  {
    path: 'empty',
    loadComponent: () =>
      import('./pages/primitives/empty-demo/empty-playground-page.component').then(
        (module) => module.EmptyPlaygroundPageComponent,
      ),
  },
  {
    path: 'progress-bar',
    loadComponent: () =>
      import('./pages/primitives/progress-bar-demo/progress-bar-playground-page.component').then(
        (module) => module.ProgressBarPlaygroundPageComponent,
      ),
  },
  {
    path: 'progress-spinner',
    loadComponent: () =>
      import(
        './pages/primitives/progress-spinner-demo/progress-spinner-playground-page.component'
      ).then((module) => module.ProgressSpinnerPlaygroundPageComponent),
  },
  {
    path: 'input',
    loadComponent: () =>
      import('./pages/primitives/input-demo/input-playground-page.component').then(
        (module) => module.InputPlaygroundPageComponent,
      ),
  },
  {
    path: 'radio',
    loadComponent: () =>
      import('./pages/primitives/radio-demo/radio-playground-page.component').then(
        (module) => module.RadioPlaygroundPageComponent,
      ),
  },
  {
    path: 'checkbox',
    loadComponent: () =>
      import('./pages/primitives/checkbox-demo/checkbox-playground-page.component').then(
        (module) => module.CheckboxPlaygroundPageComponent,
      ),
  },
  {
    path: 'textarea',
    loadComponent: () =>
      import('./pages/primitives/textarea-demo/textarea-playground-page.component').then(
        (module) => module.TextareaPlaygroundPageComponent,
      ),
  },
  {
    path: 'listbox',
    loadComponent: () =>
      import('./pages/primitives/listbox-demo/listbox-playground-page.component').then(
        (module) => module.ListboxPlaygroundPageComponent,
      ),
  },
  {
    path: 'dialog',
    loadComponent: () =>
      import('./pages/components/dialog-demo/dialog-playground-page.component').then(
        (module) => module.DialogPlaygroundPageComponent,
      ),
  },
  {
    path: 'popover',
    loadComponent: () =>
      import('./pages/components/popover-demo/popover-playground-page.component').then(
        (module) => module.PopoverPlaygroundPageComponent,
      ),
  },
  {
    path: 'icons',
    loadComponent: () =>
      import('./pages/icons/icon-demo/icon-playground-page.component').then(
        (module) => module.IconPlaygroundPageComponent,
      ),
  },
  {
    path: 'context-menu',
    loadComponent: () =>
      import('./pages/components/context-menu-demo/context-menu-playground-page.component').then(
        (module) => module.ContextMenuPlaygroundPageComponent,
      ),
  },
  {
    path: 'menubar',
    loadComponent: () =>
      import('./pages/components/menubar-demo/menubar-playground-page.component').then(
        (module) => module.MenubarPlaygroundPageComponent,
      ),
  },
  {
    path: 'navigation-menu',
    loadComponent: () =>
      import('./pages/components/navigation-menu-demo/navigation-menu-playground-page.component').then(
        (module) => module.NavigationMenuPlaygroundPageComponent,
      ),
  },
  {
    path: 'toolbar',
    loadComponent: () =>
      import('./pages/components/toolbar-demo/toolbar-playground-page.component').then(
        (module) => module.ToolbarPlaygroundPageComponent,
      ),
  },
  {
    path: 'tabs',
    loadComponent: () =>
      import('./pages/components/tabs-demo/tabs-playground-page.component').then(
        (module) => module.TabsPlaygroundPageComponent,
      ),
  },
  {
    path: 'stepper',
    loadComponent: () =>
      import('./pages/components/stepper-demo/stepper-playground-page.component').then(
        (module) => module.StepperPlaygroundPageComponent,
      ),
  },
  {
    path: 'toggle-group',
    loadComponent: () =>
      import('./pages/components/toggle-group-demo/toggle-group-playground-page.component').then(
        (module) => module.ToggleGroupPlaygroundPageComponent,
      ),
  },
  {
    path: 'chips',
    loadComponent: () =>
      import('./pages/components/chips-demo/chips-playground-page.component').then(
        (module) => module.ChipsPlaygroundPageComponent,
      ),
  },
  {
    path: 'combobox',
    loadComponent: () =>
      import('./pages/components/combobox-demo/combobox-playground-page.component').then(
        (module) => module.ComboboxPlaygroundPageComponent,
      ),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
