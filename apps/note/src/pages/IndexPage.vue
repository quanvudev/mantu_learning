<script setup lang="ts">
import { RouteNames } from '@/constants';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

onMounted(() => {
  router.push({ name: RouteNames.Notes });
});
</script>

<template>
  <div>Dashboard</div>
</template>
