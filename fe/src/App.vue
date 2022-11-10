<template>
  <app-gate />
</template>

<script setup lang="ts">
import { useQueryProvider } from 'vue-query';
import AppGate from './AppGate.vue';
useQueryProvider();
</script>
