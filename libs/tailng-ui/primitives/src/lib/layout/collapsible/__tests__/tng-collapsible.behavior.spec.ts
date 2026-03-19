import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it } from 'vitest';
import { TngCollapsible, TngCollapsibleContent, TngCollapsibleTrigger } from '../tng-collapsible';

function getByTestId<T extends Element>(fixture: { nativeElement: HTMLElement }, testId: string): T {
  const element = fixture.nativeElement.querySelector(`[data-testid="${testId}"]`) as T | null;
  if (element === null) {
    throw new Error(`Expected element [data-testid="${testId}"] to exist.`);
  }

  return element;
}

function keydown(element: HTMLElement, key: string): KeyboardEvent {
  const event = new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key });
  element.dispatchEvent(event);
  return event;
}

@Component({
  imports: [TngCollapsible, TngCollapsibleTrigger, TngCollapsibleContent],
  template: `
    <section tngCollapsible data-testid="root" [open]="open()" [disabled]="disabled()">
      <button
        tngCollapsibleTrigger
        data-testid="trigger"
        [open]="open()"
        [disabled]="disabled()"
        [contentId]="contentId()"
        (click)="onTriggerClick()"
        (keydown)="onTriggerKeydown($event)"
      >
        Trigger
      </button>

      <div tngCollapsibleContent data-testid="content" [id]="contentId()" [open]="open()">
        <button type="button" data-testid="content-action">Action</button>
      </div>
    </section>

    <button type="button" data-testid="after">After</button>
  `,
})
class CollapsibleHarnessComponent {
  readonly open = signal(false);
  readonly disabled = signal(false);
  readonly contentId = signal('collapsible-content-1');

  onTriggerClick(): void {
    if (this.disabled()) {
      return;
    }

    this.open.update((current) => !current);
  }

  onTriggerKeydown(event: KeyboardEvent): void {
    if (this.disabled()) {
      return;
    }

    if (event.key === 'Enter' || event.key === ' ' || event.key === 'Spacebar') {
      event.preventDefault();
      this.open.update((current) => !current);
    }
  }
}

@Component({
  imports: [TngCollapsible, TngCollapsibleTrigger, TngCollapsibleContent],
  template: `
    <section tngCollapsible data-testid="root" [open]="open()">
      <button
        tngCollapsibleTrigger
        data-testid="trigger"
        [open]="open()"
        [contentId]="'passive-content'"
      >
        Trigger
      </button>

      <div tngCollapsibleContent data-testid="content" id="passive-content" [open]="open()">
        Passive content
      </div>
    </section>
  `,
})
class PassiveCollapsibleHostComponent {
  readonly open = signal(false);
}

@Component({
  imports: [TngCollapsible, TngCollapsibleTrigger, TngCollapsibleContent],
  template: `
    <section tngCollapsible data-testid="root-default"></section>
    <section tngCollapsible data-testid="root-open-empty" open></section>
    <section tngCollapsible data-testid="root-open-false" open="false"></section>
    <section tngCollapsible data-testid="root-disabled-empty" disabled></section>
    <section tngCollapsible data-testid="root-disabled-false" disabled="false"></section>

    <button tngCollapsibleTrigger data-testid="trigger-default"></button>
    <button tngCollapsibleTrigger data-testid="trigger-open-empty" open></button>
    <button tngCollapsibleTrigger data-testid="trigger-open-false" open="false"></button>
    <button tngCollapsibleTrigger data-testid="trigger-disabled-empty" disabled></button>
    <button tngCollapsibleTrigger data-testid="trigger-disabled-false" disabled="false"></button>
    <button tngCollapsibleTrigger data-testid="trigger-content-id-whitespace" contentId="   "></button>

    <div tngCollapsibleContent data-testid="content-default"></div>
    <div tngCollapsibleContent data-testid="content-open-empty" open></div>
    <div tngCollapsibleContent data-testid="content-open-false" open="false"></div>
  `,
})
class CollapsibleCoercionHostComponent {}

describe('tng-collapsible primitive behavior integration', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  describe('rendering + semantics', () => {
    it('renders closed by default (trigger aria-expanded=false and content hidden)', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [CollapsibleHarnessComponent],
      }).createComponent(CollapsibleHarnessComponent);

      fixture.detectChanges();

      const trigger = getByTestId<HTMLButtonElement>(fixture, 'trigger');
      const content = getByTestId<HTMLElement>(fixture, 'content');

      expect(trigger.getAttribute('aria-expanded')).toBe('false');
      expect(content.getAttribute('hidden')).toBe('');
    });

    it('renders open state from bound open input', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [CollapsibleHarnessComponent],
      }).createComponent(CollapsibleHarnessComponent);

      fixture.componentInstance.open.set(true);
      fixture.detectChanges();

      const trigger = getByTestId<HTMLButtonElement>(fixture, 'trigger');
      const content = getByTestId<HTMLElement>(fixture, 'content');

      expect(trigger.getAttribute('aria-expanded')).toBe('true');
      expect(content.hasAttribute('hidden')).toBe(false);
    });

    it('renders trigger as native button type=button', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [CollapsibleHarnessComponent],
      }).createComponent(CollapsibleHarnessComponent);

      fixture.detectChanges();

      const trigger = getByTestId<HTMLButtonElement>(fixture, 'trigger');
      expect(trigger.getAttribute('type')).toBe('button');
    });

    it('links trigger aria-controls to content id', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [CollapsibleHarnessComponent],
      }).createComponent(CollapsibleHarnessComponent);

      fixture.detectChanges();

      const host = fixture.componentInstance;
      const trigger = getByTestId<HTMLButtonElement>(fixture, 'trigger');
      const content = getByTestId<HTMLElement>(fixture, 'content');

      expect(content.id).toBe(host.contentId());
      expect(trigger.getAttribute('aria-controls')).toBe(host.contentId());
    });
  });

  describe('a11y + state attributes', () => {
    it('exposes data-state on root/trigger/content for closed and open states', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [CollapsibleHarnessComponent],
      }).createComponent(CollapsibleHarnessComponent);

      fixture.detectChanges();

      const host = fixture.componentInstance;
      const root = getByTestId<HTMLElement>(fixture, 'root');
      const trigger = getByTestId<HTMLElement>(fixture, 'trigger');
      const content = getByTestId<HTMLElement>(fixture, 'content');

      expect(root.getAttribute('data-state')).toBe('closed');
      expect(trigger.getAttribute('data-state')).toBe('closed');
      expect(content.getAttribute('data-state')).toBe('closed');

      host.open.set(true);
      fixture.detectChanges();

      expect(root.getAttribute('data-state')).toBe('open');
      expect(trigger.getAttribute('data-state')).toBe('open');
      expect(content.getAttribute('data-state')).toBe('open');
    });

    it('applies disabled state via disabled attribute and data-disabled hooks', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [CollapsibleHarnessComponent],
      }).createComponent(CollapsibleHarnessComponent);

      fixture.componentInstance.disabled.set(true);
      fixture.detectChanges();

      const root = getByTestId<HTMLElement>(fixture, 'root');
      const trigger = getByTestId<HTMLButtonElement>(fixture, 'trigger');

      expect(root.getAttribute('data-disabled')).toBe('');
      expect(trigger.getAttribute('data-disabled')).toBe('');
      expect(trigger.hasAttribute('disabled')).toBe(true);
    });

    it('omits aria-controls when contentId is empty/whitespace', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [CollapsibleCoercionHostComponent],
      }).createComponent(CollapsibleCoercionHostComponent);

      fixture.detectChanges();

      const whitespaceIdTrigger = getByTestId<HTMLButtonElement>(
        fixture,
        'trigger-content-id-whitespace',
      );
      expect(whitespaceIdTrigger.getAttribute('aria-controls')).toBeNull();
    });

    it('keeps content in DOM and marks it hidden when closed', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [CollapsibleHarnessComponent],
      }).createComponent(CollapsibleHarnessComponent);

      fixture.detectChanges();

      const content = getByTestId<HTMLElement>(fixture, 'content');
      const contentAction = getByTestId<HTMLButtonElement>(fixture, 'content-action');

      expect(content).toBeTruthy();
      expect(contentAction).toBeTruthy();
      expect(content.getAttribute('hidden')).toBe('');
    });
  });

  describe('interaction', () => {
    it('click toggles open and closed', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [CollapsibleHarnessComponent],
      }).createComponent(CollapsibleHarnessComponent);

      fixture.detectChanges();

      const trigger = getByTestId<HTMLButtonElement>(fixture, 'trigger');
      const host = fixture.componentInstance;

      trigger.click();
      fixture.detectChanges();
      expect(host.open()).toBe(true);

      trigger.click();
      fixture.detectChanges();
      expect(host.open()).toBe(false);
    });

    it('Enter toggles open via keyboard interaction', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [CollapsibleHarnessComponent],
      }).createComponent(CollapsibleHarnessComponent);

      fixture.detectChanges();

      const trigger = getByTestId<HTMLButtonElement>(fixture, 'trigger');
      const host = fixture.componentInstance;

      const event = keydown(trigger, 'Enter');
      fixture.detectChanges();

      expect(event.defaultPrevented).toBe(true);
      expect(host.open()).toBe(true);
    });

    it('Space toggles open via keyboard interaction', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [CollapsibleHarnessComponent],
      }).createComponent(CollapsibleHarnessComponent);

      fixture.detectChanges();

      const trigger = getByTestId<HTMLButtonElement>(fixture, 'trigger');
      const host = fixture.componentInstance;

      const event = keydown(trigger, ' ');
      fixture.detectChanges();

      expect(event.defaultPrevented).toBe(true);
      expect(host.open()).toBe(true);
    });

    it('does not toggle when disabled (click and keyboard)', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [CollapsibleHarnessComponent],
      }).createComponent(CollapsibleHarnessComponent);

      const host = fixture.componentInstance;
      host.disabled.set(true);
      fixture.detectChanges();

      const trigger = getByTestId<HTMLButtonElement>(fixture, 'trigger');

      trigger.click();
      keydown(trigger, 'Enter');
      keydown(trigger, ' ');
      fixture.detectChanges();

      expect(host.open()).toBe(false);
      expect(trigger.getAttribute('aria-expanded')).toBe('false');
    });

    it('keeps trigger focusable and focus can move away with Tab', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [CollapsibleHarnessComponent],
      }).createComponent(CollapsibleHarnessComponent);

      fixture.detectChanges();

      const trigger = getByTestId<HTMLButtonElement>(fixture, 'trigger');
      const after = getByTestId<HTMLButtonElement>(fixture, 'after');

      trigger.focus();
      expect(document.activeElement).toBe(trigger);

      const tabEvent = keydown(trigger, 'Tab');
      if (!tabEvent.defaultPrevented) {
        after.focus();
      }

      expect(document.activeElement).toBe(after);
    });
  });

  describe('controlled/passive contract', () => {
    it('does not mutate open state by itself without host toggle wiring', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [PassiveCollapsibleHostComponent],
      }).createComponent(PassiveCollapsibleHostComponent);

      fixture.detectChanges();

      const host = fixture.componentInstance;
      const trigger = getByTestId<HTMLButtonElement>(fixture, 'trigger');
      const content = getByTestId<HTMLElement>(fixture, 'content');

      expect(host.open()).toBe(false);
      expect(content.getAttribute('hidden')).toBe('');

      trigger.click();
      fixture.detectChanges();

      expect(host.open()).toBe(false);
      expect(trigger.getAttribute('aria-expanded')).toBe('false');
      expect(content.getAttribute('hidden')).toBe('');
    });

    it('updates visual state only when host open binding changes', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [PassiveCollapsibleHostComponent],
      }).createComponent(PassiveCollapsibleHostComponent);

      fixture.detectChanges();

      const host = fixture.componentInstance;
      const trigger = getByTestId<HTMLButtonElement>(fixture, 'trigger');
      const content = getByTestId<HTMLElement>(fixture, 'content');

      host.open.set(true);
      fixture.detectChanges();

      expect(trigger.getAttribute('aria-expanded')).toBe('true');
      expect(content.hasAttribute('hidden')).toBe(false);
    });
  });

  describe('boolean coercion', () => {
    it('coerces open and disabled correctly from static attributes', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [CollapsibleCoercionHostComponent],
      }).createComponent(CollapsibleCoercionHostComponent);

      fixture.detectChanges();

      const rootDefault = getByTestId<HTMLElement>(fixture, 'root-default');
      const rootOpenEmpty = getByTestId<HTMLElement>(fixture, 'root-open-empty');
      const rootOpenFalse = getByTestId<HTMLElement>(fixture, 'root-open-false');
      const rootDisabledEmpty = getByTestId<HTMLElement>(fixture, 'root-disabled-empty');
      const rootDisabledFalse = getByTestId<HTMLElement>(fixture, 'root-disabled-false');

      expect(rootDefault.getAttribute('data-state')).toBe('closed');
      expect(rootOpenEmpty.getAttribute('data-state')).toBe('open');
      expect(rootOpenFalse.getAttribute('data-state')).toBe('closed');
      expect(rootDisabledEmpty.getAttribute('data-disabled')).toBe('');
      expect(rootDisabledFalse.getAttribute('data-disabled')).toBeNull();
    });

    it('coerces trigger open/disabled and keeps button semantics', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [CollapsibleCoercionHostComponent],
      }).createComponent(CollapsibleCoercionHostComponent);

      fixture.detectChanges();

      const triggerDefault = getByTestId<HTMLButtonElement>(fixture, 'trigger-default');
      const triggerOpenEmpty = getByTestId<HTMLButtonElement>(fixture, 'trigger-open-empty');
      const triggerOpenFalse = getByTestId<HTMLButtonElement>(fixture, 'trigger-open-false');
      const triggerDisabledEmpty = getByTestId<HTMLButtonElement>(fixture, 'trigger-disabled-empty');
      const triggerDisabledFalse = getByTestId<HTMLButtonElement>(fixture, 'trigger-disabled-false');

      expect(triggerDefault.getAttribute('type')).toBe('button');
      expect(triggerDefault.getAttribute('aria-expanded')).toBe('false');
      expect(triggerOpenEmpty.getAttribute('aria-expanded')).toBe('true');
      expect(triggerOpenFalse.getAttribute('aria-expanded')).toBe('false');
      expect(triggerDisabledEmpty.hasAttribute('disabled')).toBe(true);
      expect(triggerDisabledFalse.hasAttribute('disabled')).toBe(false);
    });

    it('coerces content open and hidden attributes correctly', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [CollapsibleCoercionHostComponent],
      }).createComponent(CollapsibleCoercionHostComponent);

      fixture.detectChanges();

      const contentDefault = getByTestId<HTMLElement>(fixture, 'content-default');
      const contentOpenEmpty = getByTestId<HTMLElement>(fixture, 'content-open-empty');
      const contentOpenFalse = getByTestId<HTMLElement>(fixture, 'content-open-false');

      expect(contentDefault.getAttribute('data-state')).toBe('closed');
      expect(contentDefault.getAttribute('hidden')).toBe('');
      expect(contentOpenEmpty.getAttribute('data-state')).toBe('open');
      expect(contentOpenEmpty.hasAttribute('hidden')).toBe(false);
      expect(contentOpenFalse.getAttribute('data-state')).toBe('closed');
      expect(contentOpenFalse.getAttribute('hidden')).toBe('');
    });
  });
});
