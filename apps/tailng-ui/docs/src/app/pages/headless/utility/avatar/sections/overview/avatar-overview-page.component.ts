import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { TngAvatar, TngAvatarFallback, TngAvatarImage } from '@tailng-ui/primitives';
import { type DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';
import { observeDocsCodeThemeChanges, resolveDocsCodeBlockTheme } from '../../../../../../shared/util';

type AvatarPreviewScope = 'plain' | 'tailwind';
type AvatarSourceMode = 'broken' | 'none' | 'valid';

@Component({
  selector: 'app-headless-avatar-overview-page',
  imports: [
    TngCodeBlockComponent,
    TngAvatar,
    TngAvatarImage,
    TngAvatarFallback,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './avatar-overview-page.component.html',
  styleUrl: './avatar-overview-page.component.css',
})
export class HeadlessAvatarOverviewPageComponent implements OnDestroy {
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

  protected readonly importCode = [
    "import { TngAvatar, TngAvatarImage, TngAvatarFallback } from '@tailng-ui/primitives';",
    '',
  ].join('\n');

  protected readonly basicUsageCode = [
    '<span tngAvatar class="profile-avatar">',
    '  <img',
    '    tngAvatarImage',
    '    [attr.src]="src()"',
    '    [attr.hidden]="showFallback() ? \'\' : null"',
    '    [attr.alt]="showDecorative() ? \'\' : \'Taylor Nguyen\'"',
    '    (error)="imageLoadFailed.set(true)"',
    '    (load)="imageLoadFailed.set(false)"',
    '  />',
    '  <span',
    '    tngAvatarFallback',
    '    [attr.hidden]="showFallback() ? null : \'\'"',
    '    aria-hidden="true"',
    '  >',
    '    TN',
    '  </span>',
    '</span>',
    '',
  ].join('\n');

  protected readonly plainSrc = signal<string | null>(this.sampleImage);
  protected readonly tailwindSrc = signal<string | null>(this.sampleImage);
  protected readonly plainLoadFailed = signal(false);
  protected readonly tailwindLoadFailed = signal(false);
  protected readonly plainMode = signal<AvatarSourceMode>('valid');
  protected readonly tailwindMode = signal<AvatarSourceMode>('valid');

  protected readonly plainCssCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'headless-avatar-overview-plain-css.component.ts',
      code: [
        "import { Component, signal } from '@angular/core';",
        "import { TngAvatar, TngAvatarFallback, TngAvatarImage } from '@tailng-ui/primitives';",
        '',
        '@Component({',
        "  selector: 'app-headless-avatar-overview-plain-css',",
        '  standalone: true,',
        '  imports: [TngAvatar, TngAvatarImage, TngAvatarFallback],',
        "  templateUrl: './headless-avatar-overview-plain-css.component.html',",
        "  styleUrl: './headless-avatar-overview-plain-css.component.css',",
        '})',
        'export class HeadlessAvatarOverviewPlainCssComponent {',
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
      title: 'headless-avatar-overview-plain-css.component.html',
      code: [
        '<span tngAvatar class="headless-avatar-host" data-shape="circle" data-size="md">',
        '  <img',
        '    tngAvatarImage',
        '    class="headless-avatar-image"',
        '    [attr.src]="src()"',
        '    [attr.hidden]="showFallback() ? \'\' : null"',
        '    alt="Taylor Nguyen"',
        '    (error)="imageLoadFailed.set(true)"',
        '    (load)="imageLoadFailed.set(false)"',
        '  />',
        '  <span',
        '    tngAvatarFallback',
        '    class="headless-avatar-fallback"',
        '    [attr.hidden]="showFallback() ? null : \'\'"',
        '    aria-hidden="true"',
        '  >',
        '    TN',
        '  </span>',
        '</span>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'headless-avatar-overview-plain-css.component.css',
      code: [
        '.headless-avatar-host {',
        '  background: var(--tng-semantic-background-surface);',
        '  border: 1px solid var(--tng-semantic-border-subtle);',
        '  border-radius: 9999px;',
        '  display: inline-flex;',
        '  height: 2.75rem;',
        '  overflow: hidden;',
        '  position: relative;',
        '  width: 2.75rem;',
        '}',
        '',
      ].join('\n'),
    },
  ]);

  protected readonly tailwindCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'headless-avatar-overview-tailwind.component.ts',
      code: [
        "import { Component, signal } from '@angular/core';",
        "import { TngAvatar, TngAvatarFallback, TngAvatarImage } from '@tailng-ui/primitives';",
        '',
        '@Component({',
        "  selector: 'app-headless-avatar-overview-tailwind',",
        '  standalone: true,',
        '  imports: [TngAvatar, TngAvatarImage, TngAvatarFallback],',
        "  templateUrl: './headless-avatar-overview-tailwind.component.html',",
        "  styleUrl: './headless-avatar-overview-tailwind.component.css',",
        '})',
        'export class HeadlessAvatarOverviewTailwindComponent {',
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
      title: 'headless-avatar-overview-tailwind.component.html',
      code: [
        '<span',
        '  tngAvatar',
        '  class="relative inline-flex h-12 w-12 overflow-hidden rounded-2xl border border-[var(--tng-semantic-border-subtle)] bg-[var(--tng-semantic-background-base)] shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--tng-semantic-border-subtle)_55%,transparent)]"',
        '>',
        '  <img',
        '    tngAvatarImage',
        '    class="h-full w-full object-cover"',
        '    [attr.src]="src()"',
        '    [attr.hidden]="showFallback() ? \'\' : null"',
        '    alt="Taylor Nguyen"',
        '    (error)="imageLoadFailed.set(true)"',
        '    (load)="imageLoadFailed.set(false)"',
        '  />',
        '  <span',
        '    tngAvatarFallback',
        '    class="absolute inset-0 inline-flex items-center justify-center text-sm font-semibold text-[var(--tng-semantic-foreground-primary)]"',
        '    [attr.hidden]="showFallback() ? null : \'\'"',
        '    aria-hidden="true"',
        '  >',
        '    TN',
        '  </span>',
        '</span>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'headless-avatar-overview-tailwind.component.css',
      code: '/* Tailwind utilities are applied directly in the template. */',
    },
  ]);

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }

  protected srcFor(scope: AvatarPreviewScope): string | null {
    return scope === 'plain' ? this.plainSrc() : this.tailwindSrc();
  }

  protected modeFor(scope: AvatarPreviewScope): AvatarSourceMode {
    return scope === 'plain' ? this.plainMode() : this.tailwindMode();
  }

  protected setSource(scope: AvatarPreviewScope, mode: AvatarSourceMode): void {
    const value =
      mode === 'valid' ? this.sampleImage : mode === 'broken' ? this.brokenImage : null;

    if (scope === 'plain') {
      this.plainMode.set(mode);
      this.plainLoadFailed.set(false);
      this.plainSrc.set(value);
      return;
    }

    this.tailwindMode.set(mode);
    this.tailwindLoadFailed.set(false);
    this.tailwindSrc.set(value);
  }

  protected onImageError(scope: AvatarPreviewScope): void {
    if (scope === 'plain') {
      this.plainLoadFailed.set(true);
      return;
    }

    this.tailwindLoadFailed.set(true);
  }

  protected onImageLoad(scope: AvatarPreviewScope): void {
    if (scope === 'plain') {
      this.plainLoadFailed.set(false);
      return;
    }

    this.tailwindLoadFailed.set(false);
  }

  protected showFallback(scope: AvatarPreviewScope): boolean {
    if (scope === 'plain') {
      return this.plainSrc() === null || this.plainLoadFailed();
    }

    return this.tailwindSrc() === null || this.tailwindLoadFailed();
  }
}
