<script lang="ts">
	import type { ContactForm } from '@prisma/client';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	let contacts = $state<ContactForm[]>([]);
	let selected = $state<ContactForm | null>(null);

	$effect(() => {
		contacts = data.contactForm as ContactForm[];
	});

	async function openContact(contact: ContactForm) {
		selected = contact;

		if (!contact.isRead) {
			const formData = new FormData();
			formData.append('id', contact.id);
			const res = await fetch('?/markAsRead', { method: 'POST', body: formData });
			if (res.ok) {
				contacts = contacts.map((c) => (c.id === contact.id ? { ...c, isRead: true } : c));
				selected = { ...selected!, isRead: true };
			}
		}
	}

	function closeModal() {
		selected = null;
	}

	function formatDate(date: Date) {
		return new Date(date).toLocaleString('tr-TR', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}
</script>

<div class="min-h-screen w-full bg-bg px-4 py-6">
	<div class="mx-auto max-w-4xl space-y-6">
		<h1 class="font-mono text-2xl font-bold text-accent">İletişim Formları</h1>

		{#if contacts.length === 0}
			<p class="font-mono text-sm text-muted">Henüz iletişim formu yok.</p>
		{:else}
			<div class="overflow-hidden rounded border border-border">
				{#each contacts as contact (contact.id)}
					<button
						type="button"
						onclick={() => openContact(contact)}
						class="flex w-full items-center gap-4 border-b border-border px-4 py-3 text-left transition-colors duration-150 last:border-b-0 hover:bg-surface"
					>
						<span
							class="mt-0.5 h-2 w-2 shrink-0 rounded-full {contact.isRead
								? 'border border-muted/40'
								: 'bg-accent'}"
						></span>
						<div class="min-w-0 flex-1">
							<div class="flex items-center gap-2">
								<span class="font-mono text-sm font-medium text-text">{contact.name}</span>
								<span class="font-mono text-xs text-muted">{contact.email}</span>
							</div>
							<p class="truncate font-mono text-xs text-muted">{contact.subject}</p>
						</div>
						<span class="shrink-0 font-mono text-xs text-muted"
							>{formatDate(contact.createdAt)}</span
						>
					</button>
				{/each}
			</div>
		{/if}
	</div>
</div>

{#if selected}
	<!-- Backdrop -->
	<button
		type="button"
		class="fixed inset-0 z-40 bg-black/60"
		onclick={closeModal}
		aria-label="Kapat"
	></button>

	<!-- Modal -->
	<div class="fixed inset-0 z-50 flex items-center justify-center p-4">
		<div class="relative w-full max-w-lg rounded border border-border bg-surface p-6 shadow-xl">
			<!-- Header -->
			<div class="mb-4 flex items-start justify-between gap-4">
				<div>
					<h2 class="font-mono text-lg font-bold text-text">{selected.subject}</h2>
					<p class="mt-0.5 font-mono text-xs text-muted">
						{selected.name} —
						<a href="mailto:{selected.email}" class="text-accent hover:underline"
							>{selected.email}</a
						>
					</p>
					<p class="mt-0.5 font-mono text-xs text-muted">{formatDate(selected.createdAt)}</p>
				</div>
				<button
					type="button"
					onclick={closeModal}
					class="shrink-0 font-mono text-lg leading-none text-muted transition-colors hover:text-text"
					aria-label="Kapat"
				>
					✕
				</button>
			</div>

			<!-- Message -->
			<div class="rounded border border-border bg-bg p-4">
				<p class="whitespace-pre-wrap font-mono text-sm leading-relaxed text-text">
					{selected.message}
				</p>
			</div>
		</div>
	</div>
{/if}
