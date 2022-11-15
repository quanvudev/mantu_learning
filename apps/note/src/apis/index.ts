import { api } from '@/boot/axios';

const getUser = (token?: string) => {
  let options = {
    ...api.defaults.headers
  };
  if (token)
    options = {
      ...options,
      headers: {
        authoriazation: `Bearer ${token}`
      }
    };
  return api
    .get<API.WithSuccessData<API.User>>('/user/me', options)
    .then((r) => r.data);
};

const login = (payload: API.LoginPayload) => {
  return api.post<API.UserWithToken>('/auth', payload).then((r) => r.data);
};

const AUTH: API.AUTH = {
  getUser,
  login
};

export { AUTH };
