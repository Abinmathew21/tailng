import { booleanAttribute, Component, input } from '@angular/core';
import { TngLabel as TngLabelPrimitive } from '@tailng-ui/primitives';

export function resolveTngLabelForAttr(forId: string): string | null {
  const trimmedId = forId.trim();
  return trimmedId.length > 0 ? trimmedId : null;
}

@Component({
  standalone: true,
  selector: 'tng-label',
  imports: [TngLabelPrimitive],
  templateUrl: './tng-label.component.html',
  styleUrl: './tng-label.component.css',
})
export class TngLabelComponent {
  public readonly disabled = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly forId = input<string>('');
  public readonly required = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });

  public resolveForAttr(): string | null {
    return resolveTngLabelForAttr(this.forId());
  }
}
