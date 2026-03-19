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
  TngTabsComponent,
} from '@tailng-ui/components';
import { TngIcon } from '@tailng-ui/icons';
import { TngTab, TngTabList, TngTabPanel } from '@tailng-ui/primitives';
import { map } from 'rxjs/operators';
import {
  HEADLESS_GETTING_STARTED_GROUP,
  toHeadlessDocsRouteData,
  type HeadlessDocsRouteData,
} from '../../headless-docs.data';

const quickStartItem = HEADLESS_GETTING_STARTED_GROUP.items.find(
  (item) => item.slug === 'quick-start',
);
if (quickStartItem === undefined) {
  throw new Error('Missing "quick-start" in headless getting-started docs group.');
}

const fallbackData: HeadlessDocsRouteData = toHeadlessDocsRouteData(
  HEADLESS_GETTING_STARTED_GROUP,
  quickStartItem,
);

@Component({
  selector: 'app-headless-quick-start-page',
  imports: [
    TngCardComponent,
    TngCardHeaderComponent,
    TngCardTitleComponent,
    TngCardDescriptionComponent,
    TngCardContentComponent,
    TngCodeBlockComponent,
    TngTabsComponent,
    TngTab,
    TngTabList,
    TngTabPanel,
    TngIcon,
  ],
  templateUrl: './quick-start-page.component.html',
  styleUrl: './quick-start-page.component.css',
})
export class QuickStartPageComponent implements OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly documentRef = inject(DOCUMENT);
  private readonly routeData = toSignal(
    this.route.data.pipe(
      map((data) => (data as HeadlessDocsRouteData | undefined) ?? fallbackData),
    ),
    { initialValue: fallbackData },
  );

  public readonly item = computed(() => this.routeData().item);
  public readonly groupTitle = computed(() => this.routeData().groupTitle);
  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    this.resolveCodeBlockTheme(),
  );
  private readonly colorSchemeObserver = this.observeCodeThemeChanges();

  protected readonly installHeadlessPnpmCode = [
    'pnpm add @tailng-ui/primitives @tailng-ui/cdk',
    '',
  ].join('\n');
  protected readonly installHeadlessNpmCode = [
    'npm install @tailng-ui/primitives @tailng-ui/cdk',
    '',
  ].join('\n');
  protected readonly installHeadlessYarnCode = [
    'yarn add @tailng-ui/primitives @tailng-ui/cdk',
    '',
  ].join('\n');

  protected readonly installFullPnpmCode = [
    'pnpm add @tailng-ui/components @tailng-ui/primitives @tailng-ui/cdk @tailng-ui/theme @tailng-ui/icons',
    '',
  ].join('\n');
  protected readonly installFullNpmCode = [
    'npm install @tailng-ui/components @tailng-ui/primitives @tailng-ui/cdk @tailng-ui/theme @tailng-ui/icons',
    '',
  ].join('\n');
  protected readonly installFullYarnCode = [
    'yarn add @tailng-ui/components @tailng-ui/primitives @tailng-ui/cdk @tailng-ui/theme @tailng-ui/icons',
    '',
  ].join('\n');

  protected readonly cliSetupCode = [
    '# Install CLI (once)',
    'pnpm add -D tailng',
    '',
    '# Or run without installing',
    'pnpm dlx tailng add button',
    'npx tailng add button',
    '',
  ].join('\n');

  protected readonly cliAddComponentCode = [
    'tailng add <component-name>',
    '',
    'tailng add button',
    'tailng add checkbox',
    'tailng add accordion',
    'tailng add tooltip',
    'tailng add drawer',
    '',
  ].join('\n');

  protected readonly cliOptionsCode = [
    '--cwd <path>   # App root where files are generated (default: current directory)',
    '--dry-run      # Show what would be created without writing files',
    '--force        # Overwrite existing generated files',
    '',
    'tailng add button --cwd apps/my-app',
    'tailng add dialog --dry-run',
    'tailng add checkbox --force',
    '',
  ].join('\n');

  protected readonly generatedImportCode = [
    "import { TngButton } from './tailng-ui/button';",
    '',
  ].join('\n');

  protected readonly packageDirectImportCode = [
    "import { TngCheckbox, TngToggle } from '@tailng-ui/primitives';",
    '// optional styled components',
    "import { TngCheckboxComponent, TngButtonComponent } from '@tailng-ui/components';",
    '',
  ].join('\n');

  protected readonly checkboxExampleCode = [
    "import { Component, signal } from '@angular/core';",
    "import { TngCheckbox } from '@tailng-ui/primitives';",
    '',
    '@Component({',
    '  imports: [TngCheckbox],',
    '  template: `',
    '    <label>',
    '      <input',
    "        type=\"checkbox\"",
    '        tngCheckbox',
    '        [checked]="checked()"',
    '        (checkedChange)="checked.set($event)"',
    '      />',
    '      <span>Accept terms</span>',
    '    </label>',
    '  `,',
    '})',
    'export class MyForm {',
    '  checked = signal(false);',
    '}',
    '',
  ].join('\n');

  protected readonly toggleExampleCode = [
    "import { Component, signal } from '@angular/core';",
    "import { TngToggle } from '@tailng-ui/primitives';",
    '',
    '@Component({',
    '  imports: [TngToggle],',
    '  template: `',
    '    <button',
    "      type=\"button\"",
    '      tngToggle',
    '      [pressed]="on()"',
    '      (pressedChange)="on.set($event)"',
    '    >',
    '      Toggle',
    '    </button>',
    '  `,',
    '})',
    'export class MyToolbar {',
    '  on = signal(false);',
    '}',
    '',
  ].join('\n');

  protected readonly accordionExampleCode = [
    "import { Component, signal } from '@angular/core';",
    'import {',
    '  TngAccordion,',
    '  TngAccordionItem,',
    '  TngAccordionTrigger,',
    '  TngAccordionPanel,',
    "} from '@tailng-ui/primitives';",
    '',
    '@Component({',
    '  imports: [TngAccordion, TngAccordionItem, TngAccordionTrigger, TngAccordionPanel],',
    '  template: `',
    '    <section',
    '      tngAccordion',
    '      type="single"',
    '      [value]="open()"',
    '      (valueChange)="open.set($event)"',
    '    >',
    '      <article tngAccordionItem value="a">',
    '        <button tngAccordionTrigger>Section A</button>',
    '        <div tngAccordionPanel>Content A</div>',
    '      </article>',
    '      <article tngAccordionItem value="b">',
    '        <button tngAccordionTrigger>Section B</button>',
    '        <div tngAccordionPanel>Content B</div>',
    '      </article>',
    '    </section>',
    '  `,',
    '})',
    'export class MyAccordion {',
    "  open = signal<string | null>('a');",
    '}',
    '',
  ].join('\n');

  protected readonly themeProviderCode = [
    "import { ApplicationConfig } from '@angular/core';",
    "import { provideTailngTheme } from '@tailng-ui/theme';",
    '',
    'export const appConfig: ApplicationConfig = {',
    '  providers: [',
    '    provideTailngTheme(),',
    '  ],',
    '};',
    '',
  ].join('\n');

  protected readonly listComponentsCode = ['tailng list', 'pnpm dlx tailng list', ''].join('\n');

  protected readonly aliasRows = [
    { write: 'slide-toggle', resolvesTo: 'switch' },
    { write: 'sidenav / sidebar / sheet', resolvesTo: 'drawer' },
    { write: 'expansion-panel', resolvesTo: 'accordion' },
    { write: 'spinner', resolvesTo: 'progress-spinner' },
    { write: 'snackbar / sonner', resolvesTo: 'toast' },
  ] as const;

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
