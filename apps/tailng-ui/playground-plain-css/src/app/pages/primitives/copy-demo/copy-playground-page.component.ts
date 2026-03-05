import { Component, signal } from '@angular/core';
import { TngCopyButton } from '@tailng-ui/components';
import { TngCopy } from '@tailng-ui/primitives';

@Component({
  selector: 'app-copy-playground-page',
  imports: [TngCopy, TngCopyButton],
  templateUrl: './copy-playground-page.component.html',
  styleUrl: './copy-playground-page.component.css',
})
export class CopyPlaygroundPageComponent {
  protected readonly copyStatusMessage = signal('No copy action yet.');
  protected readonly installCommand = 'pnpm add @tailng-ui/components';

  protected onCopied(payload: string): void {
    this.copyStatusMessage.set(`Copied ${payload.length} characters.`);
  }

  protected onCopyError(error: unknown): void {
    if (error instanceof Error) {
      this.copyStatusMessage.set(error.message);
      return;
    }

    if (typeof error === 'object' && error !== null && 'error' in error) {
      const nestedError = (error as { error: unknown }).error;
      if (nestedError instanceof Error) {
        this.copyStatusMessage.set(nestedError.message);
        return;
      }
    }

    this.copyStatusMessage.set('Copy failed.');
  }
}
