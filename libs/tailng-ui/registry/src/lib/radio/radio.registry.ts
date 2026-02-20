import type { RegistryItem } from '../registry.types';

const radioPrimitiveTsTemplate = `import { Directive, HostBinding, booleanAttribute, input } from '@angular/core';

export function normalizeTngRadioStringValue(
  value: string | null | undefined,
): string | null {
  if (value === undefined || value === null) {
    return null;
  }

  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
}

@Directive({
  selector: 'input[tngRadio]',
  exportAs: 'tngRadio',
})
export class TngRadioPrimitive {
  public readonly ariaDescribedBy = input<string | null>(null);
  public readonly checked = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly disabled = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly name = input<string | null>(null);
  public readonly required = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly value = input<string | null>(null);

  @HostBinding('checked')
  protected get checkedProp(): boolean {
    return this.checked();
  }

  @HostBinding('attr.aria-checked')
  protected get ariaCheckedAttr(): 'false' | 'true' {
    return this.checked() ? 'true' : 'false';
  }

  @HostBinding('attr.aria-describedby')
  protected get ariaDescribedByAttr(): string | null {
    return normalizeTngRadioStringValue(this.ariaDescribedBy());
  }

  @HostBinding('attr.data-disabled')
  protected get dataDisabledAttr(): '' | null {
    return this.disabled() ? '' : null;
  }

  @HostBinding('attr.disabled')
  protected get disabledAttr(): '' | null {
    return this.disabled() ? '' : null;
  }

  @HostBinding('attr.name')
  protected get nameAttr(): string | null {
    return normalizeTngRadioStringValue(this.name());
  }

  @HostBinding('attr.required')
  protected get requiredAttr(): '' | null {
    return this.required() ? '' : null;
  }

  @HostBinding('attr.type')
  protected get typeAttr(): 'radio' {
    return 'radio';
  }

  @HostBinding('attr.value')
  protected get valueAttr(): string | null {
    return normalizeTngRadioStringValue(this.value());
  }
}
`;

const radioComponentTsTemplate = `import { booleanAttribute, Component, input, output } from '@angular/core';
import { TngRadioPrimitive } from './tng-radio-primitive';

export function readTngRadioChecked(event: Event): boolean | null {
  const target = event.target;
  if (!(target instanceof HTMLInputElement)) {
    return null;
  }

  return target.checked;
}

@Component({
  selector: 'tng-radio',
  imports: [TngRadioPrimitive],
  templateUrl: './tng-radio.html',
  styleUrl: './tng-radio.css',
})
export class TngRadio {
  public readonly ariaDescribedBy = input<string | null>(null);
  public readonly checked = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly disabled = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly name = input<string | null>(null);
  public readonly required = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly value = input<string>('on');

  public readonly checkedChange = output<boolean>();

  public onChange(event: Event): void {
    const checked = readTngRadioChecked(event);
    if (checked === null) {
      return;
    }

    this.checkedChange.emit(checked);
  }
}
`;

const radioTemplateHtml = `<label class="tng-radio-root" [attr.data-disabled]="disabled() ? '' : null">
  <input
    tngRadio
    class="tng-radio-control"
    [checked]="checked()"
    [disabled]="disabled()"
    [required]="required()"
    [name]="name()"
    [value]="value()"
    [ariaDescribedBy]="ariaDescribedBy()"
    (change)="onChange($event)"
  />
  <span class="tng-radio-label">
    <ng-content />
  </span>
</label>
`;

const radioTemplateCss = `:host {
  display: inline-flex;
}

.tng-radio-root {
  align-items: center;
  color: var(--tng-semantic-foreground-primary, #0f172a);
  cursor: pointer;
  display: inline-flex;
  gap: 0.55rem;
  user-select: none;
}

.tng-radio-root[data-disabled] {
  cursor: not-allowed;
  opacity: 0.65;
}

.tng-radio-control {
  accent-color: var(--tng-semantic-accent-brand, #2563eb);
  block-size: 1rem;
  inline-size: 1rem;
  margin: 0;
}

.tng-radio-control:focus-visible {
  box-shadow: 0 0 0 3px var(--tng-semantic-focus-ring, #60a5fa);
  outline: none;
}

.tng-radio-label {
  font-size: 0.925rem;
  line-height: 1.2;
}
`;

const radioIndexTsTemplate = `export * from './tng-radio';
export * from './tng-radio-primitive';
`;

export const radioRegistryItem: RegistryItem = {
  dependencies: [],
  description: 'Shadcn-style source files for radio primitive and styled wrapper.',
  files: [
    {
      content: radioPrimitiveTsTemplate,
      path: 'src/app/tailng-ui/radio/tng-radio-primitive.ts',
    },
    {
      content: radioComponentTsTemplate,
      path: 'src/app/tailng-ui/radio/tng-radio.ts',
    },
    {
      content: radioTemplateHtml,
      path: 'src/app/tailng-ui/radio/tng-radio.html',
    },
    {
      content: radioTemplateCss,
      path: 'src/app/tailng-ui/radio/tng-radio.css',
    },
    {
      content: radioIndexTsTemplate,
      path: 'src/app/tailng-ui/radio/index.ts',
    },
  ],
  name: 'radio',
};
