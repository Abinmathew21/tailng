import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

const emojiIcons = Object.freeze({
  people: '👥',
});

type TngIconKind = 'emoji' | 'flag' | 'unknown';

type ResolvedTngIcon = Readonly<{
  flagCode: string | null;
  kind: TngIconKind;
  value: string | null;
}>;

function normalizeOptionalString(value: string | null | undefined): string | null {
  if (value === undefined || value === null) {
    return null;
  }

  const normalizedValue = value.trim();
  return normalizedValue.length > 0 ? normalizedValue : null;
}

function normalizeIconName(value: string): string {
  return value.trim().toLowerCase();
}

function toFlagCode(iconName: string): string | null {
  const prefix = iconName.startsWith('flag:')
    ? 'flag:'
    : iconName.startsWith('flag-')
      ? 'flag-'
      : null;

  if (prefix === null) {
    return null;
  }

  const code = iconName.slice(prefix.length).trim().toLowerCase();
  return /^[a-z]{2}$/.test(code) ? code : null;
}

export function resolveTngIcon(iconName: string): ResolvedTngIcon {
  const normalizedIconName = normalizeIconName(iconName);
  const flagCode = toFlagCode(normalizedIconName);

  if (flagCode !== null) {
    return {
      flagCode,
      kind: 'flag',
      value: flagCode,
    };
  }

  const emoji = emojiIcons[normalizedIconName as keyof typeof emojiIcons];
  if (emoji !== undefined) {
    return {
      flagCode: null,
      kind: 'emoji',
      value: emoji,
    };
  }

  return {
    flagCode: null,
    kind: 'unknown',
    value: null,
  };
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'tng-icon',
  },
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
      .tng-icon__glyph {
        line-height: 1;
      }

      .tng-icon__flag {
        border-radius: 0.125rem;
        box-shadow: inset 0 0 0 1px rgb(15 23 42 / 0.35);
        font-size: 1em;
      }

      .tng-icon__glyph {
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
    } @else {
      <span
        class="tng-icon__glyph"
        [attr.aria-hidden]="iconAriaHidden()"
        [attr.aria-label]="iconAriaLabel()"
        [attr.role]="iconRole()"
      >
        {{ resolvedValue() }}
      </span>
    }
  `,
})
export class TngIcon {
  public readonly icon = input.required<string>();
  public readonly label = input<string | null, string | null | undefined>(null, {
    transform: normalizeOptionalString,
  });

  protected readonly resolvedIcon = computed(() => resolveTngIcon(this.icon()));

  protected readonly iconAriaHidden = computed<'true' | null>(() =>
    this.label() === null ? 'true' : null,
  );

  protected readonly iconAriaLabel = computed<string | null>(() => this.label());

  protected readonly iconRole = computed<'img' | null>(() =>
    this.label() === null ? null : 'img',
  );

  protected readonly isFlag = computed<boolean>(() => this.resolvedIcon().kind === 'flag');

  protected readonly flagClass = computed<string>(() => {
    const flagCode = this.resolvedIcon().flagCode;
    if (flagCode === null) {
      return 'tng-icon__fallback';
    }

    return `fi fi-${flagCode} tng-icon__flag`;
  });

  protected readonly resolvedValue = computed<string>(() => {
    const value = this.resolvedIcon().value;
    return value ?? '◻';
  });
}
