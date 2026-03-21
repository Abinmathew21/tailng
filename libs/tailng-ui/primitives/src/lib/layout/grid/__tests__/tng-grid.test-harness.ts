import { Component } from '@angular/core';
import { TestBed, type ComponentFixture } from '@angular/core/testing';
import type { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import {
  TngGrid,
  TngGridCell,
  type TngGridActivateEvent,
  type TngGridCellValue,
  type TngGridFocusChangeEvent,
  TngGridRow,
} from '../tng-grid';

@Component({
  standalone: true,
  imports: [TngGrid, TngGridRow, TngGridCell],
  template: `
    <div
      tngGrid
      [ariaLabel]="ariaLabel"
      [ariaColcount]="ariaColcount"
      [ariaRowcount]="ariaRowcount"
      [dir]="dir"
      [focusRow]="focusRow"
      [focusCol]="focusCol"
      [selectionMode]="selectionMode"
      [value]="value"
      [defaultValue]="defaultValue"
      [wrap]="wrap"
      (focusRowChange)="focusRowChanges.push($event)"
      (focusColChange)="focusColChanges.push($event)"
      (focusChange)="focusEvents.push($event)"
      (valueChange)="valueChanges.push($event)"
      (cellActivate)="activateEvents.push($event)"
      data-testid="grid"
    >
      <div tngGridRow data-testid="row-0">
        <button
          type="button"
          tngGridCell
          data-testid="cell-0-0"
          cellRole="columnheader"
          [rowIndex]="0"
          [colIndex]="0"
        >
          Header
        </button>
        <button
          type="button"
          tngGridCell
          data-testid="cell-0-1"
          [disabled]="disableCell01"
          [rowIndex]="0"
          [colIndex]="1"
        >
          Alpha
        </button>
        <button
          type="button"
          tngGridCell
          data-testid="cell-0-2"
          [rowIndex]="0"
          [colIndex]="2"
        >
          Beta
        </button>
      </div>

      <div tngGridRow data-testid="row-1">
        <button
          type="button"
          tngGridCell
          data-testid="cell-1-0"
          [rowIndex]="1"
          [colIndex]="0"
        >
          Gamma
        </button>
        <button
          type="button"
          tngGridCell
          data-testid="cell-1-1"
          [rowIndex]="1"
          [colIndex]="1"
          [rowSpan]="2"
          [colSpan]="2"
        >
          Delta
        </button>
        <button
          type="button"
          tngGridCell
          data-testid="cell-1-2"
          [rowIndex]="1"
          [colIndex]="2"
        >
          Epsilon
        </button>
      </div>

      <div tngGridRow data-testid="row-2">
        <button
          type="button"
          tngGridCell
          data-testid="cell-2-0"
          [rowIndex]="2"
          [colIndex]="0"
        >
          Zeta
        </button>
        <button
          type="button"
          tngGridCell
          data-testid="cell-2-1"
          [rowIndex]="2"
          [colIndex]="1"
        >
          Eta
        </button>
        <button
          type="button"
          tngGridCell
          data-testid="cell-2-2"
          [rowIndex]="2"
          [colIndex]="2"
        >
          Theta
        </button>
      </div>
    </div>

    <button type="button" data-testid="outside-button">Outside</button>
  `,
})
export class GridHarnessComponent {
  public ariaLabel = 'Harness grid';
  public ariaColcount: number | null = null;
  public ariaRowcount: number | null = null;
  public dir: 'ltr' | 'rtl' = 'ltr';
  public focusRow: number | null | undefined = undefined;
  public focusCol: number | null | undefined = undefined;
  public selectionMode: 'none' | 'single' = 'none';
  public value: TngGridCellValue | null | undefined = undefined;
  public defaultValue: TngGridCellValue | null | undefined = undefined;
  public wrap = false;
  public disableCell01 = true;

  public readonly focusRowChanges: Array<number | null> = [];
  public readonly focusColChanges: Array<number | null> = [];
  public readonly focusEvents: TngGridFocusChangeEvent[] = [];
  public readonly valueChanges: Array<TngGridCellValue | null> = [];
  public readonly activateEvents: TngGridActivateEvent[] = [];
}

export async function createGridHarnessFixture(
  overrides: Partial<GridHarnessComponent> = {},
): Promise<ComponentFixture<GridHarnessComponent>> {
  await TestBed.configureTestingModule({
    imports: [GridHarnessComponent],
  }).compileComponents();

  const fixture = TestBed.createComponent(GridHarnessComponent);
  Object.assign(fixture.componentInstance, overrides);
  fixture.detectChanges();
  return fixture;
}

export function dispatchGridKeydown(
  element: HTMLElement,
  key: string,
  init: KeyboardEventInit = {},
): KeyboardEvent {
  const event = new KeyboardEvent('keydown', {
    bubbles: true,
    cancelable: true,
    key,
    ...init,
  });
  element.dispatchEvent(event);
  return event;
}

export function getGrid(fixture: ComponentFixture<GridHarnessComponent>): HTMLElement {
  return queryByTestId(fixture, 'grid');
}

export function getOutsideButton(fixture: ComponentFixture<GridHarnessComponent>): HTMLButtonElement {
  return queryByTestId(fixture, 'outside-button') as HTMLButtonElement;
}

export function getCell(
  fixture: ComponentFixture<GridHarnessComponent>,
  row: number,
  col: number,
): HTMLButtonElement {
  return queryByTestId(fixture, `cell-${row}-${col}`) as HTMLButtonElement;
}

export function getRow(
  fixture: ComponentFixture<GridHarnessComponent>,
  row: number,
): HTMLElement {
  return queryByTestId(fixture, `row-${row}`);
}

export function getCellDebugElement(
  fixture: ComponentFixture<GridHarnessComponent>,
  row: number,
  col: number,
): DebugElement {
  const de = fixture.debugElement.query(By.css(`[data-testid="cell-${row}-${col}"]`));
  if (de === null) {
    throw new Error(`Missing cell ${row}:${col}`);
  }

  return de;
}

function queryByTestId(
  fixture: ComponentFixture<GridHarnessComponent>,
  testId: string,
): HTMLElement {
  const hostElement = fixture.nativeElement as HTMLElement;
  const element = hostElement.querySelector<HTMLElement>(`[data-testid="${testId}"]`);
  if (element === null) {
    throw new Error(`Missing element with data-testid="${testId}"`);
  }

  return element;
}
