import { Component, input, signal } from '@angular/core';

@Component({
  selector: 'app-docs-form-demo-shell',
  templateUrl: './docs-form-demo-shell.component.html',
  styleUrl: './docs-form-demo-shell.component.css',
})
export class DocsFormDemoShellComponent {
  public readonly eyebrow = input<string>('Live form');
  public readonly title = input<string>('Form usage');
  public readonly description = input<string>('');
  public readonly submitLabel = input<string>('Submit form');
  public readonly submittedNote = input<string>(
    'Preview submitted. Wire this form to your save handler in application code.',
  );

  protected readonly submitted = signal(false);

  protected onSubmit(event: Event): void {
    event.preventDefault();
    this.submitted.set(true);
  }
}
