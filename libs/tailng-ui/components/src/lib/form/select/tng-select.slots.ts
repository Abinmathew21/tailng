import { Directive, TemplateRef, inject } from '@angular/core';

export type TngSelectTriggerTplContext<O, V> = Readonly<{
  value: V | null;
  option: O | null;
  label: string;
  placeholder: string;
  open: boolean;
  disabled: boolean;
}>;

@Directive({
  selector: 'ng-template[tngSelectTriggerTpl]',
})
export class TngSelectTriggerTpl<O = unknown, V = unknown> {
  readonly tpl = inject(TemplateRef<TngSelectTriggerTplContext<O, V>>);
}

export type TngSelectOptionTplContext<O, V> = Readonly<{
  $implicit: O;
  option: O;
  value: V;
  label: string;
  selected: boolean;
  active: boolean;
  disabled: boolean;
}>;

@Directive({
  selector: 'ng-template[tngSelectOptionTpl]',
})
export class TngSelectOptionTpl<O = unknown, V = unknown> {
  readonly tpl = inject(TemplateRef<TngSelectOptionTplContext<O, V>>);
}