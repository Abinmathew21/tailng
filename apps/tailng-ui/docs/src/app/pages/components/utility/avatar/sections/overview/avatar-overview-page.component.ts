import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { observeDocsCodeThemeChanges, resolveDocsCodeBlockTheme } from '../../../../../../shared/util';
import { TngAvatarComponent, TngCodeBlockComponent } from '@tailng-ui/components';
import {
  TngAvatar,
  TngAvatarFallback,
  TngAvatarImage,
} from '@tailng-ui/primitives';
import { type DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';

type AvatarPreviewScope = 'headless' | 'plain' | 'tailwind';
type AvatarSourceMode = 'valid' | 'broken' | 'none';

@Component({
  selector: 'app-avatar-overview-page',
  imports: [
    TngAvatar,
    TngAvatarImage,
    TngAvatarFallback,
    TngAvatarComponent,
    TngCodeBlockComponent,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './avatar-overview-page.component.html',
  styleUrl: './avatar-overview-page.component.css',
})
export class AvatarOverviewPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(this.documentRef, this.codeBlockTheme);

  protected readonly sampleImage = `data:image/svg+xml,${encodeURIComponent(
    "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><defs><linearGradient id='avatar-g' x1='0' x2='1' y1='0' y2='1'><stop offset='0%' stop-color='%2360a5fa'/><stop offset='100%' stop-color='%232563eb'/></linearGradient></defs><rect width='100' height='100' fill='url(%23avatar-g)'/><circle cx='50' cy='40' r='20' fill='%23cbd5e1'/><rect x='22' y='64' width='56' height='24' rx='12' fill='%23cbd5e1'/></svg>",
  )}`;

  protected readonly primitiveImportCode =
    "import { TngAvatar, TngAvatarImage, TngAvatarFallback } from '@tailng-ui/primitives';";
  protected readonly componentImportCode =
    "import { TngAvatarComponent } from '@tailng-ui/components';";

  protected readonly primitiveUsageCode = [
    '<span tngAvatar>',
    '  <img',
    '    tngAvatarImage',
    '    [attr.src]="src()"',
    '    [attr.hidden]="showFallback() ? \"\" : null"',
    '    (load)="onLoad()"',
    '    (error)="onError()"',
    '  />',
    '  <span tngAvatarFallback [attr.hidden]="showFallback() ? null : \"\"">',
    '    TN',
    '  </span>',
    '</span>',
    '',
  ].join('\n');

  protected readonly componentUsageCode = [
    '<tng-avatar',
    '  [src]="profileUrl()"',
    '  fallback="Tail Ng"',
    '  shape="circle"',
    '  size="md"',
    '></tng-avatar>',
    '',
  ].join('\n');

  protected readonly headlessSrc = signal<string | null>(this.sampleImage);
  protected readonly plainSrc = signal<string | null>(this.sampleImage);
  protected readonly tailwindSrc = signal<string | null>(this.sampleImage);

  protected readonly headlessMode = signal<AvatarSourceMode>('valid');
  protected readonly plainMode = signal<AvatarSourceMode>('valid');
  protected readonly tailwindMode = signal<AvatarSourceMode>('valid');

  protected readonly headlessLoadFailed = signal(false);
  private readonly brokenImage = 'broken://avatar';

  protected readonly headlessCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'avatar-overview-headless.component.ts',
      code: [
        "import { Component, signal } from '@angular/core';",
        "import { TngAvatar, TngAvatarImage, TngAvatarFallback } from '@tailng-ui/primitives';",
        '',
        'export class AvatarOverviewHeadlessComponent {',
        '  protected readonly src = signal<string | null>(profileUrl);',
        '  protected readonly imageLoadFailed = signal(false);',
        '}',
        '',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'avatar-overview-headless.component.html',
      code: [
        '<span tngAvatar class="avatar-preview-headless">',
        '  <img',
        '    tngAvatarImage',
        '    [attr.src]="src()"',
        '    [attr.hidden]="showFallback() ? \"\" : null"',
        '    (load)="imageLoadFailed.set(false)"',
        '    (error)="imageLoadFailed.set(true)"',
        '  />',
        '  <span tngAvatarFallback [attr.hidden]="showFallback() ? null : \"\"">TN</span>',
        '</span>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'avatar-overview-headless.component.css',
      code: [
        '.avatar-preview-headless {',
        '  border: 1px solid var(--tng-semantic-border-subtle);',
        '  border-radius: 9999px;',
        '  height: 2.75rem;',
        '  width: 2.75rem;',
        '}',
        '',
      ].join('\n'),
    },
  ]);

  protected readonly plainCssCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'avatar-overview-plain-css.component.ts',
      code: [
        "import { Component, signal } from '@angular/core';",
        "import { TngAvatarComponent } from '@tailng-ui/components';",
        '',
        'export class AvatarOverviewPlainCssComponent {',
        '  protected readonly src = signal<string | null>(profileUrl);',
        '}',
        '',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'avatar-overview-plain-css.component.html',
      code: [
        '<div class="avatar-preview-row">',
        '  <tng-avatar [src]="src()" fallback="Tail Ng"></tng-avatar>',
        '  <tng-avatar [src]="src()" fallback="Square" shape="square"></tng-avatar>',
        '  <tng-avatar [src]="null" fallback="NI"></tng-avatar>',
        '</div>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'avatar-overview-plain-css.component.css',
      code: [
        '.avatar-preview-row {',
        '  display: flex;',
        '  flex-wrap: wrap;',
        '  gap: 0.75rem;',
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
      title: 'avatar-overview-tailwind.component.ts',
      code: [
        "import { Component, signal } from '@angular/core';",
        "import { TngAvatarComponent } from '@tailng-ui/components';",
        '',
        'export class AvatarOverviewTailwindComponent {',
        '  protected readonly src = signal<string | null>(profileUrl);',
        '}',
        '',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'avatar-overview-tailwind.component.html',
      code: [
        '<div class="flex flex-wrap items-center gap-3 rounded-xl border border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">',
        '  <tng-avatar [src]="src()" fallback="TN" size="lg"></tng-avatar>',
        '  <tng-avatar [src]="src()" fallback="SQ" shape="square"></tng-avatar>',
        '  <tng-avatar [src]="null" fallback="NA" size="sm"></tng-avatar>',
        '</div>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'avatar-overview-tailwind.component.css',
      code: '/* Tailwind utilities are applied directly in the template. */',
    },
  ]);

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }

  protected srcFor(scope: AvatarPreviewScope): string | null {
    if (scope === 'headless') {
      return this.headlessSrc();
    }

    if (scope === 'plain') {
      return this.plainSrc();
    }

    return this.tailwindSrc();
  }

  protected setSource(scope: AvatarPreviewScope, mode: AvatarSourceMode): void {
    const value =
      mode === 'valid' ? this.sampleImage : mode === 'broken' ? this.brokenImage : null;

    if (scope === 'headless') {
      this.headlessMode.set(mode);
      this.headlessLoadFailed.set(false);
      this.headlessSrc.set(value);
      return;
    }

    if (scope === 'plain') {
      this.plainMode.set(mode);
      this.plainSrc.set(value);
      return;
    }

    this.tailwindMode.set(mode);
    this.tailwindSrc.set(value);
  }

  protected headlessDisplayState(): 'fallback' | 'image' {
    return this.showFallback() ? 'fallback' : 'image';
  }

  protected plainDisplayState(): AvatarSourceMode {
    return this.plainMode();
  }

  protected tailwindDisplayState(): AvatarSourceMode {
    return this.tailwindMode();
  }

  protected onHeadlessImageError(): void {
    this.headlessLoadFailed.set(true);
  }

  protected onHeadlessImageLoad(): void {
    this.headlessLoadFailed.set(false);
  }

  protected showFallback(): boolean {
    return this.headlessSrc() === null || this.headlessLoadFailed();
  }

}
