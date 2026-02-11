<script lang="ts">
	import { resolve } from '$app/paths';
	const learn = resolve('/learn');
	const about = resolve('/about');
</script>

<nav class="">
	<header>
		<a href={resolve('/')}>
			<h3 class="">2-3 Tree Visualizer</h3>
			<div>Interactive data structure visualization</div>
		</a>
	</header>
	<div>
		<a class="link-btn" href={learn}>Learn</a>
		<a class="link-btn" href={about}>About</a>
	</div>
</nav>

<style>
	a {
		text-decoration: none;
		color: inherit;
	}

	nav {
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-wrap: wrap;
		padding: 0.5rem 2rem;
		color: var(--text-primary);
		background-color: #fff;
	}

	nav div {
		display: flex;
		gap: 2rem;
		margin-right: 2rem;
	}

	.link-btn {
		border: 1px solid var(--border-medium);
		background-color: var(--bg-slate-100);
		padding: 0.3rem 2rem;
		border-radius: 2vw;
		font-size: 0.9rem;
	}

	.link-btn:hover {
		text-decoration: underline;
		flex-shrink: 0;
	}

	a div {
		font-size: 0.8rem;
		color: var(--text-secondary);
	}
</style>
