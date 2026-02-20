import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { TNG_ICON_CONFIG, TngIconResolver } from './icons';

type TngIconKind = 'flag' | 'icon' | 'unknown';

type ResolvedTngIcon = Readonly<{
  flagCode: string | null;
  iconRef: string | null;
  kind: TngIconKind;
}>;

function normalizeOptionalString(value: string | null | undefined): string | null {
  if (value === undefined || value === null) {
    return null;
  }

  const normalizedValue = value.trim();
  return normalizedValue.length > 0 ? normalizedValue : null;
}

function normalizeIconName(value: string): string {
  return value.trim();
}

function hasFlagPrefix(iconName: string): boolean {
  const normalizedIconName = iconName.toLowerCase();
  return normalizedIconName.startsWith('flag:') || normalizedIconName.startsWith('flag-');
}

function toFlagCode(iconName: string): string | null {
  const normalizedIconName = iconName.toLowerCase();

  const prefix = normalizedIconName.startsWith('flag:')
    ? 'flag:'
    : normalizedIconName.startsWith('flag-')
      ? 'flag-'
      : null;

  if (prefix === null) {
    return null;
  }

  const code = normalizedIconName.slice(prefix.length).trim().toLowerCase();
  return /^[a-z]{2}$/.test(code) ? code : null;
}

export function resolveTngIcon(iconName: string): ResolvedTngIcon {
  const normalizedIconName = normalizeIconName(iconName);
  if (normalizedIconName.length === 0) {
    return {
      flagCode: null,
      iconRef: null,
      kind: 'unknown',
    };
  }

  const flagCode = toFlagCode(normalizedIconName);

  if (flagCode !== null) {
    return {
      flagCode,
      iconRef: null,
      kind: 'flag',
    };
  }

  if (hasFlagPrefix(normalizedIconName)) {
    return {
      flagCode: null,
      iconRef: null,
      kind: 'unknown',
    };
  }

  return {
    flagCode: null,
    iconRef: normalizedIconName,
    kind: 'icon',
  };
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'tng-icon',
  },
  imports: [NgIcon],
  selector: 'tng-icon',
  styles: [
    `
      :host {
        align-items: center;
        display: inline-flex;
        justify-content: center;
        line-height: 1;
      }

      .tng-icon__flag,
      .tng-icon__fallback,
      .tng-icon__svg {
        line-height: 1;
      }

      .tng-icon__flag {
        border-radius: 0.125rem;
        box-shadow: inset 0 0 0 1px rgb(15 23 42 / 0.35);
        font-size: 1em;
      }

      .tng-icon__fallback {
        align-items: center;
        color: currentColor;
        display: inline-flex;
        font-size: 1em;
        justify-content: center;
      }

      .tng-icon__svg {
        font-size: 1em;
      }
    `,
  ],
  template: `
    @if (isFlag()) {
      <span
        [class]="flagClass()"
        [attr.aria-hidden]="iconAriaHidden()"
        [attr.aria-label]="iconAriaLabel()"
        [attr.role]="iconRole()"
      ></span>
    } @else if (hasSvg()) {
      <ng-icon
        class="tng-icon__svg"
        [svg]="svg()"
        [attr.aria-hidden]="iconAriaHidden()"
        [attr.aria-label]="iconAriaLabel()"
        [attr.role]="iconRole()"
      />
    } @else {
      <span
        class="tng-icon__fallback"
        [attr.aria-hidden]="iconAriaHidden()"
        [attr.aria-label]="iconAriaLabel()"
        [attr.role]="iconRole()"
      >
        ◻
      </span>
    }
  `,
})
export class TngIcon {
  public readonly icon = input.required<string>();
  public readonly label = input<string | null, string | null | undefined>(null, {
    transform: normalizeOptionalString,
  });
  private readonly iconResolver = new TngIconResolver(inject(TNG_ICON_CONFIG));
  private readonly svgSignal = signal<string | null>(null);

  public constructor() {
    effect(
      (onCleanup): void => {
        const resolvedIcon = this.resolvedIcon();
        if (resolvedIcon.kind !== 'icon' || resolvedIcon.iconRef === null) {
          this.svgSignal.set(null);
          return;
        }

        let cancelled = false;
        void this.iconResolver
          .loadIcon(resolvedIcon.iconRef)
          .then((resolvedSvg): void => {
            if (!cancelled) {
              this.svgSignal.set(resolvedSvg ?? null);
            }
          })
          .catch((): void => {
            if (!cancelled) {
              this.svgSignal.set(null);
            }
          });

        onCleanup((): void => {
          cancelled = true;
        });
      },
      { allowSignalWrites: true },
    );
  }

  protected readonly resolvedIcon = computed(() => resolveTngIcon(this.icon()));

  protected readonly iconAriaHidden = computed<'true' | null>(() =>
    this.label() === null ? 'true' : null,
  );

  protected readonly iconAriaLabel = computed<string | null>(() => this.label());

  protected readonly iconRole = computed<'img' | null>(() =>
    this.label() === null ? null : 'img',
  );

  protected readonly isFlag = computed<boolean>(() => this.resolvedIcon().kind === 'flag');
  protected readonly hasSvg = computed<boolean>(() => this.svgSignal() !== null);
  protected readonly svg = computed<string>(() => this.svgSignal() ?? '');

  protected readonly flagClass = computed<string>(() => {
    const flagCode = this.resolvedIcon().flagCode;
    if (flagCode === null) {
      return 'tng-icon__fallback';
    }

    return `fi fi-${flagCode} tng-icon__flag`;
  });
}
