import type { ComponentStyleContract } from '../../contracts/component-style-contract.types';

export type TreeSlot =
  | 'root'
  | 'item'
  | 'indicator'
  | 'group';

export type TreeState =
  | 'default'
  | 'expanded'
  | 'collapsed'
  | 'selected'
  | 'disabled';

export const treeStyleContract: ComponentStyleContract<TreeSlot, TreeState> = {
  slots: {
    root: 'tng-tree',
    item: 'tng-tree-item',
    indicator: 'tng-tree-indicator',
    group: 'tng-tree-group',
  },
  states: {
    default: '[data-state="default"]',
    expanded: '[data-expanded="true"]',
    collapsed: '[data-expanded="false"]',
    selected: '[data-selected="true"]',
    disabled: '[data-disabled="true"]',
  },
  cssVars: {
    '--tng-tree-item-bg-hover': '{semantic.background.hover}',
    '--tng-tree-item-bg-selected': '{semantic.background.active}',
    '--tng-tree-item-fg': '{semantic.foreground.default}',
    '--tng-tree-item-fg-selected': '{semantic.foreground.brand}',
    '--tng-tree-item-radius': '{radius.sm}',
    '--tng-tree-item-px': '{spacing.sm}',
    '--tng-tree-item-py': '{spacing.xs}',
    '--tng-tree-indent': '{spacing.xl}',
  },
};
