<script lang="ts">
	type ShelfEntrySummary = {
		rating: number | null;
		book: { title: string; author: string };
	};

	let {
		entry,
		onsubmit,
		oncancel
	}: {
		entry: ShelfEntrySummary;
		onsubmit: (rating: number) => void | Promise<void>;
		oncancel: () => void;
	} = $props();

	let pendingRating = $derived(entry.rating ?? 0);
	const stars = [1, 2, 3, 4, 5];

	const handleSubmit = async (event: SubmitEvent) => {
		event.preventDefault();
		if (pendingRating < 1) return;
		await onsubmit(pendingRating);
	};

	const handleDialogKeydown = (event: KeyboardEvent) => {
		if (event.key === 'Escape') {
			event.preventDefault();
			oncancel();
		}
	};
</script>

<div class="fixed inset-0 z-50 flex items-center justify-center bg-[color:rgb(17_24_39/.55)] p-4">
	<div
		role="dialog"
		aria-modal="true"
		aria-labelledby="rate-book-dialog-title"
		tabindex="-1"
		onkeydown={handleDialogKeydown}
		class="w-full max-w-md rounded-(--radius-card) bg-(--color-surface) p-6 shadow-xl"
	>
		<h2 id="rate-book-dialog-title" class="font-display text-2xl text-(--color-ink)">
			Rate {entry.book.title}
		</h2>
		<p class="mt-1 text-sm text-(--color-muted)">by {entry.book.author}</p>

		<form class="mt-5 space-y-5" onsubmit={handleSubmit}>
			<fieldset>
				<legend class="text-sm font-medium text-(--color-ink)">Your rating</legend>
				<div class="mt-2 flex gap-2" role="radiogroup" aria-label="Stars">
					{#each stars as value (value)}
						<label class="flex items-center gap-1 text-sm text-(--color-ink)">
							<input
								type="radio"
								name="rating"
								value={String(value)}
								checked={pendingRating === value}
								onchange={() => (pendingRating = value)}
								aria-label={`${value} ${value === 1 ? 'star' : 'stars'}`}
							/>
							<span aria-hidden="true">{value}★</span>
						</label>
					{/each}
				</div>
			</fieldset>

			<div class="flex flex-wrap justify-end gap-3">
				<button
					type="button"
					class="inline-flex items-center justify-center rounded-full border border-(--color-border-strong) bg-(--color-surface) px-4 py-2 text-sm font-semibold text-(--color-ink) transition hover:bg-(--color-surface-soft)"
					onclick={oncancel}
				>
					Cancel
				</button>
				<button
					type="submit"
					disabled={pendingRating < 1}
					class="inline-flex items-center justify-center rounded-full bg-(--color-accent) px-4 py-2 text-sm font-semibold text-white transition hover:bg-(--color-accent-strong) disabled:cursor-not-allowed disabled:opacity-50"
				>
					Save rating
				</button>
			</div>
		</form>
	</div>
</div>
