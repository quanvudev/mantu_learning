<template>
  <MainLayout />
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth-store';
import { useRouter } from 'vue-router';
import MainLayout from './MainLayout.vue';
import { RouteNames } from '@/constants';

const auth = useAuthStore();

const router = useRouter();

onMounted(() => {
  if (!auth.isAuth || !Boolean(auth.user)) {
    router.push({ name: RouteNames.Home });
  }
});
</script>
