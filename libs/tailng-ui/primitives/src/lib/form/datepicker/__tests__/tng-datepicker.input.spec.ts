import { afterEach, describe, expect, it } from 'vitest';
import {
  cleanupDom,
  collectEvents,
  createController,
  createSlashInputAdapter,
  dateKey,
} from './tng-datepicker.test-helpers';

afterEach(() => {
  cleanupDom();
});

describe('tng-datepicker editable input contract', () => {
  it('keeps input text synchronized when the current value is set programmatically', () => {
    const controller = createController();

    controller.setValue('2024-04-22');
    expect(dateKey(controller.getOutputs().value as Date)).toBe('2024-04-22');
    expect(controller.getOutputs().inputText).toBe('04-22-2024');

    controller.setValue('2024-09-14');
    expect(dateKey(controller.getOutputs().value as Date)).toBe('2024-09-14');
    expect(controller.getOutputs().inputText).toBe('09-14-2024');
  });

  it('commits editable input back into the current value, active date, and visible month', () => {
    const controller = createController({
      value: '2024-04-22',
    });
    const events = collectEvents(controller);

    controller.setInputText('09-14-2024');

    expect(controller.getOutputs().inputText).toBe('09-14-2024');
    expect(dateKey(controller.getOutputs().value as Date)).toBe('2024-04-22');

    expect(controller.commitInputText()).toBe(true);
    expect(dateKey(controller.getOutputs().value as Date)).toBe('2024-09-14');
    expect(dateKey(controller.getOutputs().activeDate)).toBe('2024-09-14');
    expect(dateKey(controller.getOutputs().visibleMonth)).toBe('2024-09-01');
    expect(controller.getOutputs().inputText).toBe('09-14-2024');

    const lastValueChange = [...events].reverse().find((event) => event.type === 'valueChange');
    expect(lastValueChange?.type).toBe('valueChange');
    if (lastValueChange?.type === 'valueChange') {
      expect(lastValueChange.trigger).toBe('text-input');
      expect(dateKey(lastValueChange.value as Date)).toBe('2024-09-14');
    }
  });

  it('does not replace the current value on incomplete or invalid text until a valid commit succeeds', () => {
    const controller = createController({
      value: '2024-04-22',
    });

    controller.setInputText('09-14');
    expect(controller.getOutputs().inputText).toBe('09-14');
    expect(dateKey(controller.getOutputs().value as Date)).toBe('2024-04-22');
    expect(controller.commitInputText()).toBe(false);
    expect(dateKey(controller.getOutputs().value as Date)).toBe('2024-04-22');
    expect(controller.getOutputs().validationError).toBe('invalid-input');

    controller.setInputText('not-a-date');
    expect(controller.commitInputText()).toBe(false);
    expect(dateKey(controller.getOutputs().value as Date)).toBe('2024-04-22');
    expect(controller.getOutputs().validationError).toBe('invalid-input');

    controller.setInputText('09-14-2024');
    expect(controller.commitInputText()).toBe(true);
    expect(dateKey(controller.getOutputs().value as Date)).toBe('2024-09-14');
    expect(controller.getOutputs().validationError).toBeNull();
  });

  it('does not replace the current value on out-of-range text input and surfaces validationError', () => {
    const controller = createController({
      maxDate: '2026-03-31',
      value: '2024-04-22',
    });

    controller.setInputText('04-22-2027');

    expect(controller.commitInputText()).toBe(false);
    expect(dateKey(controller.getOutputs().value as Date)).toBe('2024-04-22');
    expect(dateKey(controller.getOutputs().activeDate)).toBe('2024-04-22');
    expect(controller.getOutputs().validationError).toBe('out-of-range');
  });

  it('supports immediate input-driven commits when onPartialInputCommit is enabled', () => {
    const controller = createController({
      onPartialInputCommit: true,
      value: '2024-04-22',
    });

    controller.setInputText('10-03-2024');

    expect(dateKey(controller.getOutputs().value as Date)).toBe('2024-10-03');
    expect(dateKey(controller.getOutputs().activeDate)).toBe('2024-10-03');
    expect(dateKey(controller.getOutputs().visibleMonth)).toBe('2024-10-01');
    expect(controller.getOutputs().inputText).toBe('10-03-2024');
  });

  it('uses the attached adapter to control the input display and commit format', () => {
    const controller = createController({
      adapter: createSlashInputAdapter(),
      value: '2024-04-22',
    });

    expect(controller.getOutputs().inputText).toBe('2024/04/22');

    controller.setInputText('2024/10/03');
    expect(controller.commitInputText()).toBe(true);

    expect(dateKey(controller.getOutputs().value as Date)).toBe('2024-10-03');
    expect(controller.getOutputs().inputText).toBe('2024/10/03');
  });
});
