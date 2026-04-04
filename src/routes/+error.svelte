<script lang="ts">
	import { page } from '$app/state';
	import * as m from '$lib/paraglide/messages';
	import { localizeHref } from '$lib/paraglide/runtime';
</script>

<div class="flex min-h-[70vh] flex-col items-center justify-center gap-6 px-4 text-center">
	<div class="font-mono text-8xl font-bold text-accent md:text-9xl">
		{page.status}
	</div>

	<h1 class="font-mono text-xl font-bold text-text md:text-2xl">
		{page.status === 404 ? m.error_title() : (page.error?.message ?? 'Error')}
	</h1>

	<p class="max-w-md text-sm text-muted">
		{page.status === 404 ? m.error_desc() : (page.error?.message ?? '')}
	</p>

	<a
		href={localizeHref('/')}
		class="mt-4 rounded border border-accent px-4 py-2 font-mono text-sm text-accent transition-colors duration-150 hover:bg-accent hover:text-bg"
	>
		← {m.backToHome()}
	</a>
</div>
