<template>
    <div class="space-y-2">
        <input v-model="name" class="border px-2 rounded-md py-2 w-full" name="name" placeholder="Zone name.." />
        <div class="flex gap-2">

            <button v-on:click="handleSavePolygon(name)"
                class="transition-colors duration-300 ease-in px-2 w-full py-2 rounded-md border text-emerald-500 border-emerald-500 hover:bg-emerald-500 hover:text-white">Save</button>
            <button v-on:click="handleCancelEdit"
                class="transition-colors duration-300 ease-in px-2 w-full py-2 rounded-md border text-red-500 border-red-500 hover:bg-red-500 hover:text-white">Cancel</button>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const name = ref('')
const props = defineProps({
    handleCancelEdit: {
        type: Function
    },
    handleSavePolygon: {
        type: Function
    },
    name: {
        type: String
    }
})
// const { handleCancelEdit, handleSavePolygon } = props; 
console.log(props.name)  
name.value = props.name
</script>

<style lang="scss" scoped></style>