<script lang="ts">
	import { page } from '$app/state';
	import { localizeHref } from '$lib/paraglide/runtime';

	let { user = null }: { user: { role: string } | null } = $props();

	const links = [
		{ href: '/admin', label: 'Admin' },
		{ href: '/admin/users', label: 'Users' }
	];

	function isActive(href: string) {
		return page.url.pathname === href || page.url.pathname === localizeHref(href);
	}
</script>

{#if user?.role === 'admin'}
	<nav class="border-b border-border md:w-3xs md:border-r md:border-b-0">
		<div class="flex flex-row gap-4 px-4 py-2 font-mono md:flex-col md:gap-2">
			{#each links as link (link.href)}
				<a
					class="border-b py-1 text-sm transition-colors duration-150 hover:text-text
						{isActive(link.href) ? 'border-accent text-text' : 'border-transparent text-muted'}"
					href={localizeHref(link.href)}
				>
					{link.label}
				</a>
			{/each}
		</div>
	</nav>
{/if}
