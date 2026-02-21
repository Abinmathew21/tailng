import { computed, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  createActiveDescendantController,
  resolveListNavigationKeyAction,
  type TngListNavigationAction,
} from '@tailng-ui/cdk/a11y';
import {
  createSelectionModel,
  createTypeaheadController,
  type TngTypeaheadItem,
} from '@tailng-ui/cdk/collections';
import { TngButton, TngCheckbox, TngDialog, TngInput, TngTextarea } from '@tailng-ui/components';

type AssigneeOption = Readonly<{
  detail: string;
  id: string;
  label: string;
}>;

type TngMoveDirection = 'first' | 'last' | 'next' | 'prev';

const listboxId = 'tailng-dialog-assignee-listbox';

const assigneeOptions: readonly AssigneeOption[] = Object.freeze([
  {
    detail: 'Owns ARIA adapter and conformance tests.',
    id: 'aria-owner',
    label: 'ARIA Track',
  },
  {
    detail: 'Maintains fallback behavior primitives and overlay safety.',
    id: 'cdk-owner',
    label: 'CDK Track',
  },
  {
    detail: 'Coordinates docs and examples for install + copy mode.',
    id: 'docs-owner',
    label: 'Docs Track',
  },
  {
    detail: 'Verifies token contracts and CSS framework independence.',
    id: 'theme-owner',
    label: 'Theme Track',
  },
]);

const assigneeIds = Object.freeze(assigneeOptions.map((option) => option.id));
const assigneeById: ReadonlyMap<string, AssigneeOption> = new Map(
  assigneeOptions.map((option) => [option.id, option] as const),
);

function toTypeaheadItems(options: readonly AssigneeOption[]): readonly TngTypeaheadItem[] {
  return options.map((option) => ({ id: option.id, text: option.label }));
}

function toOptionLabel(optionId: string | null): string {
  if (optionId === null) {
    return 'None';
  }

  return assigneeById.get(optionId)?.label ?? 'None';
}

@Component({
  selector: 'app-dialog-playground-page',
  imports: [RouterLink, TngButton, TngCheckbox, TngDialog, TngInput, TngTextarea],
  templateUrl: './dialog-playground-page.component.html',
  styleUrl: './dialog-playground-page.component.css',
})
export class DialogPlaygroundPageComponent {
  public readonly activeAssigneeId = signal<string | null>(null);
  public readonly dialogOpen = signal(false);
  public readonly listboxId = listboxId;
  public readonly notes = signal(
    'Need to validate overlays with keyboard + screen-reader behavior before release.',
  );
  public readonly notificationsEnabled = signal(true);
  public readonly options = assigneeOptions;
  public readonly projectName = signal('TailNG Overlay MVP');
  public readonly selectedAssigneeId = signal<string | null>(null);

  public readonly activeAssigneeLabel = computed(() => toOptionLabel(this.activeAssigneeId()));
  public readonly selectedAssigneeLabel = computed(() => toOptionLabel(this.selectedAssigneeId()));

  private readonly activeDescendant = createActiveDescendantController({
    hostId: listboxId,
    itemIds: assigneeIds,
    loop: true,
  });
  private readonly selectionModel = createSelectionModel<string>({
    mode: 'single',
  });
  private readonly typeahead = createTypeaheadController({
    items: toTypeaheadItems(assigneeOptions),
    loop: true,
  });
  private readonly navigationHandlers: Readonly<
    Record<TngListNavigationAction['type'], () => void>
  > = Object.freeze({
    exit: (): void => undefined,
    'move-first': (): void => this.moveActive('first'),
    'move-last': (): void => this.moveActive('last'),
    'move-next': (): void => this.moveActive('next'),
    'move-prev': (): void => this.moveActive('prev'),
    'select-active': (): void => this.selectActive(),
    'select-all': (): void => this.selectActive(),
    'toggle-active': (): void => this.selectActive(),
  });

  public constructor() {
    const firstOptionId = assigneeIds[0] ?? null;
    this.syncActive(firstOptionId);
    if (firstOptionId !== null) {
      this.selectOnly(firstOptionId);
    }
  }

  public isAssigneeActive(optionId: string): boolean {
    return this.activeAssigneeId() === optionId;
  }

  public isAssigneeSelected(optionId: string): boolean {
    return this.selectedAssigneeId() === optionId;
  }

  public onDialogOpenChange(isOpen: boolean): void {
    this.dialogOpen.set(isOpen);
  }

  public onDialogSubmit(): void {
    this.onDialogOpenChange(false);
  }

  public onListboxFocus(): void {
    if (this.activeAssigneeId() !== null) {
      return;
    }

    this.moveActive('next');
  }

  public onListboxKeydown(event: KeyboardEvent): void {
    const action = resolveListNavigationKeyAction(event, {
      multiSelect: false,
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

  public onListboxOptionClick(optionId: string): void {
    this.syncActive(this.activeDescendant.setActiveId(optionId));
    this.selectOnly(optionId);
  }

  public onListboxOptionKeydown(optionId: string, event: KeyboardEvent): void {
    if (event.key !== 'Enter' && event.key !== ' ') {
      return;
    }

    event.preventDefault();
    this.onListboxOptionClick(optionId);
  }

  public onNotesChange(value: string): void {
    this.notes.set(value);
  }

  public onNotificationsChange(checked: boolean): void {
    this.notificationsEnabled.set(checked);
  }

  public onProjectNameChange(value: string): void {
    this.projectName.set(value);
  }

  private handleNavigationAction(action: TngListNavigationAction): void {
    const handler = this.navigationHandlers[action.type];
    handler();
  }

  private handleTypeahead(event: KeyboardEvent): void {
    const state = this.typeahead.handleKey(event.key);
    if (state.activeId === null) {
      return;
    }

    this.syncActive(this.activeDescendant.setActiveId(state.activeId));
    event.preventDefault();
  }

  private moveActive(direction: TngMoveDirection): void {
    switch (direction) {
      case 'first':
        this.syncActive(this.activeDescendant.setActiveId(assigneeIds[0] ?? null));
        return;
      case 'last':
        this.syncActive(this.activeDescendant.setActiveId(assigneeIds[assigneeIds.length - 1] ?? null));
        return;
      case 'next':
        this.syncActive(this.activeDescendant.moveNext());
        return;
      case 'prev':
        this.syncActive(this.activeDescendant.movePrev());
        return;
    }
  }

  private selectActive(): void {
    const optionId = this.activeAssigneeId();
    if (optionId !== null) {
      this.selectOnly(optionId);
    }
  }

  private selectOnly(optionId: string): void {
    this.selectionModel.selectRange(optionId, optionId, {
      orderedValues: assigneeIds,
    });
    this.syncSelected();
  }

  private syncActive(optionId: string | null): void {
    const activeId = this.activeDescendant.setActiveId(optionId);
    this.activeAssigneeId.set(activeId);
    this.typeahead.setActiveId(activeId);
  }

  private syncSelected(): void {
    const selected = this.selectionModel.getSelected()[0] ?? null;
    this.selectedAssigneeId.set(selected);
  }
}
