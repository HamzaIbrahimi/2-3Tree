import { describe, it, expect, beforeEach } from 'vitest';
import TreeNode from '../node';
import TwoThreeTree from '../twoThreeTree';

let twoThreeTree: TwoThreeTree;

beforeEach(() => {
	twoThreeTree = new TwoThreeTree();
});

describe('Has root on initialization', () => {
	it('has a root', () => {
		expect(twoThreeTree.root).toBeNull();
	});
});
