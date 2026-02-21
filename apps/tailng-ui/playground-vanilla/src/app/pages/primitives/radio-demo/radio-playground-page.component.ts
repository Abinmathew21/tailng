import { Component, signal } from '@angular/core';
import { TngRadio } from '@tailng-ui/components';
import { TngRadio as TngRadioPrimitive } from '@tailng-ui/primitives';

type BillingPlan = 'enterprise' | 'pro' | 'starter';

@Component({
  selector: 'app-radio-playground-page',
  imports: [TngRadioPrimitive, TngRadio],
  templateUrl: './radio-playground-page.component.html',
  styleUrl: './radio-playground-page.component.css',
})
export class RadioPlaygroundPageComponent {
  public readonly selectedPlan = signal<BillingPlan>('starter');

  public onPlanChecked(plan: BillingPlan, checked: boolean): void {
    if (!checked) {
      return;
    }

    this.selectedPlan.set(plan);
  }
}
