<script lang="ts">
	import { onMount } from 'svelte';
	import TwoThreeTree from '$lib/classes/twoThreeTree';
	import TreeVisualizer from '$lib/visualization/TreeVisualizer';
	import reset from '$lib/assets/debug-restart.svg';

	// Props for parent component to control the tree
	interface Props {
		onInsert?: (value: string) => Promise<void>;
		onDelete?: (value: string) => Promise<void>;
		onSearch?: (value: string) => boolean;
		clearStamps?: () => void;
	}

	let { onInsert, onDelete, onSearch, clearStamps }: Props = $props();

	let container = $state<HTMLDivElement>();
	let tree = $state(new TwoThreeTree());
	let size = $state(0);
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
		size = tree.size();
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
		size = tree.size();
		if (onDelete) await onDelete(value);
	}

	export function clear() {
		tree = new TwoThreeTree();
		if (visualizer) {
			visualizer.setTree(tree);
			size = 0;
			visualizer.draw();
			if (clearStamps) {
				clearStamps();
			}
		}
	}

	export function getSize(): number {
		return tree.size();
	}

	export function getTree(): TwoThreeTree {
		return tree;
	}
</script>

<div class="tree-canvas" bind:this={container}>
	<button onclick={() => clear()} class="clear">
		<img src={reset} alt="reset the" />
	</button>
	<span class="size">Tree Size: {size}</span>
</div>

<style>
	.tree-canvas {
		position: relative;
		width: 100%;
		height: 100%;
		border: 1px solid var(--border-medium);
	}

	button {
		border: 1px solid var(--border-medium);
		background-color: var(--bg-slate-100);
		padding: 0.3rem 0.9rem;
		border-radius: 2vw;
		font-size: 0.9rem;
		cursor: pointer;
		display: flex;
		flex-direction: row-reverse;
		gap: 1rem;
	}

	img {
		width: 20px;
		height: 20px;
		transition: 500ms ease-out;
	}

	button:hover img {
		transform: rotate(360deg);
		transition: 500ms ease-in;
	}

	.size,
	.clear {
		position: absolute;
		top: 0;
		margin: 1rem;
	}
	.size {
		right: 0;
	}
	.clear {
		left: 0;
	}

	@media (max-width: 650px) {
		.tree-canvas {
			border: none;
		}
	}
</style>
