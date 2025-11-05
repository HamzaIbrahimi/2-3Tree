<script>
	import { fade } from 'svelte/transition';
	let showInfo = true;
	function removeInfo() {
		showInfo = false;
	}
</script>

{#if showInfo}
	<div
		class="g-3 container flex items-center justify-center p-3"
		transition:fade={{ duration: 400 }}
	>
		<div>
			<h4 class="text-l">Information</h4>
			<p class="text-m">
				- To <em>interact</em> with the 2-3Tree data structure, please type a single uppercase letter
				into the input field.
			</p>
			<p class="text-m">
				- You can then press any button to perform an operation on the data structure.
			</p>
			<p class="text-m">
				- The delete and find buttons will be disabled if nothing has been inserted into the tree
				yet.
			</p>
			<button
				onclick={removeInfo}
				class="cursor-pointer rounded-full bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
			>
				Understood!
			</button>
		</div>
	</div>
{/if}

<style>
	.container div {
		display: flex;
		flex-direction: column;
		gap: 5px;
		max-width: 400px;
		border: 1px solid black;
		border-radius: 1rem;
		padding: 1.4rem;
	}
	h4 {
		text-align: center;
		text-decoration: underline;
	}
</style>
