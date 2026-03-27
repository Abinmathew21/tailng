import { Component, computed, input, signal } from '@angular/core';
import {
  TngAvatar as TngAvatarPrimitive,
  TngAvatarFallback as TngAvatarFallbackPrimitive,
  TngAvatarImage as TngAvatarImagePrimitive,
} from '@tailng-ui/primitives';

type TngAvatarShape = 'circle' | 'square';
type TngAvatarSize = 'lg' | 'md' | 'sm';

function normalizeOptionalString(value: string | null | undefined): string | null {
  if (value === undefined || value === null) {
    return null;
  }

  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
}

function normalizeAvatarAlt(value: string | null | undefined): string | null {
  if (value === undefined || value === null) {
    return null;
  }

  const normalized = value.trim();
  return normalized.length > 0 ? normalized : '';
}

function normalizeFallbackText(value: string): string {
  return value.length > 0 ? value : '?';
}

function toWords(value: string | null | undefined): readonly string[] {
  const normalized = normalizeOptionalString(value);
  if (normalized === null) {
    return [];
  }

  return normalized.split(/\s+/).filter((part) => part.length > 0);
}

function toTwoLetterCode(word: string): string {
  return normalizeFallbackText(word.slice(0, 2).toUpperCase());
}

function toInitialCode(words: readonly string[]): string {
  const firstInitial = words[0]?.charAt(0) ?? '';
  const secondInitial = words[1]?.charAt(0) ?? '';
  return normalizeFallbackText(`${firstInitial}${secondInitial}`.toUpperCase());
}

export function toTngAvatarFallbackText(value: string | null | undefined): string {
  const words = toWords(value);
  if (words.length === 0) {
    return '?';
  }

  if (words.length === 1) {
    return toTwoLetterCode(words[0] ?? '');
  }

  return toInitialCode(words);
}

@Component({
  selector: 'tng-avatar',
  imports: [TngAvatarPrimitive, TngAvatarImagePrimitive, TngAvatarFallbackPrimitive],
  templateUrl: './tng-avatar.component.html',
  styleUrl: './tng-avatar.component.css',
})
export class TngAvatarComponent {
  public readonly alt = input<string | null>('Avatar');
  public readonly fallback = input<string | null>(null);
  public readonly shape = input<TngAvatarShape>('circle');
  public readonly size = input<TngAvatarSize>('md');
  public readonly src = input<string | null>(null);

  private readonly imageLoadFailed = signal(false);
  protected readonly fallbackText = computed<string>(() =>
    toTngAvatarFallbackText(this.fallback()),
  );
  protected readonly resolvedAlt = computed<string | null>(() =>
    normalizeAvatarAlt(this.alt()),
  );
  protected readonly resolvedSrc = computed<string | null>(() =>
    normalizeOptionalString(this.src()),
  );
  protected readonly showFallback = computed<boolean>(
    () => this.resolvedSrc() === null || this.imageLoadFailed(),
  );

  public onImageError(): void {
    this.imageLoadFailed.set(true);
  }

  public onImageLoad(): void {
    this.imageLoadFailed.set(false);
  }
}
export { TngAvatarComponent as TngAvatar };
