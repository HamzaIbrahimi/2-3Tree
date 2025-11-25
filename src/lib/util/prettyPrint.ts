import TreeNode from '$lib/classes/node';

const prettyPrint = (node: TreeNode | null, prefix = '', isLeft = true): void => {
	if (!node) return;

	const hasThreeChildren = node.children.length === 3;
	const spacing = hasThreeChildren ? '│           ' : '│       ';
	const spacingAlt = hasThreeChildren ? '            ' : '        ';

	// Print children in reverse order (right to left for visual clarity)
	if (node.children.length > 0) {
		// For 3-node: print rightmost child (index 2)
		if (node.children[2]) {
			prettyPrint(node.children[2], `${prefix}${isLeft ? spacing : spacingAlt}`, false);
		}

		// For 3-node: print middle child (index 1)
		if (node.children[1]) {
			prettyPrint(node.children[1], `${prefix}${isLeft ? spacing : spacingAlt}`, false);
		}
	}

	// Print node keys
	const label = `[${node.keys.join(' | ')}]`;
	console.log(`${prefix}${isLeft ? '└──---- ' : '┌──---- '}${label}`);

	// Print leftmost child (index 0)
	if (node.children[0]) {
		prettyPrint(node.children[0], `${prefix}${isLeft ? spacingAlt : spacing}`, true);
	}
};

export default prettyPrint;
