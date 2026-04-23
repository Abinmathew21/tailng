import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  HostBinding,
  TemplateRef,
  computed,
  inject,
  input,
} from '@angular/core';

export type TngTableCellTplContext<
  TRow = unknown,
  TValue = unknown,
  TColumnId extends string = string,
> = Readonly<{
  $implicit: TValue;
  columnId: TColumnId | null;
  row: TRow;
  rowId: string | null;
  value: TValue;
}>;

export type TngTableHeaderTplContext<TColumnId extends string = string> = Readonly<{
  $implicit: string;
  columnId: TColumnId | null;
  label: string;
}>;

export type TngTableFooterTplContext<
  TRow = unknown,
  TValue = unknown,
  TColumnId extends string = string,
> = Readonly<{
  $implicit: TValue;
  columnId: TColumnId | null;
  items: readonly TRow[];
  value: TValue;
}>;

export type TngTableCellFormatter<
  TRow = unknown,
  TValue = unknown,
  TColumnId extends string = string,
> = (value: TValue, context: TngTableCellTplContext<TRow, TValue, TColumnId>) => string;

export type TngTableFooterFormatter<
  TRow = unknown,
  TValue = unknown,
  TColumnId extends string = string,
> = (value: TValue, context: TngTableFooterTplContext<TRow, TValue, TColumnId>) => string;

type TngTableFormattedTextState<TContext> = Readonly<{
  error: Readonly<{ thrown: unknown }> | null;
  text: string;
  context: TContext;
}>;

function normalizeOptionalString(value: unknown): string | null {
  if (typeof value !== 'string') {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function isTemplateRefLike<TContext>(value: unknown): value is TemplateRef<TContext> {
  return typeof value === 'object' && value !== null && 'createEmbeddedView' in value;
}

function resolveTemplateRef<TContext>(
  value: unknown,
): TemplateRef<TContext> | null {
  if (isTemplateRefLike<TContext>(value)) {
    return value;
  }

  if (
    typeof value === 'object'
    && value !== null
    && 'tpl' in value
    && isTemplateRefLike<TContext>(value.tpl)
  ) {
    return value.tpl;
  }

  return null;
}

function formatTableText<TValue, TContext>(
  value: TValue | null,
  context: TContext,
  formatter: ((value: TValue | null, context: TContext) => string) | null,
): TngTableFormattedTextState<TContext> {
  if (formatter === null) {
    return Object.freeze({
      context,
      error: null,
      text: resolveTngTableTextContent(value),
    });
  }

  try {
    return Object.freeze({
      context,
      error: null,
      text: formatter(value, context),
    });
  } catch (error: unknown) {
    return Object.freeze({
      context,
      error: Object.freeze({ thrown: error }),
      text: resolveTngTableTextContent(value),
    });
  }
}

export function resolveTngTableTextContent(value: unknown): string {
  if (value === null || value === undefined) {
    return '';
  }

  if (typeof value === 'string') {
    return value;
  }

  if (
    typeof value === 'number'
    || typeof value === 'bigint'
    || typeof value === 'boolean'
  ) {
    return String(value);
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  return '';
}

@Directive({
  selector: 'ng-template[tngTableCellTpl]',
  exportAs: 'tngTableCellTpl',
})
export class TngTableCellTpl<
  TRow = unknown,
  TValue = unknown,
  TColumnId extends string = string,
> {
  public readonly tpl = inject<TemplateRef<TngTableCellTplContext<TRow, TValue, TColumnId>>>(
    TemplateRef,
  );
}

@Directive({
  selector: 'ng-template[tngTableHeaderTpl]',
  exportAs: 'tngTableHeaderTpl',
})
export class TngTableHeaderTpl<TColumnId extends string = string> {
  public readonly tpl = inject<TemplateRef<TngTableHeaderTplContext<TColumnId>>>(TemplateRef);
}

@Directive({
  selector: 'ng-template[tngTableFooterTpl]',
  exportAs: 'tngTableFooterTpl',
})
export class TngTableFooterTpl<
  TRow = unknown,
  TValue = unknown,
  TColumnId extends string = string,
> {
  public readonly tpl = inject<TemplateRef<TngTableFooterTplContext<TRow, TValue, TColumnId>>>(
    TemplateRef,
  );
}

@Component({
  selector: 'tng-table-cell-outlet',
  exportAs: 'tngTableCellOutlet',
  imports: [NgTemplateOutlet],
  template: `
    @if (resolvedTemplate(); as templateRef) {
      <ng-container
        [ngTemplateOutlet]="templateRef"
        [ngTemplateOutletContext]="context()"
      />
    } @else {
      {{ renderState().text }}
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TngTableCellOutlet<
  TRow = unknown,
  TValue = unknown,
  TColumnId extends string = string,
> {
  public readonly columnId = input<TColumnId | null, unknown>(null, {
    transform: (value: unknown): TColumnId | null => normalizeOptionalString(value) as TColumnId | null,
  });
  public readonly formatter = input<TngTableCellFormatter<TRow, TValue | null, TColumnId> | null>(null);
  public readonly row = input<TRow | null>(null);
  public readonly rowId = input<string | null, unknown>(null, {
    transform: normalizeOptionalString,
  });
  public readonly template = input<
    | TemplateRef<TngTableCellTplContext<TRow, TValue | null, TColumnId>>
    | TngTableCellTpl<TRow, TValue | null, TColumnId>
    | null
  >(null);
  public readonly value = input<TValue | null>(null);

  protected readonly context = computed<TngTableCellTplContext<TRow, TValue | null, TColumnId>>(() =>
    Object.freeze({
      $implicit: this.value(),
      columnId: this.columnId(),
      row: this.row() as TRow,
      rowId: this.rowId(),
      value: this.value(),
    }),
  );
  protected readonly renderState = computed<
    TngTableFormattedTextState<TngTableCellTplContext<TRow, TValue | null, TColumnId>>
  >(() => formatTableText(this.value(), this.context(), this.formatter()));
  protected readonly resolvedTemplate = computed(() =>
    resolveTemplateRef<TngTableCellTplContext<TRow, TValue | null, TColumnId>>(this.template()),
  );

  @HostBinding('attr.data-format-error')
  protected get dataFormatErrorAttr(): '' | null {
    return this.resolvedTemplate() === null && this.renderState().error !== null ? '' : null;
  }

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'table-cell-outlet' as const;

  public getFormatError(): unknown {
    return this.renderState().error?.thrown ?? null;
  }
}

@Component({
  selector: 'tng-table-header-outlet',
  exportAs: 'tngTableHeaderOutlet',
  imports: [NgTemplateOutlet],
  template: `
    @if (resolvedTemplate(); as templateRef) {
      <ng-container
        [ngTemplateOutlet]="templateRef"
        [ngTemplateOutletContext]="context()"
      />
    } @else {
      {{ labelText() }}
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TngTableHeaderOutlet<TColumnId extends string = string> {
  public readonly columnId = input<TColumnId | null, unknown>(null, {
    transform: (value: unknown): TColumnId | null => normalizeOptionalString(value) as TColumnId | null,
  });
  public readonly label = input<string | null, unknown>(null, {
    transform: normalizeOptionalString,
  });
  public readonly template = input<
    TemplateRef<TngTableHeaderTplContext<TColumnId>> | TngTableHeaderTpl<TColumnId> | null
  >(null);

  protected readonly labelText = computed(() => this.label() ?? this.columnId() ?? '');
  protected readonly context = computed<TngTableHeaderTplContext<TColumnId>>(() =>
    Object.freeze({
      $implicit: this.labelText(),
      columnId: this.columnId(),
      label: this.labelText(),
    }),
  );
  protected readonly resolvedTemplate = computed(() =>
    resolveTemplateRef<TngTableHeaderTplContext<TColumnId>>(this.template()),
  );

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'table-header-outlet' as const;
}

@Component({
  selector: 'tng-table-footer-outlet',
  exportAs: 'tngTableFooterOutlet',
  imports: [NgTemplateOutlet],
  template: `
    @if (resolvedTemplate(); as templateRef) {
      <ng-container
        [ngTemplateOutlet]="templateRef"
        [ngTemplateOutletContext]="context()"
      />
    } @else {
      {{ renderState().text }}
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TngTableFooterOutlet<
  TRow = unknown,
  TValue = unknown,
  TColumnId extends string = string,
> {
  public readonly columnId = input<TColumnId | null, unknown>(null, {
    transform: (value: unknown): TColumnId | null => normalizeOptionalString(value) as TColumnId | null,
  });
  public readonly formatter = input<TngTableFooterFormatter<TRow, TValue | null, TColumnId> | null>(null);
  public readonly items = input<readonly TRow[]>([]);
  public readonly template = input<
    | TemplateRef<TngTableFooterTplContext<TRow, TValue | null, TColumnId>>
    | TngTableFooterTpl<TRow, TValue | null, TColumnId>
    | null
  >(null);
  public readonly value = input<TValue | null>(null);

  protected readonly context = computed<TngTableFooterTplContext<TRow, TValue | null, TColumnId>>(() =>
    Object.freeze({
      $implicit: this.value(),
      columnId: this.columnId(),
      items: this.items(),
      value: this.value(),
    }),
  );
  protected readonly renderState = computed<
    TngTableFormattedTextState<TngTableFooterTplContext<TRow, TValue | null, TColumnId>>
  >(() => formatTableText(this.value(), this.context(), this.formatter()));
  protected readonly resolvedTemplate = computed(() =>
    resolveTemplateRef<TngTableFooterTplContext<TRow, TValue | null, TColumnId>>(this.template()),
  );

  @HostBinding('attr.data-format-error')
  protected get dataFormatErrorAttr(): '' | null {
    return this.resolvedTemplate() === null && this.renderState().error !== null ? '' : null;
  }

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'table-footer-outlet' as const;

  public getFormatError(): unknown {
    return this.renderState().error?.thrown ?? null;
  }
}
