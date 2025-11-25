export default class TreeNode {
	keys: string[];
	children: TreeNode[];

	constructor(keys: string[] = [], children: TreeNode[] = [] as TreeNode[]) {
		this.keys = keys; //1 or 2 keys
		this.children = children; //0 or 2 or 3 children
	}

	isLeaf() {
		return this.children.length === 0;
	}

	is2Node() {
		return this.keys.length === 1;
	}

	is3Node() {
		return this.keys.length === 2;
	}
}
