<script lang="ts">
	import type { PageProps } from './$types';
	import { marked } from 'marked';
	import { getLocale, localizeHref } from '$lib/paraglide/runtime';
	import * as m from '$lib/paraglide/messages';
	import TechIcon from '$lib/components/TechIcon.svelte';

	let { data }: PageProps = $props();
	const projectDetails = $derived(data.projectDetails);

	const locale = getLocale();

	const description = $derived(
		locale === 'tr' ? projectDetails.longDescriptionTr : projectDetails.longDescriptionEn
	);

	const html = $derived(marked(description) as string);

	const statusLabel = $derived(
		projectDetails.status === 'ACTIVE'
			? m.project_status_active()
			: projectDetails.status === 'WIP'
				? m.project_status_wip()
				: m.project_status_archived()
	);

	const statusClass = $derived(
		projectDetails.status === 'ACTIVE'
			? 'text-accent border-accent'
			: projectDetails.status === 'WIP'
				? 'text-yellow-400 border-yellow-400'
				: 'text-muted border-border'
	);
</script>

<svelte:head>
	<title>sertaccan | {projectDetails.title}</title>
	<meta
		name="description"
		content={locale === 'tr' ? projectDetails.descriptionTr : projectDetails.descriptionEn}
	/>
</svelte:head>

<main class="mx-auto max-w-6xl py-4">
	<a
		href={localizeHref('/projects')}
		class="mb-8 inline-block font-mono text-xs text-muted transition-colors duration-150 hover:text-text"
	>
		{m.project_detail_back()}
	</a>

	{#if projectDetails.imageUrl}
		<img
			src={projectDetails.imageUrl}
			alt={projectDetails.title}
			class="mb-8 h-64 w-full rounded border border-border object-cover"
		/>
	{:else}
		<div
			class="mb-8 h-64 w-full rounded border border-border"
			style="background: linear-gradient(135deg, var(--color-accent-dim), var(--color-surface))"
		></div>
	{/if}

	<div class="mb-4 flex flex-wrap items-start gap-3">
		<h1 class="font-mono text-3xl font-bold text-text">{projectDetails.title}</h1>
		<span class="rounded border px-2 py-0.5 font-mono text-xs {statusClass}">{statusLabel}</span>
	</div>

	<div class="mb-6 flex flex-wrap gap-2">
		{#each projectDetails.tags as tag (tag)}
			<span
				class="flex items-center gap-1 rounded border border-border px-2 py-0.5 font-mono text-xs text-muted"
			>
				<TechIcon name={tag} />
				{tag}
			</span>
		{/each}
	</div>

	<div class="mb-10 flex gap-4">
		{#if projectDetails.githubUrl}
			<a
				href={projectDetails.githubUrl}
				target="_blank"
				rel="noopener noreferrer"
				class="font-mono text-xs text-muted transition-colors duration-150 hover:text-text"
			>
				GitHub →
			</a>
		{/if}
		{#if projectDetails.liveUrl}
			<a
				href={projectDetails.liveUrl}
				target="_blank"
				rel="noopener noreferrer"
				class="font-mono text-xs text-accent transition-colors duration-150 hover:underline"
			>
				{m.liveSite()} →
			</a>
		{/if}
	</div>

	<article class="prose max-w-none prose-invert">
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		{@html html}
	</article>
</main>
