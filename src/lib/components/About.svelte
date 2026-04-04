<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { reveal } from '$lib/actions/reveal';
</script>

<section id="about" class="px-4 py-24" use:reveal>
	<h2 class="mb-12 text-center font-mono text-2xl font-bold text-text md:text-3xl">
		{m.section_about()}
	</h2>

	<div class="mx-auto max-w-2xl space-y-4 text-sm leading-relaxed text-muted md:text-base">
		<p>{m.about_p1()}</p>
		<p>{m.about_p2()}</p>
		<p>{m.about_p3()}</p>
	</div>
</section>
