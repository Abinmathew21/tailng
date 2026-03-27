import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { observeDocsCodeThemeChanges, resolveDocsCodeBlockTheme } from '../../../../../../shared/util';
import { TngAvatarComponent } from '@tailng-ui/components';
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

@Component({
  selector: 'app-avatar-examples-page',
  imports: [
    TngAvatar,
    TngAvatarImage,
    TngAvatarFallback,
    TngAvatarComponent,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './avatar-examples-page.component.html',
  styleUrl: './avatar-examples-page.component.css',
})
export class AvatarExamplesPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(this.documentRef, this.codeBlockTheme);

  protected readonly sampleImage = `data:image/svg+xml,${encodeURIComponent(
    "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><defs><linearGradient id='avatar-g' x1='0' x2='1' y1='0' y2='1'><stop offset='0%' stop-color='%2360a5fa'/><stop offset='100%' stop-color='%232563eb'/></linearGradient></defs><rect width='100' height='100' fill='url(%23avatar-g)'/><circle cx='50' cy='40' r='20' fill='%23cbd5e1'/><rect x='22' y='64' width='56' height='24' rx='12' fill='%23cbd5e1'/></svg>",
  )}`;

  protected readonly rosterHeadlessTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'avatar-roster-headless.component.ts',
      code: [
        "import { Component } from '@angular/core';",
        "import { TngAvatar, TngAvatarImage, TngAvatarFallback } from '@tailng-ui/primitives';",
        '',
        'export class AvatarRosterHeadlessComponent {}',
        '',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'avatar-roster-headless.component.html',
      code: [
        '<div class="avatar-roster">',
        '  <span tngAvatar><img tngAvatarImage [attr.src]="sampleImage" alt="Alex" /><span tngAvatarFallback [attr.hidden]="\'\'">AL</span></span>',
        '  <span tngAvatar><img tngAvatarImage [attr.hidden]="\'\'" alt="" /><span tngAvatarFallback>TN</span></span>',
        '</div>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'avatar-roster-headless.component.css',
      code: [
        '.avatar-roster {',
        '  display: flex;',
        '  flex-wrap: wrap;',
        '  gap: 0.75rem;',
        '}',
        '',
      ].join('\n'),
    },
  ]);

  protected readonly rosterPlainTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'avatar-roster-plain.component.ts',
      code: [
        "import { Component } from '@angular/core';",
        "import { TngAvatarComponent } from '@tailng-ui/components';",
        '',
        'export class AvatarRosterPlainComponent {}',
        '',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'avatar-roster-plain.component.html',
      code: [
        '<div class="avatar-roster">',
        '  <tng-avatar [src]="sampleImage" fallback="Alex"></tng-avatar>',
        '  <tng-avatar [src]="null" fallback="Tail Ng"></tng-avatar>',
        '  <tng-avatar [src]="sampleImage" fallback="Square" shape="square"></tng-avatar>',
        '</div>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'avatar-roster-plain.component.css',
      code: [
        '.avatar-roster {',
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
      title: 'avatar-roster-tailwind.component.ts',
      code: [
        "import { Component } from '@angular/core';",
        "import { TngAvatarComponent } from '@tailng-ui/components';",
        '',
        'export class AvatarRosterTailwindComponent {}',
        '',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'avatar-roster-tailwind.component.html',
      code: [
        '<div class="flex flex-wrap items-center gap-3 rounded-xl border border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">',
        '  <tng-avatar [src]="sampleImage" fallback="Alex" size="lg"></tng-avatar>',
        '  <tng-avatar [src]="null" fallback="TN"></tng-avatar>',
        '  <tng-avatar [src]="sampleImage" fallback="SQ" shape="square" size="sm"></tng-avatar>',
        '</div>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'avatar-roster-tailwind.component.css',
      code: '/* Tailwind utilities are applied directly in the template. */',
    },
  ]);

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }

}
