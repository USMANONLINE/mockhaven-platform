import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Sign-In',
    component: () => import('pages/IndexPage.vue'),
  },
  {
    path: '/create-account',
    name: 'CreateAccount',
    component: () => import('pages/CreateAccount.vue'),
  },

  {
    path: '/dashboard',
    component: () => import('layouts/MainLayout.vue'),
    children: [{
      path: 'admin',
      name: 'Admin-Dashboard',
      meta: { for: 'admin', label: 'Dashboard', icon: 'dashboard' },
      component: () => import('pages/admin/Dashboard.vue'),
    }, {
      path: 'client',
      name: 'Client-Dashboard',
      meta: { for: 'client', label: 'Dashboard', icon: 'dashboard' },
      component: () => import('pages/client/Dashboard.vue'),
    }, {
      path: 'role',
      name: 'Role',
      meta: { for: 'admin', label: 'Dashboard', icon: 'dashboard' },
      component: () => import('pages/admin/Role.vue'),
    }, {
      path: 'rest-apps',
      name: 'Rest-Apps',
      component: () => import('pages/common/RestApps.vue'),
      meta: { for: 'all', label: 'Rest Apps', icon: 'api' },
    }, {
      path: 'profile',
      name: 'Profile',
      meta: { for: 'all', label: 'Profile', icon: 'account_circle' },
      component: () => import('pages/common/Profile.vue'),
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
