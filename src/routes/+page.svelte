<script lang="ts">
	import type { PageProps } from './$types';
	import Hero from '$lib/components/Hero.svelte';
	import About from '$lib/components/About.svelte';
	import TechStack from '$lib/components/TechStack.svelte';
	import Projects from '$lib/components/Projects.svelte';
	import Contact from '$lib/components/Contact.svelte';
	import Divider from '$lib/components/Divider.svelte';
	import * as m from '$lib/paraglide/messages';

	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>Sertaç Can | {m.hero_role()}</title>
	<meta name="description" content={m.hero_tagline()} />
	<meta property="og:title" content="Sertaç Can | {m.hero_role()}" />
	<meta property="og:description" content={m.hero_tagline()} />
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://sertaccan.com" />
	<meta property="og:image" content="https://sertaccan.com/og-image.png" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="Sertaç Can | {m.hero_role()}" />
	<meta name="twitter:description" content={m.hero_tagline()} />
	<meta name="twitter:image" content="https://sertaccan.com/og-image.png" />
</svelte:head>

<div class="mx-auto max-w-6xl py-4">
	<Hero />
	<Divider />
	<About />
	<Divider />
	<TechStack />
	<Divider />
	<Projects projects={data.projects} />
	<Divider />
	<Contact />
</div>
