export type TngAngularCdkFeature =
  | 'active-descendant'
  | 'overlay-backdrop'
  | 'overlay-outside-interaction'
  | 'overlay-portal'
  | 'overlay-positioning'
  | 'overlay-scroll-lock'
  | 'roving-focus'
  | 'selection-model'
  | 'typeahead';

export type TngAngularCdkAdapterMode = 'fallback-tailng' | 'prefer-angular-cdk';

export type TngAngularCdkAdapterConfig = Readonly<{
  enabledFeatures?: readonly TngAngularCdkFeature[];
  mode?: TngAngularCdkAdapterMode;
}>;

export type TngResolvedAngularCdkAdapterConfig = Readonly<{
  enabledFeatures: readonly TngAngularCdkFeature[];
  mode: TngAngularCdkAdapterMode;
}>;
