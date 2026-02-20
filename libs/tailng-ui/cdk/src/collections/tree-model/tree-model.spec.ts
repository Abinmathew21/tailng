import { describe, expect, it } from 'vitest';
import { createTreeModel } from './tree-model';

const demoNodes = Object.freeze([
  { id: 'root-a' },
  { id: 'root-b' },
  { id: 'child-a1', parentId: 'root-a' },
  { id: 'child-a2', parentId: 'root-a' },
  { disabled: true, id: 'child-b1', parentId: 'root-b' },
  { id: 'child-b2', parentId: 'root-b' },
  { id: 'grandchild-b2-1', parentId: 'child-b2' },
]);

describe('createTreeModel', () => {
  it('keeps only roots visible until expanded', () => {
    const model = createTreeModel({ nodes: demoNodes });
    expect(model.getState().visibleIds).toEqual(['root-a', 'root-b']);

    model.expand('root-a');
    expect(model.getState().visibleIds).toEqual(['root-a', 'child-a1', 'child-a2', 'root-b']);
  });

  it('supports toggle, expandAll, and collapseAll', () => {
    const model = createTreeModel({ nodes: demoNodes });

    model.toggle('root-b');
    expect(model.getState().visibleIds).toEqual(['root-a', 'root-b', 'child-b1', 'child-b2']);

    model.expandAll();
    expect(model.getState().visibleIds).toEqual([
      'root-a',
      'child-a1',
      'child-a2',
      'root-b',
      'child-b1',
      'child-b2',
      'grandchild-b2-1',
    ]);

    model.collapseAll();
    expect(model.getState().visibleIds).toEqual(['root-a', 'root-b']);
  });

  it('moves active id across visible and selectable items', () => {
    const model = createTreeModel({
      expandedIds: ['root-b'],
      nodes: demoNodes,
    });

    expect(model.getState().activeId).toBe('root-a');

    model.moveNext();
    expect(model.getState().activeId).toBe('root-b');

    model.moveNext();
    expect(model.getState().activeId).toBe('child-b2');
  });

  it('ignores setting active id to hidden or disabled nodes', () => {
    const model = createTreeModel({ nodes: demoNodes });

    model.setActiveId('child-a1');
    expect(model.getState().activeId).not.toBe('child-a1');

    model.expand('root-b');
    model.setActiveId('child-b1');
    expect(model.getState().activeId).not.toBe('child-b1');
  });

  it('reconciles expanded and active ids when nodes are replaced', () => {
    const model = createTreeModel({
      activeId: 'child-a1',
      expandedIds: ['root-a'],
      nodes: demoNodes,
    });

    model.setNodes(
      Object.freeze([
        { id: 'next-root' },
        { id: 'next-child', parentId: 'next-root' },
      ]),
    );

    expect(model.getState().expandedIds).toEqual([]);
    expect(model.getState().activeId).toBe('next-root');
  });
});
