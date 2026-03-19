import { Component, HostBinding, input } from '@angular/core';
import {
  TngAccordion as TngAccordionPrimitive,
  TngAccordionItem as TngAccordionItemPrimitive,
  TngAccordionPanel as TngAccordionPanelPrimitive,
  TngAccordionTrigger as TngAccordionTriggerPrimitive,
} from '@tailng-ui/primitives';

@Component({
  selector: 'tng-accordion',
  hostDirectives: [
    {
      directive: TngAccordionPrimitive,
      inputs: ['type', 'value', 'defaultValue', 'collapsible', 'disabled', 'loop', 'lazy', 'keepAlive'],
      outputs: ['valueChange', 'valuesChange', 'expandedChange', 'openStart', 'opened', 'closeStart', 'closed'],
    },
  ],
  templateUrl: './tng-accordion.component.html',
  styleUrl: './tng-accordion.component.css',
  exportAs: 'tngAccordionComponent',
})
export class TngAccordionComponent {
  readonly ariaLabel = input<string>('Accordion');

  @HostBinding('attr.aria-label')
  protected get hostAriaLabel(): string {
    return this.ariaLabel();
  }
}

@Component({
  selector: 'tng-accordion-item',
  hostDirectives: [
    {
      directive: TngAccordionItemPrimitive,
      inputs: ['value', 'disabled'],
    },
  ],
  template: '<section class="tng-accordion__item"><ng-content /></section>',
  styles: `
    :host {
      display: block;
      border-top: 1px solid var(--tng-semantic-border-subtle);
    }

    :host(:first-child) {
      border-top: 0;
    }

    .tng-accordion__item {
      display: block;
    }
  `,
  exportAs: 'tngAccordionItemComponent',
})
export class TngAccordionItemComponent {}

@Component({
  selector: 'tng-accordion-trigger',
  hostDirectives: [TngAccordionTriggerPrimitive],
  template: '<span class="tng-accordion__trigger-content"><ng-content /></span>',
  styles: `
    :host {
      align-items: center;
      background: var(--tng-semantic-background-surface);
      border: 0;
      color: var(--tng-semantic-foreground-primary);
      cursor: pointer;
      display: flex;
      font: inherit;
      gap: 0.5rem;
      justify-content: space-between;
      min-height: 2.75rem;
      padding: 0.8rem 1rem;
      user-select: none;
      width: 100%;
    }

    :host([data-disabled='true']) {
      cursor: not-allowed;
      opacity: 0.55;
    }

    :host(:focus-visible) {
      outline: 2px solid var(--tng-semantic-focus-ring);
      outline-offset: -2px;
    }

    .tng-accordion__trigger-content {
      align-items: center;
      display: inline-flex;
      flex: 1 1 auto;
      justify-content: space-between;
      width: 100%;
    }
  `,
  exportAs: 'tngAccordionTriggerComponent',
})
export class TngAccordionTriggerComponent {}

@Component({
  selector: 'tng-accordion-panel',
  hostDirectives: [TngAccordionPanelPrimitive],
  template: '<section class="tng-accordion__panel"><ng-content /></section>',
  styles: `
    :host {
      display: grid;
      grid-template-rows: 1fr;
      opacity: 1;
      transition:
        grid-template-rows 180ms ease,
        opacity 180ms ease;
    }

    :host([hidden]) {
      display: grid !important;
      grid-template-rows: 0fr;
      opacity: 0;
      pointer-events: none;
    }

    .tng-accordion__panel {
      background: var(--tng-semantic-background-base);
      border-top: 1px solid var(--tng-semantic-border-subtle);
      color: var(--tng-semantic-foreground-primary);
      display: block;
      min-height: 0;
      overflow: hidden;
      padding: 0.9rem 1rem;
      transform: translateY(0);
      transition:
        border-color 180ms ease,
        padding-block 180ms ease,
        transform 180ms ease;
    }

    :host([hidden]) .tng-accordion__panel {
      border-top-color: transparent;
      padding-block: 0;
      transform: translateY(-4px);
    }
  `,
  exportAs: 'tngAccordionPanelComponent',
})
export class TngAccordionPanelComponent {}
