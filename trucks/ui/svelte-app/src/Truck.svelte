<script>

    import { onMount } from 'svelte';
    export let data = {};
    var capa = 0;
    async function startRoute(){
        await fetch('https://localhost:30002/acg:lab:virtual-trucks/'+data.frameNumber+'/action/startRoute',{
            method: 'PUT',
            body: {}
        })
    }

    async function emptyTruck(){
        await fetch('https://localhost:30002/acg:lab:virtual-trucks/'+data.frameNumber+'/action/emptyTruck', {
            method: 'PUT',
            body: {}
        })
    }

    async function setReady() {
        await fetch('https://localhost:30002/acg:lab:virtual-trucks/'+ data.frameNumber + '/action/moveTruck', {
            method: 'PUT',
            body: JSON.stringify({
                location: {
                    lat: 36.8931,
                    lng: -2.2653
                }
            }),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
    }

    async function refill() {
        await fetch('https://localhost:30002/acg:lab:virtual-trucks/' + data.frameNumber + '/action/refillFuel', {
            method: 'PUT',
            body: JSON.stringify({
                fuel: 1000
            }),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
    }

    onMount(async () => {
        capa = parseInt((data.capacity/data.totalCapacity)*100);
        
        var es = new EventSource('https://localhost:30002/acg:lab:virtual-trucks/' + data.frameNumber + '/property/truckDetails/sse');

        es.onmessage = function(message){
            if(!message) {
                console.log("no message");
            } else {
                
                console.log(JSON.parse(JSON.parse(message.data)));
                data = JSON.parse(JSON.parse(message.data));
                capa = parseInt((data.capacity/data.totalCapacity)*100);
            }
        }
    })


</script>
<div class="back">
    <div class="card">
        <div class="grd">
            <div class="text">
                <div class="fragment">
                    <p class="pd f">Frame number: </p>
                    <p class="pd">{data.frameNumber}</p>
                </div>
                <div class="fragment">
                    <p class="pd f">Fuel: </p>
                    <p class="pd">{data.fuel}</p>
                </div>
                <div class="fragment">
                    <p class="pd f">Capacity: </p>
                    <p class="pd">{data.capacity.toFixed(2)}/{data.totalCapacity}</p>
                </div>
                <div class="fragment">
                    <p class="pd f">Garbage class: </p>
                    <p class="pd {data.garbageClass}">{data.garbageClass}</p>
                </div>
                <div class="fragment">
                    <p class="pd f">En ruta: </p>
                    <p class="pd">{data.onRoute}</p>
                </div>
                
            </div>
            <!--on route-->
            <div class="funcs">
                <ul>
                    <button class="tbtn" on:click={startRoute}>Start route</button>
                    <button class="tbtn" on:click={emptyTruck}>Empty truck</button>
                    <button class="tbtn" on:click={setReady}>Set ready</button>
                    <button class="tbtn" on:click={refill}>Refill fuel</button>
                </ul>
            </div>
        </div>
    </div>
</div>



<style>

    .fragment{
        height: 35px;
    }

    .f{
        font-weight: bold;
    }
    .pd{
        display: inline-block;
    }
    .card{
        background-color: #9c9c9c;
        border-radius: 4px;
        width: 30vw;
    }

    .grd{
        display: grid;
        grid-template-areas: 'data btn';
        height: 200px;
    }

    .back{
        padding: 5px;
        border-radius: 4px;
        background-color: white;
    }

    .text{
        margin-left: 5px;
        grid-area: data;
    }

    .funcs{
        grid-area: btn;        
    }

    .tbtn{
        text-decoration: none;
        border-radius: 8px;
        display: block;
        width: 150px;
    }

    .tbtn:hover{
        box-shadow: 0px 15px 20px rgba(51, 51, 51, 0.4);
        background-color: #0374dd;
        color: #ffffff
    }

    .organic{
        color: olive;
        font-weight: 500;
    }

    .paper{
        color: #0374dd;
        font-weight: 500;
    }

    .plastic{
        color: yellow;
        font-weight: 500;
    }

</style>