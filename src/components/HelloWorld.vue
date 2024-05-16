<template>
  <div>
    <h1 v-if="title">{{ title }}</h1>
    <h1 v-else>YOU ARE LAZY</h1>
  </div>
</template>

<script setup>
const { title } = defineProps({
  title: {
    type: String
  }
})
</script>

<style lang="scss" scoped></style>
