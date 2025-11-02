import { describe, it, expect, beforeEach } from 'vitest';
import TwoThreeTree from '../twoThreeTree';

let tree: TwoThreeTree;

beforeEach(() => {
	tree = new TwoThreeTree();
});

describe('Has root on initialization', () => {
	it('has a root', () => {
		expect(tree.root).toBeNull();
	});
});

describe('A key can be inserted into the tree', () => {
	it('inserts a key into the tree', () => {
		tree.insert('A');
		expect(tree.root?.keys[0]).toBe('A');
	});
});

describe('If 3 keys are inserted into the root, it is split into 3 nodes', () => {
	it('inserts 3 keys into the root', () => {
		tree.insert('A');
		tree.insert('B');
		tree.insert('C');
		expect(tree.root?.left?.keys[0]).toBe('A');
		expect(tree.root?.keys[0]).toBe('B');
		expect(tree.root?.right?.keys[0]).toBe('C');
	});
});

describe('Should find any key on the root', () => {
	it('Adds 3 keys and finds them', () => {
		tree.insert('A');
		tree.insert('B');
		tree.insert('C');
		expect(tree.find('A')).toEqual(tree.root?.left);
	});
});
