<script lang="ts">
	import { page } from '$app/state';
	import { m } from '$lib/paraglide/messages';
</script>

<div class="flex min-h-screen flex-col items-center justify-center gap-4">
	<span class="font-mono text-6xl font-bold text-accent">{page.status}</span>
	<p class="font-mono text-sm text-muted">{page.error?.message ?? 'Bir hata oluştu.'}</p>
	<a href="/" class="font-mono text-xs text-muted transition-colors duration-150 hover:text-text">
		← {m.backToHome()}
	</a>
</div>
