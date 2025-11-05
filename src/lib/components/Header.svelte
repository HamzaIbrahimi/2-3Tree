<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	let navigations = ['Learn', 'About'];
</script>

<nav class="flex justify-between px-5 py-1">
	<header>
		<a href="/" class="flex items-center justify-center gap-1">
			<h1 class="text-m">2-3 Tree Visualizer</h1>
			<figure>
				<img src={favicon} alt="A tree that depicts the two three tree data structure" />
			</figure>
		</a>
	</header>

	<div class="flex items-center justify-center gap-3">
		{#each navigations as nav}
			<a
				class="ccursor-pointer rounded-full bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
				href={nav.toLowerCase()}>{nav}</a
			>
		{/each}
	</div>
</nav>
