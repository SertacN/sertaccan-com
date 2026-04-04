<script lang="ts">
	import { authClient } from '$lib/auth-client';
	import { goto, invalidateAll } from '$app/navigation';
	import { localizeHref } from '$lib/paraglide/runtime';
	import type { PageProps } from './$types';

	interface FormResult {
		success?: boolean;
		deleted?: boolean;
		errors?: Record<string, string[]>;
		values?: Record<string, unknown>;
	}

	let { data, form: rawForm }: PageProps = $props();
	const form = $derived(rawForm as FormResult | null);

	async function handleLogout() {
		await authClient.signOut();
		await invalidateAll();
		goto(localizeHref('/admin/login'));
	}
</script>

<div class="min-h-screen bg-bg p-8">
	<div class="mx-auto max-w-6xl">
		<!-- Header -->
		<div class="mb-8 flex items-center justify-between">
			<h1 class="font-mono text-2xl font-bold text-accent">Admin Panel</h1>
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

		<!-- Proje Ekleme Formu -->
		<div class="mb-10 rounded border border-border bg-surface p-6">
			<h2 class="mb-6 font-mono text-lg font-bold text-text">Yeni Proje</h2>

			{#if form?.errors}
				<div
					class="mb-4 rounded border border-red-400/30 bg-red-400/5 px-4 py-2 font-mono text-sm text-red-400"
				>
					{#each Object.entries(form.errors) as [field, messages] (field)}
						<p>{field}: {messages.join(', ')}</p>
					{/each}
				</div>
			{/if}

			{#if form?.success}
				<div
					class="mb-4 rounded border border-accent/30 bg-accent/5 px-4 py-2 font-mono text-sm text-accent"
				>
					Proje eklendi.
				</div>
			{/if}

			<form
				method="POST"
				action="?/create"
				enctype="multipart/form-data"
				class="grid grid-cols-1 gap-4 md:grid-cols-2"
			>
				<div>
					<label for="slug" class="mb-1 block font-mono text-xs text-muted">Slug</label>
					<input
						type="text"
						name="slug"
						id="slug"
						required
						value={form?.values?.slug ?? ''}
						placeholder="my-project"
						class="w-full rounded border border-border bg-bg px-3 py-2 font-mono text-sm text-text focus:border-accent focus:outline-none"
					/>
					{#if form?.errors?.slug}
						<p class="mt-1 font-mono text-xs text-red-400">{form.errors.slug[0]}</p>
					{/if}
				</div>

				<div>
					<label for="title" class="mb-1 block font-mono text-xs text-muted">Başlık</label>
					<input
						type="text"
						name="title"
						id="title"
						required
						value={form?.values?.title ?? ''}
						placeholder="Proje Adı"
						class="w-full rounded border border-border bg-bg px-3 py-2 font-mono text-sm text-text focus:border-accent focus:outline-none"
					/>
					{#if form?.errors?.title}
						<p class="mt-1 font-mono text-xs text-red-400">{form.errors.title[0]}</p>
					{/if}
				</div>

				<div>
					<label for="descriptionTr" class="mb-1 block font-mono text-xs text-muted"
						>Açıklama (TR)</label
					>
					<textarea
						name="descriptionTr"
						id="descriptionTr"
						required
						rows="2"
						placeholder="Kısa açıklama..."
						class="w-full rounded border border-border bg-bg px-3 py-2 font-mono text-sm text-text focus:border-accent focus:outline-none"
						>{form?.values?.descriptionTr ?? ''}</textarea
					>
					{#if form?.errors?.descriptionTr}
						<p class="mt-1 font-mono text-xs text-red-400">{form.errors.descriptionTr[0]}</p>
					{/if}
				</div>

				<div>
					<label for="descriptionEn" class="mb-1 block font-mono text-xs text-muted"
						>Açıklama (EN)</label
					>
					<textarea
						name="descriptionEn"
						id="descriptionEn"
						required
						rows="2"
						placeholder="Short description..."
						class="w-full rounded border border-border bg-bg px-3 py-2 font-mono text-sm text-text focus:border-accent focus:outline-none"
						>{form?.values?.descriptionEn ?? ''}</textarea
					>
					{#if form?.errors?.descriptionEn}
						<p class="mt-1 font-mono text-xs text-red-400">{form.errors.descriptionEn[0]}</p>
					{/if}
				</div>

				<div>
					<label for="longDescriptionTr" class="mb-1 block font-mono text-xs text-muted"
						>Uzun Açıklama (TR) - Markdown</label
					>
					<textarea
						name="longDescriptionTr"
						id="longDescriptionTr"
						required
						rows="4"
						placeholder="Detaylı açıklama (markdown)..."
						class="w-full rounded border border-border bg-bg px-3 py-2 font-mono text-sm text-text focus:border-accent focus:outline-none"
						>{form?.values?.longDescriptionTr ?? ''}</textarea
					>
					{#if form?.errors?.longDescriptionTr}
						<p class="mt-1 font-mono text-xs text-red-400">{form.errors.longDescriptionTr[0]}</p>
					{/if}
				</div>

				<div>
					<label for="longDescriptionEn" class="mb-1 block font-mono text-xs text-muted"
						>Uzun Açıklama (EN) - Markdown</label
					>
					<textarea
						name="longDescriptionEn"
						id="longDescriptionEn"
						required
						rows="4"
						placeholder="Detailed description (markdown)..."
						class="w-full rounded border border-border bg-bg px-3 py-2 font-mono text-sm text-text focus:border-accent focus:outline-none"
						>{form?.values?.longDescriptionEn ?? ''}</textarea
					>
					{#if form?.errors?.longDescriptionEn}
						<p class="mt-1 font-mono text-xs text-red-400">{form.errors.longDescriptionEn[0]}</p>
					{/if}
				</div>

				<div>
					<label for="tags" class="mb-1 block font-mono text-xs text-muted"
						>Tag'ler (virgülle ayır)</label
					>
					<input
						type="text"
						name="tags"
						id="tags"
						required
						value={form?.values?.tags ?? ''}
						placeholder="SvelteKit, TypeScript, Prisma"
						class="w-full rounded border border-border bg-bg px-3 py-2 font-mono text-sm text-text focus:border-accent focus:outline-none"
					/>
					{#if form?.errors?.tags}
						<p class="mt-1 font-mono text-xs text-red-400">{form.errors.tags[0]}</p>
					{/if}
				</div>

				<div>
					<label for="githubUrl" class="mb-1 block font-mono text-xs text-muted">GitHub URL</label>
					<input
						type="text"
						name="githubUrl"
						id="githubUrl"
						value={form?.values?.githubUrl ?? ''}
						placeholder="https://github.com/..."
						class="w-full rounded border border-border bg-bg px-3 py-2 font-mono text-sm text-text focus:border-accent focus:outline-none"
					/>
				</div>

				<div>
					<label for="liveUrl" class="mb-1 block font-mono text-xs text-muted">Live URL</label>
					<input
						type="text"
						name="liveUrl"
						id="liveUrl"
						value={form?.values?.liveUrl ?? ''}
						placeholder="https://..."
						class="w-full rounded border border-border bg-bg px-3 py-2 font-mono text-sm text-text focus:border-accent focus:outline-none"
					/>
				</div>

				<div>
					<label for="status" class="mb-1 block font-mono text-xs text-muted">Status</label>
					<select
						name="status"
						id="status"
						class="w-full rounded border border-border bg-bg px-3 py-2 font-mono text-sm text-text focus:border-accent focus:outline-none"
					>
						<option value="WIP">WIP</option>
						<option value="ACTIVE">Active</option>
						<option value="ARCHIVED">Archived</option>
					</select>
				</div>

				<div class="flex items-center gap-6">
					<div>
						<label for="order" class="mb-1 block font-mono text-xs text-muted">Sıra</label>
						<input
							type="number"
							name="order"
							id="order"
							value={form?.values?.order ?? 0}
							class="w-20 rounded border border-border bg-bg px-3 py-2 font-mono text-sm text-text focus:border-accent focus:outline-none"
						/>
					</div>

					<label class="flex items-center gap-2 pt-4 font-mono text-sm text-muted">
						<input type="checkbox" name="featured" class="accent-accent" />
						Featured
					</label>
					<label class="flex items-center gap-2 pt-4 font-mono text-sm text-muted">
						<input type="checkbox" name="isActive" class="accent-accent" />
						Aktif
					</label>
				</div>
				<div class="mb-2">
					<label for="file" class="flex items-center gap-2 pt-4 font-mono text-sm text-muted"
						>Dosya</label
					>
					<input
						type="file"
						name="file"
						id="file"
						accept="image/*"
						class="font-mono text-sm text-muted file:mr-3 file:rounded file:border file:border-border file:bg-surface file:px-3 file:py-1.5 file:font-mono
  file:text-xs file:text-accent file:transition-colors file:duration-150 hover:file:border-accent"
					/>
				</div>
				<div class="md:col-span-2">
					<button
						type="submit"
						class="rounded border border-accent bg-accent/10 px-6 py-2 font-mono text-sm text-accent transition-colors duration-150 hover:bg-accent/20"
					>
						Proje Ekle
					</button>
				</div>
			</form>
		</div>

		<!-- Proje Listesi -->
		<div class="rounded border border-border bg-surface p-6">
			<h2 class="mb-6 font-mono text-lg font-bold text-text">Projeler ({data.projects.length})</h2>

			{#if data.projects.length === 0}
				<p class="font-mono text-sm text-muted">Henüz proje yok.</p>
			{:else}
				<div class="space-y-3">
					{#each data.projects as project (project.id)}
						<div class="flex items-center justify-between rounded border border-border px-4 py-3">
							<div class="flex items-center gap-4">
								<span class="font-mono text-sm font-bold text-text">{project.title}</span>
								<span class="font-mono text-xs text-muted">/{project.slug}</span>
								<span
									class="rounded border px-1.5 py-0.5 font-mono text-xs {project.status === 'ACTIVE'
										? 'border-accent text-accent'
										: project.status === 'WIP'
											? 'border-yellow-400 text-yellow-400'
											: 'border-border text-muted'}"
								>
									{project.status}
								</span>
								{#if project.featured}
									<span class="font-mono text-xs text-accent">featured</span>
								{/if}
							</div>
							<form method="POST" action="?/delete">
								<input type="hidden" name="id" value={project.id} />
								<button
									type="submit"
									class="font-mono text-xs text-red-400 transition-colors duration-150 hover:text-red-300"
								>
									Sil
								</button>
							</form>
						</div>
					{/each}
				</div>
			{/if}
		</div>
	</div>
</div>
