<script lang="ts">
	import Input from '$lib/components/Input.svelte';
	import TreeVisualization from '$lib/components/TreeVisualizer.svelte';

	let treeViz: TreeVisualization;

	async function handleInsert(value: string) {
		if (!treeViz) return;

		if (treeViz.search(value)) {
			alert(`'${value}' already exists in the tree!`);
			return;
		}

		await treeViz.insert(value);
	}

	async function handleDelete(value: string) {
		if (!treeViz) return;

		if (!treeViz.search(value)) {
			alert(`'${value}' not found in the tree!`);
			return;
		}

		await treeViz.remove(value);
	}

	async function handleFind(value: string) {
		if (!treeViz) return;

		const found = await treeViz.animateSearch(value);
		// Optional: show alert after animation
		setTimeout(() => {
			alert(found ? `Found '${value}' in the tree!` : `'${value}' not found in the tree.`);
		}, 100);
	}
</script>

<div class="page-container">
	<Input onInsert={handleInsert} onDelete={handleDelete} onFind={handleFind} />

	<div class="visualization-container">
		<TreeVisualization bind:this={treeViz} />
	</div>
</div>

<style>
	.page-container {
		display: flex;
		flex-direction: column;
		height: 100vh;
		padding: 1rem 2rem;
	}

	.visualization-container {
		flex: 1;
		overflow: hidden;
	}
</style>
