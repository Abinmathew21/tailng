import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngInputOtpComponent, TngCodeBlockComponent } from '@tailng-ui/components';
import type { DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';
import {
  observeDocsCodeThemeChanges,
  resolveDocsCodeBlockTheme,
} from '../../../../../../shared/util';
import { stackblitzTailwindUrl, stackblitzVanillaUrl } from '../../input-otp.util';

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

const STYLING_GUIDE_CODE = String.raw`/* Scope semantic tokens on a wrapper around <tng-input-otp>; they inherit into the component. */
.project-otp-shell {
  --tng-semantic-background-surface: var(--tng-semantic-background-surface);
  --tng-semantic-background-muted: color-mix(
    in srgb,
    var(--tng-semantic-accent-brand) 10%,
    var(--tng-semantic-background-base)
  );
  --tng-semantic-border-default: var(--tng-semantic-border-subtle);
  --tng-semantic-foreground-primary: var(--tng-semantic-foreground-primary);
  --tng-semantic-foreground-muted: var(--tng-semantic-foreground-muted);
  --tng-semantic-accent-brand: var(--tng-semantic-accent-brand);
  --tng-semantic-accent-danger: var(--tng-semantic-accent-danger);
}`;

const PLAIN_TS_CODE = String.raw`import { Component, signal } from '@angular/core';
import { TngInputOtpComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-component-input-otp-styling-plain-example',
  standalone: true,
  imports: [TngInputOtpComponent],
  templateUrl: './component-input-otp-styling-plain-example.component.html',
  styleUrl: './component-input-otp-styling-plain-example.component.css',
})
export class ComponentInputOtpStylingPlainExampleComponent {
  readonly componentInputOtpStylingPlainValue = signal('37');

  onComponentInputOtpStylingPlainValueChange(nextValue: string): void {
    this.componentInputOtpStylingPlainValue.set(nextValue);
  }
}`;

const PLAIN_HTML_CODE = String.raw`<section class="docs-component-input-otp-styling-plain-shell">
  <div class="docs-component-input-otp-styling-plain-header">
    <span class="docs-component-input-otp-styling-plain-kicker">Review code</span>
    <p class="docs-component-input-otp-styling-plain-copy">
      The wrapper keeps the OTP behavior stable while your host class supplies the visual theme.
    </p>
  </div>

  <div class="docs-component-input-otp-styling-plain-control">
    <tng-input-otp
      [length]="6"
      [value]="componentInputOtpStylingPlainValue()"
      [ariaLabel]="'Review code'"
      (valueChange)="onComponentInputOtpStylingPlainValueChange($event)"
    ></tng-input-otp>
  </div>
</section>`;

const PLAIN_CSS_CODE = String.raw`.docs-component-input-otp-styling-plain-shell {
  display: grid;
  gap: 0.9rem;
  inline-size: min(100%, 36rem);
  margin-inline: auto;
  padding: 1.15rem;
  border: 1px solid color-mix(in srgb, var(--tng-semantic-accent-brand) 22%, var(--tng-semantic-border-subtle));
  border-radius: 1.35rem;
  background: linear-gradient(
    180deg,
    color-mix(in srgb, var(--tng-semantic-accent-brand) 6%, var(--tng-semantic-background-surface)),
    var(--tng-semantic-background-surface)
  );
  color: var(--tng-semantic-foreground-primary);
  box-shadow: 0 16px 40px color-mix(in srgb, var(--tng-semantic-foreground-primary) 10%, transparent);
}

.docs-component-input-otp-styling-plain-header {
  display: grid;
  gap: 0.35rem;
}

.docs-component-input-otp-styling-plain-kicker {
  color: color-mix(in srgb, var(--tng-semantic-accent-brand) 45%, var(--tng-semantic-foreground-secondary));
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.02em;
}

.docs-component-input-otp-styling-plain-copy {
  margin: 0;
  color: var(--tng-semantic-foreground-secondary);
}

.docs-component-input-otp-styling-plain-control {
  --tng-semantic-background-surface: var(--tng-semantic-background-surface);
  --tng-semantic-background-muted: color-mix(
    in srgb,
    var(--tng-semantic-accent-brand) 12%,
    var(--tng-semantic-background-base)
  );
  --tng-semantic-border-default: color-mix(in srgb, var(--tng-semantic-accent-brand) 24%, var(--tng-semantic-border-subtle));
  --tng-semantic-foreground-primary: var(--tng-semantic-foreground-primary);
  --tng-semantic-foreground-muted: var(--tng-semantic-foreground-muted);
  --tng-semantic-accent-brand: var(--tng-semantic-accent-brand);
  --tng-semantic-accent-danger: var(--tng-semantic-accent-danger);
}

.docs-component-input-otp-styling-plain-control tng-input-otp {
  display: block;
  inline-size: 100%;
  min-inline-size: 0;
}`;

const TAILWIND_TS_CODE = String.raw`import { Component, signal } from '@angular/core';
import { TngInputOtpComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-component-input-otp-styling-tailwind-example',
  standalone: true,
  imports: [TngInputOtpComponent],
  templateUrl: './component-input-otp-styling-tailwind-example.component.html',
  styleUrl: './component-input-otp-styling-tailwind-example.component.css',
})
export class ComponentInputOtpStylingTailwindExampleComponent {
  readonly componentInputOtpStylingTailwindValue = signal('58');

  onComponentInputOtpStylingTailwindValueChange(nextValue: string): void {
    this.componentInputOtpStylingTailwindValue.set(nextValue);
  }
}`;

const TAILWIND_HTML_CODE = String.raw`<section class="mx-auto grid w-full max-w-[36rem] gap-4 rounded-[1.75rem] border border-[color-mix(in_srgb,var(--tng-semantic-accent-success)_35%,var(--tng-semantic-border-subtle))] bg-[linear-gradient(180deg,color-mix(in_srgb,var(--tng-semantic-accent-success)_8%,var(--tng-semantic-background-surface)),var(--tng-semantic-background-surface))] p-5 text-[var(--tng-semantic-foreground-primary)] shadow-[0_18px_38px_color-mix(in_srgb,var(--tng-semantic-foreground-primary)_9%,transparent)]">
  <div class="grid gap-1">
    <span class="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--tng-semantic-accent-success)]">Payment approval</span>
    <p class="m-0 text-sm leading-6 text-[var(--tng-semantic-foreground-secondary)]">
      Apply semantic tokens directly on the wrapper host while keeping the OTP behavior untouched.
    </p>
  </div>

  <div class="block [--tng-semantic-background-muted:color-mix(in_srgb,var(--tng-semantic-accent-success)_12%,var(--tng-semantic-background-base))] [--tng-semantic-border-default:color-mix(in_srgb,var(--tng-semantic-accent-success)_30%,var(--tng-semantic-border-subtle))] [--tng-semantic-accent-brand:var(--tng-semantic-accent-success)]">
    <tng-input-otp
      [length]="6"
      [value]="componentInputOtpStylingTailwindValue()"
      [ariaLabel]="'Payment approval code'"
      (valueChange)="onComponentInputOtpStylingTailwindValueChange($event)"
    ></tng-input-otp>
  </div>
</section>`;

@Component({
  selector: 'app-input-otp-styling-page',
  imports: [
    TngCodeBlockComponent,
    TngInputOtpComponent,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './input-otp-styling-page.component.html',
  styleUrl: './input-otp-styling-page.component.css',
})
export class InputOtpStylingPageComponent implements OnDestroy {
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
  protected readonly stylingGuideCode = STYLING_GUIDE_CODE;
  protected readonly plainValue = signal('37');
  protected readonly tailwindValue = signal('58');

  protected readonly plainCodeTabs = createCodeTabs(
    'component-input-otp-styling-plain-example',
    PLAIN_TS_CODE,
    PLAIN_HTML_CODE,
    PLAIN_CSS_CODE,
  );
  protected readonly tailwindCodeTabs = createCodeTabs(
    'component-input-otp-styling-tailwind-example',
    TAILWIND_TS_CODE,
    TAILWIND_HTML_CODE,
    '/* Tailwind utilities are applied directly in the template. */',
  );

  protected onPlainValueChange(nextValue: string): void {
    this.plainValue.set(nextValue);
  }

  protected onTailwindValueChange(nextValue: string): void {
    this.tailwindValue.set(nextValue);
  }

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
