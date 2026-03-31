import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import {
  observeDocsCodeThemeChanges,
  resolveDocsCodeBlockTheme,
} from '../../../../../../shared/util';

@Component({
  selector: 'app-headless-checkbox-api-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './headless-checkbox-api-page.component.html',
  styleUrl: './headless-checkbox-api-page.component.css',
})
export class HeadlessCheckboxApiPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly attachmentCode = ['<input tngCheckbox />', ''].join('\n');

  protected readonly changeHandlingCode = [
    "import { Component, signal } from '@angular/core';",
    "import { TngCheckbox } from '@tailng-ui/primitives';",
    '',
    '@Component({',
    "  selector: 'app-release-flags',",
    '  imports: [TngCheckbox],',
    "  templateUrl: './release-flags.component.html',",
    '})',
    'export class ReleaseFlagsComponent {',
    '  readonly marketingOptIn = signal(false);',
    '',
    '  onMarketingOptInChange(event: Event): void {',
    '    const target = event.target;',
    '    if (!(target instanceof HTMLInputElement)) {',
    '      return;',
    '    }',
    '',
    '    this.marketingOptIn.set(target.checked);',
    '  }',
    '}',
    '',
    '<label>',
    '  <input tngCheckbox (change)="onMarketingOptInChange($event)" />',
    '  <span>Marketing release email</span>',
    '</label>',
    '',
  ].join('\n');

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
