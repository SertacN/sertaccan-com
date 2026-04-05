<script lang="ts">
	import { page } from '$app/state';
	import { onNavigate } from '$app/navigation';
	import { locales, localizeHref } from '$lib/paraglide/runtime';

	import './layout.css';
	import Navbar from '$lib/components/Navbar.svelte';
	import Footer from '$lib/components/Footer.svelte';

	let { children, data } = $props();

	const base = 'https://sertaccan.com';
	const canonicalUrl = $derived(`${base}${page.url.pathname}`);

	onNavigate((navigation) => {
		if (!document.startViewTransition) return;

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});
</script>

<svelte:head>
	<link rel="canonical" href={canonicalUrl} />
	{#each locales as l (l)}
		<link
			rel="alternate"
			hreflang={l}
			href="{base}{localizeHref(page.url.pathname, { locale: l })}"
		/>
	{/each}
	<link
		rel="alternate"
		hreflang="x-default"
		href="{base}{localizeHref(page.url.pathname, { locale: 'tr' })}"
	/>
</svelte:head>
<Navbar user={data.user} />
<main>
	{@render children()}
</main>
<Footer />

<div style="display:none">
	{#each locales as locale (locale)}
		<a href={localizeHref(page.url.pathname, { locale })}>{locale}</a>
	{/each}
</div>
