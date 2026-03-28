<script lang="ts">
	import { authClient } from '$lib/auth-client';
	import { goto, invalidateAll } from '$app/navigation';
	import { localizeHref } from '$lib/paraglide/runtime';

	let { data } = $props();

	async function handleLogout() {
		await authClient.signOut();
		await invalidateAll();
		goto(localizeHref('/admin/login'));
	}
</script>

<div class="min-h-screen bg-bg p-8">
	<div class="mx-auto max-w-6xl">
		<div class="mb-8 flex items-center justify-between">
			<h1 class="font-mono text-2xl font-bold text-accent">Admin Dashboard</h1>
			<div class="flex items-center gap-4">
				<span class="font-mono text-xs text-muted">{data.user?.email}</span>
				<button
					onclick={handleLogout}
					class="rounded border border-border px-3 py-1.5 font-mono text-xs text-muted transition-colors duration-150 hover:border-accent hover:text-accent"
				>
					Çıkış
				</button>
			</div>
		</div>

		<p class="text-muted">Dashboard içeriği ilerleyen aşamalarda eklenecek.</p>
	</div>
</div>
