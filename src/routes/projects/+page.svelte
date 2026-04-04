<script lang="ts">
	import type { PageProps } from './$types';
	import ProjectCard from '$lib/components/ProjectCard.svelte';
	import { m } from '$lib/paraglide/messages';

	let { data }: PageProps = $props();
	const projects = $derived(data.projects);
	const pagination = $derived(data.pagination);
	const visiblePages = $derived.by(() => {
		const total = pagination.totalPages;
		const current = pagination.page;
		if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

		const pages: (number | '...')[] = [1];
		if (current > 3) pages.push('...');

		const start = Math.max(2, current - 1);
		const end = Math.min(total - 1, current + 1);
		for (let i = start; i <= end; i++) pages.push(i);

		if (current < total - 2) pages.push('...');
		pages.push(total);

		return pages;
	});
</script>

<svelte:head>
	<title>Sertaç Can | {m.project()}</title>
	<meta name="description" content={m.projects_view_all()} />
	<meta property="og:title" content="Sertaç Can | {m.project()}" />
	<meta property="og:description" content={m.projects_view_all()} />
	<meta property="og:image" content="https://sertaccan.com/og-image.png" />
	<meta name="twitter:card" content="summary_large_image" />
</svelte:head>
<main class="mx-auto max-w-6xl py-4">
	<h1 class="mb-2 font-mono text-2xl font-bold text-text">{m.project()}</h1>

	<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
		{#each projects as project (project.id)}
			<ProjectCard {project} />
		{/each}
	</div>
	{#if pagination.totalPages >= 2}
		<div class="mt-8 flex justify-center gap-2">
			{#each visiblePages as item, i (item === '...' ? `dots-${i}` : item)}
				{#if item === '...'}
					<span class="w-8 p-1 text-center text-muted">…</span>
				{:else}
					<a
						class="w-8 rounded border p-1 text-center transition-colors {item === pagination.page
							? 'border-accent bg-accent/20 text-accent'
							: 'border-border text-muted hover:border-accent hover:text-accent'}"
						href="?page={item}"
					>
						{item}
					</a>
				{/if}
			{/each}
		</div>
	{/if}
</main>
