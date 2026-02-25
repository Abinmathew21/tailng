import { Component, signal } from '@angular/core';
import { TngCopyButtonComponent } from '@tailng-ui/components';
import { TngCopy } from '@tailng-ui/primitives';

@Component({
  selector: 'app-copy-playground-page',
  imports: [TngCopy, TngCopyButtonComponent],
  templateUrl: './copy-playground-page.component.html',
  styleUrl: './copy-playground-page.component.css',
})
export class CopyPlaygroundPageComponent {
  protected readonly copyStatusMessage = signal('No copy action yet.');
  protected readonly installCommand = 'pnpm add @tailng-ui/components';

  protected onCopied(payload: string): void {
    this.copyStatusMessage.set(`Copied ${payload.length} characters.`);
  }

  protected onCopyError(error: Error): void {
    this.copyStatusMessage.set(error.message);
  }
}
