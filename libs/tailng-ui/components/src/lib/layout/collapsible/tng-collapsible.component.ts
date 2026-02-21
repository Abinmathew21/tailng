import { booleanAttribute, Component, input, output } from '@angular/core';
import {
  TngCollapsible as TngCollapsiblePrimitive,
  TngCollapsibleContent as TngCollapsibleContentPrimitive,
  TngCollapsibleTrigger as TngCollapsibleTriggerPrimitive,
} from '@tailng-ui/primitives';

let nextCollapsibleContentId = 0;

export function createTngCollapsibleContentId(): string {
  nextCollapsibleContentId += 1;
  return `tng-collapsible-content-${nextCollapsibleContentId}`;
}

export function toggleTngCollapsibleState(open: boolean, disabled: boolean): boolean {
  return disabled ? open : !open;
}

@Component({
  selector: 'tng-collapsible',
  imports: [
    TngCollapsiblePrimitive,
    TngCollapsibleTriggerPrimitive,
    TngCollapsibleContentPrimitive,
  ],
  templateUrl: './tng-collapsible.component.html',
  styleUrl: './tng-collapsible.component.css',
})
export class TngCollapsible {
  public readonly contentId = input<string>(createTngCollapsibleContentId());
  public readonly disabled = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly open = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly title = input<string>('Collapsible');

  public readonly openChange = output<boolean>();

  public onToggle(): void {
    const nextState = toggleTngCollapsibleState(this.open(), this.disabled());
    this.openChange.emit(nextState);
  }
}
