import type { RegistryItem } from '../registry.types';

const accordionPrimitiveTsTemplate = `import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: '[tngAccordion]',
  exportAs: 'tngAccordion',
})
export class TngAccordionPrimitive {
  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'accordion' as const;
}
`;

const accordionComponentTsTemplate = `import { booleanAttribute, Component, input, signal } from '@angular/core';
import { TngAccordionPrimitive } from './tng-accordion-primitive';

@Component({
  selector: 'tng-accordion',
  imports: [TngAccordionPrimitive],
  templateUrl: './tng-accordion.html',
  styleUrl: './tng-accordion.css',
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

  public constructor() {
    this.open.set(this.defaultOpen());
  }

  protected onToggle(): void {
    if (this.disabled()) {
      return;
    }

    this.open.set(!this.open());
  }
}
`;

const accordionTemplateHtml = `<section tngAccordion class="tng-accordion" [attr.data-open]="open() ? '' : null">
  <button
    type="button"
    class="tng-accordion__trigger"
    [disabled]="disabled()"
    [attr.aria-expanded]="open()"
    (click)="onToggle()"
  >
    <span>{{ title() }}</span>
    <span aria-hidden="true" class="tng-accordion__chevron">{{ open() ? '−' : '+' }}</span>
  </button>

  @if (open()) {
    <div class="tng-accordion__panel">
      <ng-content />
    </div>
  }
</section>
`;

const accordionTemplateCss = `:host {
  display: block;
}

.tng-accordion {
  border: 1px solid #cbd5e1;
  border-radius: 0.75rem;
  overflow: hidden;
}

.tng-accordion__trigger {
  align-items: center;
  background: #f8fafc;
  border: 0;
  color: #0f172a;
  cursor: pointer;
  display: flex;
  font: inherit;
  justify-content: space-between;
  padding: 0.8rem 1rem;
  width: 100%;
}

.tng-accordion__panel {
  border-top: 1px solid #cbd5e1;
  padding: 0.9rem 1rem;
}
`;

const accordionIndexTsTemplate = `export * from './tng-accordion';
export * from './tng-accordion-primitive';
`;

export const accordionRegistryItem: RegistryItem = {
  dependencies: [],
  description: 'Shadcn-style source files for accordion primitive and styled wrapper.',
  files: [
    {
      content: accordionPrimitiveTsTemplate,
      path: 'src/app/tailng-ui/accordion/tng-accordion-primitive.ts',
    },
    {
      content: accordionComponentTsTemplate,
      path: 'src/app/tailng-ui/accordion/tng-accordion.ts',
    },
    {
      content: accordionTemplateHtml,
      path: 'src/app/tailng-ui/accordion/tng-accordion.html',
    },
    {
      content: accordionTemplateCss,
      path: 'src/app/tailng-ui/accordion/tng-accordion.css',
    },
    {
      content: accordionIndexTsTemplate,
      path: 'src/app/tailng-ui/accordion/index.ts',
    },
  ],
  name: 'accordion',
};
