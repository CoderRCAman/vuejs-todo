<template> 
    <h1 v-if="Bookmarks.length==0" class="text-lg text-center mt-10 text-sky-500">
        No Bookmarks to show!
    </h1>
    <div v-else class="px-2" v-for="(bookmark, index) in Bookmarks" :key="index">

        <BookMarkItem :title="bookmark.title" :id="bookmark.id" :completed="bookmark.completed" />
    </div>
</template>

<script setup>
import BookMarkItem from '../components/BookMarkItem.vue';
import { Bookmarks } from '../store/store'; 
</script>

<style lang="scss" scoped></style>