import { Directive, TemplateRef } from '@angular/core';

@Directive({
  standalone: true,
  selector: 'ng-template[tngBreadcrumbSeparatorTemplate]',
  exportAs: 'tngBreadcrumbSeparatorTemplate',
})
export class TngBreadcrumbSeparatorTemplateDirective {
  public constructor(public readonly templateRef: TemplateRef<unknown>) {}
}
