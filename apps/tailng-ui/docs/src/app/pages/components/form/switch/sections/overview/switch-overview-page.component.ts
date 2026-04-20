import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent, TngSwitchComponent } from '@tailng-ui/components';
import type { DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';
import {
  observeDocsCodeThemeChanges,
  resolveDocsCodeBlockTheme,
} from '../../../../../../shared/util';
import { stackblitzTailwindUrl, stackblitzVanillaUrl } from '../../switch.util';

function createCodeTabs(
  baseName: string,
  tsCode: string,
  htmlCode: string,
  cssCode: string,
): readonly DocsExampleCodeTab[] {
  return Object.freeze([
    { value: 'ts', label: 'TS', language: 'ts', title: `${baseName}.component.ts`, code: tsCode },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: `${baseName}.component.html`,
      code: htmlCode,
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: `${baseName}.component.css`,
      code: cssCode,
    },
  ]);
}

@Component({
  selector: 'app-switch-overview-page',
  imports: [
    TngCodeBlockComponent,
    TngSwitchComponent,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './switch-overview-page.component.html',
  styleUrl: './switch-overview-page.component.css',
})
export class SwitchOverviewPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly stackblitzVanillaUrl = stackblitzVanillaUrl;
  protected readonly stackblitzTailwindUrl = stackblitzTailwindUrl;

  protected readonly plainCssReleaseReady = signal(true);
  protected readonly tailwindAutoPublish = signal(false);

  protected readonly componentImportCode =
    "import { TngSwitchComponent } from '@tailng-ui/components';\n";

  protected readonly controlledUsageCode = [
    '<tng-switch',
    '  [checked]="releaseReady()"',
    '  (checkedChange)="releaseReady.set($event)"',
    '>',
    '  Release ready',
    '</tng-switch>',
    '',
  ].join('\n');

  protected readonly nativeFormCode = [
    '<form>',
    '  <tng-switch',
    '    name="autoPublish"',
    '    value="enabled"',
    '    [checked]="true"',
    '  >',
    '    Auto publish after review',
    '  </tng-switch>',
    '</form>',
    '',
  ].join('\n');

  protected readonly plainCssCodeTabs = createCodeTabs(
    'component-switch-overview-plain',
    [
      "import { Component, signal } from '@angular/core';",
      "import { TngSwitchComponent } from '@tailng-ui/components';",
      '',
      '@Component({',
      "  selector: 'app-component-switch-overview-plain',",
      '  standalone: true,',
      '  imports: [TngSwitchComponent],',
      "  templateUrl: './component-switch-overview-plain.component.html',",
      "  styleUrl: './component-switch-overview-plain.component.css',",
      '})',
      'export class ComponentSwitchOverviewPlainComponent {',
      '  readonly releaseReady = signal(true);',
      '}',
      '',
    ].join('\n'),
    [
      '<section class="component-switch-release-card">',
      '  <p class="component-switch-release-card__eyebrow">Release controls</p>',
      '  <tng-switch',
      '    [checked]="releaseReady()"',
      '    (checkedChange)="releaseReady.set($event)"',
      '  >',
      '    Release ready',
      '  </tng-switch>',
      '</section>',
      '',
    ].join('\n'),
    [
      '.component-switch-release-card {',
      '  display: grid;',
      '  gap: 0.9rem;',
      '  inline-size: min(100%, 28rem);',
      '  margin-inline: auto;',
      '  padding: 1rem;',
      '  border: 1px solid var(--tng-semantic-border-subtle);',
      '  border-radius: 1rem;',
      '  background: var(--tng-semantic-background-surface);',
      '  color: var(--tng-semantic-foreground-primary);',
      '  color-scheme: light;',
      '}',
      '',
      '.component-switch-release-card__eyebrow {',
      '  margin: 0;',
      '  color: var(--tng-semantic-foreground-secondary);',
      '  font-size: 0.8rem;',
      '  font-weight: 700;',
      '  letter-spacing: 0.04em;',
      '  text-transform: uppercase;',
      '}',
      '',
      '.component-switch-release-card tng-switch {',
      '  --tng-semantic-accent-brand: #2563eb;',
      '  --tng-semantic-border-subtle: #cbd5e1;',
      '  --tng-semantic-focus-ring: rgba(37, 99, 235, 0.25);',
      '  --tng-semantic-foreground-primary: #0f172a;',
      '}',
      '',
    ].join('\n'),
  );

  protected readonly tailwindCodeTabs = createCodeTabs(
    'component-switch-overview-tailwind',
    [
      "import { Component, signal } from '@angular/core';",
      "import { TngSwitchComponent } from '@tailng-ui/components';",
      '',
      '@Component({',
      "  selector: 'app-component-switch-overview-tailwind',",
      '  standalone: true,',
      '  imports: [TngSwitchComponent],',
      "  templateUrl: './component-switch-overview-tailwind.component.html',",
      '})',
      'export class ComponentSwitchOverviewTailwindComponent {',
      '  readonly autoPublish = signal(false);',
      '}',
      '',
    ].join('\n'),
    [
      '<section class="grid w-full max-w-[28rem] gap-3 rounded-2xl border border-[var(--tng-semantic-border-subtle)] bg-[var(--tng-semantic-background-surface)] p-4 text-[var(--tng-semantic-foreground-primary)] shadow-sm">',
      '  <p class="m-0 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--tng-semantic-foreground-secondary)]">Deployment</p>',
      '  <tng-switch',
      '    [checked]="autoPublish()"',
      '    (checkedChange)="autoPublish.set($event)"',
      '  >',
      '    Auto publish after review',
      '  </tng-switch>',
      '</section>',
      '',
    ].join('\n'),
    '/* Tailwind utilities are applied directly in the template. */',
  );

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
