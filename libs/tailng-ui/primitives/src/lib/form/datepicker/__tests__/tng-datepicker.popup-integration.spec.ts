import { afterEach, describe, expect, it } from 'vitest';
import { appendFocusable, cleanupDom, collectEvents, createController, d, keyboardEvent } from './tng-datepicker.test-helpers';

afterEach(() => {
  cleanupDom();
});

describe('tng-datepicker popup integration block J', () => {
  it('J1/J2/J7/J8/J9 manage open-close state with stable event order and reasons', () => {
    const controller = createController();
    const events = collectEvents(controller);

    controller.open();
    controller.close('programmatic');
    controller.open();
    controller.close('escape');

    expect(controller.getOutputs().open).toBe(false);
    expect(events.map((event) => event.type)).toEqual([
      'openStart',
      'opened',
      'closeStart',
      'closed',
      'openStart',
      'opened',
      'closeStart',
      'closed',
    ]);
    const closeReasons = events
      .filter((event) => event.type === 'closed')
      .map((event) => event.reason);
    expect(closeReasons).toEqual(['programmatic', 'escape']);
  });

  it('J3/J4 close on outside pointerdown only when closeOnOutsideClick=true', () => {
    const trigger = appendFocusable('button');
    const overlay = document.createElement('div');
    document.body.append(trigger, overlay);

    const closable = createController({
      ownerDocument: document,
    });
    closable.registerTrigger(trigger);
    closable.registerOverlay(overlay);
    closable.open();
    document.body.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(closable.getOutputs().open).toBe(true);
    document.body.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true }));
    expect(closable.getOutputs().open).toBe(false);

    const sticky = createController({
      closeOnOutsideClick: false,
      ownerDocument: document,
    });
    sticky.registerTrigger(trigger);
    sticky.registerOverlay(overlay);
    sticky.open();
    document.body.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true }));
    expect(sticky.getOutputs().open).toBe(true);
  });

  it('J5/J6 compute overlay layout differently for overlay and push modes', () => {
    const overlayController = createController({
      overlayMode: 'overlay',
    });
    overlayController.open();
    expect(overlayController.getOutputs().layout).toMatchObject({
      mode: 'overlay',
      offsetX: 0,
      width: 0,
    });

    const pushController = createController({
      overlayMode: 'push',
      overlaySize: 280,
      position: 'start',
    });
    pushController.open();
    expect(pushController.getOutputs().layout).toMatchObject({
      mode: 'push',
      offsetX: 280,
      width: 280,
    });
  });

  it('J10 closes other open datepickers when closeOthersOnOpen=true', () => {
    const first = createController({
      closeOthersOnOpen: true,
    });
    const second = createController({
      closeOthersOnOpen: true,
    });

    first.open();
    expect(first.getOutputs().open).toBe(true);
    second.open();
    expect(first.getOutputs().open).toBe(false);
    expect(second.getOutputs().open).toBe(true);
  });

  it('J11 focuses the active calendar target when the overlay is registered and opened', () => {
    const trigger = appendFocusable('button');
    trigger.focus();

    const overlay = document.createElement('div');
    document.body.append(overlay);

    const controller = createController({
      ownerDocument: document,
      value: '2024-04-22',
    });
    controller.registerTrigger(trigger);

    const activeCellId = controller.getOutputs().cells.find((cell) => cell.active)?.id;
    expect(activeCellId).toBeTruthy();

    const activeCell = appendFocusable('button');
    activeCell.id = activeCellId as string;
    overlay.appendChild(activeCell);

    controller.registerOverlay(overlay);
    controller.open();

    expect(document.activeElement).toBe(activeCell);
  });

  it('J12 traps Tab within the popup when trapFocus=true', () => {
    const trigger = appendFocusable('button');
    const overlay = document.createElement('div');
    document.body.append(trigger, overlay);

    const controller = createController({
      ownerDocument: document,
      trapFocus: true,
      value: '2024-04-22',
    });
    controller.registerTrigger(trigger);

    const firstAction = appendFocusable('button');
    overlay.appendChild(firstAction);

    const activeCellId = controller.getOutputs().cells.find((cell) => cell.active)?.id;
    expect(activeCellId).toBeTruthy();

    const activeCell = appendFocusable('button');
    activeCell.id = activeCellId as string;
    overlay.appendChild(activeCell);

    const lastAction = appendFocusable('button');
    overlay.appendChild(lastAction);

    controller.registerOverlay(overlay);
    controller.open();

    lastAction.focus();
    const tabEvent = keyboardEvent('Tab');
    controller.handleOverlayKeyDown(tabEvent);

    expect(tabEvent.preventDefault).toHaveBeenCalled();
    expect(document.activeElement).toBe(firstAction);

    firstAction.focus();
    const shiftTabEvent = keyboardEvent('Tab', { shiftKey: true });
    controller.handleOverlayKeyDown(shiftTabEvent);

    expect(shiftTabEvent.preventDefault).toHaveBeenCalled();
    expect(document.activeElement).toBe(lastAction);
    expect(controller.getOutputs().getOverlayAttributes()['aria-modal']).toBe('true');
  });
});
