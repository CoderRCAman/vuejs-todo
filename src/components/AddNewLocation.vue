<template>
    <div class="space-y-2">
        <input class="border px-2 rounded-md py-2 w-full" name="name" placeholder="Location name.." />
        <div class="flex gap-2">

            <button
                class="transition-colors duration-300 ease-in px-2 w-full py-2 rounded-md border text-emerald-500 border-emerald-500 hover:bg-emerald-500 hover:text-white">Add</button>
            <button v-on:click="handleCancel"
                class="transition-colors duration-300 ease-in px-2 w-full py-2 rounded-md border text-red-500 border-red-500 hover:bg-red-500 hover:text-white">Cancel</button>
        </div>
    </div>
</template>

<script setup>

const props = defineProps({
    handleCancel: {
        type: Function
    }
}) 
const {handleCancel} = props ; 
</script>

<style lang="scss" scoped></style>