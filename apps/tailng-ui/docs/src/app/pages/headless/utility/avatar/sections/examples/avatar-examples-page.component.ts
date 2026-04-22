import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngAvatar, TngAvatarFallback, TngAvatarImage } from '@tailng-ui/primitives';
import { type DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';
import { observeDocsCodeThemeChanges, resolveDocsCodeBlockTheme } from '../../../../../../shared/util';

type AvatarExampleScope = 'fallback-plain' | 'fallback-tailwind';
type AvatarSourceMode = 'broken' | 'none' | 'valid';

@Component({
  selector: 'app-headless-avatar-examples-page',
  imports: [TngAvatar, TngAvatarImage, TngAvatarFallback, DocsExampleTabsSectionComponent, DocsExampleVariantDirective],
  templateUrl: './avatar-examples-page.component.html',
  styleUrl: './avatar-examples-page.component.css',
})
export class HeadlessAvatarExamplesPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly sampleImage = `data:image/svg+xml,${encodeURIComponent(
    "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><defs><linearGradient id='avatar-g' x1='0' x2='1' y1='0' y2='1'><stop offset='0%' stop-color='%2360a5fa'/><stop offset='100%' stop-color='%231d4ed8'/></linearGradient></defs><rect width='100' height='100' fill='url(%23avatar-g)'/><circle cx='50' cy='37' r='18' fill='%23cbd5e1'/><rect x='24' y='62' width='52' height='22' rx='11' fill='%23cbd5e1'/></svg>",
  )}`;
  private readonly brokenImage = 'broken://avatar';

  protected readonly fallbackSrc = signal<Record<'plain' | 'tailwind', string | null>>({
    plain: this.sampleImage,
    tailwind: this.sampleImage,
  });
  protected readonly fallbackMode = signal<Record<'plain' | 'tailwind', AvatarSourceMode>>({
    plain: 'valid',
    tailwind: 'valid',
  });
  protected readonly fallbackLoadFailed = signal<Record<'plain' | 'tailwind', boolean>>({
    plain: false,
    tailwind: false,
  });

  protected readonly fallbackPlainTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'headless-avatar-examples-fallback-plain-css.component.ts',
      code: [
        "import { Component, signal } from '@angular/core';",
        "import { TngAvatar, TngAvatarFallback, TngAvatarImage } from '@tailng-ui/primitives';",
        '',
        '@Component({',
        "  selector: 'app-headless-avatar-examples-fallback-plain-css',",
        '  standalone: true,',
        '  imports: [TngAvatar, TngAvatarImage, TngAvatarFallback],',
        "  templateUrl: './headless-avatar-examples-fallback-plain-css.component.html',",
        "  styleUrl: './headless-avatar-examples-fallback-plain-css.component.css',",
        '})',
        'export class HeadlessAvatarExamplesFallbackPlainCssComponent {',
        '  protected readonly src = signal<string | null>(profileImageUrl);',
        '  protected readonly imageLoadFailed = signal(false);',
        '',
        '  protected showFallback(): boolean {',
        '    return this.src() === null || this.imageLoadFailed();',
        '  }',
        '}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'headless-avatar-examples-fallback-plain-css.component.html',
      code: [
        '<span tngAvatar class="headless-avatar-host headless-avatar-host--lg">',
        '  <img',
        '    tngAvatarImage',
        '    class="headless-avatar-image"',
        '    [attr.src]="src()"',
        '    [attr.hidden]="showFallback() ? \'\' : null"',
        '    alt="Priya Raman"',
        '    (error)="imageLoadFailed.set(true)"',
        '    (load)="imageLoadFailed.set(false)"',
        '  />',
        '  <span tngAvatarFallback class="headless-avatar-fallback" [attr.hidden]="showFallback() ? null : \'\'" aria-hidden="true">',
        '    PR',
        '  </span>',
        '</span>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'headless-avatar-examples-fallback-plain-css.component.css',
      code: [
        '.headless-avatar-host--lg {',
        '  height: 3rem;',
        '  width: 3rem;',
        '}',
        '',
        '[data-slot="avatar-image"][hidden],',
        '[data-slot="avatar-fallback"][hidden] {',
        '  display: none !important;',
        '}',
        '',
      ].join('\n'),
    },
  ]);

  protected readonly fallbackTailwindTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'headless-avatar-examples-fallback-tailwind.component.ts',
      code: [
        "import { Component, signal } from '@angular/core';",
        "import { TngAvatar, TngAvatarFallback, TngAvatarImage } from '@tailng-ui/primitives';",
        '',
        '@Component({',
        "  selector: 'app-headless-avatar-examples-fallback-tailwind',",
        '  standalone: true,',
        '  imports: [TngAvatar, TngAvatarImage, TngAvatarFallback],',
        "  templateUrl: './headless-avatar-examples-fallback-tailwind.component.html',",
        "  styleUrl: './headless-avatar-examples-fallback-tailwind.component.css',",
        '})',
        'export class HeadlessAvatarExamplesFallbackTailwindComponent {',
        '  protected readonly src = signal<string | null>(profileImageUrl);',
        '  protected readonly imageLoadFailed = signal(false);',
        '',
        '  protected showFallback(): boolean {',
        '    return this.src() === null || this.imageLoadFailed();',
        '  }',
        '}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'headless-avatar-examples-fallback-tailwind.component.html',
      code: [
        '<span',
        '  tngAvatar',
        '  class="relative inline-flex h-14 w-14 overflow-hidden rounded-2xl border border-[var(--tng-semantic-border-subtle)] bg-[var(--tng-semantic-background-base)] shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--tng-semantic-border-subtle)_55%,transparent)]"',
        '>',
        '  <img',
        '    tngAvatarImage',
        '    class="h-full w-full object-cover [&[hidden]]:!hidden"',
        '    [attr.src]="src()"',
        '    [attr.hidden]="showFallback() ? \'\' : null"',
        '    alt="Priya Raman"',
        '    (error)="imageLoadFailed.set(true)"',
        '    (load)="imageLoadFailed.set(false)"',
        '  />',
        '  <span',
        '    tngAvatarFallback',
        '    class="absolute inset-0 inline-flex items-center justify-center text-sm font-semibold text-[var(--tng-semantic-foreground-primary)] [&[hidden]]:!hidden"',
        '    [attr.hidden]="showFallback() ? null : \'\'"',
        '    aria-hidden="true"',
        '  >',
        '    PR',
        '  </span>',
        '</span>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'headless-avatar-examples-fallback-tailwind.component.css',
      code: '/* Tailwind utilities are applied directly in the template. */',
    },
  ]);

  protected readonly rosterPlainTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'headless-avatar-examples-roster-plain-css.component.ts',
      code: [
        "import { Component } from '@angular/core';",
        "import { TngAvatar, TngAvatarFallback, TngAvatarImage } from '@tailng-ui/primitives';",
        '',
        '@Component({',
        "  selector: 'app-headless-avatar-examples-roster-plain-css',",
        '  standalone: true,',
        '  imports: [TngAvatar, TngAvatarImage, TngAvatarFallback],',
        "  templateUrl: './headless-avatar-examples-roster-plain-css.component.html',",
        "  styleUrl: './headless-avatar-examples-roster-plain-css.component.css',",
        '})',
        'export class HeadlessAvatarExamplesRosterPlainCssComponent {}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'headless-avatar-examples-roster-plain-css.component.html',
      code: [
        '<div class="headless-avatar-roster" aria-label="Decorative reviewer avatars">',
        '  <span tngAvatar class="headless-avatar-host"><img tngAvatarImage [attr.src]="sampleImage" alt="" class="headless-avatar-image" /><span tngAvatarFallback [attr.hidden]="\'\'" class="headless-avatar-fallback" aria-hidden="true">AL</span></span>',
        '  <span tngAvatar class="headless-avatar-host"><img tngAvatarImage [attr.hidden]="\'\'" alt="" class="headless-avatar-image" /><span tngAvatarFallback class="headless-avatar-fallback" aria-hidden="true">TN</span></span>',
        '  <span tngAvatar class="headless-avatar-host headless-avatar-host--square"><img tngAvatarImage [attr.src]="sampleImage" alt="" class="headless-avatar-image" /><span tngAvatarFallback [attr.hidden]="\'\'" class="headless-avatar-fallback" aria-hidden="true">SQ</span></span>',
        '</div>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'headless-avatar-examples-roster-plain-css.component.css',
      code: [
        '.headless-avatar-roster {',
        '  display: flex;',
        '  flex-wrap: wrap;',
        '  gap: 0.75rem;',
        '}',
        '',
      ].join('\n'),
    },
  ]);

  protected readonly rosterTailwindTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'headless-avatar-examples-roster-tailwind.component.ts',
      code: [
        "import { Component } from '@angular/core';",
        "import { TngAvatar, TngAvatarFallback, TngAvatarImage } from '@tailng-ui/primitives';",
        '',
        '@Component({',
        "  selector: 'app-headless-avatar-examples-roster-tailwind',",
        '  standalone: true,',
        '  imports: [TngAvatar, TngAvatarImage, TngAvatarFallback],',
        "  templateUrl: './headless-avatar-examples-roster-tailwind.component.html',",
        "  styleUrl: './headless-avatar-examples-roster-tailwind.component.css',",
        '})',
        'export class HeadlessAvatarExamplesRosterTailwindComponent {}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'headless-avatar-examples-roster-tailwind.component.html',
      code: [
        '<div class="flex flex-wrap items-center gap-3 rounded-2xl border border-[var(--tng-semantic-border-subtle)] bg-[color-mix(in_srgb,var(--tng-semantic-background-surface)_88%,transparent)] p-4">',
        '  <span tngAvatar class="relative inline-flex h-12 w-12 overflow-hidden rounded-full border border-[var(--tng-semantic-border-subtle)] bg-[var(--tng-semantic-background-base)] shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--tng-semantic-border-subtle)_55%,transparent)]"><img tngAvatarImage [attr.src]="sampleImage" alt="" class="h-full w-full object-cover [&[hidden]]:!hidden" /><span tngAvatarFallback [attr.hidden]="\'\'" class="absolute inset-0 inline-flex items-center justify-center text-sm font-semibold text-[var(--tng-semantic-foreground-primary)] [&[hidden]]:!hidden" aria-hidden="true">AL</span></span>',
        '  <span tngAvatar class="relative inline-flex h-10 w-10 overflow-hidden rounded-full border border-[var(--tng-semantic-border-subtle)] bg-[var(--tng-semantic-background-base)] shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--tng-semantic-border-subtle)_55%,transparent)]"><img tngAvatarImage [attr.hidden]="\'\'" alt="" class="h-full w-full object-cover [&[hidden]]:!hidden" /><span tngAvatarFallback class="absolute inset-0 inline-flex items-center justify-center text-xs font-semibold text-[var(--tng-semantic-foreground-primary)] [&[hidden]]:!hidden" aria-hidden="true">TN</span></span>',
        '  <span tngAvatar class="relative inline-flex h-10 w-10 overflow-hidden rounded-xl border border-[var(--tng-semantic-border-subtle)] bg-[var(--tng-semantic-background-base)] shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--tng-semantic-border-subtle)_55%,transparent)]"><img tngAvatarImage [attr.src]="sampleImage" alt="" class="h-full w-full object-cover [&[hidden]]:!hidden" /><span tngAvatarFallback [attr.hidden]="\'\'" class="absolute inset-0 inline-flex items-center justify-center text-xs font-semibold text-[var(--tng-semantic-foreground-primary)] [&[hidden]]:!hidden" aria-hidden="true">SQ</span></span>',
        '</div>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'headless-avatar-examples-roster-tailwind.component.css',
      code: '/* Tailwind utilities are applied directly in the template. */',
    },
  ]);

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }

  protected modeFor(scope: 'plain' | 'tailwind'): AvatarSourceMode {
    return this.fallbackMode()[scope];
  }

  protected srcFor(scope: 'plain' | 'tailwind'): string | null {
    return this.fallbackSrc()[scope];
  }

  protected showFallback(scope: 'plain' | 'tailwind'): boolean {
    const src = this.fallbackSrc()[scope];
    const failed = this.fallbackLoadFailed()[scope];
    return src === null || failed;
  }

  protected setFallbackSource(scope: 'plain' | 'tailwind', mode: AvatarSourceMode): void {
    const value =
      mode === 'valid' ? this.sampleImage : mode === 'broken' ? this.brokenImage : null;

    this.fallbackMode.update((current) => ({ ...current, [scope]: mode }));
    this.fallbackLoadFailed.update((current) => ({ ...current, [scope]: false }));
    this.fallbackSrc.update((current) => ({ ...current, [scope]: value }));
  }

  protected onFallbackError(scope: 'plain' | 'tailwind'): void {
    this.fallbackLoadFailed.update((current) => ({ ...current, [scope]: true }));
  }

  protected onFallbackLoad(scope: 'plain' | 'tailwind'): void {
    this.fallbackLoadFailed.update((current) => ({ ...current, [scope]: false }));
  }
}
