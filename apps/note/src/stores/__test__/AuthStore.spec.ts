import { KEYS } from '../../constants';
import { api } from '../../boot/axios';
import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { setActivePinia, createPinia } from 'pinia';
import { useAuthStore } from '../auth-store';
import MockAdapter from 'axios-mock-adapter';
import authResponse from './jsons/auth.response.json';
import meResponse from './jsons/me.response.json';

installQuasarPlugin();

describe('Auth Store', () => {
  beforeEach(() => {
    // creates a fresh pinia and make it active so it's automatically picked
    // up by any useStore() call without having to pass it to it:
    // `useStore(pinia)`
    setActivePinia(createPinia());
  });

  it('Should login with username, password successfully', async () => {
    const mock = new MockAdapter(api);
    const authStore = useAuthStore();
    mock.onPost('/auth').reply(200, authResponse);
    await authStore.login({
      username: 'username',
      password: 'password'
    });
    expect(authStore.isAuth).toBe(true);
    expect(authStore.user).toEqual(authResponse.data);
    expect(authStore.token).toEqual(authResponse.accessToken);
  });

  it('Should store login with username, password', async () => {
    const mock = new MockAdapter(api);
    const authStore = useAuthStore();
    mock.onPost('/auth').reply(401, authResponse);
    await authStore.login({
      username: 'username',
      password: 'password'
    });
    expect(authStore.isAuth).toBe(false);
    expect(authStore.user).toBe(null);
    expect(authStore.token).toBe(null);
  });

  it('Should fetch user unsuccessfully', async () => {
    const mock = new MockAdapter(api);
    const authStore = useAuthStore();
    mock.onGet('/user/me').reply(200, meResponse);
    await authStore.bootstrap();
    expect(authStore.isAuth).toBe(false);
    expect(authStore.user).toBe(null);
    expect(authStore.token).toBe(null);
  });

  it('Should fetch user successfully', async () => {
    const mock = new MockAdapter(api);
    const authStore = useAuthStore();
    mock.onGet('/user/me').reply(200, meResponse);
    localStorage.setItem(KEYS.APP_TOKEN, authResponse.accessToken);
    await authStore.bootstrap();
    expect(authStore.isAuth).toBe(true);
    expect(authStore.user).toEqual(meResponse.data);
    expect(authStore.token).toBe(authResponse.accessToken);
  });

  it('Generate google Auth0 Link', () => {
    const { generateGoogleUri } = useAuthStore();

    const auth0Uri = generateGoogleUri('/');

    expect(auth0Uri).toBe(
      'https://accounts.google.com/o/oauth2/v2/auth?redirect_uri=http%3A%2F%2Flocalhost%2Fauth%2Fcallback&client_id=783621005840-ce43kr45m7a1n9639ss2faijrl48rkvr.apps.googleusercontent.com&access_type=offline&response_type=code&prompt=consent&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email&state=%2F'
    );
  });

  it('Should store login with Google Auth0 Successfully', async () => {
    const mock = new MockAdapter(api);
    const authStore = useAuthStore();
    mock.onPost('/auth/auth0').reply(200, authResponse);
    await authStore.loginWithGoogle({
      redirect_uri: '/',
      code: '123',
      provider: 'GOOGLE'
    });
    expect(authStore.isAuth).toBe(true);
    expect(authStore.user).toEqual(authResponse.data);
    expect(authStore.token).toEqual(authResponse.accessToken);
  });

  it('Should store login with Google Auth0 UnSuccessfully', async () => {
    const mock = new MockAdapter(api);
    const authStore = useAuthStore();
    mock.onPost('/auth/auth0').reply(401, { message: 'UnAuthorized' });
    await authStore.loginWithGoogle({
      redirect_uri: '/',
      code: '123',
      provider: 'FACEBOOK'
    });
    expect(authStore.isAuth).toBe(false);
    expect(authStore.user).toEqual(null);
    expect(authStore.token).toEqual(null);
  });
});
