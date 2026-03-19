import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: '[tngCodeBlock]',
  exportAs: 'tngCodeBlock',
  standalone: true,
})
export class TngCodeBlock {
  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'code-block' as const;
}

@Directive({
  selector: '[tngCodeBlockHeader]',
  exportAs: 'tngCodeBlockHeader',
  standalone: true,
})
export class TngCodeBlockHeader {
  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'code-block-header' as const;
}

@Directive({
  selector: '[tngCodeBlockBody]',
  exportAs: 'tngCodeBlockBody',
  standalone: true,
})
export class TngCodeBlockBody {
  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'code-block-body' as const;
}

@Directive({
  selector: '[tngCodeBlockGutter]',
  exportAs: 'tngCodeBlockGutter',
  standalone: true,
})
export class TngCodeBlockGutter {
  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'code-block-gutter' as const;
}

@Directive({
  selector: '[tngCodeBlockCode]',
  exportAs: 'tngCodeBlockCode',
  standalone: true,
})
export class TngCodeBlockCode {
  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'code-block-code' as const;
}
