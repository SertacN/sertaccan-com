<script lang="ts">
	import { authClient } from '$lib/auth-client';
	import { goto, invalidateAll } from '$app/navigation';
	import { localizeHref } from '$lib/paraglide/runtime';
	import type { PageProps } from './$types';

	import type { Project } from '@prisma/client';

	interface FormResult {
		success?: boolean;
		deleted?: boolean;
		edited?: boolean;
		errors?: Record<string, string[]>;
		values?: Record<string, unknown>;
	}

	let { data, form: rawForm }: PageProps = $props();
	const form = $derived(rawForm as FormResult | null);

	let editDialog: HTMLDialogElement;
	let editData = $state<Project | null>(null);

	function openEdit(project: Project) {
		editData = { ...project };
		editDialog.showModal();
	}

	function closeEdit() {
		editDialog.close();
		editData = null;
	}

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

			{#if form?.edited}
				<div
					class="mb-4 rounded border border-accent/30 bg-accent/5 px-4 py-2 font-mono text-sm text-accent"
				>
					Proje güncellendi.
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
							<div class="flex items-center gap-3">
								<button
									type="button"
									onclick={() => openEdit(project)}
									class="font-mono text-xs text-accent transition-colors duration-150 hover:text-accent/70"
								>
									Düzenle
								</button>
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
						</div>
					{/each}
				</div>
			{/if}
		</div>
	</div>
</div>

<!-- Edit Dialog -->
<dialog
	bind:this={editDialog}
	class="m-auto w-full max-w-3xl rounded border border-border bg-surface p-0 text-text backdrop:bg-black/60"
	onclick={(e) => {
		if (e.target === editDialog) closeEdit();
	}}
>
	{#if editData}
		<div class="p-6">
			<div class="mb-6 flex items-center justify-between">
				<h2 class="font-mono text-lg font-bold text-accent">Proje Düzenle</h2>
				<button
					type="button"
					onclick={closeEdit}
					class="font-mono text-sm text-muted transition-colors hover:text-text"
				>
					✕
				</button>
			</div>

			<form
				method="POST"
				action="?/edit"
				enctype="multipart/form-data"
				class="grid grid-cols-1 gap-4 md:grid-cols-2"
			>
				<input type="hidden" name="id" value={editData.id} />

				<div>
					<label for="edit-slug" class="mb-1 block font-mono text-xs text-muted">Slug</label>
					<input
						type="text"
						name="slug"
						id="edit-slug"
						required
						bind:value={editData.slug}
						class="w-full rounded border border-border bg-bg px-3 py-2 font-mono text-sm text-text focus:border-accent focus:outline-none"
					/>
				</div>

				<div>
					<label for="edit-title" class="mb-1 block font-mono text-xs text-muted">Başlık</label>
					<input
						type="text"
						name="title"
						id="edit-title"
						required
						bind:value={editData.title}
						class="w-full rounded border border-border bg-bg px-3 py-2 font-mono text-sm text-text focus:border-accent focus:outline-none"
					/>
				</div>

				<div>
					<label for="edit-descriptionTr" class="mb-1 block font-mono text-xs text-muted"
						>Açıklama (TR)</label
					>
					<textarea
						name="descriptionTr"
						id="edit-descriptionTr"
						required
						rows="2"
						bind:value={editData.descriptionTr}
						class="w-full rounded border border-border bg-bg px-3 py-2 font-mono text-sm text-text focus:border-accent focus:outline-none"
					></textarea>
				</div>

				<div>
					<label for="edit-descriptionEn" class="mb-1 block font-mono text-xs text-muted"
						>Açıklama (EN)</label
					>
					<textarea
						name="descriptionEn"
						id="edit-descriptionEn"
						required
						rows="2"
						bind:value={editData.descriptionEn}
						class="w-full rounded border border-border bg-bg px-3 py-2 font-mono text-sm text-text focus:border-accent focus:outline-none"
					></textarea>
				</div>

				<div>
					<label for="edit-longDescriptionTr" class="mb-1 block font-mono text-xs text-muted"
						>Uzun Açıklama (TR) - Markdown</label
					>
					<textarea
						name="longDescriptionTr"
						id="edit-longDescriptionTr"
						required
						rows="4"
						bind:value={editData.longDescriptionTr}
						class="w-full rounded border border-border bg-bg px-3 py-2 font-mono text-sm text-text focus:border-accent focus:outline-none"
					></textarea>
				</div>

				<div>
					<label for="edit-longDescriptionEn" class="mb-1 block font-mono text-xs text-muted"
						>Uzun Açıklama (EN) - Markdown</label
					>
					<textarea
						name="longDescriptionEn"
						id="edit-longDescriptionEn"
						required
						rows="4"
						bind:value={editData.longDescriptionEn}
						class="w-full rounded border border-border bg-bg px-3 py-2 font-mono text-sm text-text focus:border-accent focus:outline-none"
					></textarea>
				</div>

				<div>
					<label for="edit-tags" class="mb-1 block font-mono text-xs text-muted"
						>Tag'ler (virgülle ayır)</label
					>
					<input
						type="text"
						name="tags"
						id="edit-tags"
						required
						value={editData.tags.join(', ')}
						class="w-full rounded border border-border bg-bg px-3 py-2 font-mono text-sm text-text focus:border-accent focus:outline-none"
					/>
				</div>

				<div>
					<label for="edit-githubUrl" class="mb-1 block font-mono text-xs text-muted"
						>GitHub URL</label
					>
					<input
						type="text"
						name="githubUrl"
						id="edit-githubUrl"
						value={editData.githubUrl ?? ''}
						class="w-full rounded border border-border bg-bg px-3 py-2 font-mono text-sm text-text focus:border-accent focus:outline-none"
					/>
				</div>

				<div>
					<label for="edit-liveUrl" class="mb-1 block font-mono text-xs text-muted">Live URL</label>
					<input
						type="text"
						name="liveUrl"
						id="edit-liveUrl"
						value={editData.liveUrl ?? ''}
						class="w-full rounded border border-border bg-bg px-3 py-2 font-mono text-sm text-text focus:border-accent focus:outline-none"
					/>
				</div>

				<div>
					<label for="edit-status" class="mb-1 block font-mono text-xs text-muted">Status</label>
					<select
						name="status"
						id="edit-status"
						bind:value={editData.status}
						class="w-full rounded border border-border bg-bg px-3 py-2 font-mono text-sm text-text focus:border-accent focus:outline-none"
					>
						<option value="WIP">WIP</option>
						<option value="ACTIVE">Active</option>
						<option value="ARCHIVED">Archived</option>
					</select>
				</div>

				<div class="flex items-center gap-6">
					<div>
						<label for="edit-order" class="mb-1 block font-mono text-xs text-muted">Sıra</label>
						<input
							type="number"
							name="order"
							id="edit-order"
							bind:value={editData.order}
							class="w-20 rounded border border-border bg-bg px-3 py-2 font-mono text-sm text-text focus:border-accent focus:outline-none"
						/>
					</div>

					<label class="flex items-center gap-2 pt-4 font-mono text-sm text-muted">
						<input
							type="checkbox"
							name="featured"
							class="accent-accent"
							checked={editData.featured}
						/>
						Featured
					</label>
					<label class="flex items-center gap-2 pt-4 font-mono text-sm text-muted">
						<input
							type="checkbox"
							name="isActive"
							class="accent-accent"
							checked={editData.isActive}
						/>
						Aktif
					</label>
				</div>

				<div class="mb-2">
					<label for="edit-file" class="flex items-center gap-2 pt-4 font-mono text-sm text-muted"
						>Dosya (değiştirmek için)</label
					>
					<input
						type="file"
						name="file"
						id="edit-file"
						accept="image/*"
						class="font-mono text-sm text-muted file:mr-3 file:rounded file:border file:border-border file:bg-surface file:px-3 file:py-1.5 file:font-mono file:text-xs file:text-accent file:transition-colors file:duration-150 hover:file:border-accent"
					/>
					{#if editData.imageUrl}
						<p class="mt-1 font-mono text-xs text-muted">Mevcut: {editData.imageUrl}</p>
					{/if}
				</div>

				<input type="hidden" name="imageUrl" value={editData.imageUrl ?? ''} />

				<div class="flex gap-3 md:col-span-2">
					<button
						type="submit"
						class="rounded border border-accent bg-accent/10 px-6 py-2 font-mono text-sm text-accent transition-colors duration-150 hover:bg-accent/20"
					>
						Kaydet
					</button>
					<button
						type="button"
						onclick={closeEdit}
						class="rounded border border-border px-6 py-2 font-mono text-sm text-muted transition-colors duration-150 hover:border-accent hover:text-text"
					>
						İptal
					</button>
				</div>
			</form>
		</div>
	{/if}
</dialog>
