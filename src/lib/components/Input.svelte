<script lang="ts">
	import Information from './Information.svelte';
	let value = $state('');
	let buttons = ['Insert', 'Find', 'Delete'];
</script>

<form action="">
	<div class="input-container border-top flex items-center justify-center gap-2 p-3">
		<div>
			<input
				class="ease w-full rounded-md border-none bg-transparent px-3 py-2 text-sm text-slate-700 shadow-sm transition duration-300 placeholder:text-slate-400 hover:border-slate-300 focus:border-slate-400 focus:shadow focus:outline-none"
				type="text"
				bind:value
				placeholder="Type single uppercase letter"
				required
				minlength="1"
				maxlength="1"
				pattern="[A-Z]"
			/>
		</div>
		<div class="flex gap-2">
			{#each buttons as button}
				<button
					class="cursor-pointer rounded-full bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
				>
					{button}
				</button>
			{/each}
		</div>
	</div>
</form>
<Information />

<style>
	.input-container {
		border-top: 1px solid black;
	}

	input:invalid {
		outline: 1px solid hsl(0, 100%, 59%);
	}
	input:valid {
		outline: 1px solid hsl(120, 70%, 50%);
		background: hsl(120);
	}
</style>
