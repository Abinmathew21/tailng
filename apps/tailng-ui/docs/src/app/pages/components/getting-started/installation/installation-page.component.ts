import { DOCUMENT } from '@angular/common';
import { Component, computed, inject, signal, type OnDestroy } from '@angular/core';
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

const installationItem = COMPONENTS_GETTING_STARTED_GROUP.items.find(
  (item) => item.slug === 'installation',
);

if (!installationItem) {
  throw new Error('Installation item not found.');
}
const fallbackData: ComponentsDocsRouteData = toComponentsDocsRouteData(
  COMPONENTS_GETTING_STARTED_GROUP,
  installationItem,
);

@Component({
  selector: 'app-installation-page',
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
  templateUrl: './installation-page.component.html',
  styleUrl: './installation-page.component.css',
})
export class InstallationPageComponent implements OnDestroy {
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
    this.resolveCodeBlockTheme(),
  );
  private readonly colorSchemeObserver = this.observeCodeThemeChanges();

  protected readonly installPnpmCode =
    ['## Headless behavior and accessibility primitives',
    'pnpm add @tailng-ui/primitives',
    '## Or if you need components',
    'pnpm add @tailng-ui/components',
    '## Optional',
    'pnpm add @tailng-ui/theme @tailng-ui/icons',
  ].join('\n');
  protected readonly installNpmCode =
    ['## Headless behavior and accessibility primitives',
    'npm install @tailng-ui/primitives',
    '## Or if you need components',
    'npm install @tailng-ui/components',
    '## Optional',
    'npm install @tailng-ui/theme @tailng-ui/icons',
  ].join('\n');
  protected readonly installYarnCode =
    ['## Headless behavior and accessibility primitives',
    'yarn add @tailng-ui/primitives',
    '## Or if you need components',
    'yarn add @tailng-ui/components',
    '## Optional',
    'yarn add @tailng-ui/theme @tailng-ui/icons',
  ].join('\n');
  protected readonly installComponentsOnlyPnpmCode =
    'pnpm add @tailng-ui/components @tailng-ui/theme';
  protected readonly installComponentsOnlyNpmCode =
    'npm install @tailng-ui/components @tailng-ui/theme';
  protected readonly installComponentsOnlyYarnCode =
    'yarn add @tailng-ui/components @tailng-ui/theme';
  protected readonly installWithIconsPnpmCode =
    ['## Headless behavior and accessibility primitives',
    'pnpm add @tailng-ui/primitives',
    '## Or if you need components',
    'pnpm add @tailng-ui/components',
    '## Optional',
    'pnpm add @tailng-ui/theme @tailng-ui/icons',
  ].join('\n');
  protected readonly installWithIconsNpmCode =
    ['## Headless behavior and accessibility primitives',
    'npm install @tailng-ui/primitives',
    '## Or if you need components',
    'npm install @tailng-ui/components',
    '## Optional',
    'npm install @tailng-ui/theme @tailng-ui/icons',
  ].join('\n');
  protected readonly installWithIconsYarnCode =
    ['## Headless behavior and accessibility primitives',
    'yarn add @tailng-ui/primitives',
    '## Or if you need components',
    'yarn add @tailng-ui/components',
    '## Optional',
    'yarn add @tailng-ui/theme @tailng-ui/icons',
  ].join('\n');

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }

  private observeCodeThemeChanges(): MutationObserver | null {
    const view = this.documentRef.defaultView;
    const mutationObserverCtor = view?.MutationObserver;
    if (mutationObserverCtor === undefined) {
      return null;
    }

    const observer = new mutationObserverCtor(() => {
      this.codeBlockTheme.set(this.resolveCodeBlockTheme());
    });

    observer.observe(this.documentRef.documentElement, {
      attributeFilter: ['style', 'class'],
      attributes: true,
    });

    return observer;
  }

  private resolveCodeBlockTheme(): 'github-dark' | 'github-light' {
    const root = this.documentRef.documentElement;
    const inlineColorScheme = root.style.getPropertyValue('color-scheme').trim().toLowerCase();
    if (inlineColorScheme.includes('dark')) {
      return 'github-dark';
    }

    const computedColorScheme = this.documentRef.defaultView
      ?.getComputedStyle(root)
      .getPropertyValue('color-scheme')
      .trim()
      .toLowerCase();

    return computedColorScheme?.includes('dark') ? 'github-dark' : 'github-light';
  }
}
