import { AuthService } from '@/services';
import { KEYS } from '@/constants';
import google from '@/constants/google';
import { AxiosError } from 'axios';
import { defineStore } from 'pinia';
import { reactive, toRefs, ref } from 'vue';

export interface State {
  isAuth: boolean;
  user: null | {
    id: number;
    name: string;
  };
  token: string | null;
}

const initialState = { isAuth: false, user: null, token: null };

export const useAuthStore = defineStore('auth', () => {
  const state = reactive<State>(initialState);

  const isLoading = ref<boolean>(false);
  const isAuthenticating = ref<boolean>(false);
  const isAttempting = ref<boolean>(false);
  const loginMessage = ref<AxiosError>();

  async function fetchUser(token?: string) {
    const t = token ?? state.token;
    if (!t) return;
    isLoading.value = true;
    await AuthService.getUser(t)
      .then((d) => {
        setAuthData({
          data: d.data,
          accessToken: t
        });
      })
      .catch((err: AxiosError) => {
        if (err.response?.status === 401) {
          refreshState();
        }
      })
      .finally(() => {
        isLoading.value = false;
      });
  }

  async function login(data: API.LoginPayload) {
    isAuthenticating.value = true;
    loginMessage.value = undefined;
    await AuthService.login(data)
      .then((d) => {
        setAuthData(d);
        loginMessage.value = undefined;
      })
      .catch((err) => {
        loginMessage.value = err;
        refreshState();
      })
      .finally(() => {
        isAuthenticating.value = false;
      });
  }

  async function attemptWithProvider(data: API.Auth0Payload) {
    isAttempting.value = true;
    await AuthService.auth0(data)
      .then((d) => {
        setAuthData(d);
      })
      .catch(() => {
        refreshState();
      })
      .finally(() => {
        isAttempting.value = false;
      });
  }

  function setAuthData(d: API.UserWithToken) {
    state.isAuth = true;
    state.token = d.accessToken;
    state.user = d.data;
    localStorage.setItem(KEYS.APP_TOKEN, d.accessToken);
  }

  async function bootstrap() {
    const storedData = localStorage.getItem(KEYS.APP_TOKEN);
    if (!storedData) return;
    state.token = storedData;
    await fetchUser(storedData);
  }

  function refreshState() {
    state.isAuth = false;
    state.user = null;
    state.token = null;
    localStorage.clear();
  }

  function generateGoogleUri(redirect: string) {
    const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth';

    const options = {
      redirect_uri: `${window.location.origin}/auth/callback`,
      client_id: google.clientId,
      access_type: 'offline',
      response_type: 'code',
      prompt: 'consent',
      scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email'
      ].join(' '),
      state: redirect
    };

    const qs = new URLSearchParams(options);

    return `${rootUrl}?${qs.toString()}`;
  }

  return {
    ...toRefs(state),
    isLoading,
    isAuthenticating,
    bootstrap,
    logout: refreshState,
    login,
    generateGoogleUri,
    loginWithGoogle: attemptWithProvider,
    isAttempting,
    loginMessage
  };
});
