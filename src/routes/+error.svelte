<script>
	import { page } from '$app/state';
</script>

<svelte:head>
	<title>Page not found</title>
</svelte:head>

<div class="error-page">
	<div class="error-content">
		<div class="error-number">{page.status}</div>
		<h1>Page was not found</h1>
		<p>The page you're looking for does not exist or has been moved</p>
		<a href="/2-3Tree" class="home-btn">← Go to Homepage</a>
	</div>
</div>

<style>
	.error-page {
		min-height: 50vh;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		text-align: center;
		gap: 2rem;
	}

	h1 {
		font-size: 2.5rem;
	}

	a {
		text-decoration: none;
	}

	h1,
	p {
		margin-bottom: 1rem;
	}

	.error-number {
		font-size: 10rem;
	}

	.home-btn {
		padding: 1rem 2rem;
		border: 1px solid black;
		color: black;
		letter-spacing: 0.2rem;
	}

	.home-btn:hover {
		outline: 1px solid black;
	}
</style>
