<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageProps } from './$types';

	interface FormResult {
		action?: string;
		success?: boolean;
		errors?: Record<string, string[]>;
	}

	let { data, form: rawForm }: PageProps = $props();
	const form = $derived(rawForm as FormResult | null);

	const user = $derived(data.user);
	const users = $derived(data.users);
</script>

<div class="min-h-screen w-full bg-bg px-4 py-2">
	<div class="mx-auto max-w-4xl space-y-8">
		<h1 class="font-mono text-2xl font-bold text-accent">Kullanıcılar</h1>

		<!-- Profil Güncelleme -->
		<div class="rounded border border-border bg-surface p-6">
			<h2 class="mb-6 font-mono text-lg font-bold text-text">Profil Bilgileri</h2>

			{#if form?.action === 'profile'}
				{#if form.success}
					<div
						class="mb-4 rounded border border-accent/30 bg-accent/5 px-4 py-2 font-mono text-sm text-accent"
					>
						Profil güncellendi.
					</div>
				{:else if form.errors}
					<div
						class="mb-4 rounded border border-red-400/30 bg-red-400/5 px-4 py-2 font-mono text-sm text-red-400"
					>
						{#each Object.values(form.errors).flat() as msg, i (i)}
							<p>{msg}</p>
						{/each}
					</div>
				{/if}
			{/if}

			<form
				method="POST"
				action="?/updateProfile"
				use:enhance
				class="grid grid-cols-1 gap-4 md:grid-cols-2"
			>
				<div>
					<label for="name" class="mb-1 block font-mono text-xs text-muted">İsim</label>
					<input
						type="text"
						name="name"
						id="name"
						required
						value={user?.name ?? ''}
						class="w-full rounded border border-border bg-bg px-3 py-2 font-mono text-sm text-text focus:border-accent focus:outline-none"
					/>
				</div>
				<div>
					<label for="email" class="mb-1 block font-mono text-xs text-muted">Email</label>
					<input
						type="email"
						name="email"
						id="email"
						required
						value={user?.email ?? ''}
						class="w-full rounded border border-border bg-bg px-3 py-2 font-mono text-sm text-text focus:border-accent focus:outline-none"
					/>
				</div>
				<div class="md:col-span-2">
					<button
						type="submit"
						class="rounded border border-accent bg-accent/10 px-6 py-2 font-mono text-sm text-accent transition-colors duration-150 hover:bg-accent/20"
					>
						Güncelle
					</button>
				</div>
			</form>
		</div>

		<!-- Şifre Değiştirme -->
		<div class="rounded border border-border bg-surface p-6">
			<h2 class="mb-6 font-mono text-lg font-bold text-text">Şifre Değiştir</h2>

			{#if form?.action === 'password'}
				{#if form.success}
					<div
						class="mb-4 rounded border border-accent/30 bg-accent/5 px-4 py-2 font-mono text-sm text-accent"
					>
						Şifre güncellendi.
					</div>
				{:else if form.errors}
					<div
						class="mb-4 rounded border border-red-400/30 bg-red-400/5 px-4 py-2 font-mono text-sm text-red-400"
					>
						{#each Object.values(form.errors).flat() as msg, i (i)}
							<p>{msg}</p>
						{/each}
					</div>
				{/if}
			{/if}

			<form
				method="POST"
				action="?/updatePassword"
				use:enhance
				class="grid grid-cols-1 gap-4 md:grid-cols-2"
			>
				<div>
					<label for="currentPassword" class="mb-1 block font-mono text-xs text-muted"
						>Mevcut Şifre</label
					>
					<input
						type="password"
						name="currentPassword"
						id="currentPassword"
						required
						class="w-full rounded border border-border bg-bg px-3 py-2 font-mono text-sm text-text focus:border-accent focus:outline-none"
					/>
				</div>
				<div>
					<label for="newPassword" class="mb-1 block font-mono text-xs text-muted">Yeni Şifre</label
					>
					<input
						type="password"
						name="newPassword"
						id="newPassword"
						required
						class="w-full rounded border border-border bg-bg px-3 py-2 font-mono text-sm text-text focus:border-accent focus:outline-none"
					/>
				</div>
				<div class="md:col-span-2">
					<button
						type="submit"
						class="rounded border border-accent bg-accent/10 px-6 py-2 font-mono text-sm text-accent transition-colors duration-150 hover:bg-accent/20"
					>
						Şifreyi Değiştir
					</button>
				</div>
			</form>
		</div>

		<!-- Admin: Yeni Kullanıcı Oluştur -->
		{#if user?.role === 'admin'}
			<div class="rounded border border-border bg-surface p-6">
				<h2 class="mb-6 font-mono text-lg font-bold text-text">Yeni Kullanıcı Oluştur</h2>

				{#if form?.action === 'create'}
					{#if form.success}
						<div
							class="mb-4 rounded border border-accent/30 bg-accent/5 px-4 py-2 font-mono text-sm text-accent"
						>
							Kullanıcı oluşturuldu.
						</div>
					{:else if form.errors}
						<div
							class="mb-4 rounded border border-red-400/30 bg-red-400/5 px-4 py-2 font-mono text-sm text-red-400"
						>
							{#each Object.values(form.errors).flat() as msg, i (i)}
								<p>{msg}</p>
							{/each}
						</div>
					{/if}
				{/if}

				<form
					method="POST"
					action="?/createUser"
					use:enhance
					class="grid grid-cols-1 gap-4 md:grid-cols-2"
				>
					<div>
						<label for="new-name" class="mb-1 block font-mono text-xs text-muted">İsim</label>
						<input
							type="text"
							name="name"
							id="new-name"
							required
							class="w-full rounded border border-border bg-bg px-3 py-2 font-mono text-sm text-text focus:border-accent focus:outline-none"
						/>
					</div>
					<div>
						<label for="new-email" class="mb-1 block font-mono text-xs text-muted">Email</label>
						<input
							type="email"
							name="email"
							id="new-email"
							required
							class="w-full rounded border border-border bg-bg px-3 py-2 font-mono text-sm text-text focus:border-accent focus:outline-none"
						/>
					</div>
					<div>
						<label for="new-password" class="mb-1 block font-mono text-xs text-muted">Şifre</label>
						<input
							type="password"
							name="password"
							id="new-password"
							required
							class="w-full rounded border border-border bg-bg px-3 py-2 font-mono text-sm text-text focus:border-accent focus:outline-none"
						/>
					</div>
					<div>
						<label for="new-role" class="mb-1 block font-mono text-xs text-muted">Rol</label>
						<select
							name="role"
							id="new-role"
							class="w-full rounded border border-border bg-bg px-3 py-2 font-mono text-sm text-text focus:border-accent focus:outline-none"
						>
							<option value="user">user</option>
							<option value="admin">admin</option>
						</select>
					</div>
					<div class="md:col-span-2">
						<button
							type="submit"
							class="rounded border border-accent bg-accent/10 px-6 py-2 font-mono text-sm text-accent transition-colors duration-150 hover:bg-accent/20"
						>
							Kullanıcı Oluştur
						</button>
					</div>
				</form>
			</div>

			<!-- Kullanıcı Listesi -->
			<div class="rounded border border-border bg-surface p-6">
				<h2 class="mb-6 font-mono text-lg font-bold text-text">
					Kullanıcılar ({users?.length ?? 0})
				</h2>

				{#if form?.action === 'delete' && form.errors}
					<div
						class="mb-4 rounded border border-red-400/30 bg-red-400/5 px-4 py-2 font-mono text-sm text-red-400"
					>
						{#each Object.values(form.errors).flat() as msg, i (i)}
							<p>{msg}</p>
						{/each}
					</div>
				{/if}

				{#if !users || users.length === 0}
					<p class="font-mono text-sm text-muted">Kullanıcı bulunamadı.</p>
				{:else}
					<div class="space-y-2">
						{#each users as u (u.id)}
							{console.log(u)}
							<div class="flex items-center justify-between rounded border border-border px-4 py-3">
								<div class="flex min-w-0 flex-col gap-0.5">
									<span class="font-mono text-sm font-bold text-text" class:line-through={u.banned}
										>{u.name}</span
									>
									<span class="font-mono text-xs text-muted">{u.email}</span>
								</div>
								<div class="flex shrink-0 items-center gap-4">
									<span
										class="font-mono text-xs {u.role === 'admin' ? 'text-accent' : 'text-muted'}"
									>
										{u.role ?? 'user'}
									</span>
									<span class="font-mono text-xs text-muted">
										{new Date(u.createdAt).toLocaleDateString('tr-TR')}
									</span>
									{#if u.id !== user?.id}
										<form method="POST" action="?/deleteUser" use:enhance>
											<input type="hidden" name="id" value={u.id} />
											<button
												type="submit"
												class="font-mono text-xs text-red-400 transition-colors duration-150 hover:text-red-300"
											>
												Sil
											</button>
										</form>
										<form
											method="POST"
											action={u.banned == false ? '?/banUser' : '?/unBanUser'}
											use:enhance
										>
											<input type="hidden" name="id" value={u.id} />
											<button
												class="font-mono text-xs transition-colors duration-150 hover:text-red-300"
												class:text-accent={u.banned}
												class:text-red-400={!u.banned}
												type="submit">{u.banned == false ? 'Yasakla' : 'Yasağı Kaldır'}</button
											>
										</form>
									{:else}
										<span class="font-mono text-xs text-muted/40">sen</span>
									{/if}
								</div>
							</div>
						{/each}
					</div>
				{/if}
			</div>
		{/if}
	</div>
</div>
