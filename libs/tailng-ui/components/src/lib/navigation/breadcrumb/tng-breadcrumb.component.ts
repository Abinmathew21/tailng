import { Component, input } from '@angular/core';
import { TngBreadcrumb as TngBreadcrumbPrimitive } from '@tailng-ui/primitives';

@Component({
  selector: 'tng-breadcrumb',
  imports: [TngBreadcrumbPrimitive],
  templateUrl: './tng-breadcrumb.component.html',
  styleUrl: './tng-breadcrumb.component.css',
})
export class TngBreadcrumb {
  public readonly ariaLabel = input<string>('Breadcrumb');
}
