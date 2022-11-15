import { RouteNames } from '@/constants';
import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/IndexPage.vue'),
        name: RouteNames.Home,
      },

      {
        path: 'auth',
        component: () => import('pages/AuthPage.vue'),
        name: RouteNames.Auth,
      },

      {
        path: 'notes',
        component: () => import('pages/NoteListPage.vue'),
        name: RouteNames.Notes,
      },
    ],
    name: RouteNames.Root,
  },
  // {
  //   path: '/auth',
  //   children: [
  //     {
  //       path: '',
  //       component: () => import('@/pages/AuthPage.vue'),
  //       name: RouteNames.Auth,
  //     },
  //   ],
  // },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
    name: 'NotFoundPage',
  },
];

export default routes;
