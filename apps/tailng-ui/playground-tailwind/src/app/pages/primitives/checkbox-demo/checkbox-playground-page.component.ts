import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TngCheckbox } from '@tailng-ui/components';
import { TngCheckbox as TngCheckboxPrimitive } from '@tailng-ui/primitives';

@Component({
  selector: 'app-checkbox-playground-page',
  imports: [RouterLink, TngCheckboxPrimitive, TngCheckbox],
  templateUrl: './checkbox-playground-page.component.html',
  styleUrl: './checkbox-playground-page.component.css',
})
export class CheckboxPlaygroundPageComponent {
  public readonly acceptedTerms = signal(false);
  public readonly acceptedTermsIndeterminate = signal(true);

  public onCheckedChange(checked: boolean): void {
    this.acceptedTerms.set(checked);
  }

  public onIndeterminateChange(indeterminate: boolean): void {
    this.acceptedTermsIndeterminate.set(indeterminate);
  }

  public setMixedState(): void {
    this.acceptedTerms.set(false);
    this.acceptedTermsIndeterminate.set(true);
  }
}
