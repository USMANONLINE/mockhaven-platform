<template>
  <q-layout view="hHh LpR lFf">

    <q-header elevated class="bg-primary text-white" height-hint="98">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
<!--          <q-avatar>-->
<!--            <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg">-->
<!--          </q-avatar>-->
          MockHaven
        </q-toolbar-title>
      </q-toolbar>

<!--      <q-tabs align="left">-->
<!--        <q-route-tab to="/page1" label="Page One" />-->
<!--        <q-route-tab to="/page2" label="Page Two" />-->
<!--        <q-route-tab to="/page3" label="Page Three" />-->
<!--      </q-tabs>-->
    </q-header>

    <q-drawer show-if-above v-model="leftDrawerOpen" side="left" :width="250" :breakpoint="500" bordered>
      <q-scroll-area class="fit">
        <q-list>

          <template v-for="(menuItem, index) in menuList" :key="index">
            <template v-if="menuItem.name">
              <q-item clickable v-ripple :to="{name: menuItem.name}" exact active-class="bg-primary text-white">
                <q-item-section avatar>
                  <q-icon :name="menuItem.icon" />
                </q-item-section>
                <q-item-section>
                  {{ menuItem.label }}
                </q-item-section>
              </q-item>
              <q-separator :key="'sep' + index"  v-if="menuItem.separator" />
            </template>
            <template v-if="menuItem.action">
              <q-item clickable v-ripple @click="menuItem.action">
                <q-item-section avatar>
                  <q-icon :name="menuItem.icon" />
                </q-item-section>
                <q-item-section>
                  {{ menuItem.label }}
                </q-item-section>
              </q-item>
              <q-separator :key="'sep' + index"  v-if="menuItem.separator" />
            </template>
          </template>

        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer elevated class=" text-white">
      <q-toolbar>
        <q-toolbar-title>
          <div class="text-center">Copyright {{ new Date().getFullYear() }} MockHaven</div>
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>

  </q-layout>
</template>

<script lang="ts" setup>
import { api } from 'boot/axios';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useMySessionStore } from 'stores/session';
import { runSequentialPromises, useQuasar } from 'quasar';
import type { BaseResponseData, ProfileResponse, SideBarItem } from 'src/models/CustomTypes';
import { errorNotification } from 'boot/util';
import routes from 'src/router/routes';

const $q = useQuasar();
const $router = useRouter();
const sessionStore = useMySessionStore();

const menuList = ref<Array<SideBarItem>>([]);
const leftDrawerOpen = ref(false);

defineOptions({
  preFetch () {
    const preFetchSessionStore = useMySessionStore();

    runSequentialPromises({
      profile: () => api.get<BaseResponseData<ProfileResponse>>('auth/profile')
    }).then(resultAggregator  => {
      if (resultAggregator.profile.status === 'fulfilled') {
        preFetchSessionStore.initProfile(resultAggregator.profile.value.data)
      }
    }).catch(error => {
      console.log(error)
      errorNotification('Unable to recognize user session. Please try again !')
    })
  }
})

onMounted(() => {
  setSideNavRoutes();
  const signOutItem = { label: 'Sign Out', icon: 'power_off', separator: false, action: signOut };
  menuList.value.push(signOutItem);
})

function setSideNavRoutes () {
  const dashboardRoutes = routes.filter(route => route.children);
  if (dashboardRoutes.length > 0) {
    const dashboardSubRoutes = dashboardRoutes[0]?.children;
    const accessor = sessionStore.isAdmin ? 'admin' : 'client';

    menuList.value = dashboardSubRoutes!.filter(route => {
      return route.meta !== undefined && (route.meta.for === 'all' || route.meta.for === accessor);
    }).map(route => {
      return {
        name: route.name as string,
        path: route.path,
        separator: false,
        icon: route.meta !== undefined ? route.meta.icon as string : '',
        label: route.meta !== undefined ? route.meta.label as string : ''
      }
    });
  }
}

function toggleLeftDrawer () {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

async function signOut () {
  try {
    await api.post('auth/sign-out', { userId: sessionStore.userId });
    clearSessionData();
    await $router.push({ name: 'Sign-In' })
  } catch (error) {
    console.log(error)
    clearSessionData();
    errorNotification('Unable to log you out. Please try again !');
  }
}

function clearSessionData () {
  $q.localStorage.clear();
  sessionStore.resetSession();
}
</script>
