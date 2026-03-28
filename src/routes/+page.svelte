<script lang="ts">
	import type { PageProps } from './$types';
	let { data }: PageProps = $props();
</script>

<div class="mx-auto max-w-6xl py-4">
	{#each data.projects as project (project.id)}
		<div>
			<span>{project.title}</span>
			<span>{project.status}</span>
		</div>
	{/each}
</div>
