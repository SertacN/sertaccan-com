<script lang="ts">
	import type { Project } from '@prisma/client';
	import * as m from '$lib/paraglide/messages';
	import { localizeHref } from '$lib/paraglide/runtime';
	import ProjectCard from './ProjectCard.svelte';

	let { projects }: { projects: Project[] } = $props();
</script>

<section id="projects" class="px-4 py-24">
	<h2 class="mb-12 text-center font-mono text-2xl font-bold text-text md:text-3xl">
		{m.section_projects()}
	</h2>

	<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
		{#each projects as project (project.id)}
			<ProjectCard {project} />
		{/each}
	</div>

	<div class="mt-10 text-center">
		<a
			href={localizeHref('/projects')}
			class="font-mono text-sm text-accent transition-colors duration-150 hover:underline"
		>
			{m.projects_view_all()}
		</a>
	</div>
</section>
