<template>
    <div class="container mx-auto h-[6vh] flex items-center justify-between px-2">
        <RouterLink to='/'>
            <div class="text-xl font-semibold">Vue Js Todo app</div>
        </RouterLink>
        <div>
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
        </div>
    </div>
</template>
<script setup>
import { RouterLink } from 'vue-router';
import { Bookmarks } from '../store/store'; 
</script>

<style lang="scss" scoped></style>
