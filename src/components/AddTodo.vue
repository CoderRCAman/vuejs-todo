<template>
    <div>
        <form v-on:submit="handleSubmit" class="flex gap-2 mb-5">
            <input :disabled="isSlowMode == true" v-model="title"
                class="outline-none border rounded-md py-2 px-1 w-full" />
            <button v-if="isSlowMode == true" disabled
                class="border px-4 opacity-45 rounded-md text-amber-400 border-amber-400 hover:bg-amber-50 flex items-center gap-2">
                <span>Slowed </span>
                {{ timer }}</button>
            <button v-else
                class="border px-4 rounded-md text-emerald-400 border-emerald-400 hover:bg-emerald-50">Add</button>
        </form>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { addTodos } from '../store/store';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime'
import { UserProfile } from '../router';
dayjs.extend(relativeTime)
const title = ref('')
const timer = ref(60);
const isSlowMode = ref(false);
// const interval = ref<any>(null) ; 
// const { addTodo } = store;
function handleSubmit(e: Event) {
    e.preventDefault();
    if (!title.value) return alert('Title is missing!');
    console.log(UserProfile.value?.displayName)
    addTodos({
        title: title.value,
        id: crypto.randomUUID(),
        completed: false,
        timestamp: new Date(),
        userName: UserProfile.value?.displayName || "",
        user_id: UserProfile.value?.uid as string
    })
    title.value = ''
    // isSlowMode.value = true

    // interval.value = setInterval(()=>{ 
    //     timer.value = timer.value -1 ; 
    //     localStorage.setItem('slowmode' , JSON.stringify(new Date())) ; 
    // },1000)
}


</script>

<style lang="scss" scoped></style>