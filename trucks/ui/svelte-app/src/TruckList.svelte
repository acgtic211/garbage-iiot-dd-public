<script>

	import Truck from './Truck.svelte';
	import { apiData, trucksData } from './store.js';

</script>



<div>
		
    {#each Object.entries($trucksData) as [k,v]}
        <div class="trucks">
            <Truck data={v}/>
        </div>
    {/each}
</div>

<style>
    .trucks{
		float: left;
		margin: 5px;
	}
</style>