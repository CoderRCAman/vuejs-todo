<template>
    <div
        v-bind:class="['flex', 'border', 'rounded-md', 'p-2', 'justify-between', 'mt-3', 'items-center', completed ? 'bg-emerald-50 border-emerald-300 text-emerald-600' : 'bg-white']">
        <div clas="flex flex-col">
            <p>
                {{ title }}
            </p>
            <span class="text-xs font-semibold text-slate-400 border rounded-md p-1">by {{ userName }}</span>
        </div>

        <div class="space-x-2">

            <button v-if="!completed" v-on:click="handleCompleted" class="border border-emerald-200 p-1 rounded-md">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 stroke-emerald-400" fill="none"
                    viewBox="0 0 24 24" stroke-width="1.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
            </button>
            <button v-on:click="handleAddBookmark" class="border p-1 rounded-md">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                    class="w-6 h-6 fill-slate-400">
                    <path fillRule="evenodd"
                        d="M6.32 2.577a49.255 49.255 0 0 1 11.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 0 1-1.085.67L12 18.089l-7.165 3.583A.75.75 0 0 1 3.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93Z"
                        clipRule="evenodd" />
                </svg>
            </button>
            <button v-on:click="handleRemoveTodo" class="border p-1 rounded-md border-red-400">
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
import { addToBookmark, markAsCompleted, removeTodo } from '../store/store';

// import { store } from '../store/store';
const props = defineProps({
    title: {
        type: String,
        default: '100%',
    },
    id: {
        type: String
    },
    completed: {
        type: Boolean
    },
    userName: {
        type: String,
    default:'John Doe'
    }
})

const { title, index, id, completed } = toRefs(props)
function handleRemoveTodo() {
    if (!window.confirm('Are you sure?')) return;
    removeTodo(id.value)
}
function handleAddBookmark() {
    addToBookmark({
        title: title.value,
        id: id.value,
        completed: completed.value,
        timestamp: new Date()
    })
}

function handleCompleted() {
    markAsCompleted(id.value)
}

</script>

<style lang="sass" scoped>

</style>