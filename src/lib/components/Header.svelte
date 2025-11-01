<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
</script>

<nav class="border-bottom border-black-200 flex justify-between border-b px-5 py-1">
	<header>
		<a href="/" class="flex items-center justify-center gap-2">
			<h1 class="text-xl">2-3 Tree Visualizer</h1>
			<figure>
				<img src={favicon} alt="A tree that depicts the two three tree data structure" />
			</figure>
		</a>
	</header>

	<ul
		class="flex items-center justify-center gap-3 [&>li]:cursor-pointer [&>li]:rounded-md [&>li]:border [&>li]:px-5 [&>li]:transition-shadow [&>li]:hover:shadow-md"
	>
		<li><a href="/learn">Learn</a></li>
		<li><a href="/about">About</a></li>
	</ul>
</nav>
