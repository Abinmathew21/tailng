import { Component } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { type TngTreeOrientation, TngTree, TngTreeGroup, TngTreeIndicator, TngTreeItem, type TngTreeSelectionMode, type TngTreeValue } from '../index';

@Component({
  imports: [TngTree, TngTreeItem, TngTreeGroup, TngTreeIndicator],
  template: `
    <button data-testid="before" type="button">Before</button>

      <div
        data-testid="tree"
        tngTree
      [defaultValue]="defaultValue"
      [orientation]="orientation"
      [selectionMode]="selectionMode"
      [value]="value"
      (valueChange)="onValueChange($event)"
      >
      <div
        tngTreeItem
        [defaultExpanded]="rootExpanded"
        [value]="'root-a'"
        aria-label="Alpha"
        id="root-a"
      >
        <span tngTreeIndicator aria-hidden="true">▶</span>
        Root A

        <div tngTreeGroup>
          <div tngTreeItem [value]="'a-1'" aria-label="Able" id="a-1">A-1</div>
          <div
            tngTreeItem
            [disabled]="true"
            [value]="'a-2'"
            aria-label="Beta Disabled"
            id="a-2"
          >
            A-2 Disabled
          </div>
          <div tngTreeItem [value]="'a-3'" aria-label="Charlie" id="a-3">A-3</div>
        </div>
      </div>

      <div tngTreeItem [value]="'root-b'" aria-label="Beta" id="root-b">Root B</div>
    </div>

    <button data-testid="after" type="button">After</button>
  `,
})
export class TngTreeHarnessComponent {
  public readonly valueChanges: Array<TngTreeValue | readonly TngTreeValue[] | null> = [];
  public defaultValue: TngTreeValue | readonly TngTreeValue[] | null | undefined = undefined;
  public orientation: TngTreeOrientation = 'vertical';
  public rootExpanded = false;
  public selectionMode: TngTreeSelectionMode = 'none';
  public value: TngTreeValue | readonly TngTreeValue[] | null | undefined = undefined;

  public onValueChange(value: TngTreeValue | readonly TngTreeValue[] | null): void {
    this.valueChanges.push(value);
  }

  public resetValueChanges(): void {
    this.valueChanges.length = 0;
  }
}

type TreeHarnessInitialState = Partial<
  Pick<
    TngTreeHarnessComponent,
    'defaultValue' | 'orientation' | 'rootExpanded' | 'selectionMode' | 'value'
  >
>;

export function createTreeHarnessFixture(
  initialState: TreeHarnessInitialState = {},
): ComponentFixture<TngTreeHarnessComponent> {
  TestBed.configureTestingModule({
    imports: [TngTreeHarnessComponent],
  });
  const fixture = TestBed.createComponent(TngTreeHarnessComponent);
  Object.assign(fixture.componentInstance, initialState);
  fixture.detectChanges();
  return fixture;
}

export function getTreeHost(fixture: ComponentFixture<TngTreeHarnessComponent>): HTMLElement {
  const tree = fixture.nativeElement.querySelector('[data-testid="tree"]');
  if (!(tree instanceof HTMLElement)) {
    throw new Error('Expected tree host element.');
  }
  return tree;
}

export function getItem(
  fixture: ComponentFixture<TngTreeHarnessComponent>,
  id: string,
): HTMLElement {
  const element = fixture.nativeElement.querySelector(`#${id}`);
  if (!(element instanceof HTMLElement)) {
    throw new Error(`Expected tree item #${id}.`);
  }
  return element;
}

export function clickElement(element: HTMLElement): MouseEvent {
  const event = new MouseEvent('click', { bubbles: true, cancelable: true });
  element.dispatchEvent(event);
  return event;
}

export function dispatchKeydown(
  target: HTMLElement,
  key: string,
  options: Pick<KeyboardEventInit, 'shiftKey' | 'ctrlKey' | 'metaKey' | 'altKey'> = {},
): KeyboardEvent {
  const event = new KeyboardEvent('keydown', {
    bubbles: true,
    cancelable: true,
    key,
    ...options,
  });
  target.dispatchEvent(event);
  return event;
}
