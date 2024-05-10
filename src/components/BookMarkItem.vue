<template>
    <div class="flex border rounded-md p-2 justify-between mt-3 ">
        <p>
            {{ title }}
        </p>
        <div class="space-x-2">

            <button v-on:click="handleRemoveBookmark" class="border p-1 rounded-md border-red-400">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                    class="w-6 h-6 fill-red-400">
                    <path fill-rule="evenodd"
                        d="M2.515 10.674a1.875 1.875 0 0 0 0 2.652L8.89 19.7c.352.351.829.549 1.326.549H19.5a3 3 0 0 0 3-3V6.75a3 3 0 0 0-3-3h-9.284c-.497 0-.974.198-1.326.55l-6.375 6.374ZM12.53 9.22a.75.75 0 1 0-1.06 1.06L13.19 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06l1.72-1.72 1.72 1.72a.75.75 0 1 0 1.06-1.06L15.31 12l1.72-1.72a.75.75 0 1 0-1.06-1.06l-1.72 1.72-1.72-1.72Z"
                        clip-rule="evenodd" />
                </svg>

            </button>
        </div>
    </div>
</template>

<script setup>
import { toRefs } from 'vue'
import { removeBookmark } from '../store/store';
const props = defineProps({
    title: {
        type: String,
        default: '100%',
    },
    id : {
        type:String
    },
    completed:{
        type:Boolean
    }
})
const { title , id , completed } = toRefs(props)
function handleRemoveBookmark() {
    if (!window.confirm('Are you sure?')) return;
    removeBookmark(id.value);
}
</script>

<style lang="sass" scoped>

</style>