export default class TreeNode {
	#keys: string[];
	left: TreeNode | null;
	middle: TreeNode | null;
	right: TreeNode | null;
	//Helps with splitting upwards
	parent: TreeNode | null;

	constructor() {
		this.#keys = [];
		this.parent = null;
		this.left = null;
		this.middle = null;
		this.right = null;
	}

	insertKey(data: string) {
		//No duplicates allowed
		if (this.#keys.includes(data)) {
			return;
		}
		//Do not add more than 3 keys
		if (!this.isFull()) {
			this.#keys.push(data);
			//Keys are sorted once added
			this.#keys.sort();
		}
	}

	get keys(): string[] {
		return this.#keys;
	}

	get keyCount(): number {
		return this.#keys.length;
	}

	isTwoNode(): boolean {
		return this.#keys.length === 1;
	}

	isThreeNode(): boolean {
		return this.#keys.length === 2;
	}

	isLeaf(): boolean {
		return !this.left && !this.right && !this.middle;
	}

	isFull(): boolean {
		return this.#keys.length === 3;
	}
}
