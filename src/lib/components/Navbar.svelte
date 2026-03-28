<script lang="ts">
	import { browser } from '$app/environment';
	import { localizeHref } from '$lib/paraglide/runtime';

	let isDark = $state(true);

	if (browser) {
		isDark = localStorage.getItem('theme') !== 'light';
	}

	function toggleTheme() {
		isDark = !isDark;
		const theme = isDark ? 'dark' : 'light';
		localStorage.setItem('theme', theme);
		document.documentElement.classList.toggle('light', !isDark);
	}
</script>

<nav class="fixed top-0 right-0 left-0 z-50 border-b border-border bg-bg/80 backdrop-blur-sm">
	<div class="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
		<a href="/" class="font-mono text-lg font-bold text-accent"> Sertaç Can </a>

		<div class="flex items-center gap-6">
			<a
				href="/#techstack"
				class="text-sm text-muted transition-colors duration-150 hover:text-text">Stack</a
			>
			<a href="/#projects" class="text-sm text-muted transition-colors duration-150 hover:text-text"
				>Projeler</a
			>
			<a href="/#contact" class="text-sm text-muted transition-colors duration-150 hover:text-text"
				>İletişim</a
			>
			<a href="/projects" class="text-sm text-muted transition-colors duration-150 hover:text-text"
				>Tüm Projeler</a
			>

			<button
				onclick={toggleTheme}
				class="rounded border border-border p-1.5 text-muted transition-colors duration-150 hover:text-text"
				aria-label="Tema değiştir"
			>
				{#if isDark}
					<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>
				{:else}
					<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
				{/if}
			</button>

			<div class="flex items-center gap-1 font-mono text-xs">
				<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
				<a
					href={localizeHref('/', { locale: 'tr' })}
					class="rounded border border-border px-2 py-1 text-accent transition-colors duration-150"
					>TR</a
				>
				<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
				<a
					href={localizeHref('/', { locale: 'en' })}
					class="rounded border border-transparent px-2 py-1 text-muted transition-colors duration-150 hover:text-text"
					>EN</a
				>
			</div>
		</div>
	</div>
</nav>

<div class="h-[73px]"></div>
