<template>
  <div class="auth-callback">
    <q-spinner-dots size="xl" color="primary" />
    <p>{{ $t('authenticating') }}</p>
  </div>
</template>

<script lang="ts" setup>
import { RouteNames } from '@/constants';
import { useAuthStore } from '@/stores/auth-store';
import { onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const auth = useAuthStore();

function validateStore() {
  if (auth.isAuth && Boolean(auth.user)) router.push({ name: RouteNames.Home });
}

watch(() => auth.isAuth, validateStore);

onMounted(() => {
  validateStore();
  const searchParams = new URLSearchParams(window.location.search);
  auth.loginWithGoogle({
    redirect_uri: `${window.location.origin}/auth/callback`,
    code: searchParams.get('code') || '',
    provider: 'GOOGLE',
  });
});
</script>
<style lang="scss" scoped>
.auth-callback {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin: 0;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
}
</style>
