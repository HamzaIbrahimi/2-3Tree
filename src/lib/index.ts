// place files you want to import through the `$lib` alias in this folder.
import TwoThreeTree from './classes/twoThreeTree';
import prettyPrint from './util/prettyPrint';

const twoThreeTree = new TwoThreeTree();
const alphabets = 'SEARCHXMPL'.split('');
const alp = 'ACEHLMPRSX'.split('');
for (const key of alp) {
	twoThreeTree.insert(key);
}
console.log(prettyPrint(twoThreeTree.root));
