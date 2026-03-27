import type { WritableSignal } from '@angular/core';

export const STACKBLITZ_VANILLA_URL = 'https://stackblitz.com/~/github.com/tailng/tailng-demo-headless-vanilla-v1/tree';
export const generateStackblitzVanillaUrl = (path: string, file: string): string => `${STACKBLITZ_VANILLA_URL}/${path}?file=${file}`;
export const STACKBLITZ_TAILWIND_URL = 'https://stackblitz.com/~/github.com/tailng/tailng-demo-headless-tailwind-v1/tree';
export const generateStackblitzTailwindUrl = (path: string, file: string): string => `${STACKBLITZ_TAILWIND_URL}/${path}?file=${file}`;

export type DocsCodeBlockTheme = 'github-dark' | 'github-light';

export function resolveDocsCodeBlockTheme(documentRef: Document): DocsCodeBlockTheme {
  const root = documentRef.documentElement;
  const inlineColorScheme = root.style.getPropertyValue('color-scheme').trim().toLowerCase();
  if (inlineColorScheme.includes('dark')) {
    return 'github-dark';
  }

  const computedColorScheme = documentRef.defaultView
    ?.getComputedStyle(root)
    .getPropertyValue('color-scheme')
    .trim()
    .toLowerCase();

  return computedColorScheme?.includes('dark') ? 'github-dark' : 'github-light';
}

export function observeDocsCodeThemeChanges(
  documentRef: Document,
  codeBlockTheme: WritableSignal<DocsCodeBlockTheme>,
): MutationObserver | null {
  const mutationObserverCtor = documentRef.defaultView?.MutationObserver;
  if (mutationObserverCtor === undefined) {
    return null;
  }

  const observer = new mutationObserverCtor(() => {
    codeBlockTheme.set(resolveDocsCodeBlockTheme(documentRef));
  });

  observer.observe(documentRef.documentElement, {
    attributeFilter: ['style', 'class'],
    attributes: true,
  });

  return observer;
}
