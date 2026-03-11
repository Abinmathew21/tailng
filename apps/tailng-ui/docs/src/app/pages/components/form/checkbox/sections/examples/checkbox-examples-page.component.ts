import { DOCUMENT } from '@angular/common';
import { Component, computed, inject, signal, type OnDestroy } from '@angular/core';
import { TngCheckboxComponent } from '@tailng-ui/components';
import {
  DocsExamplePanelComponent,
  type DocsExampleCodeTab,
} from '../../../../../../shared/example-panel/docs-example-panel.component';

const deploymentRows = ['build', 'security', 'monitoring'] as const;
type DeploymentRow = (typeof deploymentRows)[number];

@Component({
  selector: 'app-checkbox-examples-page',
  imports: [DocsExamplePanelComponent, TngCheckboxComponent],
  templateUrl: './checkbox-examples-page.component.html',
  styleUrl: './checkbox-examples-page.component.css',
})
export class CheckboxExamplesPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    this.resolveCodeBlockTheme(),
  );
  private readonly colorSchemeObserver = this.observeCodeThemeChanges();

  private readonly selectedRows = signal<ReadonlySet<DeploymentRow>>(new Set(['build']));
  protected readonly rows = deploymentRows;

  protected readonly allRowsChecked = computed<boolean>(
    () => this.selectedRows().size === deploymentRows.length,
  );

  protected readonly someRowsChecked = computed<boolean>(() => {
    const count = this.selectedRows().size;
    return count > 0 && count < deploymentRows.length;
  });

  protected readonly statusSummary = computed<string>(() => {
    const rows = Array.from(this.selectedRows()).join(', ');
    return rows.length > 0 ? rows : 'none';
  });

  protected readonly consentCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'release-consent-example.component.html',
      code: [
        '<tng-checkbox [checked]="true">I confirm release notes are reviewed.</tng-checkbox>',
        '<tng-checkbox [readonly]="true" [checked]="true">Legal policy accepted (readonly).</tng-checkbox>',
        '',
      ].join('\n'),
    },
  ]);

  protected readonly triStateCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'tri-state-select-all-example.component.html',
      code: [
        '<tng-checkbox',
        '  [checked]="allRowsChecked()"',
        '  [indeterminate]="someRowsChecked()"',
        '  (checkedChange)="onSelectAllChange($event)"',
        '>',
        '  Select all deployment checks',
        '</tng-checkbox>',
        '',
        '@for (row of rows; track row) {',
        '  <tng-checkbox [checked]="isRowChecked(row)" (checkedChange)="onRowChange(row, $event)">',
        '    {{ row }}',
        '  </tng-checkbox>',
        '}',
        '',
      ].join('\n'),
    },
  ]);

  protected readonly validationCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'validation-example.component.html',
      code: [
        '<tng-checkbox [invalid]="true">',
        '  Security review is required before production deploy.',
        '</tng-checkbox>',
        '',
      ].join('\n'),
    },
  ]);

  protected isRowChecked(row: DeploymentRow): boolean {
    return this.selectedRows().has(row);
  }

  protected onRowChange(row: DeploymentRow, checked: boolean): void {
    const next = new Set(this.selectedRows());
    if (checked) {
      next.add(row);
    } else {
      next.delete(row);
    }

    this.selectedRows.set(next);
  }

  protected onSelectAllChange(checked: boolean): void {
    if (checked) {
      this.selectedRows.set(new Set(deploymentRows));
      return;
    }

    this.selectedRows.set(new Set());
  }

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }

  private observeCodeThemeChanges(): MutationObserver | null {
    const mutationObserverCtor = this.documentRef.defaultView?.MutationObserver;
    if (mutationObserverCtor === undefined) {
      return null;
    }

    const observer = new mutationObserverCtor(() => {
      this.codeBlockTheme.set(this.resolveCodeBlockTheme());
    });

    observer.observe(this.documentRef.documentElement, {
      attributeFilter: ['style', 'class'],
      attributes: true,
    });

    return observer;
  }

  private resolveCodeBlockTheme(): 'github-dark' | 'github-light' {
    const root = this.documentRef.documentElement;
    const inlineColorScheme = root.style.getPropertyValue('color-scheme').trim().toLowerCase();
    if (inlineColorScheme.includes('dark')) {
      return 'github-dark';
    }

    const computedColorScheme = this.documentRef.defaultView
      ?.getComputedStyle(root)
      .getPropertyValue('color-scheme')
      .trim()
      .toLowerCase();

    return computedColorScheme?.includes('dark') ? 'github-dark' : 'github-light';
  }
}
