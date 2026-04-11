<script lang="ts">
	import { page } from '$app/state';
	import { localizeHref } from '$lib/paraglide/runtime';

	let {
		user = null,
		unreadContactCount = 0
	}: { user: { role: string } | null; unreadContactCount?: number } = $props();

	const links = $derived([
		{ href: '/admin', label: 'Admin', badge: 0 },
		{ href: '/admin/users', label: 'Users', badge: 0 },
		{ href: '/admin/contact', label: 'Contact', badge: unreadContactCount }
	]);

	function isActive(href: string) {
		return page.url.pathname === href || page.url.pathname === localizeHref(href);
	}
</script>

{#if user?.role === 'admin'}
	<nav class="border-b border-border md:w-3xs md:border-r md:border-b-0">
		<div class="flex flex-row gap-4 px-4 py-2 font-mono md:flex-col md:gap-2">
			{#each links as link (link.href)}
				<a
					class="relative inline-flex items-center border-b py-1 text-sm transition-colors duration-150 hover:text-text
						{isActive(link.href) ? 'border-accent text-text' : 'border-transparent text-muted'}"
					href={localizeHref(link.href)}
				>
					{link.label}
					{#if link.badge > 0}
						<span
							class="ml-1.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-bg"
						>
							{link.badge}
						</span>
					{/if}
				</a>
			{/each}
		</div>
	</nav>
{/if}
