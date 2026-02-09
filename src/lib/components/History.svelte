<script lang="ts">
	import { SvelteDate } from 'svelte/reactivity';

	type Ops = {
		operation: string;
		letter: string;
		date: Date;
	};

	interface Props {
		opsHistory: Ops[];
	}
	const pad = (n: number) => (n < 10 ? '0' + n : n);
	let { opsHistory }: Props = $props();
</script>

<div class="container">
	<div class="title">Operation History</div>
	<div class="ops-container">
		{#each opsHistory as ops}
			<div class="ops">
				<div>
					<div class="operation">{ops.operation}</div>
					<div>{ops.letter}</div>
				</div>
				<div class="timestamp">
					{ops.date.getHours()}:{pad(ops.date.getMinutes())}:{pad(ops.date.getSeconds())}
				</div>
			</div>
		{/each}
	</div>
</div>

<style>
	.container {
		padding: 1rem 1rem;
	}
</style>
