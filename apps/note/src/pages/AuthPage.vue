<template>
  <q-page class="container">
    <form
      class="form q-gutter-md"
      @submit.prevent.stop="onSubmit"
      autocomplete="off"
      autocorrect="off"
    >
      <q-input
        ref="usernameRef"
        v-model="form.username"
        label="Username"
        :rules="[
          (v) => !!v || 'Username is required',
          (v) => v.length >= 6 || 'Username minimum 6 characters',
        ]"
        :loading="auth.isAuthenticating"
      />
      <q-input
        ref="passwordRef"
        v-model="form.password"
        label="Password"
        :rules="[
          (v) => !!v || 'Password is required',
          (v) => v.length >= 6 || 'Password minimum 6 characters',
        ]"
        :type="visiblePassword ? 'text' : 'password'"
        :loading="auth.isAuthenticating"
      >
        <template #append>
          <q-btn
            :icon="visiblePassword ? 'visibility' : 'visibility_off'"
            @click="visiblePassword = !visiblePassword"
            round
            flat
          />
        </template>
      </q-input>

      <q-btn type="submit" color="primary" :loading="auth.isAuthenticating"
        >Login</q-btn
      >
      <q-btn
        @click="loginWithGoogle()"
        flat
        color="primary"
        :loading="auth.isAuthenticating"
      >
        Login With Google
      </q-btn>
    </form>
  </q-page>
</template>

<script lang="ts" setup>
import { RouteNames } from '@/constants';
import { useAuthStore } from '@/stores/auth-store';
import { QInput } from 'quasar';
import { onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

const form = ref<{ username: string; password: string }>({
  username: '',
  password: '',
});

const auth = useAuthStore();

const router = useRouter();
const usernameRef = ref<QInput | null>(null);
const passwordRef = ref<QInput | null>(null);

const visiblePassword = ref(false);

function onSubmit() {
  if (!usernameRef.value || !passwordRef.value) return;
  usernameRef.value.validate();
  passwordRef.value.validate();
  if (usernameRef.value.hasError || passwordRef.value.hasError) return;
  auth.login(form.value);
}

function validateStore() {
  if (auth.isAuth && Boolean(auth.user)) router.push({ name: RouteNames.Home });
}

onMounted(validateStore);

watch(() => auth.isAuth, validateStore);

function loginWithGoogle(uri = '/') {
  const loginURL = auth.generateGoogleUri(uri);
  window.location.assign(loginURL);
}
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex: 1;
  justify-content: center;
  height: calc(100vh - 50px);

  .form {
    display: flex;
    flex-direction: column;
    min-width: 320px;
    margin: auto;

    & .q-btn {
      width: fit-content;
      margin-left: auto;
    }
  }
}
</style>
