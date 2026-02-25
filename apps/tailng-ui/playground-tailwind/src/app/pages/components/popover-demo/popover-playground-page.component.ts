import { Component, signal } from '@angular/core';
import { TngButtonComponent, TngPopoverComponent } from '@tailng-ui/components';

type TngQuickAction = Readonly<{
  description: string;
  id: string;
  label: string;
}>;

const quickActions: readonly TngQuickAction[] = Object.freeze([
  {
    description: 'Open dialog with starter template values.',
    id: 'new-session',
    label: 'New Session',
  },
  {
    description: 'Sync latest design tokens from theme contract.',
    id: 'sync-theme',
    label: 'Sync Theme',
  },
  {
    description: 'Run accessibility checks on the selected branch.',
    id: 'run-a11y',
    label: 'Run A11y Audit',
  },
]);

@Component({
  selector: 'app-popover-playground-page',
  imports: [TngButtonComponent, TngPopoverComponent],
  templateUrl: './popover-playground-page.component.html',
  styleUrl: './popover-playground-page.component.css',
})
export class PopoverPlaygroundPageComponent {
  public readonly actions = quickActions;
  public readonly actionsPopoverOpen = signal(false);
  public readonly detailsPopoverOpen = signal(false);
  public readonly selectedAction = signal<string | null>(null);

  public onActionPick(actionId: string): void {
    this.selectedAction.set(actionId);
    this.actionsPopoverOpen.set(false);
  }

  public onActionsPopoverChange(isOpen: boolean): void {
    this.actionsPopoverOpen.set(isOpen);
  }

  public onDetailsPopoverChange(isOpen: boolean): void {
    this.detailsPopoverOpen.set(isOpen);
  }
}
