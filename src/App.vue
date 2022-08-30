<script setup>
import data from "./data.json";
import { ref, provide } from "vue";
import Editor from "./packages/editor";
import { registerConfig as config } from "@/utils/editor-config";

const state = ref(data);
provide("config", config);
</script>

<template>
  <div class="app">
    <Editor v-model="state"></Editor>
  </div>
</template>

<style scoped lang="scss">
.app {
  position: fixed;
  top: 20px;
  left: 20px;
  right: 20px;
  bottom: 20px;
}
</style>
