import { describe, it, expect, beforeEach } from 'vitest';
import TreeNode from '../node';

let node: TreeNode;

beforeEach(() => {
	node = new TreeNode();
});

describe('node keys check', () => {
	it('has an empty keys array on initialization', () => {
		expect(node.keys.length).toBe(0);
	});
});

describe('Check keys after insertion', () => {
	it('adds a string key to the node', () => {
		node.keys.push('A');
		expect(node.keys[0]).toBe('A');
		expect(node.keys.length).toBe(1);
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
		node.children.push(leftNode);
		expect(node.isLeaf()).toBeFalsy();
	});
});

describe('Check if its a 2Node', () => {
	it('checks whether a node is a 2Node', () => {
		node.keys.push('A');
		expect(node.is2Node()).toBeTruthy();
	});
});

describe('Check if its a 3Node', () => {
	it('checks whether a node is a 3Node', () => {
		node.keys.push('A', 'B');
		expect(node.is3Node()).toBeTruthy();
	});
});
