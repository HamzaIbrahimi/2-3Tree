<script lang="ts">
	import { resolve } from '$app/paths';
</script>

<nav class="">
	<header>
		<a href={resolve('/')}>
			<h3 class="">2-3 Tree Visualizer</h3>
			<div>Interactive data structure visualization</div>
		</a>
	</header>
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
		padding: 0.5rem 2.5rem;
		color: var(--text-primary);
		background-color: #fff;
	}

	nav div {
		display: flex;
		gap: 2rem;
		margin-right: 2rem;
	}

	a div {
		font-size: 0.8rem;
		color: var(--text-secondary);
	}

	@media (max-width: 650px) {
		nav {
			padding: 0.5rem 1rem;
		}
	}
</style>
