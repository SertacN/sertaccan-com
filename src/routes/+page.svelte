<script lang="ts">
	import type { PageProps } from './$types';
	import Hero from '$lib/components/Hero.svelte';
	import TechStack from '$lib/components/TechStack.svelte';
	import Projects from '$lib/components/Projects.svelte';
	import Contact from '$lib/components/Contact.svelte';
	import * as m from '$lib/paraglide/messages';

	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>Sertaç Can | {m.hero_role()}</title>
	<meta name="description" content={m.hero_tagline()} />
</svelte:head>

<div class="mx-auto max-w-6xl py-4">
	<Hero />
	<TechStack />
	<Projects projects={data.projects} />
	<Contact />
</div>
