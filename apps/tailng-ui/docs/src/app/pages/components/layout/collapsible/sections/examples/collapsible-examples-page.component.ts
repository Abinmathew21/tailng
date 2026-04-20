import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { observeDocsCodeThemeChanges, resolveDocsCodeBlockTheme } from '../../../../../../shared/util';
import { TngCollapsibleComponent } from '@tailng-ui/components';
import type { DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';

@Component({
  selector: 'app-collapsible-examples-page',
  imports: [TngCollapsibleComponent, DocsExampleTabsSectionComponent, DocsExampleVariantDirective],
  templateUrl: './collapsible-examples-page.component.html',
  styleUrl: './collapsible-examples-page.component.css',
})
export class CollapsibleExamplesPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(this.documentRef, this.codeBlockTheme);
  public readonly checkoutPlainOpen = signal(true);
  public readonly checkoutTailwindOpen = signal(false);
  public readonly errorPlainOpen = signal(true);
  public readonly errorTailwindOpen = signal(false);

  protected readonly checkoutPlainCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'collapsible-examples-checkout-plain-css.component.ts',
      code: [
        "import { Component, signal } from '@angular/core';",
        "import { TngCollapsibleComponent } from '@tailng-ui/components';",
        '',
        '@Component({',
        "  selector: 'app-collapsible-examples-checkout-plain',",
        '  standalone: true,',
        '  imports: [TngCollapsibleComponent],',
        "  templateUrl: './collapsible-examples-checkout-plain-css.component.html',",
        "  styleUrl: './collapsible-examples-checkout-plain-css.component.css',",
        '})',
        'export class CollapsibleExamplesCheckoutPlainComponent {',
        '  readonly open = signal(true);',
        '}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'collapsible-examples-checkout-plain-css.component.html',
      code: [
        '<div class="collapsible-example-shell collapsible-example-shell--plain">',
        '  <tng-collapsible',
        '    title="Checkout progress"',
        '    [open]="open()"',
        '    (openChange)="open.set($event)"',
        '  >',
        '    <ol class="collapsible-example-list">',
        '      <li class="collapsible-example-item is-complete"><span class="dot">✓</span> Cart</li>',
        '      <li class="collapsible-example-item is-current"><span class="dot">2</span> Shipping</li>',
        '      <li class="collapsible-example-item"><span class="dot">3</span> Payment</li>',
        '    </ol>',
        '  </tng-collapsible>',
        '</div>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'collapsible-examples-checkout-plain-css.component.css',
      code: [
        '.collapsible-example-shell--plain {',
        '  border: 1px solid var(--tng-semantic-border-subtle);',
        '  border-radius: 0.8rem;',
        '  padding: 0.9rem 1rem;',
        '}',
      ].join('\n'),
    },
  ]);

  protected readonly checkoutTailwindCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'collapsible-examples-checkout-tailwind.component.ts',
      code: [
        "import { Component, signal } from '@angular/core';",
        "import { TngCollapsibleComponent } from '@tailng-ui/components';",
        '',
        '@Component({',
        "  selector: 'app-collapsible-examples-checkout-tailwind',",
        '  standalone: true,',
        '  imports: [TngCollapsibleComponent],',
        "  templateUrl: './collapsible-examples-checkout-tailwind.component.html',",
        "  styleUrl: './collapsible-examples-checkout-tailwind.component.css',",
        '})',
        'export class CollapsibleExamplesCheckoutTailwindComponent {',
        '  readonly open = signal(false);',
        '}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'collapsible-examples-checkout-tailwind.component.html',
      code: [
        '<div class="rounded-xl border border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">',
        '  <tng-collapsible',
        '    title="Checkout progress"',
        '    [open]="open()"',
        '    (openChange)="open.set($event)"',
        '  >',
        '    <ol class="collapsible-example-list">',
        '      <li class="collapsible-example-item is-complete"><span class="dot">✓</span> Cart</li>',
        '      <li class="collapsible-example-item is-current"><span class="dot">2</span> Shipping</li>',
        '      <li class="collapsible-example-item"><span class="dot">3</span> Payment</li>',
        '    </ol>',
        '  </tng-collapsible>',
        '</div>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'collapsible-examples-checkout-tailwind.component.css',
      code: '/* Tailwind utilities are applied directly in the template. */',
    },
  ]);

  protected readonly errorPlainCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'collapsible-examples-error-plain-css.component.ts',
      code: [
        "import { Component, signal } from '@angular/core';",
        "import { TngCollapsibleComponent } from '@tailng-ui/components';",
        '',
        '@Component({',
        "  selector: 'app-collapsible-examples-error-plain',",
        '  standalone: true,',
        '  imports: [TngCollapsibleComponent],',
        "  templateUrl: './collapsible-examples-error-plain-css.component.html',",
        "  styleUrl: './collapsible-examples-error-plain-css.component.css',",
        '})',
        'export class CollapsibleExamplesErrorPlainComponent {',
        '  readonly open = signal(true);',
        '}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'collapsible-examples-error-plain-css.component.html',
      code: [
        '<div class="collapsible-example-shell collapsible-example-shell--plain">',
        '  <tng-collapsible',
        '    title="Onboarding"',
        '    [open]="open()"',
        '    (openChange)="open.set($event)"',
        '  >',
        '    <ol class="collapsible-example-list">',
        '      <li class="collapsible-example-item is-complete"><span class="dot">✓</span> Profile</li>',
        '      <li class="collapsible-example-item is-error"><span class="dot">2</span> Billing</li>',
        '      <li class="collapsible-example-item"><span class="dot">3</span> Team invite</li>',
        '    </ol>',
        '  </tng-collapsible>',
        '</div>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'collapsible-examples-error-plain-css.component.css',
      code: [
        '.collapsible-example-item.is-error {',
        '  border-color: var(--tng-semantic-accent-danger);',
        '  background: color-mix(in srgb, var(--tng-semantic-accent-danger) 10%, transparent);',
        '}',
      ].join('\n'),
    },
  ]);

  protected readonly errorTailwindCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'collapsible-examples-error-tailwind.component.ts',
      code: [
        "import { Component, signal } from '@angular/core';",
        "import { TngCollapsibleComponent } from '@tailng-ui/components';",
        '',
        '@Component({',
        "  selector: 'app-collapsible-examples-error-tailwind',",
        '  standalone: true,',
        '  imports: [TngCollapsibleComponent],',
        "  templateUrl: './collapsible-examples-error-tailwind.component.html',",
        "  styleUrl: './collapsible-examples-error-tailwind.component.css',",
        '})',
        'export class CollapsibleExamplesErrorTailwindComponent {',
        '  readonly open = signal(false);',
        '}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'collapsible-examples-error-tailwind.component.html',
      code: [
        '<div class="rounded-xl border border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">',
        '  <tng-collapsible',
        '    title="Onboarding"',
        '    [open]="open()"',
        '    (openChange)="open.set($event)"',
        '  >',
        '    <ol class="collapsible-example-list">',
        '      <li class="collapsible-example-item is-complete"><span class="dot">✓</span> Profile</li>',
        '      <li class="collapsible-example-item is-error"><span class="dot">2</span> Billing</li>',
        '      <li class="collapsible-example-item"><span class="dot">3</span> Team invite</li>',
        '    </ol>',
        '  </tng-collapsible>',
        '</div>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'collapsible-examples-error-tailwind.component.css',
      code: '/* Tailwind utilities are applied directly in the template. */',
    },
  ]);

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
