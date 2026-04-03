<script lang="ts">
	import type { PageProps } from './$types';
	import Hero from '$lib/components/Hero.svelte';
	import TechStack from '$lib/components/TechStack.svelte';
	import Projects from '$lib/components/Projects.svelte';
	import Contact from '$lib/components/Contact.svelte';

	let { data }: PageProps = $props();
</script>

<div class="mx-auto max-w-6xl py-4">
	<Hero />
	<TechStack />
	<Projects projects={data.projects} />
	<Contact />
</div>
