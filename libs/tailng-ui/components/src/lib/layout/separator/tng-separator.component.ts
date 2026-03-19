import { booleanAttribute, Component, input } from '@angular/core';
import {
  TngSeparator as TngSeparatorPrimitive,
  type TngSeparatorOrientation,
} from '@tailng-ui/primitives';

@Component({
  standalone: true,
  selector: 'tng-separator',
  imports: [TngSeparatorPrimitive],
  templateUrl: './tng-separator.component.html',
  styleUrl: './tng-separator.component.css',
})
export class TngSeparatorComponent {
  public readonly decorative = input<boolean, boolean | string>(true, {
    transform: booleanAttribute,
  });
  public readonly orientation = input<TngSeparatorOrientation>('horizontal');
}
