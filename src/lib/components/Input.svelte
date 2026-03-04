<script lang="ts">
	let value = $state('');
	let active = $state(true);
	let isProcessing = $state(false);
	let inputRef: HTMLInputElement;

	interface Props {
		insertInto?: (value: string) => Promise<void>;
		deleteFrom?: (value: string) => Promise<void>;
		findFrom?: (value: string) => void;
		reset?: () => void;
	}

	let { insertInto, deleteFrom, findFrom, reset }: Props = $props();

	function resetTreeOnModeSwitch() {
		if (active && reset) {
			active = false;
			reset();
			return;
		} else if (!active && reset) {
			active = true;
			reset();
			return;
		}
	}

	async function handleButtonClick(action: string) {
		if (!inputRef.checkValidity()) {
			inputRef.reportValidity();
			return;
		}
		if (!value.trim() || isProcessing) return;

		isProcessing = true;

		try {
			const inputs = value
				.split(',')
				.map((item) => item.trim().toUpperCase())
				.filter((item) => item !== '');
			for (const item of inputs) {
				if (action === 'Insert' && insertInto) {
					await insertInto(item);
				} else if (action === 'Delete' && deleteFrom) {
					await deleteFrom(item);
				} else if (action === 'Find' && findFrom) {
					findFrom(item);
				}
			}
			value = '';
		} finally {
			isProcessing = false;
		}
	}
</script>

<form action="" onsubmit={(e) => e.preventDefault()}>
	<div class="mode">
		<div class="title">Mode <span>changing modes will clear the tree</span></div>
		<div class="form-buttons">
			<button
				type="button"
				class={active ? 'active' : 'inactive'}
				onclick={() => resetTreeOnModeSwitch()}
				disabled={active}
			>
				Alphabet</button
			>

			<button
				type="button"
				class={active ? 'inactive' : 'active'}
				onclick={() => resetTreeOnModeSwitch()}
				disabled={!active}>Numbers</button
			>
		</div>
		{#if active}
			<p>Insert single capital letters A-Z, or use commas to insert multiple (e.g., A,B,C)</p>
		{:else}
			<p>Insert an Integer (eg. 1 or 12), or use commas to insert multiple (e.g 20,15,18,225)</p>
		{/if}
	</div>
	<div class="operation">
		<div class="title">Operations</div>
		<input
			type="text"
			bind:value
			bind:this={inputRef}
			required
			inputmode={active ? 'text' : 'numeric'}
			minlength="1"
			placeholder={active
				? 'Enter a letter or letters (eg A or A,B,C)'
				: 'Enter an integer or integers (eg 1 or 1,2,3)'}
			pattern={active ? '[a-zA-Z](,\\s*[a-zA-Z])*' : '[0-9]+(,\\s*[0-9]+)*'}
			title={active
				? 'A single letter or letters separated by commas: Example A or A,B,C or A, B, C'
				: 'An integer or integers separated by commas: Example 1 or 1,2,3 or 1, 2, 3'}
		/>
		<div class="operation-buttons">
			<button
				disabled={isProcessing || !value.trim()}
				onclick={() => handleButtonClick('Insert')}
				class="insert">+ Insert</button
			>
			<button
				disabled={isProcessing || !value.trim()}
				onclick={() => handleButtonClick('Delete')}
				class="delete">- Delete</button
			>
			<button
				disabled={isProcessing || !value.trim()}
				onclick={() => handleButtonClick('Find')}
				class="find"
			>
				Find</button
			>
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
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		background-color: #fff;
		border-radius: 1rem;
	}

	.mode {
		padding: 1rem 1rem;
	}
	.operation {
		padding: 1rem 1rem;
	}

	.title {
		font-weight: 700;
		font-size: 0.9rem;
	}

	p,
	span {
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
		padding-inline: 0.6rem;
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
	}

	input::placeholder {
		font-size: 0.7rem;
	}
	input:invalid {
		outline: 1px solid hsl(0, 100%, 59%);
	}
	input:valid {
		outline: 1px solid hsl(120, 70%, 50%);
		background: hsl(120);
	}

	@media (max-width: 650px) {
		form {
			align-content: center;
			justify-content: stretch;
			gap: 10px;
			width: 100%;
			background-color: #fff;
			padding: 1rem;
			margin-top: 1rem;
		}

		.form-buttons > button {
			padding-inline: 3.8rem;
		}

		.operation-buttons {
			width: 100%;
		}

		.operation,
		.mode {
			border-radius: 0;
			gap: 0;
			padding: 0;
			max-width: 100%;
		}

		.operation {
			gap: 10px;
		}

		p {
			display: none;
		}

		.operation .title {
			display: none;
		}

		.mode .title {
			color: var(--text-tertiary);
		}
	}
</style>
