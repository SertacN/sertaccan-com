<script lang="ts">
	import { onMount } from 'svelte';

	let {
		particleColor = '#00ff88',
		particleDensity = 80,
		minSize = 0.8,
		maxSize = 2.5,
		speed = 0.6,
		className = ''
	}: {
		particleColor?: string;
		particleDensity?: number;
		minSize?: number;
		maxSize?: number;
		speed?: number;
		className?: string;
	} = $props();

	let canvas: HTMLCanvasElement;

	onMount(() => {
		const ctx = canvas.getContext('2d')!;
		let animationId: number;
		let particles: {
			x: number;
			y: number;
			size: number;
			opacity: number;
			opacityDirection: number;
			speedX: number;
			speedY: number;
		}[] = [];

		function resize() {
			const rect = canvas.parentElement!.getBoundingClientRect();
			canvas.width = rect.width;
			canvas.height = rect.height;
			initParticles();
		}

		function initParticles() {
			const area = (canvas.width * canvas.height) / (400 * 400);
			const count = Math.floor(particleDensity * area);
			particles = Array.from({ length: count }, () => ({
				x: Math.random() * canvas.width,
				y: Math.random() * canvas.height,
				size: minSize + Math.random() * (maxSize - minSize),
				opacity: Math.random(),
				opacityDirection: (Math.random() > 0.5 ? 1 : -1) * (0.5 + Math.random() * 0.5),
				speedX: (Math.random() - 0.5) * speed,
				speedY: (Math.random() - 0.5) * speed
			}));
		}

		function animate() {
			ctx.clearRect(0, 0, canvas.width, canvas.height);

			for (const p of particles) {
				p.x += p.speedX;
				p.y += p.speedY;
				p.opacity += p.opacityDirection * 0.008;

				if (p.opacity >= 1) {
					p.opacity = 1;
					p.opacityDirection *= -1;
				} else if (p.opacity <= 0.05) {
					p.opacity = 0.05;
					p.opacityDirection *= -1;
				}

				if (p.x < 0) p.x = canvas.width;
				if (p.x > canvas.width) p.x = 0;
				if (p.y < 0) p.y = canvas.height;
				if (p.y > canvas.height) p.y = 0;

				ctx.beginPath();
				ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
				ctx.fillStyle = particleColor;
				ctx.globalAlpha = p.opacity;
				ctx.fill();
			}

			ctx.globalAlpha = 1;
			animationId = requestAnimationFrame(animate);
		}

		resize();
		animate();

		const observer = new ResizeObserver(resize);
		observer.observe(canvas.parentElement!);

		return () => {
			cancelAnimationFrame(animationId);
			observer.disconnect();
		};
	});
</script>

<canvas bind:this={canvas} class="pointer-events-none absolute inset-0 {className}"></canvas>
