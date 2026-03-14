import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-skeleton-api-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './skeleton-api-page.component.html',
  styleUrl: './skeleton-api-page.component.css',
})
export class SkeletonApiPageComponent {
  protected readonly primitiveAttachmentCode = [
    '<div tngSkeleton class="skeleton-line"></div>',
    '<div tngSkeleton [animated]="false" [rounded]="false" class="skeleton-block"></div>',
    '',
  ].join('\n');

  protected readonly componentAttachmentCode = [
    '<tng-skeleton width="75%" height="1rem"></tng-skeleton>',
    '<tng-skeleton width="100%" height="7rem" [animated]="false" [rounded]="false"></tng-skeleton>',
    '',
  ].join('\n');
}
