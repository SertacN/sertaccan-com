<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { Mail } from 'lucide-svelte';
	import { reveal } from '$lib/actions/reveal';
	import { enhance } from '$app/forms';
	import Divider from './Divider.svelte';

	interface FormResult {
		action?: string;
		success?: boolean;
		errors?: Record<string, string[]>;
	}
	interface Props {
		form?: FormResult | null;
	}
	const { form }: Props = $props();

	let messageLength = $state(0);
</script>

<section id="contact" class="px-4 py-24" use:reveal>
	<h2 class="mb-8 text-center font-mono text-2xl font-bold text-text md:text-3xl">
		{m.section_contact()}
	</h2>

	<div class="mb-6 flex flex-wrap justify-center gap-4">
		<a
			href="mailto:sertac.can1@gmail.com"
			class="flex items-center gap-2 rounded border border-border px-4 py-2 font-mono text-sm text-muted transition-colors duration-150 hover:border-accent hover:text-accent"
		>
			<Mail size={18} />
			Email
		</a>

		<a
			href="https://github.com/SertacN"
			target="_blank"
			rel="noopener noreferrer"
			class="flex items-center gap-2 rounded border border-border px-4 py-2 font-mono text-sm text-muted transition-colors duration-150 hover:border-accent hover:text-accent"
		>
			<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
				<path
					d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
				/>
			</svg>
			GitHub
		</a>

		<a
			href="https://www.linkedin.com/in/sertacn"
			target="_blank"
			rel="noopener noreferrer"
			class="flex items-center gap-2 rounded border border-border px-4 py-2 font-mono text-sm text-muted transition-colors duration-150 hover:border-accent hover:text-accent"
		>
			<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
				<path
					d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
				/>
			</svg>
			LinkedIn
		</a>
	</div>

	<div class="-mx-4">
		<Divider />
	</div>

	<div class="mt-6">
		<div class="rounded border border-border bg-surface p-6">
			<h2 class="mb-6 font-mono text-lg font-bold text-text">{m.form_contact()}</h2>

			{#if form?.success}
				<div
					class="mb-4 rounded border border-accent/30 bg-accent/5 px-4 py-2 font-mono text-sm text-accent"
				>
					{m.message_send_success()}
				</div>
			{/if}

			<form
				action="?/createContactForm"
				method="POST"
				use:enhance
				class="grid grid-cols-1 gap-4 md:grid-cols-2"
			>
				<div>
					<label for="name" class="mb-1 block font-mono text-xs text-muted">{m.name()}</label>
					<input
						type="text"
						name="name"
						id="name"
						maxlength="20"
						class="w-full rounded border border-border bg-bg px-3 py-2 font-mono text-sm text-text focus:border-accent focus:outline-none"
					/>
					{#if form?.errors?.name}
						<p class="mt-1 font-mono text-xs text-red-400">{form.errors.name[0]}</p>
					{/if}
				</div>
				<div>
					<label for="email" class="mb-1 block font-mono text-xs text-muted">Email</label>
					<input
						type="email"
						name="email"
						id="email"
						class="w-full rounded border border-border bg-bg px-3 py-2 font-mono text-sm text-text focus:border-accent focus:outline-none"
					/>
					{#if form?.errors?.email}
						<p class="mt-1 font-mono text-xs text-red-400">{form.errors.email[0]}</p>
					{/if}
				</div>
				<div class="md:col-span-2">
					<label for="subject" class="mb-1 block font-mono text-xs text-muted">{m.subject()}</label>
					<input
						type="text"
						name="subject"
						id="subject"
						maxlength="50"
						class="w-full rounded border border-border bg-bg px-3 py-2 font-mono text-sm text-text focus:border-accent focus:outline-none"
					/>
					{#if form?.errors?.subject}
						<p class="mt-1 font-mono text-xs text-red-400">{form.errors.subject[0]}</p>
					{/if}
				</div>
				<div class="md:col-span-2">
					<label for="message" class="mb-1 block font-mono text-xs text-muted">{m.message()}</label>
					<textarea
						name="message"
						id="message"
						maxlength="300"
						rows="5"
						oninput={(e) => (messageLength = (e.target as HTMLTextAreaElement).value.length)}
						class="w-full resize-none rounded border border-border bg-bg px-3 py-2 font-mono text-sm text-text focus:border-accent focus:outline-none"
					></textarea>
					<div class="mt-1 flex items-center justify-between">
						{#if form?.errors?.message}
							<p class="font-mono text-xs text-red-400">{form.errors.message[0]}</p>
						{:else}
							<span></span>
						{/if}
						<span
							class="font-mono text-xs {messageLength >= 270 ? 'text-red-400' : 'text-muted/50'}"
							>{messageLength}/300</span
						>
					</div>
				</div>
				<div class="md:col-span-2">
					<button
						type="submit"
						class="rounded border border-accent bg-accent/10 px-6 py-2 font-mono text-sm text-accent transition-colors duration-150 hover:bg-accent/20"
					>
						{m.send()}
					</button>
				</div>
			</form>
		</div>
	</div>
</section>
