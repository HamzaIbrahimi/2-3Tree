import type { SvelteDate } from 'svelte/reactivity';
export interface Ops {
	operation: string;
	letter: string;
	date: SvelteDate;
	found: boolean;
}
