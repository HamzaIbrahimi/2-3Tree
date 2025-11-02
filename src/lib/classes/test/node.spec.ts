import { describe, it, expect, beforeEach } from 'vitest';
import TreeNode from '../node';

let node: TreeNode;

beforeEach(() => {
	node = new TreeNode();
});

describe('check public fields', () => {
	it('has the correct properties and null on initialization', () => {
		expect(node.parent).toBeNull();
		expect(node.left).toBeNull();
		expect(node.middle).toBeNull();
		expect(node.right).toBeNull();
	});
});

describe('node keys check', () => {
	it('has an empty keys array on initialization', () => {
		expect(node.keys.length).toBe(0);
	});
});

describe('Check keys after insertion', () => {
	it('adds a string key to the node', () => {
		node.insertKey('A');
		expect(node.keys[0]).toBe('A');
		expect(node.keyCount).toBe(1);
	});
});

describe('Can have three keys Maximum', () => {
	it('adds three keys to the node', () => {
		node.insertKey('A');
		node.insertKey('B');
		node.insertKey('C');
		node.insertKey('D');
		expect(node.keys).toEqual(['A', 'B', 'C']);
		expect(node.keyCount).toBe(3);
	});
});

describe('Node is full when three are inserted', () => {
	it('adds three keys and expects node to be full', () => {
		node.insertKey('A');
		node.insertKey('B');
		node.insertKey('C');
		expect(node.isFull()).toBeTruthy();
	});
});

describe('Node is not full on less than 3 keys', () => {
	it('adds 2 keys and expects node to be not full', () => {
		node.insertKey('A');
		node.insertKey('B');
		expect(node.isFull()).toBeFalsy();
	});
});

describe('Node sorts the keys on insertion', () => {
	it('adds 3 keys in random order', () => {
		node.insertKey('C');
		node.insertKey('B');
		node.insertKey('A');
		expect(node.keys).toEqual(['A', 'B', 'C']);
	});
});

describe('Node does not add an already existing key', () => {
	it('adds two keys with the same character', () => {
		node.insertKey('A');
		node.insertKey('A');
		expect(node.keys).toEqual(['A']);
	});
});

describe('A node with no links should be a leaf', () => {
	it('checks whether the node is a leaf', () => {
		expect(node.isLeaf()).toBeTruthy();
	});
});

describe('A node with links should not be a leaf', () => {
	it('checks whether the node is not a leaf', () => {
		const leftNode = new TreeNode();
		node.left = leftNode;
		expect(node.isLeaf()).toBeFalsy();
	});
});

describe('Check if its a 2Node', () => {
	it('checks whether a node is a 2Node', () => {
		node.insertKey('A');
		expect(node.isTwoNode()).toBeTruthy();
	});
});

describe('Check if its a 3Node', () => {
	it('checks whether a node is a 2Node', () => {
		node.insertKey('A');
		node.insertKey('B');
		expect(node.isThreeNode()).toBeTruthy();
	});
});
