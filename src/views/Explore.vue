<template>
    <section class="container mx-auto">
        <div class="flex flex-col gap-2 md:flex-row">
            <div id="map" class="w-full"></div>
            <div class="min-h-92 p-2 text-sm md:w-80 border rounded-md space-y-2">
                <h1 class="font-semibold text-slate-700">Map polygons</h1>
                <div v-if="!showAdd">
                    <button v-on:click="showAdd = !showAdd" class="border rounded-md px-7 w-full py-2 font-semibold text-emerald-500 border-emerald-500
                hover:bg-emerald-500 hover:text-white transition-colors duration-300 ease-in
                ">Add a new location</button>
                </div>
                <div v-if="showAdd">
                    <AddNewLocation :handle-cancel="handleCancel" />
                </div>
            </div>
        </div>
        <div v-if="showAdd" class="text-cyan-700 italic p-2">
            <p> &#8226; Tap on the map to create a polygon</p>
            <p> &#8226; In case you want to cancel click the cancel button!</p>
            <p> &#8226; Finally save the polygon!</p>
        </div>
    </section>
</template>

<script setup lang="ts">
import { Loader } from "@googlemaps/js-api-loader"
import { onMounted, ref, watch } from "vue";
import AddNewLocation from "../components/AddNewLocation.vue";
const showAdd = ref(false);
type latlng = {
    lat: number;
    lng: number;
}
const curClickedCords = ref<latlng | undefined>(
)
const myLatLong = ref({
    lat: -34.397,
    lng: 150.644
})
const polygonCordinates = ref<latlng[]>()

let map: google.maps.Map
let marker: google.maps.marker.AdvancedMarkerElement
let polygon: google.maps.Polygon
const loader = new Loader({
    apiKey: "AIzaSyBNKvbePmg8mvhEKKLa5M8vrlSrlAlYAW4",
    version: "weekly",

});
loader.importLibrary("maps").then(async () => {
    const { Map } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;
    map = new Map(document.getElementById("map") as HTMLElement, {
        center: myLatLong.value,
        zoom: 8,
        mapId: 'b7a9841aa08c5884+'
    });
    let infoWindow = new google.maps.InfoWindow({
        content: "Click the map to get Lat/Lng!",
        position: myLatLong.value,
    });
    infoWindow.open(map);
    map.addListener("click", (mapsMouseEvent: any) => {
        infoWindow.close();
        curClickedCords.value = {
            lat: mapsMouseEvent?.latLng?.lat() as number,
            lng: mapsMouseEvent?.latLng?.lng() as number
        }
        infoWindow = new google.maps.InfoWindow({
            position: mapsMouseEvent.latLng,
        });
        infoWindow.setContent(
            JSON.stringify(mapsMouseEvent.latLng.toJSON(), null, 2)
        );
        infoWindow.open(map);
    })
    marker = new AdvancedMarkerElement({
        map: map,
        position: myLatLong.value
    })

    polygon = new google.maps.Polygon({
        strokeColor: "#FF0000",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#FF0000",
        fillOpacity: 0.35,
    });

    polygon.setMap(map);
});

function handleCancel() {
    console.log('working')
    showAdd.value = !showAdd.value
}

onMounted(() => {
    navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        switch (result.state) {
            case 'granted':
                navigator.geolocation.getCurrentPosition((location) => {
                    console.log('hello')
                    myLatLong.value = {
                        lat: location.coords.latitude,
                        lng: location.coords.longitude
                    }
                })
                break;
            case 'prompt':
                navigator.geolocation.getCurrentPosition((location) => {
                    console.log(location)
                })
                break;
            case 'denied':
                break;
            default:
                break;
        }

    })
})


watch(myLatLong, () => {
    if (!map) return;
    map.setCenter(myLatLong.value)
    marker.position = myLatLong.value
})

watch(
    curClickedCords, () => {
        if (showAdd.value) {
            if (curClickedCords.value) {
                if (polygonCordinates.value && polygonCordinates.value.length > 0) {
                    polygonCordinates.value = [...polygonCordinates.value, curClickedCords.value]
                }
                else {
                    polygonCordinates.value = [curClickedCords.value]
                }
            }
        }

    }
)

watch(polygonCordinates, () => {
    if (showAdd.value) {
        console.log(polygonCordinates.value)
        polygon.setPaths(polygonCordinates.value as google.maps.LatLngLiteral[])
    }
})


</script>
