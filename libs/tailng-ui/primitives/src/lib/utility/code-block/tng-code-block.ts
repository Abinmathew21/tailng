import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: '[tngCodeBlock]',
  exportAs: 'tngCodeBlock',
})
export class TngCodeBlock {
  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'code-block' as const;
}

@Directive({
  selector: '[tngCodeBlockHeader]',
  exportAs: 'tngCodeBlockHeader',
})
export class TngCodeBlockHeader {
  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'code-block-header' as const;
}

@Directive({
  selector: '[tngCodeBlockBody]',
  exportAs: 'tngCodeBlockBody',
})
export class TngCodeBlockBody {
  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'code-block-body' as const;
}

@Directive({
  selector: '[tngCodeBlockGutter]',
  exportAs: 'tngCodeBlockGutter',
})
export class TngCodeBlockGutter {
  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'code-block-gutter' as const;
}

@Directive({
  selector: '[tngCodeBlockCode]',
  exportAs: 'tngCodeBlockCode',
})
export class TngCodeBlockCode {
  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'code-block-code' as const;
}
