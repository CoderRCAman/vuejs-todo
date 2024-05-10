<template>
    <div class="container flex flex-col mx-auto mt-10">
        <h1 class="text-center font-semibold text-sm  text-teal-500 text-xl">{{ UserProfile.displayName }}</h1>
        <div class="flex justify-center mt-5">
            <button v-on:click="handleLogout"
                class="border border-red-400 px-5 py-2 rounded-md text-red-400">Logout</button>
        </div>
    </div>
</template>

<script setup>
import { getAuth } from 'firebase/auth';
import { UserProfile } from '../router';
const auth = getAuth();
async function handleLogout() {
    if (!window.confirm('Are you sure?')) return;

    await auth.signOut();
    window.location.reload()
}

</script>

<style lang="scss" scoped></style>