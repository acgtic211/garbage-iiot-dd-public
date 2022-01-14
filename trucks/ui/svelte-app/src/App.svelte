<script>
	import { onMount } from 'svelte';
	import { apiData, trucksData } from './store.js';
	import { Router, Link, Route } from "svelte-routing";
	import TruckList from './TruckList.svelte';
	import TruckDetail from './TruckDetail.svelte';

	function compare(a, b){
		if(a.frameNumber < b.frameNumber){
			return -1;
		}
		if(a.frameNumber > b.frameNumber) {
			return 1;
		}
		return 0;
	}

	/*
	AL EMPEZAR UNA RUTA SE REORDENAN LOS CAMIONES Y EXPLOTA EL ORDEN DE LOS BOTONES :(
	*/
	
	onMount(async() => {

		fetch('https://localhost:30002/acg:lab:virtual-trucks/property/fleetDetails', {
			method: 'GET'
		}).then(response => response.json())
		.then(data => {
			console.log(data);
			
			data.sort(compare);

			apiData.set(data);
			
		}).catch(error => {
			console.log(error);
			return [];
		})
	})

</script>

<Router>
	<div class="menu">
		<div>
			<ul>
				<button class="btn">
					<Link to="/truckList">Truck list</Link>
				</button>
				
				{#each Object.entries($trucksData) as [k, v]}
					<button class="btn">
						<Link to="/truck/{v.frameNumber}">Truck {v.frameNumber}</Link>
					</button>
				{/each}

			</ul>
		</div>
	</div>

	<Route path="/truckList" component="{TruckList}" />

	{#each Object.entries($trucksData) as [k,v]}
		<Route path="/truck/{v.frameNumber}">
			<TruckDetail data="{v}"/>
		</Route>
	{/each}

</Router>


	

	


<style>

	.btn{
		text-decoration: none;
        border-radius: 8px;
        display: inline-block;
        width: 100px;
		margin-right: 0.5rem;
	}


	.btn:hover{
        box-shadow: 0px 15px 20px rgba(51, 51, 51, 0.4);
        background-color: #aaaaaa;
    }


	:global(body){
		background-color: #333;
	}
	
</style>