import { DOCUMENT } from '@angular/common';
import { computed, Component, inject, signal, type OnDestroy } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import {
  TngCardComponent,
  TngCardContentComponent,
  TngCardDescriptionComponent,
  TngCardHeaderComponent,
  TngCardTitleComponent,
  TngCodeBlockComponent,
} from '@tailng-ui/components';
import { TngIcon } from '@tailng-ui/icons';
import { map } from 'rxjs/operators';
import {
  COMPONENTS_GETTING_STARTED_GROUP,
  toComponentsDocsRouteData,
  type ComponentsDocsRouteData,
} from '../../component-docs.data';

const fallbackItem = COMPONENTS_GETTING_STARTED_GROUP.items[0];
if (fallbackItem === undefined) {
  throw new Error('Components getting-started docs are empty.');
}

const fallbackData: ComponentsDocsRouteData = toComponentsDocsRouteData(
  COMPONENTS_GETTING_STARTED_GROUP,
  fallbackItem,
);

@Component({
  selector: 'app-getting-started-landing-page',
  imports: [
    TngCardComponent,
    TngCardHeaderComponent,
    TngCardTitleComponent,
    TngCardDescriptionComponent,
    TngCardContentComponent,
    TngCodeBlockComponent,
    TngIcon,
  ],
  templateUrl: './getting-started-landing-page.component.html',
  styleUrl: './getting-started-landing-page.component.css',
})
export class GettingStartedLandingPageComponent implements OnDestroy {
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

  protected readonly quickStartInstallCode =
    'pnpm add @tailng-ui/components @tailng-ui/primitives @tailng-ui/cdk @tailng-ui/theme @tailng-ui/icons';

  protected readonly quickStartThemeConfigCode = [
    "import { ApplicationConfig } from '@angular/core';",
    "import { provideRouter } from '@angular/router';",
    "import { provideTailngTheme } from '@tailng-ui/theme';",
    "import { routes } from './app.routes';",
    '',
    'export const appConfig: ApplicationConfig = {',
    '  providers: [',
    '    provideRouter(routes),',
    '    provideTailngTheme(),',
    '  ],',
    '};',
    '',
  ].join('\n');

  protected readonly quickStartButtonExampleCode = [
    "import { Component } from '@angular/core';",
    "import { TngButtonComponent } from '@tailng-ui/components';",
    '',
    '@Component({',
    "  selector: 'app-quick-start-example',",
    '  standalone: true,',
    '  imports: [TngButtonComponent],',
    '  template: `',
    '    <button tngButton variant="primary">Save changes</button>',
    '  `,',
    '})',
    'export class QuickStartExampleComponent {}',
    '',
  ].join('\n');

  protected readonly quickStartInputExampleCode = [
    '<tng-input label="Email" hint="We\\\'ll never share this." required>',
    '  <span tngInputLeading aria-hidden="true">@</span>',
    '  <input tngInput type="email" placeholder="you@example.com" />',
    '</tng-input>',
    '',
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
