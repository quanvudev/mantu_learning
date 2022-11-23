import { AUTH } from '@/apis';
import { KEYS } from '@/constants';
import google from '@/constants/google';
import { AxiosError } from 'axios';
import { defineStore } from 'pinia';
import { useQuasar } from 'quasar';
import { reactive, toRefs } from 'vue';
import { useQuery, useMutation } from 'vue-query';

export interface State {
  isAuth: boolean;
  user: null | {
    id: number;
    name: string;
  };
  token?: string;
}

const initialState = { isAuth: false, user: null };

export const useAuthStore = defineStore('auth', () => {
  const $q = useQuasar();
  const state = reactive<State>(initialState);

  const { isLoading, refetch } = useQuery(
    ['GET_USER_WITH_TOKEN', state.token],
    (q) => AUTH.getUser(q.queryKey[1]),
    {
      enabled: Boolean(state.token),
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      onSuccess: (d) => {
        state.user = d.data;
        state.isAuth = Boolean(d.data);
      },
      onError: (err: AxiosError) => {
        if (err.response?.status === 401) {
          refreshState();
        }
      },
      retry: false
    }
  );

  function setAuthData(d: API.UserWithToken) {
    localStorage.setItem(KEYS.APP_TOKEN, d.accessToken);
    state.isAuth = true;
    state.token = d.accessToken;
    state.user = d.data;
  }
  const { mutate, isLoading: isAuthenticating } = useMutation(
    ['POST_USER_WITH_TOKEN'],
    AUTH.login,
    {
      onSuccess: (d) => {
        setAuthData(d);
      }
    }
  );

  const { mutate: attemptWithProvider, isLoading: isAttempting } = useMutation(
    ['Auth0 with Provider'],
    AUTH.auth0,
    {
      onSuccess: (d) => {
        setAuthData(d);
      }
    }
  );

  function bootstrap() {
    const storedData = localStorage.getItem(KEYS.APP_TOKEN);
    if (!storedData) return;
    state.token = storedData;
    refetch.value();
  }

  function refreshState() {
    state.isAuth = false;
    state.user = null;
    state.token = undefined;
    localStorage.clear();
  }

  function logout() {
    $q.dialog({
      title: 'Alert',
      message: 'Are you sure to logout?',
      ok: {
        color: 'primary'
      },
      cancel: true
    }).onOk(refreshState);
  }

  function login(payload: API.LoginPayload) {
    mutate(payload);
  }

  function generateGoogleUri(from: string) {
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
      state: from
    };

    const qs = new URLSearchParams(options);

    return `${rootUrl}?${qs.toString()}`;
  }

  function loginWithGoogle(payload: API.Auth0Payload) {
    attemptWithProvider(payload);
  }

  return {
    ...toRefs(state),
    isLoading,
    isAuthenticating,
    bootstrap,
    logout,
    login,
    generateGoogleUri,
    loginWithGoogle,
    isAttempting
  };
});
