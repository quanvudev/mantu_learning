import { api } from '@/boot/axios';

const AuthService: API.AUTH = {
  getUser: (token?: string) => {
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
  },
  login: (payload: API.LoginPayload) => {
    return api.post<API.UserWithToken>('/auth', payload).then((r) => r.data);
  },
  auth0: (payload) => {
    return api
      .post<API.UserWithToken>('/auth/auth0', payload)
      .then((r) => r.data);
  }
};

export default AuthService
