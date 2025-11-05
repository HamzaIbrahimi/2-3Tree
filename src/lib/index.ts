// place files you want to import through the `$lib` alias in this folder.
import TwoThreeTree from './classes/twoThreeTree';
import prettyPrint from './util/prettyPrint';

const twoThreeTree = new TwoThreeTree();
twoThreeTree.insert('A');
twoThreeTree.insert('B');
twoThreeTree.insert('C');

console.log(prettyPrint(twoThreeTree.root));
console.log(twoThreeTree.root?.middle?.keys);
