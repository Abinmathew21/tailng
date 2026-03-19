import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: '[tngAvatar]',
  exportAs: 'tngAvatar',
  standalone: true,
})
export class TngAvatar {
  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'avatar' as const;
}

@Directive({
  selector: 'img[tngAvatarImage]',
  exportAs: 'tngAvatarImage',
  standalone: true,
})
export class TngAvatarImage {
  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'avatar-image' as const;
}

@Directive({
  selector: '[tngAvatarFallback]',
  exportAs: 'tngAvatarFallback',
  standalone: true,
})
export class TngAvatarFallback {
  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'avatar-fallback' as const;
}
