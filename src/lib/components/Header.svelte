<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import { resolve } from '$app/paths';
	const learn = resolve('/learn');
	const about = resolve('/about');
</script>

<nav class="flex justify-between px-5 py-1">
	<header>
		<a href={resolve('/')} class="flex items-center justify-center gap-1">
			<h1 class="text-m">2-3 Tree Visualizer</h1>
			<figure>
				<img src={favicon} alt="A tree that depicts the two three tree data structure" />
			</figure>
		</a>
	</header>

	<div class="flex items-center justify-center gap-3">
		<a href={learn}>Learn</a>
		<a href={about}>About</a>
	</div>
</nav>
