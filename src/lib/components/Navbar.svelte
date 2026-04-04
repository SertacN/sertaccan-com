<script lang="ts">
	import { browser } from '$app/environment';
	import { getLocale, setLocale, localizeHref } from '$lib/paraglide/runtime';
	import * as m from '$lib/paraglide/messages';
	import { authClient } from '$lib/auth-client';
	import { goto, invalidateAll } from '$app/navigation';

	let { user = null }: { user: { role: string } | null } = $props();

	let isDark = $state(true);
	let mobileOpen = $state(false);

	if (browser) {
		isDark = localStorage.getItem('theme') !== 'light';
	}

	function toggleTheme() {
		isDark = !isDark;
		const theme = isDark ? 'dark' : 'light';
		localStorage.setItem('theme', theme);
		document.documentElement.classList.toggle('light', !isDark);
	}

	function closeMobile() {
		mobileOpen = false;
	}

	const locale = getLocale();

	async function handleLogout() {
		await authClient.signOut();
		await invalidateAll();
		goto(localizeHref('/'));
	}
</script>

<nav class="fixed top-0 right-0 left-0 z-50 border-b border-border bg-bg/80 backdrop-blur-sm">
	<div class="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
		<a href={localizeHref('/')} class="font-mono text-lg font-bold text-accent">Sertaç Can</a>

		<!-- Hamburger button (mobile) -->
		<button
			onclick={() => (mobileOpen = !mobileOpen)}
			class="rounded border border-border p-1.5 text-muted transition-colors duration-150 hover:text-text md:hidden"
			aria-label="Menü"
		>
			{#if mobileOpen}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="18"
					height="18"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg
				>
			{:else}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="18"
					height="18"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					><line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" /><line
						x1="4"
						x2="20"
						y1="18"
						y2="18"
					/></svg
				>
			{/if}
		</button>

		<!-- Desktop nav -->
		<div class="hidden items-center gap-6 md:flex">
			<a
				href={localizeHref('/#about')}
				class="text-sm text-muted transition-colors duration-150 hover:text-text"
				>{m.nav_about()}</a
			>
			<a
				href={localizeHref('/#techstack')}
				class="text-sm text-muted transition-colors duration-150 hover:text-text">{m.nav_stack()}</a
			>
			<a
				href={localizeHref('/#projects')}
				class="text-sm text-muted transition-colors duration-150 hover:text-text"
				>{m.nav_projects()}</a
			>
			<a
				href={localizeHref('/#contact')}
				class="text-sm text-muted transition-colors duration-150 hover:text-text"
				>{m.nav_contact()}</a
			>
			<a
				href={localizeHref('/projects')}
				class="text-sm text-muted transition-colors duration-150 hover:text-text"
				>{m.nav_all_projects()}</a
			>

			<button
				onclick={toggleTheme}
				class="rounded border border-border p-1.5 text-muted transition-colors duration-150 hover:text-text"
				aria-label="Tema değiştir"
			>
				{#if isDark}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="14"
						height="14"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						><circle cx="12" cy="12" r="4" /><path
							d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"
						/></svg
					>
				{:else}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="14"
						height="14"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" /></svg
					>
				{/if}
			</button>

			{#if user?.role === 'admin'}
				<a
					href={localizeHref('/admin')}
					class="rounded border border-accent px-3 py-1.5 font-mono text-xs text-accent transition-colors duration-150 hover:bg-accent hover:text-bg"
					>{m.panel()}</a
				>
				<button
					onclick={handleLogout}
					class="rounded border border-border px-3 py-1.5 font-mono text-xs text-muted transition-colors duration-150 hover:border-accent hover:text-accent"
					>{m.logout()}</button
				>
			{/if}

			<div class="flex items-center gap-1 font-mono text-xs">
				<button
					onclick={() => setLocale('tr')}
					class="rounded border px-2 py-1 transition-colors duration-150 {locale === 'tr'
						? 'border-border text-accent'
						: 'border-transparent text-muted hover:text-text'}">TR</button
				>
				<button
					onclick={() => setLocale('en')}
					class="rounded border px-2 py-1 transition-colors duration-150 {locale === 'en'
						? 'border-border text-accent'
						: 'border-transparent text-muted hover:text-text'}">EN</button
				>
			</div>
		</div>
	</div>

	<!-- Mobile menu -->
	{#if mobileOpen}
		<div class="flex flex-col gap-4 border-t border-border px-4 py-4 md:hidden">
			<a
				href={localizeHref('/#about')}
				onclick={closeMobile}
				class="text-sm text-muted transition-colors duration-150 hover:text-text"
				>{m.nav_about()}</a
			>
			<a
				href={localizeHref('/#techstack')}
				onclick={closeMobile}
				class="text-sm text-muted transition-colors duration-150 hover:text-text">{m.nav_stack()}</a
			>
			<a
				href={localizeHref('/#projects')}
				onclick={closeMobile}
				class="text-sm text-muted transition-colors duration-150 hover:text-text"
				>{m.nav_projects()}</a
			>
			<a
				href={localizeHref('/#contact')}
				onclick={closeMobile}
				class="text-sm text-muted transition-colors duration-150 hover:text-text"
				>{m.nav_contact()}</a
			>
			<a
				href={localizeHref('/projects')}
				onclick={closeMobile}
				class="text-sm text-muted transition-colors duration-150 hover:text-text"
				>{m.nav_all_projects()}</a
			>

			<div class="flex items-center gap-3 border-t border-border pt-4">
				<button
					onclick={toggleTheme}
					class="rounded border border-border p-1.5 text-muted transition-colors duration-150 hover:text-text"
					aria-label="Tema değiştir"
				>
					{#if isDark}
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="14"
							height="14"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							><circle cx="12" cy="12" r="4" /><path
								d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"
							/></svg
						>
					{:else}
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="14"
							height="14"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" /></svg
						>
					{/if}
				</button>

				{#if user?.role === 'admin'}
					<a
						href={localizeHref('/admin')}
						onclick={closeMobile}
						class="rounded border border-accent px-3 py-1.5 font-mono text-xs text-accent transition-colors duration-150 hover:bg-accent hover:text-bg"
						>{m.panel()}</a
					>
					<button
						onclick={() => {
							handleLogout();
							closeMobile();
						}}
						class="rounded border border-border px-3 py-1.5 font-mono text-xs text-muted transition-colors duration-150 hover:border-accent hover:text-accent"
						>{m.logout()}</button
					>
				{/if}

				<div class="ml-auto flex items-center gap-1 font-mono text-xs">
					<button
						onclick={() => setLocale('tr')}
						class="rounded border px-2 py-1 transition-colors duration-150 {locale === 'tr'
							? 'border-border text-accent'
							: 'border-transparent text-muted hover:text-text'}">TR</button
					>
					<button
						onclick={() => setLocale('en')}
						class="rounded border px-2 py-1 transition-colors duration-150 {locale === 'en'
							? 'border-border text-accent'
							: 'border-transparent text-muted hover:text-text'}">EN</button
					>
				</div>
			</div>
		</div>
	{/if}
</nav>

<div class="h-18.25"></div>
