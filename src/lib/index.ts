// place files you want to import through the `$lib` alias in this folder.
import TwoThreeTree from './classes/twoThreeTree';
import prettyPrint from './util/prettyPrint';

const twoThreeTree = new TwoThreeTree();
const chars = ['S', 'E', 'A', 'R', 'C', 'H', 'X', 'M', 'P', 'L'];
const chars2 = ['A', 'C', 'E', 'H', 'L', 'M', 'P', 'R', 'S', 'X'];
for (const key of chars2) {
	twoThreeTree.insert(key);
}
console.log(prettyPrint(twoThreeTree.root));
