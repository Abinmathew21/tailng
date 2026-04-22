import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngInputOtpComponent } from '@tailng-ui/components';
import type { DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';
import { DocsFormDemoShellComponent } from '../../../../../../shared/form-demo-shell/docs-form-demo-shell.component';
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

const PASSCODE_PLAIN_TS_CODE = String.raw`import { Component, signal } from '@angular/core';
import { TngInputOtpComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-component-input-otp-examples-passcode-plain',
  standalone: true,
  imports: [TngInputOtpComponent],
  templateUrl: './component-input-otp-examples-passcode-plain.component.html',
  styleUrl: './component-input-otp-examples-passcode-plain.component.css',
})
export class ComponentInputOtpExamplesPasscodePlainComponent {
  readonly componentInputOtpExamplesPasscodePlainValue = signal('28');
  readonly componentInputOtpExamplesPasscodePlainComplete = signal('');

  onComponentInputOtpExamplesPasscodePlainValueChange(nextValue: string): void {
    this.componentInputOtpExamplesPasscodePlainValue.set(nextValue);
    if (nextValue.length < 6) {
      this.componentInputOtpExamplesPasscodePlainComplete.set('');
    }
  }

  onComponentInputOtpExamplesPasscodePlainComplete(nextValue: string): void {
    this.componentInputOtpExamplesPasscodePlainComplete.set(nextValue);
  }
}`;

const PASSCODE_PLAIN_HTML_CODE = String.raw`<section class="docs-component-input-otp-examples-passcode-plain-shell">
  <div class="docs-component-input-otp-examples-passcode-plain-header">
    <span class="docs-component-input-otp-examples-passcode-plain-kicker">Verification flow</span>
    <p class="docs-component-input-otp-examples-passcode-plain-copy">
      A straightforward numeric code step with completion feedback.
    </p>
  </div>

  <div class="docs-component-input-otp-examples-passcode-plain-control">
    <tng-input-otp
      [length]="6"
      [value]="componentInputOtpExamplesPasscodePlainValue()"
      [ariaLabel]="'Verification code'"
      (valueChange)="onComponentInputOtpExamplesPasscodePlainValueChange($event)"
      (complete)="onComponentInputOtpExamplesPasscodePlainComplete($event)"
    ></tng-input-otp>
  </div>

  <p class="docs-component-input-otp-examples-passcode-plain-summary">
    Value: {{ componentInputOtpExamplesPasscodePlainValue() || '—' }}
  </p>
  <p class="docs-component-input-otp-examples-passcode-plain-summary">
    Complete event: {{ componentInputOtpExamplesPasscodePlainComplete() || '—' }}
  </p>
</section>`;

const PASSCODE_PLAIN_CSS_CODE = String.raw`.docs-component-input-otp-examples-passcode-plain-shell {
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

.docs-component-input-otp-examples-passcode-plain-header {
  display: grid;
  gap: 0.35rem;
}

.docs-component-input-otp-examples-passcode-plain-kicker {
  color: var(--tng-semantic-foreground-secondary);
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.02em;
}

.docs-component-input-otp-examples-passcode-plain-copy,
.docs-component-input-otp-examples-passcode-plain-summary {
  margin: 0;
  color: var(--tng-semantic-foreground-secondary);
}

.docs-component-input-otp-examples-passcode-plain-control {
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

.docs-component-input-otp-examples-passcode-plain-control tng-input-otp {
  display: block;
  inline-size: 100%;
  min-inline-size: 0;
}`;

const PASSCODE_TAILWIND_TS_CODE = String.raw`import { Component, signal } from '@angular/core';
import { TngInputOtpComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-component-input-otp-examples-passcode-tailwind',
  standalone: true,
  imports: [TngInputOtpComponent],
  templateUrl: './component-input-otp-examples-passcode-tailwind.component.html',
  styleUrl: './component-input-otp-examples-passcode-tailwind.component.css',
})
export class ComponentInputOtpExamplesPasscodeTailwindComponent {
  readonly componentInputOtpExamplesPasscodeTailwindValue = signal('84');
  readonly componentInputOtpExamplesPasscodeTailwindComplete = signal('');

  onComponentInputOtpExamplesPasscodeTailwindValueChange(nextValue: string): void {
    this.componentInputOtpExamplesPasscodeTailwindValue.set(nextValue);
    if (nextValue.length < 6) {
      this.componentInputOtpExamplesPasscodeTailwindComplete.set('');
    }
  }

  onComponentInputOtpExamplesPasscodeTailwindComplete(nextValue: string): void {
    this.componentInputOtpExamplesPasscodeTailwindComplete.set(nextValue);
  }
}`;

const PASSCODE_TAILWIND_HTML_CODE = String.raw`<section class="mx-auto grid w-full max-w-[36rem] gap-4 rounded-[1.5rem] border border-[var(--tng-semantic-border-subtle)] bg-[var(--tng-semantic-background-surface)] p-5 text-[var(--tng-semantic-foreground-primary)] shadow-[0_12px_32px_color-mix(in_srgb,var(--tng-semantic-foreground-primary)_8%,transparent)]">
  <div class="grid gap-1">
    <span class="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--tng-semantic-foreground-secondary)]">Approval flow</span>
    <p class="m-0 text-sm leading-6 text-[var(--tng-semantic-foreground-secondary)]">Numeric approval code with utility-first framing.</p>
  </div>

  <div class="block [--tng-semantic-background-muted:color-mix(in_srgb,var(--tng-semantic-accent-brand)_12%,var(--tng-semantic-background-base))] [--tng-semantic-border-default:var(--tng-semantic-border-subtle)]">
    <tng-input-otp
      [length]="6"
      [value]="componentInputOtpExamplesPasscodeTailwindValue()"
      [ariaLabel]="'Approval code'"
      (valueChange)="onComponentInputOtpExamplesPasscodeTailwindValueChange($event)"
      (complete)="onComponentInputOtpExamplesPasscodeTailwindComplete($event)"
    ></tng-input-otp>
  </div>

  <p class="m-0 text-sm text-[var(--tng-semantic-foreground-secondary)]">Value: {{ componentInputOtpExamplesPasscodeTailwindValue() || '—' }}</p>
  <p class="m-0 text-sm text-[var(--tng-semantic-foreground-secondary)]">Complete event: {{ componentInputOtpExamplesPasscodeTailwindComplete() || '—' }}</p>
</section>`;

const RECOVERY_PLAIN_TS_CODE = String.raw`import { Component, signal } from '@angular/core';
import { TngInputOtpComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-component-input-otp-examples-recovery-plain',
  standalone: true,
  imports: [TngInputOtpComponent],
  templateUrl: './component-input-otp-examples-recovery-plain.component.html',
  styleUrl: './component-input-otp-examples-recovery-plain.component.css',
})
export class ComponentInputOtpExamplesRecoveryPlainComponent {
  readonly componentInputOtpExamplesRecoveryPlainValue = signal('A1B');

  onComponentInputOtpExamplesRecoveryPlainValueChange(nextValue: string): void {
    this.componentInputOtpExamplesRecoveryPlainValue.set(nextValue);
  }
}`;

const RECOVERY_PLAIN_HTML_CODE = String.raw`<section class="docs-component-input-otp-examples-recovery-plain-shell">
  <div class="docs-component-input-otp-examples-recovery-plain-header">
    <span class="docs-component-input-otp-examples-recovery-plain-kicker">Recovery code</span>
    <p class="docs-component-input-otp-examples-recovery-plain-copy">
      Alphanumeric entry with masking for sensitive approval checkpoints.
    </p>
  </div>

  <div class="docs-component-input-otp-examples-recovery-plain-control">
    <tng-input-otp
      [length]="6"
      [type]="'alphanumeric'"
      [mask]="true"
      [value]="componentInputOtpExamplesRecoveryPlainValue()"
      [ariaLabel]="'Recovery code'"
      (valueChange)="onComponentInputOtpExamplesRecoveryPlainValueChange($event)"
    ></tng-input-otp>
  </div>

  <p class="docs-component-input-otp-examples-recovery-plain-summary">
    Value: {{ componentInputOtpExamplesRecoveryPlainValue() || '—' }}
  </p>
</section>`;

const RECOVERY_PLAIN_CSS_CODE = String.raw`.docs-component-input-otp-examples-recovery-plain-shell {
  display: grid;
  gap: 0.9rem;
  inline-size: min(100%, 36rem);
  margin-inline: auto;
  padding: 1.15rem;
  border: 1px solid color-mix(in srgb, var(--tng-semantic-accent-danger) 28%, var(--tng-semantic-border-subtle));
  border-radius: 1.35rem;
  background: linear-gradient(
    180deg,
    color-mix(in srgb, var(--tng-semantic-accent-danger) 8%, var(--tng-semantic-background-surface)),
    var(--tng-semantic-background-surface)
  );
  color: var(--tng-semantic-foreground-primary);
  box-shadow: 0 14px 36px color-mix(in srgb, var(--tng-semantic-foreground-primary) 10%, transparent);
}

.docs-component-input-otp-examples-recovery-plain-header {
  display: grid;
  gap: 0.35rem;
}

.docs-component-input-otp-examples-recovery-plain-kicker {
  color: color-mix(in srgb, var(--tng-semantic-accent-danger) 55%, var(--tng-semantic-foreground-secondary));
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.02em;
}

.docs-component-input-otp-examples-recovery-plain-copy,
.docs-component-input-otp-examples-recovery-plain-summary {
  margin: 0;
  color: var(--tng-semantic-foreground-secondary);
}

.docs-component-input-otp-examples-recovery-plain-control {
  --tng-semantic-background-surface: var(--tng-semantic-background-surface);
  --tng-semantic-background-muted: color-mix(
    in srgb,
    var(--tng-semantic-accent-danger) 10%,
    var(--tng-semantic-background-base)
  );
  --tng-semantic-border-default: color-mix(in srgb, var(--tng-semantic-accent-danger) 30%, var(--tng-semantic-border-subtle));
  --tng-semantic-foreground-primary: var(--tng-semantic-foreground-primary);
  --tng-semantic-foreground-muted: var(--tng-semantic-foreground-muted);
  --tng-semantic-accent-brand: var(--tng-semantic-accent-danger);
  --tng-semantic-accent-danger: var(--tng-semantic-accent-danger);
}

.docs-component-input-otp-examples-recovery-plain-control tng-input-otp {
  display: block;
  inline-size: 100%;
  min-inline-size: 0;
}`;

const RECOVERY_TAILWIND_TS_CODE = String.raw`import { Component, signal } from '@angular/core';
import { TngInputOtpComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-component-input-otp-examples-recovery-tailwind',
  standalone: true,
  imports: [TngInputOtpComponent],
  templateUrl: './component-input-otp-examples-recovery-tailwind.component.html',
  styleUrl: './component-input-otp-examples-recovery-tailwind.component.css',
})
export class ComponentInputOtpExamplesRecoveryTailwindComponent {
  readonly componentInputOtpExamplesRecoveryTailwindValue = signal('X9Q');

  onComponentInputOtpExamplesRecoveryTailwindValueChange(nextValue: string): void {
    this.componentInputOtpExamplesRecoveryTailwindValue.set(nextValue);
  }
}`;

const RECOVERY_TAILWIND_HTML_CODE = String.raw`<section class="mx-auto grid w-full max-w-[36rem] gap-4 rounded-[1.75rem] border border-[color-mix(in_srgb,var(--tng-semantic-accent-danger)_28%,var(--tng-semantic-border-subtle))] bg-[linear-gradient(180deg,color-mix(in_srgb,var(--tng-semantic-accent-danger)_8%,var(--tng-semantic-background-surface)),var(--tng-semantic-background-surface))] p-5 text-[var(--tng-semantic-foreground-primary)] shadow-[0_14px_36px_color-mix(in_srgb,var(--tng-semantic-foreground-primary)_10%,transparent)]">
  <div class="grid gap-1">
    <span class="text-xs font-semibold uppercase tracking-[0.22em] text-[color-mix(in_srgb,var(--tng-semantic-accent-danger)_55%,var(--tng-semantic-foreground-secondary))]">Recovery checkpoint</span>
    <p class="m-0 text-sm leading-6 text-[var(--tng-semantic-foreground-secondary)]">Masked alphanumeric entry with a warmer caution tone.</p>
  </div>

  <div class="block [--tng-semantic-background-muted:color-mix(in_srgb,var(--tng-semantic-accent-danger)_12%,var(--tng-semantic-background-base))] [--tng-semantic-border-default:color-mix(in_srgb,var(--tng-semantic-accent-danger)_30%,var(--tng-semantic-border-subtle))] [--tng-semantic-accent-brand:var(--tng-semantic-accent-danger)]">
    <tng-input-otp
      [length]="6"
      [type]="'alphanumeric'"
      [mask]="true"
      [value]="componentInputOtpExamplesRecoveryTailwindValue()"
      [ariaLabel]="'Recovery code'"
      (valueChange)="onComponentInputOtpExamplesRecoveryTailwindValueChange($event)"
    ></tng-input-otp>
  </div>

  <p class="m-0 text-sm text-[var(--tng-semantic-foreground-secondary)]">Value: {{ componentInputOtpExamplesRecoveryTailwindValue() || '—' }}</p>
</section>`;

@Component({
  selector: 'app-input-otp-examples-page',
  imports: [
    TngInputOtpComponent,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
    DocsFormDemoShellComponent,
  ],
  templateUrl: './input-otp-examples-page.component.html',
  styleUrl: './input-otp-examples-page.component.css',
})
export class InputOtpExamplesPageComponent implements OnDestroy {
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

  protected readonly passcodePlainValue = signal('28');
  protected readonly passcodePlainComplete = signal('');
  protected readonly passcodeTailwindValue = signal('84');
  protected readonly passcodeTailwindComplete = signal('');
  protected readonly recoveryPlainValue = signal('A1B');
  protected readonly recoveryTailwindValue = signal('X9Q');

  protected readonly passcodePlainCodeTabs = createCodeTabs(
    'component-input-otp-examples-passcode-plain',
    PASSCODE_PLAIN_TS_CODE,
    PASSCODE_PLAIN_HTML_CODE,
    PASSCODE_PLAIN_CSS_CODE,
  );
  protected readonly passcodeTailwindCodeTabs = createCodeTabs(
    'component-input-otp-examples-passcode-tailwind',
    PASSCODE_TAILWIND_TS_CODE,
    PASSCODE_TAILWIND_HTML_CODE,
    '/* Tailwind utilities are applied directly in the template. */',
  );
  protected readonly recoveryPlainCodeTabs = createCodeTabs(
    'component-input-otp-examples-recovery-plain',
    RECOVERY_PLAIN_TS_CODE,
    RECOVERY_PLAIN_HTML_CODE,
    RECOVERY_PLAIN_CSS_CODE,
  );
  protected readonly recoveryTailwindCodeTabs = createCodeTabs(
    'component-input-otp-examples-recovery-tailwind',
    RECOVERY_TAILWIND_TS_CODE,
    RECOVERY_TAILWIND_HTML_CODE,
    '/* Tailwind utilities are applied directly in the template. */',
  );

  protected onPasscodePlainValueChange(nextValue: string): void {
    this.passcodePlainValue.set(nextValue);
    if (nextValue.length < 6) {
      this.passcodePlainComplete.set('');
    }
  }

  protected onPasscodePlainComplete(nextValue: string): void {
    this.passcodePlainComplete.set(nextValue);
  }

  protected onPasscodeTailwindValueChange(nextValue: string): void {
    this.passcodeTailwindValue.set(nextValue);
    if (nextValue.length < 6) {
      this.passcodeTailwindComplete.set('');
    }
  }

  protected onPasscodeTailwindComplete(nextValue: string): void {
    this.passcodeTailwindComplete.set(nextValue);
  }

  protected onRecoveryPlainValueChange(nextValue: string): void {
    this.recoveryPlainValue.set(nextValue);
  }

  protected onRecoveryTailwindValueChange(nextValue: string): void {
    this.recoveryTailwindValue.set(nextValue);
  }

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
