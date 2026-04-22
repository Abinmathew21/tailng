import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngAvatarComponent, TngCodeBlockComponent } from '@tailng-ui/components';
import { type DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';
import { observeDocsCodeThemeChanges, resolveDocsCodeBlockTheme } from '../../../../../../shared/util';

type AvatarPreviewScope = 'plain' | 'tailwind';
type AvatarSourceMode = 'broken' | 'none' | 'valid';

@Component({
  selector: 'app-avatar-overview-page',
  imports: [
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
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly sampleImage = `data:image/svg+xml,${encodeURIComponent(
    "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><defs><linearGradient id='avatar-g' x1='0' x2='1' y1='0' y2='1'><stop offset='0%' stop-color='%2360a5fa'/><stop offset='100%' stop-color='%231d4ed8'/></linearGradient></defs><rect width='100' height='100' fill='url(%23avatar-g)'/><circle cx='50' cy='37' r='18' fill='%23cbd5e1'/><rect x='24' y='62' width='52' height='22' rx='11' fill='%23cbd5e1'/></svg>",
  )}`;
  private readonly brokenImage = 'broken://avatar';

  protected readonly componentImportCode = [
    "import { TngAvatarComponent } from '@tailng-ui/components';",
    '',
  ].join('\n');

  protected readonly componentUsageCode = [
    '<tng-avatar',
    '  [src]="profilePhotoUrl"',
    '  fallback="Tail Ng"',
    '  alt="Taylor Nguyen"',
    '  shape="circle"',
    '  size="md"',
    '></tng-avatar>',
    '',
  ].join('\n');

  protected readonly plainSrc = signal<string | null>(this.sampleImage);
  protected readonly tailwindSrc = signal<string | null>(this.sampleImage);
  protected readonly plainMode = signal<AvatarSourceMode>('valid');
  protected readonly tailwindMode = signal<AvatarSourceMode>('valid');

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
        '@Component({',
        "  selector: 'app-avatar-overview-plain-css',",
        '  standalone: true,',
        '  imports: [TngAvatarComponent],',
        "  templateUrl: './avatar-overview-plain-css.component.html',",
        "  styleUrl: './avatar-overview-plain-css.component.css',",
        '})',
        'export class AvatarOverviewPlainCssComponent {',
        '  protected readonly src = signal<string | null>(profileImageUrl);',
        '}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'avatar-overview-plain-css.component.html',
      code: [
        '<div class="avatar-preview-shell avatar-preview-shell--plain">',
        '  <div class="avatar-preview-row">',
        '    <tng-avatar [src]="src()" fallback="Tail Ng" alt="Taylor Nguyen"></tng-avatar>',
        '    <tng-avatar [src]="src()" fallback="Square" alt="Taylor Nguyen" shape="square"></tng-avatar>',
        '    <tng-avatar [src]="null" fallback="NI" alt=""></tng-avatar>',
        '  </div>',
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
        '@Component({',
        "  selector: 'app-avatar-overview-tailwind',",
        '  standalone: true,',
        '  imports: [TngAvatarComponent],',
        "  templateUrl: './avatar-overview-tailwind.component.html',",
        "  styleUrl: './avatar-overview-tailwind.component.css',",
        '})',
        'export class AvatarOverviewTailwindComponent {',
        '  protected readonly src = signal<string | null>(profileImageUrl);',
        '}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'avatar-overview-tailwind.component.html',
      code: [
        '<div class="rounded-2xl border border-[var(--tng-semantic-border-subtle)] bg-[color-mix(in_srgb,var(--tng-semantic-background-surface)_88%,transparent)] p-4">',
        '  <div class="flex flex-wrap items-center gap-3">',
        '    <tng-avatar [src]="src()" fallback="TN" alt="Taylor Nguyen" size="lg"></tng-avatar>',
        '    <tng-avatar [src]="src()" fallback="SQ" alt="Taylor Nguyen" shape="square"></tng-avatar>',
        '    <tng-avatar [src]="null" fallback="NA" alt="" size="sm"></tng-avatar>',
        '  </div>',
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
      this.plainSrc.set(value);
      return;
    }

    this.tailwindMode.set(mode);
    this.tailwindSrc.set(value);
  }
}
