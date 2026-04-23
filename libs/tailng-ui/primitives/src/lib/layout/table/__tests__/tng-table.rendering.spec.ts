import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it } from 'vitest';
import {
  TableRenderingHarnessComponent,
  getByTestId,
} from './tng-table.test-harness';

describe('tng-table rendering and formatting helpers', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('renders primitive string, number, and boolean values with the default renderer', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TableRenderingHarnessComponent],
    }).createComponent(TableRenderingHarnessComponent);
    fixture.detectChanges();

    expect(getByTestId<HTMLTableCellElement>(fixture, 'default-string-cell').textContent?.trim()).toBe(
      'Alpha',
    );
    expect(getByTestId<HTMLTableCellElement>(fixture, 'default-number-cell').textContent?.trim()).toBe(
      '42',
    );
    expect(getByTestId<HTMLTableCellElement>(fixture, 'default-boolean-cell').textContent?.trim()).toBe(
      'true',
    );
    expect(getByTestId<HTMLTableCellElement>(fixture, 'default-footer-cell').textContent?.trim()).toBe(
      '2',
    );
  });

  it('renders a custom cell template with row and column context', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TableRenderingHarnessComponent],
    }).createComponent(TableRenderingHarnessComponent);
    fixture.detectChanges();

    expect(getByTestId<HTMLElement>(fixture, 'custom-cell-content').textContent?.trim()).toBe(
      'alpha::status::Active',
    );
  });

  it('renders custom header and footer templates with column context', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TableRenderingHarnessComponent],
    }).createComponent(TableRenderingHarnessComponent);
    fixture.detectChanges();

    expect(getByTestId<HTMLElement>(fixture, 'custom-header-content').textContent?.trim()).toBe(
      'status::Status',
    );
    expect(getByTestId<HTMLElement>(fixture, 'custom-footer-content').textContent?.trim()).toBe(
      'summary::2::2',
    );
  });

  it('falls back to the default text renderer when a formatter throws', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TableRenderingHarnessComponent],
    }).createComponent(TableRenderingHarnessComponent);
    fixture.detectChanges();

    const errorCell = getByTestId<HTMLTableCellElement>(fixture, 'formatter-error-cell');
    const outlet = fixture.componentInstance.errorCellOutlet;

    expect(errorCell.textContent?.trim()).toBe('Active');
    expect(errorCell.querySelector('tng-table-cell-outlet')?.getAttribute('data-format-error')).toBe('');
    expect(outlet?.getFormatError()).toBeInstanceOf(Error);
  });

  it('escapes HTML by default and only renders markup when a custom template opts in', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TableRenderingHarnessComponent],
    }).createComponent(TableRenderingHarnessComponent);
    fixture.detectChanges();

    const escapedCell = getByTestId<HTMLTableCellElement>(fixture, 'html-escape-cell');
    const optInCell = getByTestId<HTMLTableCellElement>(fixture, 'html-optin-cell');

    expect(escapedCell.textContent?.trim()).toBe('<strong>Safe</strong>');
    expect(escapedCell.querySelector('strong')).toBeNull();

    expect(optInCell.querySelector('strong')?.textContent).toBe('Safe');
    expect(getByTestId<HTMLElement>(fixture, 'custom-html-content').innerHTML).toBe('<strong>Safe</strong>');
  });

  it('applies formatter output when the formatter succeeds', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TableRenderingHarnessComponent],
    }).createComponent(TableRenderingHarnessComponent);
    fixture.detectChanges();

    expect(getByTestId<HTMLTableCellElement>(fixture, 'formatted-cell').textContent?.trim()).toBe(
      'formatted:ACTIVE',
    );
  });
});
