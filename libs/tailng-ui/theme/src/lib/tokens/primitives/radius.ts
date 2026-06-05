import type { TokenScale } from '../../contracts/token.types';

export const radiusPrimitives: TokenScale = {
  none: '0',
  xs:   '0.25rem',  // chips, badges, small inline elements
  sm:   '0.5rem',   // controls: inputs, selects, buttons, tooltips, tags
  md:   '0.75rem',  // panels: menus, accordions, tabs, popovers
  lg:   '1rem',     // surfaces: cards, dialogs, bottom-sheets
  full: '9999px',   // pills, avatars, switches
};
