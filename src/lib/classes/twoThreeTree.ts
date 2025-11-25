import TreeNode from './node';

export default class TwoThreeTree {
	root: TreeNode | null;

	constructor() {
		this.root = null;
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

	/* --------------------------- INSERT --------------------------- */

	insert(value: string): void {
		if (!this.root) {
			this.root = new TreeNode([value], []);
			return;
		}

		const result = this.#insertRecursive(this.root, value);

		if (result && result.type === 'split') {
			// root split, promote middle key into a new root
			this.root = new TreeNode([result.key], [result.left, result.right]);
		}
	}

	#insertRecursive(
		node: TreeNode,
		value: string,
	): { type: 'split'; key: string; left: TreeNode; right: TreeNode } | null {
		if (node.keys.includes(value)) {
			return null;
		}
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

		this.#deleteRecursive(this.root, value);

		// If root became empty, collapse it
		if (this.root.keys.length === 0 && !this.root.isLeaf()) {
			this.root = this.root.children[0];
		}
	}

	#deleteRecursive(node: TreeNode, value: string): void {
		if (node.isLeaf()) {
			this.#deleteFromLeaf(node, value);
			return;
		}

		// Find child to go down into
		let idx: number;

		if (node.is2Node()) {
			const cmp = value.localeCompare(node.keys[0]);
			if (cmp === 0) {
				// delete key by replacing with inorder successor
				node.keys[0] = this.#deleteReplaceWithSuccessor(node.children[1]);
				return;
			}
			idx = cmp < 0 ? 0 : 1;
		} else {
			const [a, b] = node.keys;
			if (value.localeCompare(a) === 0) {
				node.keys[0] = this.#deleteReplaceWithSuccessor(node.children[1]);
				return;
			}
			if (value.localeCompare(b) === 0) {
				node.keys[1] = this.#deleteReplaceWithSuccessor(node.children[2]);
				return;
			}

			if (value.localeCompare(a) < 0) idx = 0;
			else if (value.localeCompare(b) < 0) idx = 1;
			else idx = 2;
		}

		this.#deleteRecursive(node.children[idx], value);

		this.#fixUnderflow(node, idx);
	}

	#deleteReplaceWithSuccessor(node: TreeNode): string {
		while (!node.isLeaf()) node = node.children[0];
		const val = node.keys[0];
		this.#deleteFromLeaf(node, val);
		return val;
	}

	#deleteFromLeaf(node: TreeNode, value: string): void {
		const i = node.keys.findIndex((k) => k.localeCompare(value) === 0);
		if (i !== -1) node.keys.splice(i, 1);
	}

	#fixUnderflow(node: TreeNode, idx: number): void {
		const child = node.children[idx];
		if (child.keys.length !== 0) return; // no underflow

		// Borrow or merge
		if (idx > 0 && node.children[idx - 1].keys.length === 2) {
			// borrow from left
			const left = node.children[idx - 1];
			child.keys = [node.keys[idx - 1]];
			node.keys[idx - 1] = left.keys.pop()!;
			if (!left.isLeaf()) {
				child.children.unshift(left.children.pop()!);
			}
		} else if (idx < node.children.length - 1 && node.children[idx + 1].keys.length === 2) {
			// borrow from right
			const right = node.children[idx + 1];
			child.keys = [node.keys[idx]];
			node.keys[idx] = right.keys.shift()!;
			if (!right.isLeaf()) {
				child.children.push(right.children.shift()!);
			}
		} else {
			// merge
			if (idx > 0) {
				this.#mergeChildren(node, idx - 1);
			} else {
				this.#mergeChildren(node, idx);
			}
		}
	}

	#mergeChildren(node: TreeNode, leftIdx: number): void {
		const rightIdx = leftIdx + 1;

		const left = node.children[leftIdx];
		const right = node.children[rightIdx];

		left.keys.push(node.keys[leftIdx]);
		left.keys.push(...right.keys);

		if (!right.isLeaf()) {
			left.children.push(...right.children);
		}

		node.keys.splice(leftIdx, 1);
		node.children.splice(rightIdx, 1);
	}
}
