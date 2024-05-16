<template>
    <section class="container mx-auto">
        <div class="flex flex-col gap-2 md:flex-row">
            <div id="map" class="w-full"></div>
            <div class="min-h-92 p-2 text-sm md:w-80 border rounded-md space-y-2">
                <h1 class="font-semibold text-slate-700">Map polygons</h1>
                <div v-if="!showAdd">
                    <button v-on:click="toggleAddPolygon" class="add-new-btn">Add a new location</button>
                </div>
                <div v-if="!showAll">
                    <button v-on:click="showAll = !showAll" class="show-all-btn">Show all zones</button>
                </div>
                <div v-else>
                    <button v-on:click="showAll = !showAll" class="hide-all-btn">Hide</button>
                </div>


                <div v-if="showAdd">
                    <AddNewLocation :handle-cancel="handleCancel" :handle-save-polygon="handleSavePolygon" />
                </div>
                <div v-if="showEdit">
                    <EditLocation :name="selectedPolygon?.name" :handle-cancel-edit="handleCancelEdit"
                        :handle-save-polygon="handleSavePolygon" />
                </div>

                <div v-if="!showAdd && !showEdit" v-for="(polygon, index) in polygons" :key="index">
                    <div
                        v-bind:class="(selectedPolygon?.id == polygon?.id ? 'bg-gray-100' : '') + ' flex items-center justify-between p-1 rounded-md  border'">
                        <h1 class="capitalize">{{ polygon.name }}</h1>
                        <div class="flex items-center gap-1">

                            <button v-on:click="handleViewPolygon(polygon)"
                                class="border px-1 py-1 rounded-md text-sky-500 border-sky-500 hover:bg-sky-500 hover:text-white">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                    stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                        d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                        d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                </svg>

                            </button>
                            <button v-on:click="handleToggleEdit(polygon)"
                                class="border px-1 py-1 rounded-md text-emarald-500 border-emerald-500 group hover:bg-emerald-500 hover:text-white">

                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                    stroke-width="1.5" stroke="currentColor"
                                    class="w-4 h-4 stroke-emerald-500 group-hover:stroke-white ">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                        d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                </svg>
                            </button>
                            <button v-on:click="handleDeletePolygin(polygon.id)"
                                class="border px-1 py-1 rounded-md text-red-500 border-red-500 hover:bg-red-500 hover:stroke-white">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                                    class="w-4 h-4 fill-red-400">
                                    <path fill-rule="evenodd"
                                        d="M2.515 10.674a1.875 1.875 0 0 0 0 2.652L8.89 19.7c.352.351.829.549 1.326.549H19.5a3 3 0 0 0 3-3V6.75a3 3 0 0 0-3-3h-9.284c-.497 0-.974.198-1.326.55l-6.375 6.374ZM12.53 9.22a.75.75 0 1 0-1.06 1.06L13.19 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06l1.72-1.72 1.72 1.72a.75.75 0 1 0 1.06-1.06L15.31 12l1.72-1.72a.75.75 0 1 0-1.06-1.06l-1.72 1.72-1.72-1.72Z"
                                        clip-rule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    </div>
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
import { onBeforeMount, onMounted, ref, toRaw, watch } from "vue";
import AddNewLocation from "../components/AddNewLocation.vue";
import { collection, deleteDoc, doc, getDocs, onSnapshot, orderBy, query, setDoc, where } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { myLatLong } from "../store/store";
import EditLocation from "../components/EditLocation.vue";
import { getRandomColor, ifPolygonsIntersect, isSameCordinatesArray } from "../utils";
const showAdd = ref(false);
const showEdit = ref(false);
const currentZoomLevel = ref(8);
const polygons = ref<any[]>([]);
const selectedPolygon = ref<any>()
const polygonBeforeEdit = ref<any>()
const showAll = ref(true)
const allPolygons = ref<google.maps.Polygon[]>([]);
const editPolygon = ref<google.maps.Polygon>();
const loading = ref(false)
let map: google.maps.Map
let marker: google.maps.marker.AdvancedMarkerElement
let specificPolyogon: google.maps.Polygon
const loader = new Loader({
    apiKey: import.meta.env.VITE_MAP_API_KEY,
    version: "weekly",
});
onBeforeMount(() => {
loading.value = true;
    loader.importLibrary("maps").then(async () => {
        const { Map } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;
        const { AdvancedMarkerElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;
        loading.value = false;
        map = new Map(document.getElementById("map") as HTMLElement, {
            center: myLatLong.value,
            zoom: 8,
            mapId: import.meta.env.VITE_MAP_ID
        });

        specificPolyogon = new google.maps.Polygon({
            strokeColor: "#FF0000",
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: "#FF0000",
            fillOpacity: 0.35,

        })

        specificPolyogon.setMap(map);
        map.addListener("click", (mapsMouseEvent: any) => {
            if (showAdd.value) {
                //which means we can now plot the polygon 
                handleDisplayPolygon(mapsMouseEvent)
            }
        })
        google.maps.event.addListenerOnce(map, "idle", function () {
            map.setCenter(myLatLong.value)
        })
        map.addListener('zoom_changed', () => {
            currentZoomLevel.value = map.getZoom() as number;
        })
        marker = new AdvancedMarkerElement({
            map: map,
            position: myLatLong.value
        })
    });
})

function toggleAddPolygon() {
    if (!showAdd.value) {
        specificPolyogon.setPath([])
        specificPolyogon.setEditable(true);
        specificPolyogon.setDraggable(true);
        showAdd.value = !showAdd.value;
    }
    else {
        showAdd.value = !showAdd.value;
        specificPolyogon.setEditable(false);
        specificPolyogon.setDraggable(false);
    }
}

function handleDisplayPolygon(event: google.maps.MapMouseEvent) {
    //initially the polygon remains undefined 
    const path = specificPolyogon.getPath();
    if (path == undefined) {
        //do something
        specificPolyogon.setPath([event.latLng as google.maps.LatLng])
    }
    else {
        path.push(event.latLng as google.maps.LatLng)
    }
}

function handleCancel() {
    showAdd.value = !showAdd.value;
    specificPolyogon.setPaths([]);
    specificPolyogon.setEditable(false);
    specificPolyogon.setDraggable(false);
}

watch(loading, () => {
    if (!loading.value) {
        const q = query(collection(db, 'polygons'), orderBy('timestamps', 'desc'))
        onSnapshot(q, (querySnapshot) => {
            let polygons_: any = [];
            querySnapshot.forEach((doc) => {
                polygons_.push({
                    name: doc.data()?.name,
                    coordinates: doc.data()?.coordinates,
                    id: doc.data()?.id,
                    timestamps: doc.data()?.timestamps,
                    zoom: doc.data()?.zoom,
                    zone_color: doc.data()?.zone_color
                });
            });
            //check if something was deleted!  
            const deletedPolygons = allPolygons.value.filter(p => !polygons_.some((p_: any) => p_.id == p.get('id')))
            deletedPolygons.forEach(dp => toRaw(dp)?.setMap(null))
            //below checks if there was anything new added!
            allPolygons.value = polygons_.map((p: any) => {
                const foundP = allPolygons.value.find((p_: google.maps.Polygon) =>
                    p_.get('id') === p.id
                )
                if (foundP) {
                    return foundP
                }
                const polygon = new google.maps.Polygon({
                    paths: p.coordinates,
                    strokeColor: p.zone_color,
                    strokeWeight: 2,
                    fillColor: p.zone_color,
                    fillOpacity: 0.35,
                    map: map,
                    geodesic: true,
                })
                polygon.set('id', p.id);
                polygon.set('content', p.name)
                return polygon
            })
            specificPolyogon.setPath([]);
            polygons.value = polygons_
        })
    }
})


onMounted(() => {
    navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        switch (result.state) {
            case 'granted':
                navigator.geolocation.getCurrentPosition((location) => {
                    myLatLong.value = {
                        lat: location.coords.latitude,
                        lng: location.coords.longitude
                    }

                })
                break;
            case 'prompt':
                navigator.geolocation.getCurrentPosition((location) => {
                    myLatLong.value = {
                        lat: location.coords.latitude,
                        lng: location.coords.longitude
                    }
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


watch(showAll, () => {
    if (showAll.value) {
        allPolygons.value.forEach(p => toRaw(p).setMap(map))
    } else {
        allPolygons.value.forEach(p => {
            if (showEdit.value && p.get('id') == selectedPolygon.value?.id) return;
            toRaw(p).setMap(null)
        })
        if (!showEdit.value) {
            selectedPolygon.value = null
        }
    }

})



async function handleSavePolygon(polygon_name: string) {
    if (!showAdd.value && !showEdit.value) return;
    if (!polygon_name) return alert('Please set a polygon name!');
    if (!showEdit.value) {
        if (specificPolyogon?.getPath() && specificPolyogon?.getPath()?.getLength() <= 3) return alert('Please select more than 3 points!!')
    }
    const polygon_id = crypto.randomUUID();
    const q = query(collection(db, 'polygons'), where('name', '==', polygon_name));
    try {
        const docRef = doc(db, 'polygons', polygon_id)
        if (showAdd.value) {
            const docs = await getDocs(q);
            if (docs.size) {
                return alert('This name already exist!')
            }
            const currentPoints = specificPolyogon?.getPath()?.getArray().map(p => ({
                lat: p.lat(),
                lng: p.lng()
            }))
            if (allPolygons.value.some(poly => ifPolygonsIntersect(specificPolyogon, poly))) return alert('Zones are overlaping!');
            await setDoc(docRef, {
                name: polygon_name.toLowerCase(),
                coordinates: currentPoints,
                id: polygon_id,
                timestamps: new Date(),
                zoom: currentZoomLevel.value,
                zone_color: getRandomColor(),
            })
            alert('Polygon saved successfully!');
            showAdd.value = !showAdd.value
        }

        if (showEdit.value) {
            const docRef = doc(db, 'polygons', selectedPolygon.value?.id)
            let currentPoints: {
                lat: number,
                lng: number
            }[] | undefined = [];
            currentPoints = editPolygon.value?.getPath()?.getArray().map(p => ({
                lat: p.lat(),
                lng: p.lng()
            }))
            if (allPolygons.value.some(poly => poly.get('id') != selectedPolygon.value?.id && ifPolygonsIntersect(toRaw(editPolygon.value) as google.maps.Polygon, toRaw(poly)))) return alert('Zones are overlaping!');

            await setDoc(docRef, {
                name: polygon_name.toLowerCase(),
                coordinates: currentPoints,
                id: selectedPolygon.value?.id,
                timestamps: new Date(),
                zoom: currentZoomLevel.value,
                zone_color: selectedPolygon.value.zone_color
            })
            alert('Polygon saved successfully!');
            editPolygon.value?.setDraggable(false);
            editPolygon.value?.setEditable(false);
            showEdit.value = !showEdit.value
        }
    } catch (error) {
        console.log(error);
        alert('Something went wrong!')
    }
}


async function handleDeletePolygin(id: string) {
    if (!window.confirm('Are you sure?')) return;
    try {
        const toDeletePolygon: any[] = polygons.value.find((p: any) => p.id === id)?.coordinates
        const currentPoints = specificPolyogon?.getPath()?.getArray().map(p => ({
            lat: p.lat(),
            lng: p.lng()
        }))

        await deleteDoc(doc(db, 'polygons', id))
        if (currentPoints && isSameCordinatesArray(toDeletePolygon, currentPoints)) {
            specificPolyogon.setPath([]);
        }
        alert('Polygon deleted successfully!');

    } catch (error) {
        console.log(error)
        alert('Something went wrong!')
    }
}
function handleCancelEdit() {
    showEdit.value = !showEdit.value
    specificPolyogon.setEditable(false);
    specificPolyogon.setDraggable(false);
    editPolygon.value?.setDraggable(false);
    editPolygon.value?.setEditable(false);
    editPolygon.value?.setPath(polygonBeforeEdit.value)
}


function handleToggleEdit(polygon: any) {
    showAdd.value = showAdd.value ? !showAdd.value : showAdd.value;
    showEdit.value = !showEdit.value;
    selectedPolygon.value = polygon;
    polygonBeforeEdit.value = polygon?.coordinates
    const oneOfCoordinates = polygon?.coordinates[0];
    const zoom = polygon?.zoom;
    map.setCenter(oneOfCoordinates);
    map.setZoom(zoom)
    editPolygon.value = allPolygons.value.find(p => p.get('id') == polygon.id);
    editPolygon.value?.setDraggable(true);
    editPolygon.value?.setEditable(true);

}
function handleViewPolygon(polygon: any) {
    selectedPolygon.value = polygon
    const oneOfCoordinates = polygon?.coordinates[0];
    map.setCenter(oneOfCoordinates);
    map.setZoom(polygon?.zoom);
    if (showAll.value) return;
    toRaw(editPolygon.value)?.setMap(null)
    editPolygon.value = allPolygons.value.find(p => p.get('id') == polygon.id);
    toRaw(editPolygon.value)?.setMap(map)
}

</script>
