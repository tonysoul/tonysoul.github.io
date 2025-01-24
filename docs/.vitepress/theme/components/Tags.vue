<template>
  <div class="container">111</div>
</template>

<script setup lang="ts">
import { useData } from "vitepress";

const data = useData();

console.log(data.theme.value.posts);
</script>

<style scoped lang="scss">
.container {
  width: 1024px;
  margin: 0 auto;
}
</style>
