import {
  createTngIconPack,
  provideTngIcons,
  type TngIconLoader,
} from '@tailng-ui/icons';
import bdFlagUrl from 'flag-icons/flags/4x3/bd.svg';
import brFlagUrl from 'flag-icons/flags/4x3/br.svg';
import cnFlagUrl from 'flag-icons/flags/4x3/cn.svg';
import idFlagUrl from 'flag-icons/flags/4x3/id.svg';
import inFlagUrl from 'flag-icons/flags/4x3/in.svg';
import mxFlagUrl from 'flag-icons/flags/4x3/mx.svg';
import ngFlagUrl from 'flag-icons/flags/4x3/ng.svg';
import pkFlagUrl from 'flag-icons/flags/4x3/pk.svg';
import ruFlagUrl from 'flag-icons/flags/4x3/ru.svg';
import usFlagUrl from 'flag-icons/flags/4x3/us.svg';

function createStaticSvgLoader(svg: string): TngIconLoader {
  return (): Promise<string> => Promise.resolve(svg);
}

function createFlagSvgLoader(svgUrl: string): TngIconLoader {
  return async (): Promise<string> => {
    const response = await fetch(svgUrl);
    if (!response.ok) {
      throw new Error(`Failed to load flag icon from "${svgUrl}".`);
    }

    return response.text();
  };
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
  bd: createFlagSvgLoader(bdFlagUrl),
  br: createFlagSvgLoader(brFlagUrl),
  cn: createFlagSvgLoader(cnFlagUrl),
  id: createFlagSvgLoader(idFlagUrl),
  in: createFlagSvgLoader(inFlagUrl),
  mx: createFlagSvgLoader(mxFlagUrl),
  ng: createFlagSvgLoader(ngFlagUrl),
  pk: createFlagSvgLoader(pkFlagUrl),
  ru: createFlagSvgLoader(ruFlagUrl),
  us: createFlagSvgLoader(usFlagUrl),
});

export const tngIconProviders = provideTngIcons({
  packs: [customPack1, customPack2, flagPack],
});
