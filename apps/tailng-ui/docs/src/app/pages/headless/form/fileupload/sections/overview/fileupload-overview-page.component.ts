import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import {
  TngFileUploadDirective,
  type TngFileUploadDragState,
  type TngFileUploadSelectedEvent,
} from '@tailng-ui/primitives';
import { type DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';
import { observeDocsCodeThemeChanges, resolveDocsCodeBlockTheme } from '../../../../../../shared/util';

@Component({
  selector: 'app-headless-fileupload-overview-page',
  imports: [
    TngCodeBlockComponent,
    TngFileUploadDirective,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './fileupload-overview-page.component.html',
  styleUrl: './fileupload-overview-page.component.css',
})
export class HeadlessFileuploadOverviewPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);
  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly plainFiles = signal<readonly string[]>([]);
  protected readonly plainDrag = signal<TngFileUploadDragState>('idle');
  protected readonly tailwindFiles = signal<readonly string[]>([]);
  protected readonly tailwindDrag = signal<TngFileUploadDragState>('idle');

  protected readonly importCode = ["import { TngFileUploadDirective } from '@tailng-ui/primitives';", ''].join(
    '\n',
  );

  protected readonly basicUsageCode = [
    '<div',
    '  tngFileUpload',
    '  [accept]="\'.png,.jpg,.pdf\'"',
    '  [multiple]="true"',
    '  (filesSelected)="onFilesSelected($event)"',
    '  (filesRejected)="onFilesRejected($event)"',
    '>',
    '  Drop files here',
    '</div>',
    '',
  ].join('\n');

  protected readonly plainCssCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'fileupload-overview-plain-css.component.ts',
      code: [
        "import { Component, signal } from '@angular/core';",
        "import { TngFileUploadDirective, type TngFileUploadSelectedEvent } from '@tailng-ui/primitives';",
        '',
        '@Component({',
        "  selector: 'app-fileupload-overview-plain-css',",
        '  standalone: true,',
        '  imports: [TngFileUploadDirective],',
        "  templateUrl: './fileupload-overview-plain-css.component.html',",
        "  styleUrl: './fileupload-overview-plain-css.component.css',",
        '})',
        'export class FileuploadOverviewPlainCssComponent {',
        '  protected readonly files = signal<readonly string[]>([]);',
        '',
        '  protected onFilesSelected(event: TngFileUploadSelectedEvent): void {',
        '    this.files.set(event.files.map((file) => file.name));',
        '  }',
        '}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'fileupload-overview-plain-css.component.html',
      code: [
        '<div',
        '  tngFileUpload',
        '  class="fileupload-zone"',
        '  [multiple]="true"',
        '  (filesSelected)="onFilesSelected($event)"',
        '>',
        '  <p>Drag files here or drop a batch.</p>',
        '</div>',
        '',
        '@if (files().length > 0) {',
        '  <ul>',
        '    @for (name of files(); track name) {',
        '      <li>{{ name }}</li>',
        '    }',
        '  </ul>',
        '}',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'fileupload-overview-plain-css.component.css',
      code: [
        '.fileupload-zone {',
        '  border: 2px dashed var(--tng-semantic-border-strong);',
        '  border-radius: 0.85rem;',
        '  padding: 1.5rem;',
        '  text-align: center;',
        '}',
        '',
        '.fileupload-zone[data-dragging] {',
        '  border-color: var(--tng-semantic-accent-brand);',
        '  background: color-mix(in srgb, var(--tng-semantic-accent-brand) 10%, transparent);',
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
      title: 'fileupload-overview-tailwind.component.ts',
      code: [
        "import { Component, signal } from '@angular/core';",
        "import { TngFileUploadDirective, type TngFileUploadSelectedEvent } from '@tailng-ui/primitives';",
        '',
        '@Component({',
        "  selector: 'app-fileupload-overview-tailwind',",
        '  standalone: true,',
        '  imports: [TngFileUploadDirective],',
        "  templateUrl: './fileupload-overview-tailwind.component.html',",
        '})',
        'export class FileuploadOverviewTailwindComponent {',
        '  protected readonly files = signal<readonly string[]>([]);',
        '',
        '  protected onFilesSelected(event: TngFileUploadSelectedEvent): void {',
        '    this.files.set(event.files.map((file) => file.name));',
        '  }',
        '}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'fileupload-overview-tailwind.component.html',
      code: [
        '<div',
        '  tngFileUpload',
        '  [multiple]="true"',
        '  (filesSelected)="onFilesSelected($event)"',
        '  class="rounded-2xl border-2 border-dashed border-[var(--tng-semantic-border-strong)] p-6 text-center data-[dragging]:border-[var(--tng-semantic-accent-brand)] data-[dragging]:bg-[color-mix(in_srgb,var(--tng-semantic-accent-brand)_10%,transparent)]"',
        '>',
        '  <p class="text-sm text-[var(--tng-semantic-foreground-secondary)]">Drag files here or drop a batch.</p>',
        '</div>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'fileupload-overview-tailwind.component.css',
      code: '/* Tailwind utilities are applied directly in the template. */',
    },
  ]);

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }

  protected onPlainSelected(event: TngFileUploadSelectedEvent): void {
    this.plainFiles.set(event.files.map((file) => file.name));
  }

  protected onTailwindSelected(event: TngFileUploadSelectedEvent): void {
    this.tailwindFiles.set(event.files.map((file) => file.name));
  }
}
