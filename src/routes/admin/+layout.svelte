<script lang="ts">
	import AdminSideNav from '$lib/components/AdminSideNav.svelte';
	import type { LayoutProps } from './$types';

	let { data, children }: LayoutProps = $props();
</script>

<section class="mx-auto flex max-w-6xl flex-col md:flex-row">
	<AdminSideNav user={data.user} unreadContactCount={data.unreadContactCount} />
	<div class="min-w-0 flex-1">
		{@render children()}
	</div>
</section>
