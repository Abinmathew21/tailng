export function syncPortalledThemeVars(options: Readonly<{
  cssVars: readonly string[];
  panel: HTMLElement;
  source: HTMLElement;
}>): void {
  const panelStyles = options.panel.style;
  const sourceStyles = getComputedStyle(options.source);

  for (const cssVar of options.cssVars) {
    const value = sourceStyles.getPropertyValue(cssVar).trim();
    if (value !== '') {
      panelStyles.setProperty(cssVar, value);
    } else {
      panelStyles.removeProperty(cssVar);
    }
  }

  const colorScheme = sourceStyles.colorScheme?.trim();
  if (colorScheme !== '' && colorScheme !== 'normal') {
    options.panel.style.colorScheme = colorScheme;
  } else {
    panelStyles.removeProperty('color-scheme');
  }
}

export function clearPortalledThemeVars(panel: HTMLElement, cssVars: readonly string[]): void {
  const panelStyles = panel.style;

  for (const cssVar of cssVars) {
    panelStyles.removeProperty(cssVar);
  }

  panelStyles.removeProperty('color-scheme');
}

export function resolveCssCustomPropertyPx(
  source: HTMLElement,
  cssVar: string,
  fallback: number,
): number {
  const ownerDocument = source.ownerDocument;
  if (ownerDocument === null) {
    return fallback;
  }

  const probe = ownerDocument.createElement('div');
  probe.style.position = 'absolute';
  probe.style.visibility = 'hidden';
  probe.style.pointerEvents = 'none';
  probe.style.inlineSize = `var(${cssVar}, ${fallback}px)`;
  probe.setAttribute('aria-hidden', 'true');
  source.appendChild(probe);

  const resolved = Number.parseFloat(getComputedStyle(probe).width);
  source.removeChild(probe);
  return Number.isFinite(resolved) ? resolved : fallback;
}

export function applyFixedPortalledOverlayBaseStyles(
  panel: HTMLElement,
  zIndex = '1000',
): void {
  panel.style.position = 'fixed';
  panel.style.left = '0px';
  panel.style.top = '0px';
  panel.style.visibility = 'hidden';
  panel.style.zIndex = zIndex;
}

export function clearFixedPortalledOverlayBaseStyles(panel: HTMLElement): void {
  panel.style.left = '';
  panel.style.position = '';
  panel.style.top = '';
  panel.style.visibility = '';
  panel.style.zIndex = '';
}
