<script lang="ts">
	import { onMount } from 'svelte';
	import * as m from '$lib/paraglide/messages';
	import { Mail } from 'lucide-svelte';
	import Sparkles from './Sparkles.svelte';

	let typedText = $state('');
	let showCursor = $state(true);

	onMount(() => {
		const fullText = m.hero_role();
		let i = 0;

		const typeInterval = setInterval(() => {
			if (i < fullText.length) {
				typedText = fullText.slice(0, i + 1);
				i++;
			} else {
				clearInterval(typeInterval);
			}
		}, 80);

		const cursorInterval = setInterval(() => {
			showCursor = !showCursor;
		}, 530);

		return () => {
			clearInterval(typeInterval);
			clearInterval(cursorInterval);
		};
	});
</script>

<section
	id="hero"
	class="relative flex min-h-[80vh] flex-col items-center justify-center overflow-hidden px-4 text-center"
>
	<!-- Animated gradient background -->
	<div class="hero-gradient pointer-events-none absolute inset-0"></div>

	<h1 class="relative z-10 font-mono text-4xl font-bold tracking-tight text-text md:text-7xl">
		Sertaç Can
	</h1>

	<div class="relative mt-4">
		<p class="relative z-10 font-mono text-lg text-accent md:text-2xl">
			<span class="inline-block">
				&gt; {typedText}<span class="transition-opacity duration-100" class:opacity-0={!showCursor}
					>_</span
				>
			</span>
		</p>
		<div class="absolute -inset-x-12 -inset-y-6 z-0 md:-inset-x-20 md:-inset-y-8">
			<Sparkles
				particleColor="#00ff88"
				particleDensity={100}
				minSize={0.6}
				maxSize={2}
				speed={0.4}
			/>
		</div>
	</div>

	<p class="relative z-10 mt-3 max-w-md text-sm text-muted md:text-base">
		{m.hero_tagline()}
	</p>

	<div class="relative z-10 mt-8 flex gap-5">
		<a
			href="https://github.com/SertacN"
			target="_blank"
			rel="noopener noreferrer"
			class="text-muted transition-colors duration-150 hover:text-accent"
			aria-label="GitHub"
		>
			<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
				<path
					d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
				/>
			</svg>
		</a>
		<a
			href="mailto:sertac.can1@gmail.com"
			class="text-muted transition-colors duration-150 hover:text-accent"
			aria-label="Email"
		>
			<Mail size={24} />
		</a>
	</div>
</section>

<style>
	.hero-gradient {
		background: radial-gradient(
			ellipse 60% 50% at 50% 50%,
			var(--color-accent-dim) 0%,
			transparent 70%
		);
		animation: gradient-pulse 6s ease-in-out infinite;
	}

	@keyframes gradient-pulse {
		0%,
		100% {
			opacity: 0.4;
			transform: scale(1);
		}
		50% {
			opacity: 0.7;
			transform: scale(1.1);
		}
	}
</style>
