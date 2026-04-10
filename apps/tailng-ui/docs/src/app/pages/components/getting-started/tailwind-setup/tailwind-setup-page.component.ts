import { DOCUMENT } from '@angular/common';
import { computed, Component, inject, signal, type OnDestroy } from '@angular/core';
import { observeDocsCodeThemeChanges, resolveDocsCodeBlockTheme } from '../../../../shared/util';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import {
  TngCardComponent,
  TngCardContentComponent,
  TngCardDescriptionComponent,
  TngCardHeaderComponent,
  TngCardTitleComponent,
  TngCodeBlockComponent,
  TngTabsComponent,
} from '@tailng-ui/components';
import { TngIcon } from '@tailng-ui/icons';
import { TngTab, TngTabList, TngTabPanel } from '@tailng-ui/primitives';
import { map } from 'rxjs/operators';
import {
  COMPONENTS_GETTING_STARTED_GROUP,
  toComponentsDocsRouteData,
  type ComponentsDocsRouteData,
} from '../../component-docs.data';

const tailwindSetupItem = COMPONENTS_GETTING_STARTED_GROUP.items.find(
  (item) => item.slug === 'tailwind-setup',
);
if (tailwindSetupItem === undefined) {
  throw new Error('Missing "tailwind-setup" in components getting-started docs group.');
}

const fallbackData: ComponentsDocsRouteData = toComponentsDocsRouteData(
  COMPONENTS_GETTING_STARTED_GROUP,
  tailwindSetupItem,
);

@Component({
  selector: 'app-tailwind-setup-page',
  imports: [
    TngCardComponent,
    TngCardHeaderComponent,
    TngCardTitleComponent,
    TngCardDescriptionComponent,
    TngCardContentComponent,
    TngCodeBlockComponent,
    TngTabsComponent,
    TngTabList,
    TngTab,
    TngTabPanel,
    TngIcon,
  ],
  templateUrl: './tailwind-setup-page.component.html',
  styleUrl: './tailwind-setup-page.component.css',
})
export class TailwindSetupPageComponent implements OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly documentRef = inject(DOCUMENT);
  private readonly routeData = toSignal(
    this.route.data.pipe(
      map((data) => (data as ComponentsDocsRouteData | undefined) ?? fallbackData),
    ),
    { initialValue: fallbackData },
  );

  public readonly item = computed(() => this.routeData().item);
  public readonly groupTitle = computed(() => this.routeData().groupTitle);
  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(this.documentRef, this.codeBlockTheme);

  protected readonly installPnpmCode = [
    '## TailNG packages',
    'pnpm add @tailng-ui/components @tailng-ui/primitives @tailng-ui/cdk @tailng-ui/theme @tailng-ui/icons',
    '## Tailwind CSS',
    'pnpm add -D tailwindcss postcss autoprefixer',
  ].join('\n');
  protected readonly installNpmCode = [
    '## TailNG packages',
    'npm install @tailng-ui/components @tailng-ui/primitives @tailng-ui/cdk @tailng-ui/theme @tailng-ui/icons',
    '## Tailwind CSS',
    'npm install -D tailwindcss postcss autoprefixer',
    '',
  ].join('\n');
  protected readonly installYarnCode = [
    '## TailNG packages',
    'yarn add @tailng-ui/components @tailng-ui/primitives @tailng-ui/cdk @tailng-ui/theme @tailng-ui/icons',
    '## Tailwind CSS',
    'yarn add -D tailwindcss postcss autoprefixer',
    '',
  ].join('\n');

  protected readonly providerCode = [
    "import { ApplicationConfig } from '@angular/core';",
    "import { provideRouter } from '@angular/router';",
    "import { defaultDarkThemePreset, provideTailngTheme } from '@tailng-ui/theme';",
    "import { routes } from './app.routes';",
    '',
    'export const appConfig: ApplicationConfig = {',
    '  providers: [',
    '    provideRouter(routes),',
    '    provideTailngTheme({ theme: defaultDarkThemePreset }),',
    '  ],',
    '};',
    '',
  ].join('\n');

  protected readonly tailwindConfigCode = [
    "import type { Config } from 'tailwindcss';",
    '',
    'export default {',
    "  content: ['./src/**/*.{html,ts}'],",
    '  theme: {',
    '    extend: {',
    '      colors: {',
    "        brand: 'var(--tng-semantic-accent-brand)',",
    '      },',
    '    },',
    '  },',
    '  plugins: [],',
    '} satisfies Config;',
    '',
  ].join('\n');

  protected readonly stylesCode = [
    '/* src/styles.css */',
    '@tailwind base;',
    '@tailwind components;',
    '@tailwind utilities;',
    '',
    "@import '@tailng-ui/theme/component-contracts/index.css';",
    '',
    ':root {',
    '  --tng-semantic-background-canvas: #f8fafc;',
    '  --tng-semantic-background-surface: #ffffff;',
    '  --tng-semantic-foreground-primary: #0f172a;',
    '  --tng-semantic-border-subtle: #cbd5e1;',
    '  --tng-semantic-accent-brand: #2563eb;',
    '  --tng-semantic-focus-ring: rgba(37, 99, 235, 0.35);',
    '}',
    '',
  ].join('\n');

  protected readonly markupCode = [
    '<section class="grid gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">',
    '  <h2 class="m-0 text-sm font-semibold text-slate-900">Tailwind + TailNG</h2>',
    '',
    '  <tng-input',
    '    type="text"',
    '    placeholder="tailng-app"',
    '    ariaLabel="Workspace name"',
    '  ></tng-input>',
    '',
    '  <div class="[--tng-semantic-accent-brand:#0f766e]">',
    '    <tng-button class="w-fit">Create workspace</tng-button>',
    '  </div>',
    '</section>',
    '',
  ].join('\n');

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }

}
