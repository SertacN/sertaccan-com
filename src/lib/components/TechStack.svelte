<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { techstack, type Tech } from '$lib/data/techstack';
	import { reveal } from '$lib/actions/reveal';
	import TechIcon from './TechIcon.svelte';

	const categories = ['Frontend', 'Backend', 'Database', 'DevOps', 'Mobile'] as const;

	const grouped = categories.reduce(
		(acc, cat) => {
			acc[cat] = techstack.filter((t) => t.category === cat);
			return acc;
		},
		{} as Record<string, Tech[]>
	);

	const levelBg: Record<Tech['level'], string> = {
		advanced: 'bg-accent/8 border-accent/25 text-accent',
		intermediate: 'bg-accent/4 border-accent/15 text-accent/70',
		beginner: 'bg-accent/2 border-accent/10 text-accent/50'
	};
</script>

<section id="techstack" class="px-4 py-24" use:reveal>
	<h2 class="mb-12 text-center font-mono text-2xl font-bold text-text md:text-3xl">
		{m.section_stack()}
	</h2>

	<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
		{#each categories as category (category)}
			{@const items = grouped[category]}
			{#if items.length > 0}
				<div class="rounded-lg border border-border bg-surface/50 p-5">
					<h3 class="mb-4 font-mono text-xs tracking-widest text-muted uppercase">
						{category}
					</h3>
					<div class="flex flex-wrap gap-2">
						{#each items as tech (tech.name)}
							<span
								class="tech-chip inline-flex items-center gap-1.5 rounded border px-3 py-1.5 font-mono text-xs transition-all duration-200 {levelBg[tech.level]}"
							>
								<TechIcon name={tech.name} size={14} />
								{tech.name}
							</span>
						{/each}
					</div>
				</div>
			{/if}
		{/each}
	</div>
</section>

<style>
	.tech-chip {
		position: relative;
	}

	.tech-chip::before {
		content: '';
		position: absolute;
		inset: -1px;
		border-radius: inherit;
		opacity: 0;
		transition: opacity 200ms ease-out;
		box-shadow: 0 0 12px 2px var(--color-accent-dim);
	}

	.tech-chip:hover::before {
		opacity: 1;
	}

	.tech-chip:hover {
		border-color: var(--color-accent);
		color: var(--color-accent);
		transform: translateY(-1px);
	}
</style>
