<script lang="ts">
	import type { Ops } from '$lib/types';

	interface Props {
		opsHistory: Ops[];
	}

	const pad = (n: number) => (n < 10 ? '0' + n : n);
	let { opsHistory }: Props = $props();
</script>

<div class="container">
	<div class="title">Operation History</div>
	<div class="ops-container">
		{#each opsHistory as ops, index (index)}
			<div class="ops">
				<div class="ops-info">
					<div class="operation {ops.operation.toLowerCase()}">{ops.operation}</div>
					<div class="letter">{ops.letter}</div>
					{#if ops.operation === 'Find' || ops.operation === 'Delete'}
						<div class="failure" style="display: {ops.found ? 'none' : 'block'}">
							not found in the tree
						</div>
					{:else if ops.operation === 'Insert'}
						<div class="failure" style="display: {ops.found ? 'block' : 'none'}">
							Already exists in the tree
						</div>
					{/if}
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
		display: flex;
		flex-direction: column;
		row-gap: 1rem;
		padding: 1rem 1rem;
		min-width: 100%;
		background-color: #fff;
		border-radius: 1rem;
		overflow: scroll;
	}

	.ops-container {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.title {
		font-weight: 700;
		font-size: 0.9rem;
	}

	.ops {
		display: flex;
		align-items: center;
		justify-content: space-between;
		background-color: var(--bg-slate-50);
		border: 1px solid var(--border-light);
		border-radius: 10px;
		padding: 0.5rem 0.5rem;
		font-size: 0.9rem;
	}

	.ops-info {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		width: 100%;
	}

	.letter {
		color: var(--text-primary);
	}

	.timestamp {
		color: var(--text-tertiary);
		font-size: 0.6rem;
	}

	.insert {
		background-color: var(--bg-success);
		color: var(--text-success);
	}
	.delete {
		background-color: var(--bg-error);
		color: var(--text-error);
	}

	.failure {
		font-size: 0.6rem;
		font-weight: 600;
		text-transform: uppercase;
		color: var(--text-error);
	}

	.find {
		background-color: var(--bg-warning);
		color: var(--text-warning);
	}
</style>
