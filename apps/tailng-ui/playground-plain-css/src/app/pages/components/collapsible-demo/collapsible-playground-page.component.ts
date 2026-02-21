import { Component, signal } from '@angular/core';
import { TngCollapsible as TngCollapsibleComponent } from '@tailng-ui/components';
import {
  TngCollapsible,
  TngCollapsibleContent,
  TngCollapsibleTrigger,
} from '@tailng-ui/primitives';

const primitiveContentId = 'tailng-collapsible-primitive-content';

@Component({
  selector: 'app-collapsible-playground-page',
  imports: [
    TngCollapsibleComponent,
    TngCollapsible,
    TngCollapsibleTrigger,
    TngCollapsibleContent,
  ],
  templateUrl: './collapsible-playground-page.component.html',
  styleUrl: './collapsible-playground-page.component.css',
})
export class CollapsiblePlaygroundPageComponent {
  public readonly componentDisabled = signal(false);
  public readonly componentOpen = signal(false);
  public readonly primitiveContentId = primitiveContentId;
  public readonly primitiveDisabled = signal(false);
  public readonly primitiveOpen = signal(true);

  public onComponentOpenChange(nextOpen: boolean): void {
    this.componentOpen.set(nextOpen);
  }

  public onToggleComponentDisabled(): void {
    this.componentDisabled.set(!this.componentDisabled());
  }

  public onTogglePrimitive(): void {
    if (this.primitiveDisabled()) {
      return;
    }

    this.primitiveOpen.set(!this.primitiveOpen());
  }

  public onTogglePrimitiveDisabled(): void {
    this.primitiveDisabled.set(!this.primitiveDisabled());
    if (this.primitiveDisabled()) {
      this.primitiveOpen.set(false);
    }
  }
}
