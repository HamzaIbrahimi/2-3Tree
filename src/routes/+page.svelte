<script lang="ts">
	import Input from '$lib/components/Input.svelte';
	import History from '$lib/components/History.svelte';
	import type { Ops } from '$lib/types';
	import { SvelteDate } from 'svelte/reactivity';
	import TreeVisualization from '$lib/components/TreeVisualizer.svelte';

	let timeStamps = $state<Ops[]>([]);
	let treeViz: TreeVisualization;

	function addTimeStamp(operation: string, letter: string, found: boolean) {
		let date = new SvelteDate();
		timeStamps.unshift({ operation, letter, date, found });
	}

	async function handleInsert(value: string) {
		if (!treeViz) return;

		if (treeViz.search(value)) {
			addTimeStamp('Insert', value, true);
			return;
		}

		addTimeStamp('Insert', value, false);
		await treeViz.insert(value);
	}

	async function handleDelete(value: string) {
		if (!treeViz) return;

		if (treeViz.search(value)) {
			addTimeStamp('Delete', value, true);
			await treeViz.remove(value);
			return;
		}

		addTimeStamp('Delete', value, false);
	}

	function reset() {
		treeViz.clear();
	}

	async function handleFind(value: string) {
		if (!treeViz) return;
		const found = await treeViz.animateSearch(value);
		if (found) {
			addTimeStamp('Find', value, true);
			return;
		}
		addTimeStamp('Find', value, false);
	}
</script>

<div class="page-container">
	<Input insertInto={handleInsert} deleteFrom={handleDelete} findFrom={handleFind} {reset} />
	<History opsHistory={timeStamps} />
	<div class="visualization-container">
		<TreeVisualization bind:this={treeViz} />
	</div>
</div>

<style>
	.page-container {
		display: grid;
		grid-template-columns: 1fr 3fr;
		grid-template-rows: 0.5fr auto;
		column-gap: 1rem;
		row-gap: 1rem;
		height: 100vh;
		padding: 1rem 2rem;
	}

	.page-container > *:nth-child(1) {
		grid-column: 1/2;
		grid-row: 1/2;
	}

	.page-container > *:nth-child(2) {
		grid-column: 1/2;
		grid-row: 2/3;
	}
	.page-container > *:nth-child(3) {
		grid-column: 2/3;
		grid-row: 1/3;
	}

	.visualization-container {
		background-color: #fff;
		padding: 1rem;
		overflow: hidden;
		border-radius: 1rem;
		border: 1px solid var(--border-light);
	}

	@media (max-width: 650px) {
		.page-container {
			grid-template-columns: 1fr;
			grid-template-rows: 200px 400px 200px;
			padding: 0;
		}

		.page-container > *:nth-child(1) {
			grid-column: 1/-1;
			grid-row: 1/2;
		}

		.page-container > *:nth-child(2) {
			grid-column: 1/-1;
			grid-row: 3/4;
		}

		.page-container > *:nth-child(3) {
			grid-column: 1/-1;
			grid-row: 2/3;
		}
		.visualization-container {
			padding: 0;
			border: 0;
			border-color: var(--bg-slate-100);
		}
	}
</style>
