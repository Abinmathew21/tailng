import { Component, signal } from '@angular/core';
import { TngCopyButtonComponent } from '@tailng-ui/components';
import { TngCopy } from '@tailng-ui/primitives';
import type { TngCopyEvent, TngCopySuccessEvent } from '@tailng-ui/primitives';

@Component({
  selector: 'app-copy-playground-page',
  imports: [TngCopy, TngCopyButtonComponent],
  templateUrl: './copy-playground-page.component.html',
})
export class CopyPlaygroundPageComponent {
  protected readonly copyStatusMessage = signal('No copy action yet.');
  protected readonly installCommand = 'pnpm add @tailng-ui/components';
  protected readonly dynamicCommand = signal('pnpm nx run playground-tailwind:serve');
  protected readonly advancedStatus = signal('Waiting for copy action.');

  protected onCopied(payload: string): void {
    this.copyStatusMessage.set(`Copied ${payload.length} characters.`);
  }

  protected onCopyError(error: unknown): void {
    if (error instanceof Error) {
      this.copyStatusMessage.set(error.message);
      this.advancedStatus.set(`Error: ${error.message}`);
      return;
    }

    if (typeof error === 'object' && error !== null && 'error' in error) {
      const nestedError = (error as { error: unknown }).error;
      if (nestedError instanceof Error) {
        this.copyStatusMessage.set(nestedError.message);
        this.advancedStatus.set(`Error: ${nestedError.message}`);
        return;
      }
    }

    this.copyStatusMessage.set('Copy failed.');
    this.advancedStatus.set('Error: Copy failed.');
  }

  protected onAdvancedCopy(event: TngCopyEvent): void {
    this.advancedStatus.set(`Copy requested by ${event.trigger} for ${event.text.length} chars.`);
  }

  protected onAdvancedCopySuccess(event: TngCopySuccessEvent): void {
    this.advancedStatus.set(`Copied via ${event.method}: "${event.text}"`);
  }
}
