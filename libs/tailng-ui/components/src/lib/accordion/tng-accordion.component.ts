import { booleanAttribute, Component, effect, input, signal } from '@angular/core';
import { createDisclosureController } from '@tailng-ui/cdk';
import { createTngIdFactory } from '@tailng-ui/cdk/core';
import { TngAccordion as TngAccordionPrimitive } from '@tailng-ui/primitives';

const accordionIdFactory = createTngIdFactory('tng-accordion-panel');

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

  private syncOpenState(): void {
    this.open.set(this.disclosure.isOpen());
  }
}
