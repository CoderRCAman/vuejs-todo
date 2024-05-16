<template>
<div class="container mx-auto h-[6vh] flex items-center justify-between py-2 ">
        <RouterLink to='/'>
            <div class="text-xl font-semibold">Vue Js Todo app</div>
        </RouterLink>
        <div class="flex items-center gap-2">
            <RouterLink to="/bookmarks">
                <button class="border border-gray-200 p-1 rounded-md hover:bg-gray-50 relative">
                    <svg viewBox="0 0 24 24" class="w-6 h-6 fill-slate-400">
                        <path fillRule="evenodd"
                            d="M6.32 2.577a49.255 49.255 0 0 1 11.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 0 1-1.085.67L12 18.089l-7.165 3.583A.75.75 0 0 1 3.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93Z"
                            clipRule="evenodd" />
                    </svg>

                    <span
                        class="absolute right-0 bg-emerald-400 rounded-full h-5 w-5 flex justify-center items-center -top-2 text-xs text-white">
                        {{ Bookmarks.length }}
                    </span>
                </button>
            </RouterLink>
            <div v-if="UserProfile">

                <RouterLink to="/profile">
                    <img :src="UserProfile?.photoURL" class="h-10 w-10 rounded-full" />
                </RouterLink>
            </div>
            <RouterLink to='/explore/map'>
                <div class="text-xl font-semibold p-1 border rounded-md hover:bg-gray-200">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                        stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z" />
                    </svg>

                </div>
            </RouterLink>
        </div>

    </div>
</template>
<script setup>
import { RouterLink } from 'vue-router';
import { Bookmarks } from '../store/store';
import { UserProfile } from '../router';

</script>

<style lang="scss" scoped></style>
