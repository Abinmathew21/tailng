import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngInputOtpComponent } from '@tailng-ui/components';
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

  <tng-input-otp
    class="docs-component-input-otp-examples-passcode-plain-control"
    [length]="6"
    [value]="componentInputOtpExamplesPasscodePlainValue()"
    [ariaLabel]="'Verification code'"
    (valueChange)="onComponentInputOtpExamplesPasscodePlainValueChange($event)"
    (complete)="onComponentInputOtpExamplesPasscodePlainComplete($event)"
  ></tng-input-otp>

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
  border: 1px solid #cbd5e1;
  border-radius: 1.35rem;
  background: #ffffff;
  color: #0f172a;
  color-scheme: light;
  box-shadow: 0 12px 32px rgba(15, 23, 42, 0.08);
}

.docs-component-input-otp-examples-passcode-plain-header {
  display: grid;
  gap: 0.35rem;
}

.docs-component-input-otp-examples-passcode-plain-kicker {
  color: #64748b;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.02em;
}

.docs-component-input-otp-examples-passcode-plain-copy,
.docs-component-input-otp-examples-passcode-plain-summary {
  margin: 0;
  color: #475569;
}

.docs-component-input-otp-examples-passcode-plain-control {
  --tng-semantic-background-surface: #ffffff;
  --tng-semantic-background-muted: #eef4ff;
  --tng-semantic-border-default: #cbd5e1;
  --tng-semantic-foreground-primary: #0f172a;
  --tng-semantic-foreground-muted: #94a3b8;
  --tng-semantic-accent-brand: #2563eb;
  --tng-semantic-accent-danger: #dc2626;
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

const PASSCODE_TAILWIND_HTML_CODE = String.raw`<section class="mx-auto grid w-full max-w-[36rem] gap-4 rounded-[1.5rem] border border-slate-200 bg-white p-5 text-slate-900 shadow-sm">
  <div class="grid gap-1">
    <span class="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Approval flow</span>
    <p class="m-0 text-sm leading-6 text-slate-600">Numeric approval code with utility-first framing.</p>
  </div>

  <tng-input-otp
    class="block [--tng-semantic-background-surface:#ffffff] [--tng-semantic-background-muted:#eef6ff] [--tng-semantic-border-default:#cbd5e1] [--tng-semantic-foreground-primary:#0f172a] [--tng-semantic-foreground-muted:#94a3b8] [--tng-semantic-accent-brand:#2563eb] [--tng-semantic-accent-danger:#dc2626]"
    [length]="6"
    [value]="componentInputOtpExamplesPasscodeTailwindValue()"
    [ariaLabel]="'Approval code'"
    (valueChange)="onComponentInputOtpExamplesPasscodeTailwindValueChange($event)"
    (complete)="onComponentInputOtpExamplesPasscodeTailwindComplete($event)"
  ></tng-input-otp>

  <p class="m-0 text-sm text-slate-600">Value: {{ componentInputOtpExamplesPasscodeTailwindValue() || '—' }}</p>
  <p class="m-0 text-sm text-slate-600">Complete event: {{ componentInputOtpExamplesPasscodeTailwindComplete() || '—' }}</p>
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

  <tng-input-otp
    class="docs-component-input-otp-examples-recovery-plain-control"
    [length]="6"
    [type]="'alphanumeric'"
    [mask]="true"
    [value]="componentInputOtpExamplesRecoveryPlainValue()"
    [ariaLabel]="'Recovery code'"
    (valueChange)="onComponentInputOtpExamplesRecoveryPlainValueChange($event)"
  ></tng-input-otp>

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
  border: 1px solid #d6c6b8;
  border-radius: 1.35rem;
  background: linear-gradient(180deg, #fff7ed 0%, #fffdfa 100%);
  color: #3f3022;
  color-scheme: light;
  box-shadow: 0 14px 36px rgba(68, 46, 14, 0.12);
}

.docs-component-input-otp-examples-recovery-plain-header {
  display: grid;
  gap: 0.35rem;
}

.docs-component-input-otp-examples-recovery-plain-kicker {
  color: #9a6a3a;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.02em;
}

.docs-component-input-otp-examples-recovery-plain-copy,
.docs-component-input-otp-examples-recovery-plain-summary {
  margin: 0;
  color: #5f4a35;
}

.docs-component-input-otp-examples-recovery-plain-control {
  --tng-semantic-background-surface: #fffdfa;
  --tng-semantic-background-muted: #ffedd5;
  --tng-semantic-border-default: #fdba74;
  --tng-semantic-foreground-primary: #3f3022;
  --tng-semantic-foreground-muted: #9c8468;
  --tng-semantic-accent-brand: #ea580c;
  --tng-semantic-accent-danger: #b42318;
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

const RECOVERY_TAILWIND_HTML_CODE = String.raw`<section class="mx-auto grid w-full max-w-[36rem] gap-4 rounded-[1.75rem] border border-orange-200 bg-white p-5 text-slate-900 shadow-sm">
  <div class="grid gap-1">
    <span class="text-xs font-semibold uppercase tracking-[0.22em] text-orange-600">Recovery checkpoint</span>
    <p class="m-0 text-sm leading-6 text-slate-600">Masked alphanumeric entry with a warmer caution tone.</p>
  </div>

  <tng-input-otp
    class="block [--tng-semantic-background-surface:#ffffff] [--tng-semantic-background-muted:#fff7ed] [--tng-semantic-border-default:#fdba74] [--tng-semantic-foreground-primary:#0f172a] [--tng-semantic-foreground-muted:#94a3b8] [--tng-semantic-accent-brand:#ea580c] [--tng-semantic-accent-danger:#dc2626]"
    [length]="6"
    [type]="'alphanumeric'"
    [mask]="true"
    [value]="componentInputOtpExamplesRecoveryTailwindValue()"
    [ariaLabel]="'Recovery code'"
    (valueChange)="onComponentInputOtpExamplesRecoveryTailwindValueChange($event)"
  ></tng-input-otp>

  <p class="m-0 text-sm text-slate-600">Value: {{ componentInputOtpExamplesRecoveryTailwindValue() || '—' }}</p>
</section>`;

@Component({
  selector: 'app-input-otp-examples-page',
  imports: [TngInputOtpComponent, DocsExampleTabsSectionComponent, DocsExampleVariantDirective],
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
