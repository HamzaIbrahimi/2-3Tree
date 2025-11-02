import TreeNode from './node';

export default class TwoThreeTree {
	root: TreeNode | null;
	#size: number;
	constructor() {
		this.root = null;
		this.#size = 0;
	}

	insert(key: string) {
		const node = new TreeNode();
		if (this.root === null) {
			node.insertKey(key);
			this.root = node;
			this.#size++;
			return;
		}

		if (!this.root.isFull()) {
			this.root.insertKey(key);
			this.#size++;
			if (this.root.isFull()) {
				this.root = this.#splitRoot(this.root);
			}
			return;
		}
	}

	find(key: string) {
		let node = this.root;
		while (node !== null) {
			if (node.keys.includes(key)) {
				return node;
			} else if (key < node.keys[0]) {
				node = node.left;
			} else if (node.isThreeNode() && key < node.keys[1]) {
				node = node.middle;
			} else {
				node = node.right;
			}
		}
	}

	delete() {}

	get size() {
		return this.#size;
	}

	//If the root has 3 keys split into a 2node
	#splitRoot(node: TreeNode) {
		const [leftKey, middleKey, rightKey] = node.keys;
		const newRoot = new TreeNode();
		newRoot.insertKey(middleKey);
		newRoot.left = new TreeNode();
		newRoot.left.insertKey(leftKey);
		newRoot.right = new TreeNode();
		newRoot.right.insertKey(rightKey);
		newRoot.right.parent = newRoot;
		newRoot.left.parent = newRoot;
		return newRoot;
	}
}
