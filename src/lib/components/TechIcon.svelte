<script lang="ts">
	import { getTechIcon } from '$lib/utils/tech-icons';

	let { name, size = 12 }: { name: string; size?: number } = $props();

	const icon = $derived(getTechIcon(name));
</script>

{#if icon}
	<svg
		role="img"
		viewBox="0 0 24 24"
		width={size}
		height={size}
		fill="#{icon.hex}"
		aria-label={icon.title}
		xmlns="http://www.w3.org/2000/svg"
	>
		<path d={icon.path} />
	</svg>
{/if}
