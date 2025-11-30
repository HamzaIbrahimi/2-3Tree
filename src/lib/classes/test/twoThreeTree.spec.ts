import { describe, it, expect, beforeEach } from 'vitest';
import TwoThreeTree from '../twoThreeTree';

let tree: TwoThreeTree;
let algsTree: TwoThreeTree;

beforeEach(() => {
	tree = new TwoThreeTree();
	algsTree = new TwoThreeTree();
	const a = 'ALGORITHMS'.split('');
	a.forEach((key) => algsTree.insert(key));
});

describe('Has root on initialization', () => {
	it('has a root', () => {
		expect(tree.root).toBeNull();
	});
});

//------- Insert method tests -------

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

//------- Size method tests -------

describe('Should return the correct size', () => {
	it('Adds 3 keys and returns size', () => {
		expect(tree.size()).toBe(0);
	});
});

describe('Should return the correct size', () => {
	it('Adds 3 keys and returns size', () => {
		tree.insert('A');
		tree.insert('B');
		tree.insert('C');
		expect(tree.size()).toBe(3);
	});
});

describe('Should return the correct size on duplicate keys', () => {
	it('Adds 3 keys and returns size', () => {
		tree.insert('A');
		tree.insert('A');
		tree.insert('A');
		expect(tree.size()).toBe(1);
	});
});

describe('Should return the correct size on larger tree', () => {
	it('Adds 10 keys and returns size', () => {
		const keys = ['S', 'E', 'A', 'R', 'C', 'H', 'X', 'M', 'P', 'L'];
		keys.forEach((k) => tree.insert(k));
		expect(tree.size()).toBe(10);
	});
});

//------- search method test -------
describe('Should find deeper elements in the tree', () => {
	it('inserts 3 keys into the tree and gets size', () => {
		tree.insert('A');
		tree.insert('B');
		tree.insert('C');
		//Search returns the node that contains the key
		expect(tree.search('C')?.keys).toContain('C');
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

describe('Should return null on a key that does not exist', () => {
	it('inserts alphabet into the tree and looks for elements that do not exist', () => {
		const keys = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
		keys.forEach((k) => tree.insert(k));
		expect(tree.search('123')).toBeNull();
		expect(tree.search('a')).toBeNull();
	});
});

//------- delete method test -------
//Example from https://www.cs.princeton.edu/~dpw/courses/cos326-12/ass/2-3-trees.pdf
/*
│                   ┌──---- [T]

│                   ┌──---- [R]

│       ┌──---- [O | S]

│       │           └──---- [L | M]

└──---- [I]

        │       ┌──---- [H]

        └──---- [G]

                └──---- [A]
				*/
//The point here is to delete ALGORITHMS from the algsTree one by one
//And ensure the state of the tree matches that of the linked example
describe('Deletes A from algsTree ', () => {
	it('Deletes a leaf node with no children', () => {
		algsTree.delete('A');
		expect(algsTree.size()).toBe(9);
		expect(algsTree.root?.keys[0]).toBe('O');
		expect(algsTree.root?.children.map((k) => k.keys).flat()).toEqual(['I', 'S']);
		const I = algsTree.search('I')!;
		expect(I?.is2Node()).toBeTruthy();
		expect(I.children.map((k) => k.keys).flat()).toEqual(['G', 'H', 'L', 'M']);
		const S = algsTree.search('S')!;
		expect(S.children.map((k) => k.keys).flat()).toEqual(['R', 'T']);
	});
});

describe('Deletes AL from the algsTree', () => {
	it('Deletes a leaf node with no children', () => {
		algsTree.delete('A');
		algsTree.delete('L');
		expect(algsTree.size()).toBe(8);
		expect(algsTree.root?.keys[0]).toBe('O');
		expect(algsTree.root?.children.map((k) => k.keys).flat()).toEqual(['I', 'S']);
		const I = algsTree.search('I')!;
		expect(I?.is2Node()).toBeTruthy();
		expect(I.children.map((k) => k.keys).flat()).toEqual(['G', 'H', 'M']);
		const S = algsTree.search('S')!;
		expect(S.children.map((k) => k.keys).flat()).toEqual(['R', 'T']);
	});
});

describe('Deletes ALG from the algsTree', () => {
	it('Deletes a leaf node with no children', () => {
		algsTree.delete('A');
		algsTree.delete('L');
		algsTree.delete('G');
		expect(algsTree.size()).toBe(7);
		expect(algsTree.root?.keys[0]).toBe('O');
		expect(algsTree.root?.children.map((k) => k.keys).flat()).toEqual(['I', 'S']);
		const I = algsTree.search('I')!;
		expect(I?.is2Node()).toBeTruthy();
		expect(I.children.map((k) => k.keys).flat()).toEqual(['H', 'M']);
		const S = algsTree.search('S')!;
		expect(S.children.map((k) => k.keys).flat()).toEqual(['R', 'T']);
	});
});

describe('Deletes ALGO from the algsTree', () => {
	it('Deletes the root node which has two children', () => {
		algsTree.delete('A');
		algsTree.delete('L');
		algsTree.delete('G');
		algsTree.delete('O');
		expect(algsTree.size()).toBe(6);
		expect(algsTree.root!.keys).toEqual(['M', 'S']);
		expect(algsTree.root!.children.map((k) => k.keys).flat()).toEqual(['H', 'I', 'R', 'T']);
	});
});

describe('Deletes ALGOR from the algsTree', () => {
	it('Deletes a leaf where the parent is a 3 node', () => {
		algsTree.delete('A');
		algsTree.delete('L');
		algsTree.delete('G');
		algsTree.delete('O');
		algsTree.delete('R');
		expect(algsTree.size()).toBe(5);
		expect(algsTree.root!.keys).toEqual(['I', 'S']);
		expect(algsTree.root!.children.map((k) => k.keys).flat()).toEqual(['H', 'M', 'T']);
	});
});

describe('Deletes ALGORI from the algsTree', () => {
	it('Deletes a key from a root 2 node', () => {
		algsTree.delete('A');
		algsTree.delete('L');
		algsTree.delete('G');
		algsTree.delete('O');
		algsTree.delete('R');
		algsTree.delete('I');
		expect(algsTree.size()).toBe(4);
		expect(algsTree.root!.keys).toEqual(['S']);
		expect(algsTree.root!.children.map((k) => k.keys).flat()).toEqual(['H', 'M', 'T']);
	});
});

describe('Deletes ALGORIT from the algsTree', () => {
	it('Deletes a leaf node', () => {
		algsTree.delete('A');
		algsTree.delete('L');
		algsTree.delete('G');
		algsTree.delete('O');
		algsTree.delete('R');
		algsTree.delete('I');
		algsTree.delete('T');
		expect(algsTree.size()).toBe(3);
		expect(algsTree.root!.keys).toEqual(['M']);
		expect(algsTree.root!.children.map((k) => k.keys).flat()).toEqual(['H', 'S']);
	});
});

describe('Deletes ALGORITH from the algsTree', () => {
	it('Deletes a leaf node', () => {
		algsTree.delete('A');
		algsTree.delete('L');
		algsTree.delete('G');
		algsTree.delete('O');
		algsTree.delete('R');
		algsTree.delete('I');
		algsTree.delete('T');
		algsTree.delete('H');
		expect(algsTree.size()).toBe(2);
		expect(algsTree.root!.keys).toEqual(['M', 'S']);
		expect(algsTree.root?.children).toEqual([]);
	});
});

describe('Deletes ALGORITHM from the algsTree', () => {
	it('Deletes a key from a 2 node root', () => {
		algsTree.delete('A');
		algsTree.delete('L');
		algsTree.delete('G');
		algsTree.delete('O');
		algsTree.delete('R');
		algsTree.delete('I');
		algsTree.delete('T');
		algsTree.delete('H');
		algsTree.delete('M');
		expect(algsTree.size()).toBe(1);
		expect(algsTree.root!.keys).toEqual(['S']);
		expect(algsTree.root?.children).toEqual([]);
	});
});

describe('Deletes ALGORITHMS from the algsTree', () => {
	it('Deletes all keys from algsTree', () => {
		algsTree.delete('A');
		algsTree.delete('L');
		algsTree.delete('G');
		algsTree.delete('O');
		algsTree.delete('R');
		algsTree.delete('I');
		algsTree.delete('T');
		algsTree.delete('H');
		algsTree.delete('M');
		algsTree.delete('S');
		expect(algsTree.size()).toBe(0);
		expect(algsTree.root!.keys).toEqual([]);
		expect(algsTree.root?.children).toEqual([]);
	});
});
