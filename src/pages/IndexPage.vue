<template>
  <q-layout>
    <q-page-container>
      <q-page>
        <div class="row window-height">
          <div class="col-xs-12 col-sm-12 col-md-7 bg-secondary"></div>
          <div class="col-xs-12 col-sm-12 col-md-5 flex flex-center">
            <div style="width: 500px">
              <p class="text-subtitle1 text-bold">MockHaven - Sign In</p>
              <form @submit.prevent="login">
                <q-input
                  autofocus
                  label="Email Address"
                  type="email"
                  v-model="loginField.userId"
                  outlined
                  :rules="[val => val.length > 0 && val.includes('@') && val.includes('.') || 'Please input a valid Email Address']"
                >
                  <template v-slot:prepend>
                    <q-icon name="account_circle" />
                  </template>
                </q-input>
                <q-input
                  label="Password"
                  :type="isPassword ? 'password' : 'text'"
                  v-model="loginField.password"
                  outlined
                  :rules="[val => val.length >= 8 || 'Please input a valid Password']"
                >
                  <template v-slot:prepend>
                    <q-icon name="vpn_key" />
                  </template>
                  <template v-slot:append>
                    <q-icon
                      :name="isPassword ? 'visibility_off' : 'visibility'"
                      class="cursor-pointer"
                      @click="isPassword = !isPassword"
                    />
                  </template>
                </q-input>
                <div class="q-mt-sm">
                  <router-link  to="/">Forgot Password?</router-link>
                  <q-btn
                    label="Sign In"
                    :loading="loading"
                    type="submit"
                    class="float-right"
                    color="primary"
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { api } from 'boot/axios';
import { useQuasar } from 'quasar';
import { Property } from 'src/models/Property';
import { errorNotification, successNotification } from 'boot/util';
import { useMySessionStore } from 'stores/session';
import type { Login, BaseResponseData, LoginResponse } from 'src/models/CustomTypes';
import { useRouter } from 'vue-router';

const $q = useQuasar();
const $router = useRouter();
const sessionStore = useMySessionStore();

const isPassword = ref<boolean>(true);
const loading = ref<boolean>(false);
const loginField = ref<Login>({ userId: '', password: '' });

async function login () {
  loading.value = true;

  try {
    const loginResponse = await api
      .post<BaseResponseData<LoginResponse>>('auth/sign-in', loginField.value);

    const authToken = {
      accessToken: loginResponse.headers['access-token'],
      refreshToken: loginResponse.headers['refresh-token'],
      expiryTimeInSeconds: loginResponse.headers['access-expiry']
    };

    const isAdmin = loginResponse.data.data
      .roles.filter(role => role.isAdmin)
      .length > 0;

    $q.localStorage.set(Property.AUTH_TOKEN, authToken);
    sessionStore.initSession(loginResponse.data.data.userId, isAdmin, authToken);
    api.defaults.headers.common.Authorization = `Bearer ${authToken.accessToken}`;

    successNotification(loginResponse.data.message);
    loading.value = false;
    await $router.push({ name: 'Admin-Dashboard' })
  } catch (error) {
    loading.value = false;
    console.log(error);
    errorNotification('Unable to complete request. Please try again ');
  }
}
</script>
