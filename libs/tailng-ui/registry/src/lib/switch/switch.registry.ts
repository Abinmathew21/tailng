import type { RegistryItem } from '../registry.types';

const switchPrimitiveTsTemplate = `import { Directive, HostBinding, booleanAttribute, input } from '@angular/core';

export function resolveTngSwitchAriaChecked(checked: boolean): 'false' | 'true' {
  return checked ? 'true' : 'false';
}

export function resolveTngSwitchDataState(checked: boolean): 'checked' | 'unchecked' {
  return checked ? 'checked' : 'unchecked';
}

@Directive({
  selector: 'button[tngSwitch]',
  exportAs: 'tngSwitch',
})
export class TngSwitchPrimitive {
  public readonly checked = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly disabled = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });

  @HostBinding('attr.aria-checked')
  protected get ariaCheckedAttr(): 'false' | 'true' {
    return resolveTngSwitchAriaChecked(this.checked());
  }

  @HostBinding('attr.data-disabled')
  protected get dataDisabledAttr(): '' | null {
    return this.disabled() ? '' : null;
  }

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'switch' as const;

  @HostBinding('attr.data-state')
  protected get dataStateAttr(): 'checked' | 'unchecked' {
    return resolveTngSwitchDataState(this.checked());
  }

  @HostBinding('attr.disabled')
  protected get disabledAttr(): '' | null {
    return this.disabled() ? '' : null;
  }

  @HostBinding('attr.role')
  protected readonly roleAttr = 'switch' as const;

  @HostBinding('attr.type')
  protected readonly typeAttr = 'button' as const;
}
`;

const switchComponentTsTemplate = `import { booleanAttribute, Component, input, output } from '@angular/core';
import { TngSwitchPrimitive } from './tng-switch-primitive';

export function toggleTngSwitchState(checked: boolean): boolean {
  return !checked;
}

@Component({
  selector: 'tng-switch',
  imports: [TngSwitchPrimitive],
  templateUrl: './tng-switch.html',
  styleUrl: './tng-switch.css',
})
export class TngSwitch {
  public readonly checked = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly disabled = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });

  public readonly checkedChange = output<boolean>();

  public onToggle(): void {
    if (this.disabled()) {
      return;
    }

    this.checkedChange.emit(toggleTngSwitchState(this.checked()));
  }
}
`;

const switchTemplateHtml = `<div class="tng-switch-root" [attr.data-disabled]="disabled() ? '' : null">
  <button
    tngSwitch
    class="tng-switch-control"
    [checked]="checked()"
    [disabled]="disabled()"
    (click)="onToggle()"
  >
    <span class="tng-switch-track">
      <span class="tng-switch-thumb"></span>
    </span>
  </button>
  <span class="tng-switch-label">
    <ng-content />
  </span>
</div>
`;

const switchTemplateCss = `:host {
  display: inline-flex;
}

.tng-switch-root {
  align-items: center;
  color: var(--tng-semantic-text-primary, #0f172a);
  column-gap: 0.65rem;
  display: inline-flex;
  font-size: 0.95rem;
  line-height: 1.3;
}

.tng-switch-root[data-disabled] {
  cursor: not-allowed;
  opacity: 0.65;
}

.tng-switch-control {
  align-items: center;
  background: var(--tng-semantic-background-muted, #cbd5e1);
  border: 0;
  border-radius: 999px;
  cursor: pointer;
  display: inline-flex;
  height: 1.5rem;
  padding: 0.125rem;
  transition: background-color 150ms ease;
  width: 2.65rem;
}

.tng-switch-control[data-state='checked'] {
  background: var(--tng-semantic-accent-brand, #2563eb);
}

.tng-switch-control:focus-visible {
  outline: 2px solid var(--tng-semantic-accent-brand, #2563eb);
  outline-offset: 2px;
}

.tng-switch-thumb {
  background: #fff;
  border-radius: 999px;
  box-shadow: 0 1px 2px rgb(15 23 42 / 0.2);
  display: block;
  height: 1.25rem;
  transform: translateX(0);
  transition: transform 150ms ease;
  width: 1.25rem;
}

.tng-switch-control[data-state='checked'] .tng-switch-thumb {
  transform: translateX(1.15rem);
}

.tng-switch-label {
  user-select: none;
}
`;

const switchIndexTsTemplate = `export * from './tng-switch';
export * from './tng-switch-primitive';
`;

export const switchRegistryItem: RegistryItem = {
  dependencies: [],
  description: 'Shadcn-style source files for switch primitive and styled wrapper.',
  files: [
    {
      content: switchPrimitiveTsTemplate,
      path: 'src/app/tailng-ui/switch/tng-switch-primitive.ts',
    },
    {
      content: switchComponentTsTemplate,
      path: 'src/app/tailng-ui/switch/tng-switch.ts',
    },
    {
      content: switchTemplateHtml,
      path: 'src/app/tailng-ui/switch/tng-switch.html',
    },
    {
      content: switchTemplateCss,
      path: 'src/app/tailng-ui/switch/tng-switch.css',
    },
    {
      content: switchIndexTsTemplate,
      path: 'src/app/tailng-ui/switch/index.ts',
    },
  ],
  name: 'switch',
};
