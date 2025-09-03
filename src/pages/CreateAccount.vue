<template>
  <q-layout>
    <q-page-container>
      <q-page>
        <div class="row window-height">
          <div class="col-xs-12 col-sm-12 col-md-7 bg-secondary"></div>
          <div class="col-xs-12 col-sm-12 col-md-5 flex flex-center">
            <div style="width: 500px">
              <div class="text-subtitle1 text-bold">Get Started For Free</div>
              <p class="text-subtitle2 ">Already registered? <router-link to="/">Sign In</router-link> to your account</p>
              <form @submit.prevent="createAccount">
                <div class="row">
                  <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 q-pr-sm">
                    <q-input
                      label="First Name"
                      type="text"
                      name="firstName"
                      v-model.trim="newAccount.firstName"
                      outlined
                      lazy-rules
                      :rules="[val => val && val.length > 3 || 'Please input a valid first name']"
                    >
                      <template v-slot:prepend>
                        <q-icon name="person" />
                      </template>
                    </q-input>
                  </div>
                  <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                    <q-input
                      label="Surname"
                      type="text"
                      name="surname"
                      v-model.trim="newAccount.surName"
                      outlined
                      lazy-rules
                      :rules="[val => val && val.length > 3 || 'Please input a valid surname']"
                    >
                      <template v-slot:prepend>
                        <q-icon name="person" />
                      </template>
                    </q-input>
                  </div>
                </div>
                <q-input
                  name="email"
                  label="Email Address"
                  v-model.trim="newAccount.emailAddress"
                  outlined
                  lazy-rules
                  :rules="[val => val && val.length > 3 || 'Please input a valid Email Address']"
                >
                  <template v-slot:prepend>
                    <q-icon name="email" />
                  </template>
                </q-input>
                <q-input
                  type="tel"
                  name="phone"
                  label="Phone Number"
                  v-model.trim="newAccount.phoneNumber"
                  outlined
                  lazy-rules
                  :rules="[val => val && val.length > 3 || 'Please input a valid Phone Number']"
                >
                  <template v-slot:prepend>
                    <q-icon name="phone" />
                  </template>
                </q-input>
                <q-input
                  class="q-mb-sm"
                  type="text"
                  name="companyName"
                  label="Company Name"
                  v-model.trim="newAccount.businessName"
                  hint="This field is optional."
                  outlined
                >
                  <template v-slot:prepend>
                    <q-icon name="business" />
                  </template>
                </q-input>
                <q-input
                  label="Password"
                  :type="isPassword ? 'password' : 'text'"
                  v-model="newAccount.password"
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
                <q-btn
                  label="Create Account"
                  :loading="loading"
                  color="primary"
                  type="submit"
                  glossy
                />
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
import type { BaseResponseData, CreateAccount, LoginResponse } from 'src/models/CustomTypes';
import { api } from 'boot/axios';
import { Property } from 'src/models/Property';
import { successNotification } from 'boot/util';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import { useMySessionStore } from 'stores/session';

const $q = useQuasar();
const $router = useRouter();
const sessionStore = useMySessionStore();

const loading = ref<boolean>(false);
const isPassword = ref<boolean>(true);
const newAccount = ref<CreateAccount>({
  firstName: '',
  surName: '',
  emailAddress: '',
  businessName: '',
  password: '',
  phoneNumber: ''
});

async function createAccount () {
  loading.value = true;
  try {
    const createAccountResp = await api.post<BaseResponseData<LoginResponse>>('auth/create-account', newAccount.value);
    const authToken = {
      accessToken: createAccountResp.headers['access-token'],
      refreshToken: createAccountResp.headers['refresh-token'],
      expiryTimeInSeconds: createAccountResp.headers['access-expiry']
    };

    const isAdmin = createAccountResp.data.data
      .roles.filter(role => role.isAdmin)
      .length > 0;

    $q.localStorage.set(Property.AUTH_TOKEN, authToken);
    sessionStore.initSession(createAccountResp.data.data.userId, isAdmin, authToken);
    api.defaults.headers.common.Authorization = `Bearer ${authToken.accessToken}`;

    successNotification(createAccountResp.data.message);
    loading.value = false;
    await $router.push({ name: 'Admin-Dashboard' })
    loading.value = false;
  } catch (err) {
    console.log(err)
    loading.value = false;
  }
}

</script>
