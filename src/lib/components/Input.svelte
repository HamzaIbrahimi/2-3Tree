<script lang="ts">
	import Information from './Information.svelte';
	let value = $state('');
	let active = $state(true);
	let isProcessing = $state(false);

	interface Props {
		insertInto?: (value: string) => Promise<void>;
		deleteFrom?: (value: string) => Promise<void>;
		findFrom?: (value: string) => void;
	}
	let { insertInto, deleteFrom, findFrom }: Props = $props();
</script>

<form action="" onsubmit={(e) => e.preventDefault()}>
	<div class="mode">
		<div class="title">Mode</div>
		<div class="form-buttons">
			<button class={active ? 'active' : 'inactive'} onclick={() => (active = true)}>
				Alphabet</button
			>
			<button class={active ? 'inactive' : 'active'} onclick={() => (active = false)}
				>Numbers</button
			>
		</div>
		{#if active}
			<p>Insert single capital letters A-Z, or use commas to insert multiple (e.g., A,B,C)</p>
		{:else}
			<p>Insert an Integer (eg. 1 or 12), or use commas to insert multiple (e.g 20,15,18,225)</p>
		{/if}
		<p></p>
	</div>
	<div class="operation">
		<div class="title">Operations</div>
		<input
			type="text"
			bind:value
			required
			minlength="1"
			placeholder={active
				? 'Enter a letter or letters (eg A or A,B,C)'
				: 'Enter an integer or integers (eg 1 or 1,2,3)'}
			pattern={active ? '[a-zA-Z]+(,[a-zA-Z]+)*' : '[0-9]+(,[0-9]+)*'}
			title={active
				? 'A single letter or letters separated by commas: Example A or A,B,C'
				: 'An integer or integers separated by commas: Example 1 or 1,2,3'}
		/>
		<div class="operation-buttons">
			<button class="insert">+ Insert</button>
			<button class="delete">- Delete</button>
			<button class="find"> Find</button>
		</div>
	</div>
</form>

<style>
	form {
		display: grid;
		row-gap: 1rem;
	}

	.operation,
	.mode {
		display: grid;
		row-gap: 0.5rem;
		background-color: #fff;
		max-width: 400px;
		border-radius: 1rem;
	}

	.mode {
		padding: 1rem 1rem 0;
	}
	.operation {
		padding: 1rem 1rem 3rem;
	}

	.title {
		font-weight: 700;
		font-size: 0.9rem;
	}

	p {
		font-size: 0.6rem;
		color: var(--text-tertiary);
	}

	.operation-buttons,
	.form-buttons {
		display: flex;
		gap: 10px;
		color: #fff;
	}

	.operation-buttons > button:hover {
		transform: scale(1.05);
	}

	button {
		padding: 0.5rem 2rem;
		font-size: 0.8rem;
		border: none;
		cursor: pointer;
		text-align: center;
		border-radius: 0.7rem;
		width: 100%;
	}

	.active {
		background-color: var(--mode-active-bg);
		color: var(--mode-active-text);
	}

	.inactive {
		background-color: var(--mode-inactive-bg);
		color: var(--mode-inactive-text);
	}

	.operation-buttons > button {
		color: #fff;
	}

	.insert {
		background-color: var(--color-insert);
	}
	.delete {
		background-color: var(--color-delete);
	}
	.find {
		background-color: var(--color-find);
	}

	input {
		border: 1px solid var(--border-light);
		border-radius: 1rem;
		padding: 0.5rem 1rem;
		font-size: 0.5rem;
	}
	/* input:invalid {
		outline: 1px solid hsl(0, 100%, 59%);
	}
	input:valid {
		outline: 1px solid hsl(120, 70%, 50%);
		background: hsl(120);
	} */
</style>
