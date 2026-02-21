import { computed, Component, signal } from '@angular/core';
import {
  createActiveDescendantController,
  resolveListNavigationKeyAction,
  type TngListNavigationAction,
  type TngListNavigationActionType,
} from '@tailng-ui/cdk/a11y';
import {
  createSelectionModel,
  createTypeaheadController,
  type TngTypeaheadItem,
} from '@tailng-ui/cdk/collections';

type DemoOption = Readonly<{
  description: string;
  disabled?: boolean;
  id: string;
  label: string;
}>;

type TngMoveDirection = 'first' | 'last' | 'next' | 'prev';

const listboxId = 'tailng-cdk-listbox-demo';

const demoOptions: readonly DemoOption[] = Object.freeze([
  {
    description: 'Experimental wrapper track for future Angular 22 alignment.',
    id: 'angular-aria',
    label: 'Angular ARIA Wrapper',
  },
  {
    description: 'Fallback behavior primitives for focus and overlays.',
    id: 'angular-cdk',
    label: 'Angular CDK Adapter',
  },
  {
    description: 'Reference implementation and compatibility baseline.',
    id: 'angular-material',
    label: 'Angular Material Bridge',
  },
  {
    description: 'Style integration target for utility-class consumers.',
    id: 'tailwind',
    label: 'Tailwind Styling',
  },
  {
    description: 'Ongoing a11y verification in CI and component acceptance tests.',
    id: 'a11y-audit',
    label: 'Accessibility Audits',
  },
  {
    description: 'Reserved work item for post-listbox component wave.',
    disabled: true,
    id: 'future-roadmap',
    label: 'Future Roadmap (disabled)',
  },
]);

const optionIds = Object.freeze(demoOptions.map((option) => option.id));
const disabledOptionIds = Object.freeze(
  demoOptions.filter((option) => option.disabled === true).map((option) => option.id),
);
const enabledOptionIds = Object.freeze(optionIds.filter((id) => !disabledOptionIds.includes(id)));
const optionById: ReadonlyMap<string, DemoOption> = new Map(
  demoOptions.map((option) => [option.id, option] as const),
);

function toTypeaheadItems(options: readonly DemoOption[]): readonly TngTypeaheadItem[] {
  return options.map((option) => ({
    disabled: option.disabled,
    id: option.id,
    text: option.label,
  }));
}

function isPrintableTypeaheadKey(key: string): boolean {
  return key.length === 1 && key.trim().length > 0;
}

@Component({
  selector: 'app-listbox-playground-page',
  imports: [],
  templateUrl: './listbox-playground-page.component.html',
  styleUrl: './listbox-playground-page.component.css',
})
export class ListboxPlaygroundPageComponent {
  public readonly activeId = signal<string | null>(null);
  public readonly listboxId = listboxId;
  public readonly options = demoOptions;
  public readonly selectedIds = signal<readonly string[]>([]);

  public readonly activeLabel = computed((): string => {
    const activeOption = this.activeId() === null ? undefined : optionById.get(this.activeId() ?? '');
    return activeOption?.label ?? 'None';
  });

  public readonly selectedLabel = computed((): string => {
    const labels = this.selectedIds()
      .map((id) => optionById.get(id)?.label)
      .filter((label): label is string => label !== undefined);
    return labels.length === 0 ? 'None' : labels.join(', ');
  });

  private readonly actionHandlers: Readonly<
    Record<TngListNavigationActionType, (extendSelection: boolean) => void>
  > = Object.freeze({
    exit: () => undefined,
    'move-first': (extendSelection: boolean): void => this.moveActive('first', extendSelection),
    'move-last': (extendSelection: boolean): void => this.moveActive('last', extendSelection),
    'move-next': (extendSelection: boolean): void => this.moveActive('next', extendSelection),
    'move-prev': (extendSelection: boolean): void => this.moveActive('prev', extendSelection),
    'select-active': () => this.selectActive(),
    'select-all': () => this.selectAll(),
    'toggle-active': () => this.toggleActive(),
  });

  private readonly activeDescendant = createActiveDescendantController({
    disabledIds: disabledOptionIds,
    hostId: listboxId,
    itemIds: optionIds,
    loop: true,
  });

  private readonly selectionModel = createSelectionModel<string>({
    mode: 'multiple',
  });

  private readonly typeahead = createTypeaheadController({
    items: toTypeaheadItems(demoOptions),
    loop: true,
  });

  public constructor() {
    this.syncActiveId(this.activeDescendant.getActiveId());
    this.syncSelectedIds();
  }

  public isActive(id: string): boolean {
    return this.activeId() === id;
  }

  public isDisabled(id: string): boolean {
    return disabledOptionIds.includes(id);
  }

  public isSelected(id: string): boolean {
    return this.selectedIds().includes(id);
  }

  public onFocus(): void {
    if (this.activeId() !== null) {
      return;
    }

    this.moveActive('next', false);
  }

  public onKeydown(event: KeyboardEvent): void {
    const action = resolveListNavigationKeyAction(event, {
      multiSelect: true,
      orientation: 'vertical',
    });
    if (action !== null) {
      this.handleNavigationAction(action);
      if (action.preventDefault) {
        event.preventDefault();
      }
      return;
    }

    this.handleTypeahead(event);
  }

  public onOptionClick(id: string, event: MouseEvent): void {
    if (this.isDisabled(id)) {
      return;
    }

    this.syncActiveId(this.activeDescendant.setActiveId(id));
    if (event.shiftKey) {
      this.selectRangeTo(id);
      return;
    }

    if (event.ctrlKey || event.metaKey) {
      this.selectionModel.toggle(id);
      this.syncSelectedIds();
      return;
    }

    this.selectOnly(id);
  }

  public onOptionKeydown(id: string, event: KeyboardEvent): void {
    if (event.key !== 'Enter' && event.key !== ' ') {
      return;
    }

    event.preventDefault();
    if (this.isDisabled(id)) {
      return;
    }

    this.syncActiveId(this.activeDescendant.setActiveId(id));
    if (event.ctrlKey || event.metaKey) {
      this.selectionModel.toggle(id);
      this.syncSelectedIds();
      return;
    }

    this.selectOnly(id);
  }

  private handleNavigationAction(action: TngListNavigationAction): void {
    const handler = this.actionHandlers[action.type];
    handler(action.extendSelection);
  }

  private handleTypeahead(event: KeyboardEvent): void {
    if (!isPrintableTypeaheadKey(event.key)) {
      return;
    }

    const previousActiveId = this.activeId();
    const state = this.typeahead.handleKey(event.key);
    if (state.activeId === null || state.activeId === previousActiveId) {
      return;
    }

    this.syncActiveId(this.activeDescendant.setActiveId(state.activeId));
    event.preventDefault();
  }

  private moveActive(direction: TngMoveDirection, extendSelection: boolean): void {
    const previousActiveId = this.activeId();
    const nextActiveId = this.resolveNextActiveId(direction);
    this.syncActiveId(nextActiveId);
    if (!extendSelection || nextActiveId === null) {
      return;
    }

    const anchorId = this.selectionModel.getAnchor() ?? previousActiveId ?? nextActiveId;
    this.selectionModel.selectRange(anchorId, nextActiveId, {
      orderedValues: enabledOptionIds,
    });
    this.syncSelectedIds();
  }

  private resolveNextActiveId(direction: TngMoveDirection): string | null {
    switch (direction) {
      case 'first':
        return this.activeDescendant.setActiveId(enabledOptionIds[0] ?? null);
      case 'last':
        return this.activeDescendant.setActiveId(enabledOptionIds[enabledOptionIds.length - 1] ?? null);
      case 'next':
        return this.activeDescendant.moveNext();
      case 'prev':
        return this.activeDescendant.movePrev();
    }
  }

  private selectActive(): void {
    const activeOptionId = this.activeId();
    if (activeOptionId === null) {
      return;
    }

    this.selectOnly(activeOptionId);
  }

  private selectAll(): void {
    const firstId = enabledOptionIds[0];
    const lastId = enabledOptionIds[enabledOptionIds.length - 1];
    if (firstId === undefined || lastId === undefined) {
      return;
    }

    this.selectionModel.selectRange(firstId, lastId, {
      orderedValues: enabledOptionIds,
    });
    this.syncSelectedIds();
  }

  private selectOnly(optionId: string): void {
    this.selectionModel.selectRange(optionId, optionId, {
      orderedValues: enabledOptionIds,
    });
    this.syncSelectedIds();
  }

  private selectRangeTo(optionId: string): void {
    const anchorId = this.selectionModel.getAnchor() ?? this.activeId() ?? optionId;
    this.selectionModel.selectRange(anchorId, optionId, {
      orderedValues: enabledOptionIds,
    });
    this.syncSelectedIds();
  }

  private syncActiveId(id: string | null): void {
    const activeId = this.activeDescendant.setActiveId(id);
    this.activeId.set(activeId);
    this.typeahead.setActiveId(activeId);
  }

  private syncSelectedIds(): void {
    this.selectedIds.set(this.selectionModel.getSelected());
  }

  private toggleActive(): void {
    const activeOptionId = this.activeId();
    if (activeOptionId === null) {
      return;
    }

    this.selectionModel.toggle(activeOptionId);
    this.syncSelectedIds();
  }
}
