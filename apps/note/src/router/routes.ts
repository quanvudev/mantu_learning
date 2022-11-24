import { RouteNames } from '@/constants';
import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('@/pages/IndexPage.vue'),
        name: RouteNames.Home
      },

      {
        path: 'auth',
        component: () => import('@/pages/AuthPage.vue'),
        name: RouteNames.Auth
      },
      {
        path: 'notes',
        component: () => import('@/pages/NotePage.vue'),
        name: RouteNames.Notes
      }
    ],
    name: RouteNames.Root
  },
  {
    path: '/profile',
    component: () => import('@/layouts/AuthLayout.vue'),
    redirect: RouteNames.OwnedNotes,
    children: [
      {
        path: 'notes',
        component: () => import('@/pages/MyNotePage.vue'),
        name: RouteNames.OwnedNotes
      }
    ],
    name: RouteNames.Profile
  },
  {
    path: '/auth/callback',
    component: () => import('@/pages/AuthCallback.vue'),
    name: 'AuthCallbackPage'
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('@/pages/ErrorNotFound.vue'),
    name: 'NotFoundPage'
  }
];

export default routes;
