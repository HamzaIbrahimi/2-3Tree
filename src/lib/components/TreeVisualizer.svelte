<script lang="ts">
	import { onMount } from 'svelte';
	import TwoThreeTree from '$lib/classes/TwoThreeTree';
	import TreeVisualizer from '$lib/visualization/TreeVisualizer';

	// Props for parent component to control the tree
	interface Props {
		onInsert?: (value: string) => Promise<void>;
		onDelete?: (value: string) => Promise<void>;
		onSearch?: (value: string) => boolean;
	}

	let { onInsert, onDelete, onSearch }: Props = $props();

	let container = $state<HTMLDivElement>();
	let tree = $state(new TwoThreeTree());
	let visualizer = $state<TreeVisualizer>();

	onMount(() => {
		if (container) {
			visualizer = new TreeVisualizer(container, tree);
			visualizer.draw();
		}
	});

	// Expose methods to parent component
	export async function insert(value: string) {
		if (!visualizer) return;

		tree.insert(value);
		await visualizer.animateInsert(value);

		if (onInsert) await onInsert(value);
	}

	export function search(value: string): boolean {
		const result = tree.search(value) !== null;
		if (onSearch) return onSearch(value);
		return result;
	}

	export async function animateSearch(value: string): Promise<boolean> {
		if (!visualizer) return false;
		return await visualizer.animateSearch(value);
	}

	export async function remove(value: string) {
		if (!visualizer) return;

		tree.delete(value);
		visualizer.draw(); // For now, just redraw (can add animation later)

		if (onDelete) await onDelete(value);
	}

	export function clear() {
		tree = new TwoThreeTree();
		if (visualizer) {
			visualizer.setTree(tree);
		}
	}

	export function getSize(): number {
		return tree.size();
	}

	export function getTree(): TwoThreeTree {
		return tree;
	}
</script>

<div class="tree-canvas" bind:this={container}></div>

<style>
	.tree-canvas {
		width: 100%;
		height: 100%;
		background: #0f172a;
	}
</style>
