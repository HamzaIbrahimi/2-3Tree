import TreeNode from '$lib/classes/node';

const prettyPrint = (node: TreeNode | null, prefix = '', isLeft = true): void => {
	if (!node) return;

	// Print right subtree
	if (node.right) {
		prettyPrint(node.right, `${prefix}${isLeft ? '│   ' : '    '}`, false);
	}

	// Print middle subtree (for 3-node)
	if (node.middle && node.keys.length === 2) {
		prettyPrint(node.middle, `${prefix}${isLeft ? '│   ' : '    '}`, false);
	}

	// Print node keys
	const label = `[${node.keys.join(' | ')}]`;
	console.log(`${prefix}${isLeft ? '└── ' : '┌── '}${label}`);

	// Print left subtree
	if (node.left) {
		prettyPrint(node.left, `${prefix}${isLeft ? '    ' : '│   '}`, true);
	}
};

export default prettyPrint;
