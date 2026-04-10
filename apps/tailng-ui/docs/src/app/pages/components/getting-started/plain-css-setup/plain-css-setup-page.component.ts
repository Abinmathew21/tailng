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

const plainCssItem = COMPONENTS_GETTING_STARTED_GROUP.items.find(
  (item) => item.slug === 'plain-css-setup',
);
if (plainCssItem === undefined) {
  throw new Error('Missing "plain-css-setup" in components getting-started docs group.');
}

const fallbackData: ComponentsDocsRouteData = toComponentsDocsRouteData(
  COMPONENTS_GETTING_STARTED_GROUP,
  plainCssItem,
);

@Component({
  selector: 'app-plain-css-setup-page',
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
  templateUrl: './plain-css-setup-page.component.html',
  styleUrl: './plain-css-setup-page.component.css',
})
export class PlainCssSetupPageComponent implements OnDestroy {
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

  protected readonly installPnpmCode =
    'pnpm add @tailng-ui/components @tailng-ui/primitives @tailng-ui/cdk @tailng-ui/theme @tailng-ui/icons';
  protected readonly installNpmCode =
    'npm install @tailng-ui/components @tailng-ui/primitives @tailng-ui/cdk @tailng-ui/theme @tailng-ui/icons';
  protected readonly installYarnCode =
    'yarn add @tailng-ui/components @tailng-ui/primitives @tailng-ui/cdk @tailng-ui/theme @tailng-ui/icons';

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

  protected readonly globalStylesCode = [
    '/* src/styles.css */',
    "@import '@tailng-ui/theme/component-contracts/index.css';",
    '',
    ':root {',
    '  --tng-semantic-background-canvas: #ffffff;',
    '  --tng-semantic-background-surface: #f8fafc;',
    '  --tng-semantic-background-base: #ffffff;',
    '  --tng-semantic-foreground-primary: #0f172a;',
    '  --tng-semantic-foreground-secondary: #475569;',
    '  --tng-semantic-border-subtle: #cbd5e1;',
    '  --tng-semantic-border-strong: #94a3b8;',
    '  --tng-semantic-accent-brand: #2563eb;',
    '  --tng-semantic-focus-ring: rgba(37, 99, 235, 0.35);',
    '}',
    '',
  ].join('\n');

  protected readonly componentMarkupCode = [
    '<section class="demo-stack">',
    '  <tng-input',
    '    type="text"',
    '    placeholder="TailNG docs"',
    '    ariaLabel="Project name"',
    '  ></tng-input>',
    '',
    '  <tng-button class="demo-primary-action">Create project</tng-button>',
    '</section>',
    '',
  ].join('\n');

  protected readonly componentStylesCode = [
    '/* src/app/app.css */',
    '.demo-stack {',
    '  display: grid;',
    '  gap: 0.75rem;',
    '  max-width: 22rem;',
    '}',
    '',
    '.demo-primary-action {',
    '  --tng-semantic-accent-brand: #0f766e;',
    '  --tng-semantic-focus-ring: rgba(15, 118, 110, 0.35);',
    '}',
    '',
  ].join('\n');

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }

}
