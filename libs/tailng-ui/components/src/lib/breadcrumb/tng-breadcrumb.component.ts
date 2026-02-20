import { Component, input } from '@angular/core';
import {
  TngBreadcrumb as TngBreadcrumbPrimitive,
  TngBreadcrumbItem as TngBreadcrumbItemPrimitive,
  TngBreadcrumbLink as TngBreadcrumbLinkPrimitive,
  TngBreadcrumbList as TngBreadcrumbListPrimitive,
  TngBreadcrumbSeparator as TngBreadcrumbSeparatorPrimitive,
} from '@tailng-ui/primitives';

@Component({
  selector: 'tng-breadcrumb',
  imports: [
    TngBreadcrumbPrimitive,
    TngBreadcrumbListPrimitive,
    TngBreadcrumbItemPrimitive,
    TngBreadcrumbLinkPrimitive,
    TngBreadcrumbSeparatorPrimitive,
  ],
  templateUrl: './tng-breadcrumb.component.html',
  styleUrl: './tng-breadcrumb.component.css',
})
export class TngBreadcrumb {
  public readonly ariaLabel = input<string>('Breadcrumb');
}
