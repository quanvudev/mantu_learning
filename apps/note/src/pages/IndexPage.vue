<script setup lang="ts">
import { RouteNames } from '@/constants';
import { useRouter } from 'vue-router';

const router = useRouter();

router.push({ name: RouteNames.Notes });

</script>

<template>
  <div>Dashboard</div>
</template>
