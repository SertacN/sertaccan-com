<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { techstack, type Tech } from '$lib/data/techstack';

	const categories = ['Frontend', 'Backend', 'Database', 'DevOps', 'Mobile'] as const;

	const grouped = categories.reduce(
		(acc, cat) => {
			acc[cat] = techstack.filter((t) => t.category === cat);
			return acc;
		},
		{} as Record<string, Tech[]>
	);

	const levelColor: Record<Tech['level'], string> = {
		advanced: 'border-accent/60 text-accent',
		intermediate: 'border-accent/30 text-accent/70',
		beginner: 'border-accent/15 text-accent/40'
	};
</script>

<section id="techstack" class="px-4 py-24">
	<h2 class="mb-12 text-center font-mono text-2xl font-bold text-text md:text-3xl">
		{m.section_stack()}
	</h2>

	<div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
		{#each categories as category (category)}
			{@const items = grouped[category]}
			{#if items.length > 0}
				<div>
					<h3 class="mb-4 font-mono text-sm tracking-widest text-muted uppercase">
						{category}
					</h3>
					<div class="flex flex-wrap gap-2">
						{#each items as tech (tech.name)}
							<span
								class="rounded border px-3 py-1.5 font-mono text-xs transition-colors duration-150 hover:border-accent hover:text-accent {levelColor[
									tech.level
								]}"
							>
								{tech.name}
							</span>
						{/each}
					</div>
				</div>
			{/if}
		{/each}
	</div>
</section>
