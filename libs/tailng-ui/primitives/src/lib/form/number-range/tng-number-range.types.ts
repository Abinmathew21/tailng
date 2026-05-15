export type TngNumberRangeValue = {
  min: number | null;
  max: number | null;
};

export type TngNumberRangeSource = 'min' | 'max';

export type TngNumberRangeChangeEvent = {
  value: TngNumberRangeValue;
  source: TngNumberRangeSource;
  valid: boolean;
};

export type TngNumberRangeSlots =
  | 'root'
  | 'group'
  | 'minInput'
  | 'separator'
  | 'maxInput';
