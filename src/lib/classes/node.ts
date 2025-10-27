class TreeNode {
	#keys: string[] = [];
	left: TreeNode | null = null;
	middle: TreeNode | null = null;
	right: TreeNode | null = null;
	//Helps with splitting upwards
	parent: TreeNode | null = null;

	insertKey(data: string) {
		//No duplicates allowed
		if (this.#keys.includes(data)) {
			return;
		}
		this.#keys.push(data);
		//Keys are sorted once added
		this.#keys.sort();
	}

	get keys(): string[] {
		return this.#keys;
	}

	get keyCount(): number {
		return this.#keys.length;
	}

	isLeaf(): boolean {
		return !this.left && !this.right && !this.middle;
	}

	isFull(): boolean {
		return this.#keys.length === 3;
	}
}
