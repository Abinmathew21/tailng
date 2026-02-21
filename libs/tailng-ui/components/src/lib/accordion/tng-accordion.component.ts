import { booleanAttribute, Component, effect, ElementRef, inject, input, signal } from '@angular/core';
import { createDisclosureController } from '@tailng-ui/cdk';
import { createTngIdFactory } from '@tailng-ui/cdk/core';
import { TngAccordion as TngAccordionPrimitive } from '@tailng-ui/primitives';

const accordionIdFactory = createTngIdFactory('tng-accordion-panel');
const accordionTriggerIdFactory = createTngIdFactory('tng-accordion-trigger');
const accordionTriggerSelector = '[data-tng-accordion-trigger]';
const accordionNavigationKeys = new Set(['ArrowDown', 'ArrowUp', 'Home', 'End']);

type TngAccordionTriggerElement = HTMLButtonElement;
type TngAccordionGroupRoot = Document | Element;

function hasModifierKey(event: Readonly<Pick<KeyboardEvent, 'altKey' | 'ctrlKey' | 'metaKey'>>): boolean {
  return event.altKey || event.ctrlKey || event.metaKey;
}

function isAccordionGroupRoot(value: unknown): value is TngAccordionGroupRoot {
  return value instanceof Document || value instanceof Element;
}

function isEnabledAccordionTrigger(value: unknown): value is TngAccordionTriggerElement {
  return value instanceof HTMLButtonElement && !value.disabled;
}

function resolveAccordionTrigger(eventTarget: unknown): TngAccordionTriggerElement | null {
  if (eventTarget instanceof HTMLButtonElement) {
    return eventTarget;
  }

  return null;
}

function getAccordionGroupRoot(host: unknown): TngAccordionGroupRoot | null {
  if (!(host instanceof HTMLElement)) {
    return null;
  }

  const explicitGroup = host.closest('[data-tng-accordion-group]');
  if (explicitGroup !== null) {
    return explicitGroup;
  }

  return host.parentElement ?? host.ownerDocument;
}

export function getEnabledAccordionTriggers(groupRoot: unknown): readonly TngAccordionTriggerElement[] {
  if (!isAccordionGroupRoot(groupRoot)) {
    return [];
  }

  return Array.from(groupRoot.querySelectorAll<TngAccordionTriggerElement>(accordionTriggerSelector)).filter(
    isEnabledAccordionTrigger,
  );
}

export function resolveAccordionTriggerTargetIndex(
  currentIndex: number,
  total: number,
  key: string,
): number | null {
  if (total <= 0 || currentIndex < 0 || currentIndex >= total) {
    return null;
  }

  const targetIndexResolver: Readonly<Record<string, (index: number, count: number) => number>> = {
    ArrowDown: (index, count) => (index + 1 >= count ? 0 : index + 1),
    ArrowUp: (index, count) => (index - 1 < 0 ? count - 1 : index - 1),
    End: (_index, count) => count - 1,
    Home: () => 0,
  };

  return targetIndexResolver[key]?.(currentIndex, total) ?? null;
}

function resolveNextAccordionTrigger(
  hostElement: unknown,
  currentTarget: unknown,
  key: string,
): TngAccordionTriggerElement | null {
  if (!(currentTarget instanceof HTMLButtonElement)) {
    return null;
  }

  const groupRoot = getAccordionGroupRoot(hostElement);
  if (groupRoot === null) {
    return null;
  }

  const triggers = getEnabledAccordionTriggers(groupRoot);
  if (triggers.length <= 1) {
    return null;
  }

  const currentIndex = triggers.indexOf(currentTarget);
  const nextIndex = resolveAccordionTriggerTargetIndex(currentIndex, triggers.length, key);
  if (nextIndex === null || nextIndex === currentIndex) {
    return null;
  }

  return triggers[nextIndex] ?? null;
}

@Component({
  selector: 'tng-accordion',
  imports: [TngAccordionPrimitive],
  templateUrl: './tng-accordion.component.html',
  styleUrl: './tng-accordion.component.css',
})
export class TngAccordion {
  public readonly defaultOpen = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly disabled = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly title = input<string>('Accordion');

  protected readonly open = signal(false);
  protected readonly panelId = accordionIdFactory();
  protected readonly triggerId = accordionTriggerIdFactory();

  private readonly hostRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly disclosure = createDisclosureController();

  public constructor() {
    effect(() => {
      this.disclosure.setDisabled(this.disabled());
      this.syncOpenState();
    });

    effect(() => {
      if (this.defaultOpen()) {
        this.disclosure.open();
      } else {
        this.disclosure.close();
      }
      this.syncOpenState();
    });
  }

  protected onToggle(): void {
    this.disclosure.toggle();
    this.syncOpenState();
  }

  protected onTriggerKeydown(event: unknown): void {
    if (!(event instanceof KeyboardEvent)) {
      return;
    }

    if (hasModifierKey(event) || !accordionNavigationKeys.has(event.key)) {
      return;
    }

    const currentTarget = resolveAccordionTrigger(event.currentTarget);
    if (currentTarget === null) {
      return;
    }

    const nextTrigger = resolveNextAccordionTrigger(this.hostRef.nativeElement, currentTarget, event.key);
    if (nextTrigger === null) {
      return;
    }

    event.preventDefault();
    nextTrigger.focus();
  }

  private syncOpenState(): void {
    this.open.set(this.disclosure.isOpen());
  }
}
