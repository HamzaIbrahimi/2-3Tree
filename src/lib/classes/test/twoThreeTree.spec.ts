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

describe('A root can contain two keys', () => {
	it('inserts two keys into the root', () => {
		tree.insert('A');
		tree.insert('B');
		expect(tree.root?.keys).toEqual(['A', 'B']);
	});
});

describe('If 3 keys are inserted into the root, it is split into 3 nodes', () => {
	it('inserts 3 keys into the root', () => {
		tree.insert('A');
		tree.insert('B');
		tree.insert('C');
		expect(tree.root?.keys.length).toBe(1);
		expect(tree.root?.children.length).toBe(2);
	});
});

describe('If 5 keys are inserted, they are correctly placed', () => {
	it('inserts 5 keys into the root', () => {
		tree.insert('A');
		tree.insert('B');
		tree.insert('C');
		tree.insert('D');
		tree.insert('E');
		expect(tree.root?.keys).toEqual(['B', 'D']);
		const [left, mid, right] = tree.root!.children;
		expect(left.keys[0]).toBe('A');
		expect(mid.keys[0]).toBe('C');
		expect(right.keys[0]).toBe('E');
	});
});

describe('Handles duplicate keys', () => {
	it('inserts duplicate key', () => {
		tree.insert('A');
		tree.insert('A');
		expect(tree.root?.keys).toEqual(['A']);
	});
});

// describe('Handles non-sequential insertion', () => {
// 	it('inserts keys in descending order', () => {
// 		tree.insert('E');
// 		tree.insert('D');
// 		tree.insert('C');
// 		tree.insert('B');
// 		tree.insert('A');
// 		// Verify structure
// 	});

// 	it('inserts keys in random order', () => {
// 		tree.insert('C');
// 		tree.insert('A');
// 		tree.insert('E');
// 		tree.insert('B');
// 		tree.insert('D');
// 		expect(tree.root?.keys).toEqual(['B', 'D']);
// 	});
// });

// describe('Creates deeper tree structure', () => {
// 	it('inserts 10 keys and maintains balance', () => {
// 		const keys = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
// 		keys.forEach((k) => tree.insert(k));
// 		// Verify tree height and structure
// 	});
// });
// describe('Should find any key on the root', () => {
// 	it('Adds 3 keys and finds them', () => {
// 		tree.insert('A');
// 		tree.insert('B');
// 		tree.insert('C');
// 		expect(tree.find('A')).toEqual(tree.root?.left);
// 	});
// });

// describe('Should find deeper elements in the tree', () => {
// 	it('inserts 5 keys into the root and finds E', () => {
// 		tree.insert('A');
// 		tree.insert('B');
// 		tree.insert('C');
// 		tree.insert('D');
// 		tree.insert('E');
// 		expect(tree.find('E')?.keys).toContain('E');
// 	});
// });
