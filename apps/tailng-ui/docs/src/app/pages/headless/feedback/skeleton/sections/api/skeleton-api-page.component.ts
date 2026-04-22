import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-headless-skeleton-api-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './skeleton-api-page.component.html',
  styleUrl: './skeleton-api-page.component.css',
})
export class HeadlessSkeletonApiPageComponent {
  protected readonly rootCode = [
    '<div tngSkeleton class="skeleton-line"></div>',
    '<div tngSkeleton [animated]="false" [rounded]="false" class="skeleton-block"></div>',
    '',
  ].join('\n');

  protected readonly attributesCode = [
    '<div tngSkeleton [animated]="false" [rounded]="false" class="skeleton-block"></div>',
    '<!-- renders with data-slot="skeleton" data-animated="false" data-rounded="false" -->',
    '',
  ].join('\n');
}
