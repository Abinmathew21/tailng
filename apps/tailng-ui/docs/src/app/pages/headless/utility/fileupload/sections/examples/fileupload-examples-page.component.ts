import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import {
  TngFileUploadDirective,
  type TngFileUploadDragState,
  type TngFileUploadRejectedEvent,
  type TngFileUploadSelectedEvent,
} from '@tailng-ui/primitives';
import { type DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';
import { observeDocsCodeThemeChanges, resolveDocsCodeBlockTheme } from '../../../../../../shared/util';

type FileUploadExampleId = 'basic' | 'accept' | 'size' | 'disabled';

type FileUploadExampleResult = {
  readonly accepted: readonly string[];
  readonly rejected: readonly string[];
  readonly drag: TngFileUploadDragState;
};

const emptyResult: FileUploadExampleResult = Object.freeze({
  accepted: [],
  rejected: [],
  drag: 'idle',
});

@Component({
  selector: 'app-headless-fileupload-examples-page',
  imports: [TngFileUploadDirective, DocsExampleTabsSectionComponent, DocsExampleVariantDirective],
  templateUrl: './fileupload-examples-page.component.html',
  styleUrl: './fileupload-examples-page.component.css',
})
export class HeadlessFileuploadExamplesPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);
  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly maxSizeBytes = 1024 * 1024;

  private readonly results = signal<Record<FileUploadExampleId, FileUploadExampleResult>>({
    basic: emptyResult,
    accept: emptyResult,
    size: emptyResult,
    disabled: emptyResult,
  });

  protected readonly basicTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'fileupload-basic.component.ts',
      code: [
        "import { Component, signal } from '@angular/core';",
        "import { TngFileUploadDirective, type TngFileUploadSelectedEvent } from '@tailng-ui/primitives';",
        '',
        '@Component({',
        "  selector: 'app-fileupload-basic',",
        '  standalone: true,',
        '  imports: [TngFileUploadDirective],',
        "  templateUrl: './fileupload-basic.component.html',",
        "  styleUrl: './fileupload-basic.component.css',",
        '})',
        'export class FileuploadBasicComponent {',
        '  protected readonly selected = signal<readonly string[]>([]);',
        '',
        '  protected onFilesSelected(event: TngFileUploadSelectedEvent): void {',
        '    this.selected.set(event.files.map((file) => file.name));',
        '  }',
        '}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'fileupload-basic.component.html',
      code: [
        '<div',
        '  tngFileUpload',
        '  class="dropzone"',
        '  (filesSelected)="onFilesSelected($event)"',
        '>',
        '  <p>Drop a single file here.</p>',
        '</div>',
        '',
        '@for (name of selected(); track name) {',
        '  <p>{{ name }}</p>',
        '}',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'fileupload-basic.component.css',
      code: [
        '.dropzone {',
        '  border: 2px dashed var(--tng-semantic-border-strong);',
        '  border-radius: 0.85rem;',
        '  padding: 1.5rem;',
        '  text-align: center;',
        '}',
        '',
        '.dropzone[data-dragging] {',
        '  border-color: var(--tng-semantic-accent-brand);',
        '}',
        '',
      ].join('\n'),
    },
  ]);

  protected readonly acceptTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'fileupload-accept.component.ts',
      code: [
        "import { Component, signal } from '@angular/core';",
        'import {',
        '  TngFileUploadDirective,',
        '  type TngFileUploadRejectedEvent,',
        '  type TngFileUploadSelectedEvent,',
        "} from '@tailng-ui/primitives';",
        '',
        '@Component({',
        "  selector: 'app-fileupload-accept',",
        '  standalone: true,',
        '  imports: [TngFileUploadDirective],',
        "  templateUrl: './fileupload-accept.component.html',",
        '})',
        'export class FileuploadAcceptComponent {',
        '  protected readonly accepted = signal<readonly string[]>([]);',
        '  protected readonly rejected = signal<readonly string[]>([]);',
        '',
        '  protected onFilesSelected(event: TngFileUploadSelectedEvent): void {',
        '    this.accepted.set(event.files.map((file) => file.name));',
        '  }',
        '',
        '  protected onFilesRejected(event: TngFileUploadRejectedEvent): void {',
        '    this.rejected.set(event.rejected.map((item) => `${item.file.name} — ${item.reason}`));',
        '  }',
        '}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'fileupload-accept.component.html',
      code: [
        '<div',
        '  tngFileUpload',
        '  class="dropzone"',
        '  [multiple]="true"',
        '  [accept]="\'image/*,.pdf\'"',
        '  (filesSelected)="onFilesSelected($event)"',
        '  (filesRejected)="onFilesRejected($event)"',
        '>',
        '  <p>Drop images or PDFs (multiple allowed).</p>',
        '</div>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'fileupload-accept.component.css',
      code: '/* Reuse the shared .dropzone styles. */',
    },
  ]);

  protected readonly sizeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'fileupload-size.component.ts',
      code: [
        "import { Component, signal } from '@angular/core';",
        'import {',
        '  TngFileUploadDirective,',
        '  type TngFileUploadRejectedEvent,',
        '  type TngFileUploadSelectedEvent,',
        "} from '@tailng-ui/primitives';",
        '',
        '@Component({',
        "  selector: 'app-fileupload-size',",
        '  standalone: true,',
        '  imports: [TngFileUploadDirective],',
        "  templateUrl: './fileupload-size.component.html',",
        '})',
        'export class FileuploadSizeComponent {',
        '  protected readonly maxSize = 1024 * 1024;',
        '  protected readonly accepted = signal<readonly string[]>([]);',
        '  protected readonly rejected = signal<readonly string[]>([]);',
        '',
        '  protected onFilesSelected(event: TngFileUploadSelectedEvent): void {',
        '    this.accepted.set(event.files.map((file) => file.name));',
        '  }',
        '',
        '  protected onFilesRejected(event: TngFileUploadRejectedEvent): void {',
        '    this.rejected.set(event.rejected.map((item) => item.message));',
        '  }',
        '}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'fileupload-size.component.html',
      code: [
        '<div',
        '  tngFileUpload',
        '  class="dropzone"',
        '  [multiple]="true"',
        '  [maxSize]="maxSize"',
        '  (filesSelected)="onFilesSelected($event)"',
        '  (filesRejected)="onFilesRejected($event)"',
        '>',
        '  <p>Files larger than 1 MB are rejected.</p>',
        '</div>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'fileupload-size.component.css',
      code: '/* Reuse the shared .dropzone styles. */',
    },
  ]);

  protected readonly disabledTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'fileupload-disabled.component.ts',
      code: [
        "import { Component } from '@angular/core';",
        "import { TngFileUploadDirective } from '@tailng-ui/primitives';",
        '',
        '@Component({',
        "  selector: 'app-fileupload-disabled',",
        '  standalone: true,',
        '  imports: [TngFileUploadDirective],',
        "  templateUrl: './fileupload-disabled.component.html',",
        "  styleUrl: './fileupload-disabled.component.css',",
        '})',
        'export class FileuploadDisabledComponent {}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'fileupload-disabled.component.html',
      code: [
        '<div',
        '  tngFileUpload',
        '  class="dropzone"',
        '  [disabled]="true"',
        '  (filesSelected)="onFilesSelected($event)"',
        '>',
        '  <p>This drop zone is disabled and ignores drops.</p>',
        '</div>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'fileupload-disabled.component.css',
      code: [
        '.dropzone[data-disabled] {',
        '  cursor: not-allowed;',
        '  opacity: 0.55;',
        '}',
        '',
      ].join('\n'),
    },
  ]);

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }

  protected accepted(id: FileUploadExampleId): readonly string[] {
    return this.results()[id].accepted;
  }

  protected rejected(id: FileUploadExampleId): readonly string[] {
    return this.results()[id].rejected;
  }

  protected drag(id: FileUploadExampleId): TngFileUploadDragState {
    return this.results()[id].drag;
  }

  protected onSelected(id: FileUploadExampleId, event: TngFileUploadSelectedEvent): void {
    this.patch(id, {
      accepted: event.files.map((file) => file.name),
      rejected: [],
    });
  }

  protected onRejected(id: FileUploadExampleId, event: TngFileUploadRejectedEvent): void {
    this.patch(id, {
      accepted: event.accepted.map((file) => file.name),
      rejected: event.rejected.map((item) => `${item.file.name} — ${item.reason}: ${item.message}`),
    });
  }

  protected onDrag(id: FileUploadExampleId, drag: TngFileUploadDragState): void {
    this.patch(id, { drag });
  }

  private patch(id: FileUploadExampleId, partial: Partial<FileUploadExampleResult>): void {
    this.results.update((current) => ({
      ...current,
      [id]: { ...current[id], ...partial },
    }));
  }
}
