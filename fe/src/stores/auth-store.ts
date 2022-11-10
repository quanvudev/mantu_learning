import { AUTH } from '@/apis';
import { KEYS } from '@/constants';
import { defineStore } from 'pinia';
import { computed, reactive, toRefs } from 'vue';
import { useQuery, useMutation } from 'vue-query';

interface State {
  isAuth: boolean;
  user: null | {
    id: number;
    name: string;
  };
  token?: string;
}

const initialState = { isAuth: false, user: null };

export const useAuthStore = defineStore('auth', () => {
  const state = reactive<State>(initialState);

  const isAuthenticated = computed(() => state.isAuth && state.user);

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
      }
    }
  );

  const { mutate, isLoading: isAuthenticating } = useMutation(
    ['POST_USER_WITH_TOKEN'],
    AUTH.login,
    {
      onSuccess: (d) => {
        localStorage.setItem(KEYS.APP_TOKEN, d.accessToken);
        state.isAuth = true;
        state.token = d.accessToken;
        state.user = d.data;
      }
    }
  );

  function bootstrap() {
    const storedData = localStorage.getItem(KEYS.APP_TOKEN);
    if (!storedData) return;
    state.token = storedData;
    refetch.value();
  }

  function logout() {
    state.isAuth = false;
    state.user = null;
    state.token = undefined;
  }

  function login(payload: API.LoginPayload) {
    mutate(payload);
  }

  return {
    ...toRefs(state),
    isLoading,
    isAuthenticating,
    isAuthenticated,
    bootstrap,
    logout,
    login
  };
});
