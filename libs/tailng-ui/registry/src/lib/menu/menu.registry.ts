import type { RegistryItem } from '../registry.types';

const menuPrimitiveTsTemplate = `import { Directive, ElementRef, HostBinding, HostListener, inject } from '@angular/core';

type MenuItemElement = HTMLElement;

function getEnabledMenuItems(host: HTMLElement): readonly MenuItemElement[] {
  return [...host.querySelectorAll<MenuItemElement>('[role="menuitem"]')].filter(
    (element) => element.getAttribute('aria-disabled') !== 'true',
  );
}

function getNextIndex(currentIndex: number, total: number): number {
  if (currentIndex < 0) {
    return 0;
  }

  return currentIndex + 1 >= total ? 0 : currentIndex + 1;
}

function getPrevIndex(currentIndex: number, total: number): number {
  if (currentIndex < 0) {
    return total - 1;
  }

  return currentIndex - 1 < 0 ? total - 1 : currentIndex - 1;
}

@Directive({
  selector: '[tngMenu]',
  exportAs: 'tngMenu',
})
export class TngMenuPrimitive {
  private readonly hostRef = inject<ElementRef<HTMLElement>>(ElementRef);

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'menu' as const;

  @HostBinding('attr.role')
  protected readonly role = 'menu' as const;

  @HostListener('keydown', ['$event'])
  protected onKeydown(event: KeyboardEvent): void {
    const items = getEnabledMenuItems(this.hostRef.nativeElement);
    if (items.length === 0) {
      return;
    }

    const currentIndex = items.findIndex((item) => item === document.activeElement);

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      items[getNextIndex(currentIndex, items.length)]?.focus();
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      items[getPrevIndex(currentIndex, items.length)]?.focus();
      return;
    }

    if (event.key === 'Home') {
      event.preventDefault();
      items[0]?.focus();
      return;
    }

    if (event.key === 'End') {
      event.preventDefault();
      items[items.length - 1]?.focus();
    }
  }
}
`;

const menuComponentTsTemplate = `import { Component, input } from '@angular/core';
import { TngMenuPrimitive } from './tng-menu-primitive';

@Component({
  selector: 'tng-menu',
  imports: [TngMenuPrimitive],
  templateUrl: './tng-menu.html',
  styleUrl: './tng-menu.css',
})
export class TngMenu {
  public readonly ariaLabel = input<string>('Menu');
}
`;

const menuTemplateHtml = `<ul tngMenu class="tng-menu" [attr.aria-label]="ariaLabel()">
  <ng-content />
</ul>
`;

const menuTemplateCss = `:host {
  display: block;
}

.tng-menu {
  border: 1px solid #cbd5e1;
  border-radius: 0.75rem;
  display: grid;
  gap: 0.25rem;
  list-style: none;
  margin: 0;
  max-width: 18rem;
  padding: 0.4rem;
}

.tng-menu :where([role='menuitem']) {
  align-items: center;
  border-radius: 0.5rem;
  cursor: pointer;
  display: flex;
  min-height: 2.25rem;
  padding: 0 0.7rem;
}
`;

const menuIndexTsTemplate = `export * from './tng-menu';
export * from './tng-menu-primitive';
`;

export const menuRegistryItem: RegistryItem = {
  dependencies: [],
  description: 'Shadcn-style source files for menu primitive and styled wrapper.',
  files: [
    {
      content: menuPrimitiveTsTemplate,
      path: 'src/app/tailng-ui/menu/tng-menu-primitive.ts',
    },
    {
      content: menuComponentTsTemplate,
      path: 'src/app/tailng-ui/menu/tng-menu.ts',
    },
    {
      content: menuTemplateHtml,
      path: 'src/app/tailng-ui/menu/tng-menu.html',
    },
    {
      content: menuTemplateCss,
      path: 'src/app/tailng-ui/menu/tng-menu.css',
    },
    {
      content: menuIndexTsTemplate,
      path: 'src/app/tailng-ui/menu/index.ts',
    },
  ],
  name: 'menu',
};
