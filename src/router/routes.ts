import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('pages/IndexPage.vue'),
  },

  {
    path: '/dashboard',
    component: () => import('layouts/MainLayout.vue'),
    children: [{
      path: 'rest-apps',
      name: 'Rest Apps',
      component: () => import('pages/user/RestApp.vue'),
    }]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
