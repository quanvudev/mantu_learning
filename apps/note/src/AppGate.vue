<template>
  <router-view v-if="!store.isLoading" />
</template>

<script lang="ts" setup>
import { useQuasar } from 'quasar';
import { onMounted, watch } from 'vue';
import { useAuthStore } from './stores/auth-store';

const store = useAuthStore();

const $q = useQuasar();

watch(
  () => store.isLoading,
  (v) => {
    if (v)
      $q.loading.show({
        message: 'Some important process  is in progress. Hang on...',
        backgroundColor: 'secondary',
      });
    else $q.loading.hide();
  }
);

onMounted(() => {
  store.bootstrap();
});
</script>
