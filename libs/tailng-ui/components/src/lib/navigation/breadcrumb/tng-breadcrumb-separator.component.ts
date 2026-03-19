import { NgTemplateOutlet } from '@angular/common';
import { Component, input, type TemplateRef } from '@angular/core';
import { TngBreadcrumbSeparator as TngBreadcrumbSeparatorPrimitive } from '@tailng-ui/primitives';

@Component({
  standalone: true,
  selector: 'tng-breadcrumb-separator',
  imports: [NgTemplateOutlet, TngBreadcrumbSeparatorPrimitive],
  templateUrl: './tng-breadcrumb-separator.component.html',
  styleUrl: './tng-breadcrumb-separator.component.css',
})
export class TngBreadcrumbSeparatorComponent {
  public readonly symbol = input('/');
  public readonly template = input<TemplateRef<unknown> | null>(null);
}
