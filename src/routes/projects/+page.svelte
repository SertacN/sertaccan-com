<script lang="ts">
	import type { PageProps } from './$types';
	import ProjectCard from '$lib/components/ProjectCard.svelte';
	import { m } from '$lib/paraglide/messages';

	let { data }: PageProps = $props();
</script>

<main class="mx-auto max-w-6xl py-4">
	<h1 class="mb-10 font-mono text-2xl font-bold text-text">{m.project()}</h1>

	<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
		{#each data.projects as project (project.id)}
			<ProjectCard {project} />
		{/each}
	</div>
</main>
