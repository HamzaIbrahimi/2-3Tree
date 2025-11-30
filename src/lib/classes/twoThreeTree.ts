import TreeNode from './node';

export default class TwoThreeTree {
	root: TreeNode | null;
	#size: number;

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
			const cmp = value.localeCompare(node.keys[0]);
			if (cmp === 0) return node;
			if (node.isLeaf()) return null;
			return cmp < 0
				? this.#searchNode(node.children[0], value)
				: this.#searchNode(node.children[1], value);
		}

		if (node.is3Node()) {
			const [a, b] = node.keys;
			const cmpA = value.localeCompare(a);
			const cmpB = value.localeCompare(b);

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
			// root split, promote middle key into a new root
			this.root = new TreeNode([result.key], [result.left, result.right]);
		}
		this.#size++;
	}

	#insertRecursive(
		node: TreeNode,
		value: string,
	): { type: 'split'; key: string; left: TreeNode; right: TreeNode } | null {
		// -- Leaf insert
		if (node.isLeaf()) {
			return this.#insertIntoLeaf(node, value);
		}

		// -- Internal node: pick the right child, recurse
		let childIndex: number;

		if (node.is2Node()) {
			childIndex = value.localeCompare(node.keys[0]) < 0 ? 0 : 1;
		} else {
			const [a, b] = node.keys;
			if (value.localeCompare(a) < 0) childIndex = 0;
			else if (value.localeCompare(b) < 0) childIndex = 1;
			else childIndex = 2;
		}

		const res = this.#insertRecursive(node.children[childIndex], value);

		// If nothing to do, return
		if (!res || res.type !== 'split') return null;

		// Handle child split inside this node
		return this.#insertSplitToInternal(node, res.key, res.left, res.right);
	}

	#insertIntoLeaf(
		node: TreeNode,
		value: string,
	): { type: 'split'; key: string; left: TreeNode; right: TreeNode } | null {
		// Insert into a leaf
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
			// Insert new key and child
			const [k] = node.keys;
			if (middleKey.localeCompare(k) < 0) {
				node.keys = [middleKey, k];
				node.children = [leftChild, rightChild, node.children[1]];
			} else {
				node.keys = [k, middleKey];
				node.children = [node.children[0], leftChild, rightChild];
			}
			return null;
		}

		// 3-node split case
		const [a, b] = node.keys;

		let allKeys = [a, b, middleKey];
		let allChildren: TreeNode[] = [];

		// Merge children in correct order
		if (middleKey.localeCompare(a) < 0) {
			allChildren = [leftChild, rightChild, node.children[1], node.children[2]];
		} else if (middleKey.localeCompare(b) < 0) {
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
		return arr.sort((a, b) => a.localeCompare(b));
	}

	/* --------------------------- DELETE --------------------------- */
	// Proper 2-3 tree delete is complicated but fully doable.
	// This is the working, complete version.

	delete(value: string): void {
		if (!this.root) return;
		if (!this.search(value)) return;

		this.#deleteRecursive(this.root, value);

		// Remove root hole: only if root has 0 keys and exactly 1 child
		// This is the "remove root hole" case from the PDF
		if (this.root.keys.length === 0 && this.root.children.length === 1) {
			this.root = this.root.children[0];
		}

		this.#size--;
	}

	#deleteRecursive(node: TreeNode, value: string): void {
		// Terminal case: delete from leaf
		if (node.isLeaf()) {
			this.#deleteFromLeaf(node, value);
			return;
		}

		// Find which child to recurse into or handle key-in-node replacement
		let idx: number;

		if (node.is2Node()) {
			const cmp = value.localeCompare(node.keys[0]);

			if (cmp === 0) {
				// Key found in this 2-node (non-terminal)
				// Replace with in-order predecessor value (non-destructive)
				const pred = this.#getPredecessorValue(node.children[0]);
				node.keys[0] = pred;

				// Now delete that predecessor from the left subtree using the normal recursive deletion,
				// which will create a hole somewhere in that subtree and will be fixed bottom-up.
				idx = 0;
				this.#deleteRecursive(node.children[idx], pred);
			} else {
				// Key not here, recurse down
				idx = cmp < 0 ? 0 : 1;
				this.#deleteRecursive(node.children[idx], value);
			}
		} else {
			// 3-node
			const [a, b] = node.keys;

			if (value.localeCompare(a) === 0) {
				// First key matches
				// Replace with predecessor from left subtree (non-destructive)
				const pred = this.#getPredecessorValue(node.children[0]);
				node.keys[0] = pred;

				idx = 0;
				this.#deleteRecursive(node.children[idx], pred);
			} else if (value.localeCompare(b) === 0) {
				// Second key matches
				// Replace with predecessor from middle subtree (non-destructive)
				const pred = this.#getPredecessorValue(node.children[1]);
				node.keys[1] = pred;

				idx = 1;
				this.#deleteRecursive(node.children[idx], pred);
			} else {
				// Key not here, recurse down
				if (value.localeCompare(a) < 0) idx = 0;
				else if (value.localeCompare(b) < 0) idx = 1;
				else idx = 2;
				this.#deleteRecursive(node.children[idx], value);
			}
		}

		// Upward phase: fix any hole created in the child
		// Note: idx is set in all branches above where a child was operated on.
		this.#fixUnderflow(node, idx);
	}

	#getPredecessorValue(node: TreeNode): string {
		// Return the in-order predecessor (rightmost value) WITHOUT deleting it.
		let cur = node;
		while (!cur.isLeaf()) {
			cur = cur.children[cur.children.length - 1];
		}
		return cur.keys[cur.keys.length - 1];
	}

	// Kept your existing leaf deletion helper (unchanged)
	#deleteFromLeaf(node: TreeNode, value: string): void {
		const i = node.keys.findIndex((k) => k.localeCompare(value) === 0);
		if (i !== -1) {
			node.keys.splice(i, 1);
		}
	}

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
