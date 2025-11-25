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

describe('Handles non-sequential insertion', () => {
	it('inserts keys in descending order', () => {
		tree.insert('E');
		tree.insert('D');
		tree.insert('C');
		tree.insert('B');
		tree.insert('A');
		expect(tree.root?.keys).toEqual(['B', 'D']);
		const [left, mid, right] = tree.root!.children;
		expect(left.keys[0]).toBe('A');
		expect(mid.keys[0]).toBe('C');
		expect(right.keys[0]).toBe('E');
	});
});
describe('Handles random order', () => {
	it('inserts keys in random order', () => {
		tree.insert('C');
		tree.insert('A');
		tree.insert('E');
		tree.insert('B');
		tree.insert('D');
		expect(tree.root?.keys).toEqual(['C']);
		const [left, right] = tree.root!.children;
		expect(left.keys).toEqual(['A', 'B']);
		expect(right.keys).toEqual(['D', 'E']);
	});
});

describe('Creates deeper tree structure', () => {
	it('inserts 10 keys and maintains balance', () => {
		//Book example thorough test
		/*		│-──---- [S | X]
│       ┌──---- [R]
│       │       └──---- [P]
└──---- [M]
        │       ┌──---- [H | L]
        └──---- [E]
                └──---- [A | C] */
		const keys = ['S', 'E', 'A', 'R', 'C', 'H', 'X', 'M', 'P', 'L'];
		keys.forEach((k) => tree.insert(k));
		expect(tree.root?.keys).toEqual(['M']);
		const [left_root_child, right_root_child] = tree.root!.children;
		expect([...left_root_child.keys, ...right_root_child.keys]).toEqual(['E', 'R']);
		const [left, right] = left_root_child.children;
		const [leftR, rightR] = right_root_child.children;
		expect([...left.keys, ...right.keys]).toEqual(['A', 'C', 'H', 'L']);
		expect([...leftR.keys, ...rightR.keys]).toEqual(['P', 'S', 'X']);
	});
});

describe('Should return get correct size', () => {
	it('Adds 3 keys and returns size', () => {
		tree.insert('A');
		tree.insert('B');
		tree.insert('C');
		expect(tree.size()).toBe(3);
	});
});
describe('Should return get correct size on duplicate keys', () => {
	it('Adds 3 keys and returns size', () => {
		tree.insert('A');
		tree.insert('A');
		tree.insert('A');
		expect(tree.size()).toBe(1);
	});
});

describe('Should return get correct size on larger tree', () => {
	it('Adds 10 keys and returns size', () => {
		const keys = ['S', 'E', 'A', 'R', 'C', 'H', 'X', 'M', 'P', 'L'];
		keys.forEach((k) => tree.insert(k));
		expect(tree.size()).toBe(10);
	});
});

describe('Should find deeper elements in the tree', () => {
	it('inserts 3 keys into the tree and gets size', () => {
		tree.insert('A');
		tree.insert('B');
		tree.insert('C');
		//Search returns the node that contains the key
		expect(tree.search('C')?.keys).toContain('C');
		expect(tree.size()).toBe(3);
	});
});
describe('Should find deeper elements in the tree', () => {
	it('inserts alphabet into the tree and finds elements and also size', () => {
		const keys = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
		keys.forEach((k) => tree.insert(k));
		expect(tree.search('E')?.keys).toContain('E');
		expect(tree.search('Z')?.keys).toContain('Z');
		expect(tree.search('A')?.keys).toContain('A');
		expect(tree.search('M')?.keys).toContain('M');
		expect(tree.size()).toBe(26);
	});
});
