<script lang="ts">
	import type { Project } from '@prisma/client';
	import { getLocale, localizeHref } from '$lib/paraglide/runtime';
	import * as m from '$lib/paraglide/messages';
	import TechIcon from './TechIcon.svelte';

	let { project }: { project: Project } = $props();

	const locale = getLocale();

	const description = $derived(locale === 'tr' ? project.descriptionTr : project.descriptionEn);

	const statusLabel = $derived(
		project.status === 'ACTIVE'
			? m.project_status_active()
			: project.status === 'WIP'
				? m.project_status_wip()
				: m.project_status_archived()
	);

	const statusClass = $derived(
		project.status === 'ACTIVE'
			? 'text-accent border-accent'
			: project.status === 'WIP'
				? 'text-yellow-400 border-yellow-400'
				: 'text-muted border-border'
	);

	let cardEl: HTMLDivElement;
	let tiltStyle = $state('');

	function handleMouseMove(e: MouseEvent) {
		const rect = cardEl.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;
		const centerX = rect.width / 2;
		const centerY = rect.height / 2;

		const rotateX = ((y - centerY) / centerY) * -6;
		const rotateY = ((x - centerX) / centerX) * 6;

		tiltStyle = `transform: perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02); --glow-x: ${x}px; --glow-y: ${y}px;`;
	}

	function handleMouseLeave() {
		tiltStyle = '';
	}
</script>

<div
	bind:this={cardEl}
	role="article"
	onmousemove={handleMouseMove}
	onmouseleave={handleMouseLeave}
	class="card-tilt relative flex flex-col overflow-hidden rounded border border-border bg-surface transition-all duration-200 ease-out hover:border-accent/40"
	style={tiltStyle}
>
	<!-- Glow overlay -->
	<div class="card-glow pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-200"></div>

	<!-- Kapak görseli -->
	<a href={`projects/${project.slug}`}>
		{#if project.imageUrl}
			<img src={project.imageUrl} alt={project.title} class="h-44 w-full rounded-t object-cover" />
		{:else}
			<div
				class="h-44 w-full rounded-t"
				style="background: linear-gradient(135deg, var(--color-accent-dim), var(--color-surface))"
			></div>
		{/if}
	</a>
	<div class="flex flex-1 flex-col gap-3 p-5">
		<!-- Başlık + status -->
		<div class="flex items-start justify-between gap-2">
			<h3 class="font-mono text-sm font-bold text-text">{project.title}</h3>
			<span class="shrink-0 rounded border px-1.5 py-0.5 font-mono text-xs {statusClass}">
				{statusLabel}
			</span>
		</div>

		<!-- Açıklama -->
		<p class="text-xs leading-relaxed text-muted">{description}</p>

		<!-- Tag'ler -->
		<div class="flex flex-wrap gap-1.5">
			{#each project.tags as tag (tag)}
				<span
					class="flex items-center gap-1 rounded border border-border px-1.5 py-0.5 font-mono text-xs text-muted"
				>
					<TechIcon name={tag} />
					{tag}
				</span>
			{/each}
		</div>

		<!-- Aksiyonlar -->
		<div class="mt-auto flex items-center gap-3 pt-2">
			{#if project.githubUrl}
				<a
					href={project.githubUrl}
					target="_blank"
					rel="noopener noreferrer"
					class="text-muted transition-colors duration-150 hover:text-text"
					aria-label="GitHub"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="15"
						height="15"
						viewBox="0 0 24 24"
						fill="currentColor"
					>
						<path
							d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2Z"
						/>
					</svg>
				</a>
			{/if}

			<a
				href={localizeHref(`/projects/${project.slug}`)}
				class="ml-auto rounded border border-accent px-1.5 py-0.5 font-mono text-xs text-accent transition-colors duration-150 hover:underline"
			>
				{m.details()} →
			</a>
		</div>
	</div>
</div>

<style>
	.card-tilt {
		will-change: transform;
		transform-style: preserve-3d;
	}

	.card-tilt:hover .card-glow {
		opacity: 1;
	}

	.card-glow {
		background: radial-gradient(
			300px circle at var(--glow-x, 50%) var(--glow-y, 50%),
			var(--color-accent-dim),
			transparent 70%
		);
	}
</style>
