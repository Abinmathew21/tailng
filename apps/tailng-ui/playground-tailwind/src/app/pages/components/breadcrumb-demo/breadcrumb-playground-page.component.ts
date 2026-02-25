import { Component } from '@angular/core';
import { TngBreadcrumbComponent } from '@tailng-ui/components';
import {
  TngBreadcrumb,
  TngBreadcrumbItem,
  TngBreadcrumbLink,
  TngBreadcrumbList,
  TngBreadcrumbSeparator,
} from '@tailng-ui/primitives';

@Component({
  selector: 'app-breadcrumb-playground-page',
  imports: [
    TngBreadcrumb,
    TngBreadcrumbList,
    TngBreadcrumbItem,
    TngBreadcrumbLink,
    TngBreadcrumbSeparator,
    TngBreadcrumbComponent,
  ],
  templateUrl: './breadcrumb-playground-page.component.html',
  styleUrl: './breadcrumb-playground-page.component.css',
})
export class BreadcrumbPlaygroundPageComponent {}
