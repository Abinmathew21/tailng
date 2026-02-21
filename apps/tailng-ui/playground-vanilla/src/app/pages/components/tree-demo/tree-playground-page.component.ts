import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TngTree, type TngTreeItem } from '@tailng-ui/components';
import { TngTree as TngTreePrimitive } from '@tailng-ui/primitives';

const treeNodes: readonly TngTreeItem[] = Object.freeze([
  {
    description: 'Workspace root for TailNG.',
    id: 'workspace',
    label: 'tailng-ui',
  },
  {
    description: 'Reusable libraries and design-system packages.',
    id: 'libs',
    label: 'libs',
    parentId: 'workspace',
  },
  {
    description: 'Primitive behavior and styled wrappers.',
    id: 'components',
    label: 'tailng-ui',
    parentId: 'libs',
  },
  {
    description: 'Theme tokens, adapters, and css variables.',
    id: 'tokens',
    label: 'theme',
    parentId: 'components',
  },
  {
    description: 'Unstyled accessibility and behavior primitives.',
    id: 'primitives',
    label: 'primitives',
    parentId: 'components',
  },
  {
    description: 'Docs, playground-tailwind, playground-vanilla.',
    id: 'apps',
    label: 'apps',
    parentId: 'workspace',
  },
  {
    description: 'Interactive demos for utility-class consumers.',
    id: 'tailwind-app',
    label: 'playground-tailwind',
    parentId: 'apps',
  },
  {
    description: 'Plain-css verification target.',
    id: 'vanilla-app',
    label: 'playground-vanilla',
    parentId: 'apps',
  },
  {
    description: 'Backlog bucket, intentionally disabled.',
    disabled: true,
    id: 'future',
    label: 'future-roadmap',
    parentId: 'workspace',
  },
]);

const defaultExpandedIds = Object.freeze(['workspace', 'libs', 'components', 'apps']);

const labelById: ReadonlyMap<string, string> = new Map(
  treeNodes.map((node) => [node.id, node.label] as const),
);

function toSelectionLabel(nodeId: string | null): string {
  if (nodeId === null) {
    return 'None';
  }

  return labelById.get(nodeId) ?? 'None';
}

@Component({
  selector: 'app-tree-playground-page',
  imports: [RouterLink, TngTreePrimitive, TngTree],
  templateUrl: './tree-playground-page.component.html',
  styleUrl: './tree-playground-page.component.css',
})
export class TreePlaygroundPageComponent {
  public readonly defaultExpandedIds = defaultExpandedIds;
  public readonly selectedLabel = signal(toSelectionLabel('tokens'));
  public readonly treeNodes = treeNodes;

  public onSelectedIdChange(nodeId: string | null): void {
    this.selectedLabel.set(toSelectionLabel(nodeId));
  }
}
