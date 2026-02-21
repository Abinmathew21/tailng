import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TngTextarea } from '@tailng-ui/components';
import { TngTextarea as TngTextareaPrimitive } from '@tailng-ui/primitives';

@Component({
  selector: 'app-textarea-playground-page',
  imports: [RouterLink, TngTextareaPrimitive, TngTextarea],
  templateUrl: './textarea-playground-page.component.html',
  styleUrl: './textarea-playground-page.component.css',
})
export class TextareaPlaygroundPageComponent {
  public readonly notes = signal('Initial value from component input');

  public onNotesChange(value: string): void {
    this.notes.set(value);
  }
}
