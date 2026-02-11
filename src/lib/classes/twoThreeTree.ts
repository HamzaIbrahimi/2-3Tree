import TreeNode from './node';

export default class TwoThreeTree {
	root: TreeNode | null;
	#size: number;
	// Define options once for consistency
	private readonly compareOptions = { numeric: true } as const;

	constructor() {
		this.root = null;
		this.#size = 0;
	}

	search(value: string): TreeNode | null {
		return this.#searchNode(this.root, value);
	}

	#searchNode(node: TreeNode | null, value: string): TreeNode | null {
		if (!node) return null;

		if (node.is2Node()) {
			const cmp = value.localeCompare(node.keys[0], undefined, this.compareOptions);
			if (cmp === 0) return node;
			if (node.isLeaf()) return null;
			return cmp < 0
				? this.#searchNode(node.children[0], value)
				: this.#searchNode(node.children[1], value);
		}

		if (node.is3Node()) {
			const [a, b] = node.keys;
			const cmpA = value.localeCompare(a, undefined, this.compareOptions);
			const cmpB = value.localeCompare(b, undefined, this.compareOptions);

			if (cmpA === 0 || cmpB === 0) return node;
			if (node.isLeaf()) return null;

			if (cmpA < 0) return this.#searchNode(node.children[0], value);
			if (cmpB < 0) return this.#searchNode(node.children[1], value);
			return this.#searchNode(node.children[2], value);
		}

		return null;
	}

	size(): number {
		return this.#size;
	}

	/* --------------------------- INSERT --------------------------- */

	insert(value: string): void {
		if (this.search(value)) {
			return;
		}

		if (!this.root) {
			this.root = new TreeNode([value], []);
			this.#size++;
			return;
		}

		const result = this.#insertRecursive(this.root, value);
		if (result && result.type === 'split') {
			this.root = new TreeNode([result.key], [result.left, result.right]);
		}
		this.#size++;
	}

	#insertRecursive(
		node: TreeNode,
		value: string,
	): { type: 'split'; key: string; left: TreeNode; right: TreeNode } | null {
		if (node.isLeaf()) {
			return this.#insertIntoLeaf(node, value);
		}

		let childIndex: number;

		if (node.is2Node()) {
			childIndex = value.localeCompare(node.keys[0], undefined, this.compareOptions) < 0 ? 0 : 1;
		} else {
			const [a, b] = node.keys;
			if (value.localeCompare(a, undefined, this.compareOptions) < 0) childIndex = 0;
			else if (value.localeCompare(b, undefined, this.compareOptions) < 0) childIndex = 1;
			else childIndex = 2;
		}

		const res = this.#insertRecursive(node.children[childIndex], value);

		if (!res || res.type !== 'split') return null;

		return this.#insertSplitToInternal(node, res.key, res.left, res.right);
	}

	#insertIntoLeaf(
		node: TreeNode,
		value: string,
	): { type: 'split'; key: string; left: TreeNode; right: TreeNode } | null {
		if (node.is2Node()) {
			node.keys = this.#sorted([node.keys[0], value]);
			return null;
		}

		if (node.is3Node()) {
			const all = this.#sorted([node.keys[0], node.keys[1], value]);
			const left = new TreeNode([all[0]], []);
			const right = new TreeNode([all[2]], []);

			return {
				type: 'split',
				key: all[1],
				left,
				right,
			};
		}

		return null;
	}

	#insertSplitToInternal(
		node: TreeNode,
		middleKey: string,
		leftChild: TreeNode,
		rightChild: TreeNode,
	): { type: 'split'; key: string; left: TreeNode; right: TreeNode } | null {
		if (node.is2Node()) {
			const [k] = node.keys;
			if (middleKey.localeCompare(k, undefined, this.compareOptions) < 0) {
				node.keys = [middleKey, k];
				node.children = [leftChild, rightChild, node.children[1]];
			} else {
				node.keys = [k, middleKey];
				node.children = [node.children[0], leftChild, rightChild];
			}
			return null;
		}

		const [a, b] = node.keys;

		let allKeys = [a, b, middleKey];
		let allChildren: TreeNode[] = [];

		if (middleKey.localeCompare(a, undefined, this.compareOptions) < 0) {
			allChildren = [leftChild, rightChild, node.children[1], node.children[2]];
		} else if (middleKey.localeCompare(b, undefined, this.compareOptions) < 0) {
			allChildren = [node.children[0], leftChild, rightChild, node.children[2]];
		} else {
			allChildren = [node.children[0], node.children[1], leftChild, rightChild];
		}

		allKeys = this.#sorted(allKeys);

		const left = new TreeNode([allKeys[0]], allChildren.slice(0, 2));
		const right = new TreeNode([allKeys[2]], allChildren.slice(2));

		return {
			type: 'split',
			key: allKeys[1],
			left,
			right,
		};
	}

	#sorted(arr: string[]): string[] {
		return arr.sort((a, b) => a.localeCompare(b, undefined, this.compareOptions));
	}

	/* --------------------------- DELETE --------------------------- */

	delete(value: string): void {
		if (!this.root) return;
		if (!this.search(value)) return;

		this.#deleteRecursive(this.root, value);

		if (this.root.keys.length === 0 && this.root.children.length === 1) {
			this.root = this.root.children[0];
		} else if (this.root.keys.length === 0 && this.root.isLeaf()) {
			this.root = null;
		}

		this.#size--;
	}

	#deleteRecursive(node: TreeNode, value: string): void {
		if (node.isLeaf()) {
			this.#deleteFromLeaf(node, value);
			return;
		}

		let idx: number;

		if (node.is2Node()) {
			const cmp = value.localeCompare(node.keys[0], undefined, this.compareOptions);

			if (cmp === 0) {
				const pred = this.#getPredecessorValue(node.children[0]);
				node.keys[0] = pred;
				idx = 0;
				this.#deleteRecursive(node.children[idx], pred);
			} else {
				idx = cmp < 0 ? 0 : 1;
				this.#deleteRecursive(node.children[idx], value);
			}
		} else {
			const [a, b] = node.keys;

			if (value.localeCompare(a, undefined, this.compareOptions) === 0) {
				const pred = this.#getPredecessorValue(node.children[0]);
				node.keys[0] = pred;
				idx = 0;
				this.#deleteRecursive(node.children[idx], pred);
			} else if (value.localeCompare(b, undefined, this.compareOptions) === 0) {
				const pred = this.#getPredecessorValue(node.children[1]);
				node.keys[1] = pred;
				idx = 1;
				this.#deleteRecursive(node.children[idx], pred);
			} else {
				if (value.localeCompare(a, undefined, this.compareOptions) < 0) idx = 0;
				else if (value.localeCompare(b, undefined, this.compareOptions) < 0) idx = 1;
				else idx = 2;
				this.#deleteRecursive(node.children[idx], value);
			}
		}

		this.#fixUnderflow(node, idx);
	}

	#getPredecessorValue(node: TreeNode): string {
		let cur = node;
		while (!cur.isLeaf()) {
			cur = cur.children[cur.children.length - 1];
		}
		return cur.keys[cur.keys.length - 1];
	}

	#deleteFromLeaf(node: TreeNode, value: string): void {
		const i = node.keys.findIndex(
			(k) => k.localeCompare(value, undefined, this.compareOptions) === 0,
		);
		if (i !== -1) {
			node.keys.splice(i, 1);
		}
	}
	// Kept your existing leaf deletion helper (unchanged)

	#fixUnderflow(node: TreeNode, idx: number): void {
		const child = node.children[idx];

		// No underflow if child still has keys
		if (child.keys.length !== 0) return;

		// Child is now a "hole node" - need to fix it
		// Try to borrow from siblings, otherwise merge

		const leftSibling = idx > 0 ? node.children[idx - 1] : null;
		const rightSibling = idx < node.children.length - 1 ? node.children[idx + 1] : null;

		// Case 2 & 4: Try to borrow from a 3-node sibling
		if (leftSibling && leftSibling.keys.length === 2) {
			// Borrow from left 3-node sibling
			// PDF Case 2 (if parent is 2-node) or Case 4 (if parent is 3-node)
			this.#borrowFromLeft(node, idx);
		} else if (rightSibling && rightSibling.keys.length === 2) {
			// Borrow from right 3-node sibling
			this.#borrowFromRight(node, idx);
		} else {
			// Case 1 & 3: Must merge with a 2-node sibling
			// This will create a hole in the parent (or reduce parent keys)
			if (leftSibling) {
				this.#mergeWithLeft(node, idx);
			} else {
				this.#mergeWithRight(node, idx);
			}
		}
	}

	#borrowFromLeft(parent: TreeNode, holeIdx: number): void {
		// PDF Case 2 or Case 4(a)
		// Left sibling is a 3-node, borrow its rightmost key

		const hole = parent.children[holeIdx];
		const leftSib = parent.children[holeIdx - 1];

		// Move parent key down to hole
		hole.keys = [parent.keys[holeIdx - 1]];

		// Move left sibling's rightmost key up to parent
		parent.keys[holeIdx - 1] = leftSib.keys.pop()!;

		// Move left sibling's rightmost child to hole's left
		if (!leftSib.isLeaf()) {
			hole.children.unshift(leftSib.children.pop()!);
		}
	}

	#borrowFromRight(parent: TreeNode, holeIdx: number): void {
		// PDF Case 2 or Case 4(b)
		// Right sibling is a 3-node, borrow its leftmost key

		const hole = parent.children[holeIdx];
		const rightSib = parent.children[holeIdx + 1];

		// Move parent key down to hole
		hole.keys = [parent.keys[holeIdx]];

		// Move right sibling's leftmost key up to parent
		parent.keys[holeIdx] = rightSib.keys.shift()!;

		// Move right sibling's leftmost child to hole's right
		if (!rightSib.isLeaf()) {
			hole.children.push(rightSib.children.shift()!);
		}
	}

	#mergeWithLeft(parent: TreeNode, holeIdx: number): void {
		// PDF Case 1 or Case 3
		// Merge hole with left 2-node sibling

		const leftSib = parent.children[holeIdx - 1];
		const hole = parent.children[holeIdx];

		// Bring parent key down and merge
		leftSib.keys.push(parent.keys[holeIdx - 1]);

		// Add hole's children to left sibling
		if (!hole.isLeaf()) {
			leftSib.children.push(...hole.children);
		}

		// Remove the parent key and the hole node
		parent.keys.splice(holeIdx - 1, 1);
		parent.children.splice(holeIdx, 1);
	}

	#mergeWithRight(parent: TreeNode, holeIdx: number): void {
		// PDF Case 1 or Case 3
		// Merge hole with right 2-node sibling

		const hole = parent.children[holeIdx];
		const rightSib = parent.children[holeIdx + 1];

		// Bring parent key down
		const mergedKeys = [parent.keys[holeIdx]];
		mergedKeys.push(...rightSib.keys);

		// Merge children
		const mergedChildren = [...hole.children, ...rightSib.children];

		// Update right sibling to contain merged result
		rightSib.keys = mergedKeys;
		rightSib.children = mergedChildren;

		// Remove parent key and hole node
		parent.keys.splice(holeIdx, 1);
		parent.children.splice(holeIdx, 1);
	}
}
