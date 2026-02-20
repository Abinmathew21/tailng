import {
  createTngIconPack,
  provideTngIcons,
  type TngIconLoader,
} from '@tailng-ui/icons';

const flagSvgBaseUrl = 'https://cdn.jsdelivr.net/npm/flag-icons@7.5.0/flags/4x3';

function createFlagSvgLoader(countryCode: string): TngIconLoader {
  const svgUrl = `${flagSvgBaseUrl}/${countryCode}.svg`;
  return async (): Promise<string> => {
    const response = await fetch(svgUrl);
    if (!response.ok) {
      throw new Error(`Failed to load flag icon from "${svgUrl}".`);
    }

    return response.text();
  };
}

function createStaticSvgLoader(svg: string): TngIconLoader {
  return (): Promise<string> => Promise.resolve(svg);
}

const customPack1 = createTngIconPack('customPack1', {
  badge: createStaticSvgLoader(
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/></svg>',
  ),
});

const customPack2 = createTngIconPack('customPack2', {
  sparkle: createStaticSvgLoader(
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3l2.2 6.8L21 12l-6.8 2.2L12 21l-2.2-6.8L3 12l6.8-2.2Z"/></svg>',
  ),
});

const flagPack = createTngIconPack('flags', {
  bd: createFlagSvgLoader('bd'),
  br: createFlagSvgLoader('br'),
  cn: createFlagSvgLoader('cn'),
  id: createFlagSvgLoader('id'),
  in: createFlagSvgLoader('in'),
  mx: createFlagSvgLoader('mx'),
  ng: createFlagSvgLoader('ng'),
  pk: createFlagSvgLoader('pk'),
  ru: createFlagSvgLoader('ru'),
  us: createFlagSvgLoader('us'),
});

export const tngIconProviders = provideTngIcons({
  packs: [customPack1, customPack2, flagPack],
});
