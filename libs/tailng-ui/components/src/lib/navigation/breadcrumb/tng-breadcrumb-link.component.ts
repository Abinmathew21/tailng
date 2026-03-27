import { booleanAttribute, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TngBreadcrumbLink as TngBreadcrumbLinkPrimitive } from '@tailng-ui/primitives';

@Component({
  selector: 'tng-breadcrumb-link',
  imports: [RouterLink, TngBreadcrumbLinkPrimitive],
  templateUrl: './tng-breadcrumb-link.component.html',
  styleUrl: './tng-breadcrumb-link.component.css',
})
export class TngBreadcrumbLinkComponent {
  public readonly current = input(false, { transform: booleanAttribute });
  public readonly disabled = input(false, { transform: booleanAttribute });
  public readonly href = input<string | null>(null);
  public readonly rel = input<string | null>(null);
  public readonly routerLink = input<string | readonly (number | string)[] | null>(null);
  public readonly target = input<string | null>(null);

  protected onClick(event: MouseEvent): void {
    if (!this.disabled()) {
      return;
    }

    event.preventDefault();
    event.stopImmediatePropagation();
  }
}
export { TngBreadcrumbLinkComponent as TngBreadcrumbLink };
