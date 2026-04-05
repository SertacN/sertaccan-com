<script lang="ts">
	import { authClient } from '$lib/auth-client';
	import { goto, invalidateAll } from '$app/navigation';
	import { localizeHref } from '$lib/paraglide/runtime';

	let email = $state('');
	let password = $state('');
	let error = $state('');
	let loading = $state(false);

	async function handleLogin(e: SubmitEvent) {
		e.preventDefault();
		loading = true;
		error = '';

		const result = await authClient.signIn.email({ email, password });

		if (result.error) {
			error = 'Email veya şifre hatalı.';
			loading = false;
			return;
		}

		await invalidateAll();
		goto(localizeHref('/admin'));
	}
</script>

<div class="flex min-h-screen w-full items-center justify-center bg-bg">
	<div class="w-full max-w-sm rounded border border-border bg-surface p-8">
		<h1 class="mb-6 font-mono text-xl font-bold text-accent">Admin Girişi</h1>

		<form onsubmit={handleLogin} class="flex flex-col gap-4">
			<div class="flex flex-col gap-1">
				<label for="email" class="font-mono text-xs text-muted">EMAIL</label>
				<input
					id="email"
					type="email"
					bind:value={email}
					required
					class="rounded border border-border bg-bg px-3 py-2 text-sm text-text outline-none focus:border-accent"
				/>
			</div>

			<div class="flex flex-col gap-1">
				<label for="password" class="font-mono text-xs text-muted">ŞİFRE</label>
				<input
					id="password"
					type="password"
					bind:value={password}
					required
					class="rounded border border-border bg-bg px-3 py-2 text-sm text-text outline-none focus:border-accent"
				/>
			</div>

			{#if error}
				<p class="font-mono text-xs text-red-400">{error}</p>
			{/if}

			<button
				type="submit"
				disabled={loading}
				class="rounded border border-accent bg-transparent px-4 py-2 font-mono text-sm text-accent transition-colors duration-150 hover:bg-accent hover:text-bg disabled:opacity-50"
			>
				{loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
			</button>
		</form>
	</div>
</div>
