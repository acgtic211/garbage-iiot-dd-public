import { writable, derived } from 'svelte/store';

export const apiData = writable({});

export const trucksData = derived(apiData, ($apiData) => {
    return $apiData;
});