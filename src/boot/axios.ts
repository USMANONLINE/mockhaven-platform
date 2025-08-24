import { defineBoot } from '#q-app/wrappers';
import axios, { type AxiosInstance } from 'axios';
import { LocalStorage } from 'quasar';
import type { AuthToken } from 'src/models/CustomTypes';
import { Property } from 'src/models/Property';
import { useMySessionStore } from 'stores/session';

declare module 'vue' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
    $api: AxiosInstance;
  }
}

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)

let baseURL = '';
if (process.env && process.env.API_BASE_URL) {
  baseURL = process.env.API_BASE_URL;
}
const api = axios.create({ baseURL });

// Todo: Logic below to be executed only on routes requiring auth
if (api.defaults.headers.common.Authorization === undefined) {
  const authToken = LocalStorage.getItem<AuthToken>(Property.AUTH_TOKEN);
  if (authToken?.accessToken) {
    const sessionStore = useMySessionStore();
    sessionStore.setAuthTokenField(authToken);
    api.defaults.headers.common.Authorization = `Bearer ${authToken.accessToken}`;
  }
}


export default defineBoot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios;
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api;
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
});

export { api };
