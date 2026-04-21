import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent, TngInputOtpComponent } from '@tailng-ui/components';
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

const COMPONENT_IMPORT_CODE = String.raw`import { TngInputOtpComponent } from '@tailng-ui/components';`;

const BASIC_USAGE_CODE = String.raw`<tng-input-otp
  [length]="6"
  [value]="verificationCode()"
  [ariaLabel]="'Verification code'"
  (valueChange)="onVerificationCodeChange($event)"
  (complete)="onVerificationCodeComplete($event)"
></tng-input-otp>`;

const PLAIN_TS_CODE = String.raw`import { Component, signal } from '@angular/core';
import { TngInputOtpComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-component-input-otp-overview-plain-example',
  standalone: true,
  imports: [TngInputOtpComponent],
  templateUrl: './component-input-otp-overview-plain-example.component.html',
  styleUrl: './component-input-otp-overview-plain-example.component.css',
})
export class ComponentInputOtpOverviewPlainExampleComponent {
  readonly componentInputOtpOverviewPlainValue = signal('12');
  readonly componentInputOtpOverviewPlainComplete = signal('');

  onComponentInputOtpOverviewPlainValueChange(nextValue: string): void {
    this.componentInputOtpOverviewPlainValue.set(nextValue);
    if (nextValue.length < 6) {
      this.componentInputOtpOverviewPlainComplete.set('');
    }
  }

  onComponentInputOtpOverviewPlainComplete(nextValue: string): void {
    this.componentInputOtpOverviewPlainComplete.set(nextValue);
  }
}`;

const PLAIN_HTML_CODE = String.raw`<section class="docs-component-input-otp-overview-plain-shell">
  <div class="docs-component-input-otp-overview-plain-header">
    <span class="docs-component-input-otp-overview-plain-kicker">Verification code</span>
    <p class="docs-component-input-otp-overview-plain-copy">
      Wrapper-first OTP entry with a controlled string value and a light verification surface.
    </p>
  </div>

  <div class="docs-component-input-otp-overview-plain-control">
    <tng-input-otp
      [length]="6"
      [value]="componentInputOtpOverviewPlainValue()"
      [ariaLabel]="'Verification code'"
      (valueChange)="onComponentInputOtpOverviewPlainValueChange($event)"
      (complete)="onComponentInputOtpOverviewPlainComplete($event)"
    ></tng-input-otp>
  </div>

  <p class="docs-component-input-otp-overview-plain-summary">
    Value: {{ componentInputOtpOverviewPlainValue() || '—' }}
  </p>
  <p class="docs-component-input-otp-overview-plain-summary">
    Complete event: {{ componentInputOtpOverviewPlainComplete() || '—' }}
  </p>
</section>`;

const PLAIN_CSS_CODE = String.raw`.docs-component-input-otp-overview-plain-shell {
  display: grid;
  gap: 0.9rem;
  inline-size: min(100%, 36rem);
  margin-inline: auto;
  padding: 1.15rem;
  border: 1px solid var(--tng-semantic-border-subtle);
  border-radius: 1.35rem;
  background: var(--tng-semantic-background-surface);
  color: var(--tng-semantic-foreground-primary);
  box-shadow: 0 12px 32px color-mix(in srgb, var(--tng-semantic-foreground-primary) 8%, transparent);
}

.docs-component-input-otp-overview-plain-header {
  display: grid;
  gap: 0.35rem;
}

.docs-component-input-otp-overview-plain-kicker {
  color: var(--tng-semantic-foreground-secondary);
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.02em;
}

.docs-component-input-otp-overview-plain-copy,
.docs-component-input-otp-overview-plain-summary {
  margin: 0;
  color: var(--tng-semantic-foreground-secondary);
}

.docs-component-input-otp-overview-plain-control {
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
}

.docs-component-input-otp-overview-plain-control tng-input-otp {
  display: block;
  inline-size: 100%;
  min-inline-size: 0;
}`;

const TAILWIND_TS_CODE = String.raw`import { Component, signal } from '@angular/core';
import { TngInputOtpComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-component-input-otp-overview-tailwind-example',
  standalone: true,
  imports: [TngInputOtpComponent],
  templateUrl: './component-input-otp-overview-tailwind-example.component.html',
  styleUrl: './component-input-otp-overview-tailwind-example.component.css',
})
export class ComponentInputOtpOverviewTailwindExampleComponent {
  readonly componentInputOtpOverviewTailwindValue = signal('84');
  readonly componentInputOtpOverviewTailwindComplete = signal('');

  onComponentInputOtpOverviewTailwindValueChange(nextValue: string): void {
    this.componentInputOtpOverviewTailwindValue.set(nextValue);
    if (nextValue.length < 6) {
      this.componentInputOtpOverviewTailwindComplete.set('');
    }
  }

  onComponentInputOtpOverviewTailwindComplete(nextValue: string): void {
    this.componentInputOtpOverviewTailwindComplete.set(nextValue);
  }
}`;

const TAILWIND_HTML_CODE = String.raw`<section class="mx-auto grid w-full max-w-[36rem] gap-4 rounded-[1.5rem] border border-[var(--tng-semantic-border-subtle)] bg-[var(--tng-semantic-background-surface)] p-5 text-[var(--tng-semantic-foreground-primary)] shadow-[0_12px_32px_color-mix(in_srgb,var(--tng-semantic-foreground-primary)_8%,transparent)]">
  <div class="grid gap-1">
    <span class="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--tng-semantic-foreground-secondary)]">Approval code</span>
    <p class="m-0 text-sm leading-6 text-[var(--tng-semantic-foreground-secondary)]">
      Same wrapper, utility-first shell, and a completion event you can wire into your flow.
    </p>
  </div>

  <div class="block [--tng-semantic-background-muted:color-mix(in_srgb,var(--tng-semantic-accent-brand)_12%,var(--tng-semantic-background-base))] [--tng-semantic-border-default:var(--tng-semantic-border-subtle)]">
    <tng-input-otp
      [length]="6"
      [value]="componentInputOtpOverviewTailwindValue()"
      [ariaLabel]="'Approval code'"
      (valueChange)="onComponentInputOtpOverviewTailwindValueChange($event)"
      (complete)="onComponentInputOtpOverviewTailwindComplete($event)"
    ></tng-input-otp>
  </div>

  <p class="m-0 text-sm text-[var(--tng-semantic-foreground-secondary)]">Value: {{ componentInputOtpOverviewTailwindValue() || '—' }}</p>
  <p class="m-0 text-sm text-[var(--tng-semantic-foreground-secondary)]">Complete event: {{ componentInputOtpOverviewTailwindComplete() || '—' }}</p>
</section>`;

@Component({
  selector: 'app-input-otp-overview-page',
  imports: [
    TngCodeBlockComponent,
    TngInputOtpComponent,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './input-otp-overview-page.component.html',
  styleUrl: './input-otp-overview-page.component.css',
})
export class InputOtpOverviewPageComponent implements OnDestroy {
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
  protected readonly componentImportCode = COMPONENT_IMPORT_CODE;
  protected readonly basicUsageCode = BASIC_USAGE_CODE;

  protected readonly plainValue = signal('12');
  protected readonly plainComplete = signal('');
  protected readonly tailwindValue = signal('84');
  protected readonly tailwindComplete = signal('');

  protected readonly plainCodeTabs = createCodeTabs(
    'component-input-otp-overview-plain-example',
    PLAIN_TS_CODE,
    PLAIN_HTML_CODE,
    PLAIN_CSS_CODE,
  );
  protected readonly tailwindCodeTabs = createCodeTabs(
    'component-input-otp-overview-tailwind-example',
    TAILWIND_TS_CODE,
    TAILWIND_HTML_CODE,
    '/* Tailwind utilities are applied directly in the template. */',
  );

  protected onPlainValueChange(nextValue: string): void {
    this.plainValue.set(nextValue);
    if (nextValue.length < 6) {
      this.plainComplete.set('');
    }
  }

  protected onPlainComplete(nextValue: string): void {
    this.plainComplete.set(nextValue);
  }

  protected onTailwindValueChange(nextValue: string): void {
    this.tailwindValue.set(nextValue);
    if (nextValue.length < 6) {
      this.tailwindComplete.set('');
    }
  }

  protected onTailwindComplete(nextValue: string): void {
    this.tailwindComplete.set(nextValue);
  }

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
