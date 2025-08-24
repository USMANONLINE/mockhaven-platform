import { defineStore, acceptHMRUpdate } from 'pinia';
import type { AuthToken, BaseResponseData, ProfileResponse } from 'src/models/CustomTypes';

export const useMySessionStore = defineStore('SessionStore', {
  state: () => ({
    isAdmin: false,
    userId: '',
    roles: [],
    privileges: [],
    profile: {},
    preference: [],
    authToken: {
      accessToken: ''
    }
  }),
  getters: {},
  actions: {
    setUserIdField (userId: string) {
      this.userId = userId;
    },

    setAdminField (isAdmin: boolean) {
      this.isAdmin = isAdmin;
    },

    setAuthTokenField (authToken: AuthToken) {
      this.authToken = authToken;
    },

    initSession (userId: string, isAdmin: boolean,  authToken: AuthToken) {
      this.userId = userId;
      this.authToken = authToken;
    },

    initProfile (profileResponse: BaseResponseData<ProfileResponse>) {
      this.profile = profileResponse;
      this.userId = profileResponse.data.emailAddress;
      this.isAdmin = profileResponse.data.roles
        .filter(role => role.isAdmin)
        .length > 0;
    },

    getAccessToken () {
      if (this.authToken && this.authToken.accessToken !== '' ) {
        return this.authToken.accessToken;
      }
      return null;
    },

    resetSession () {
      this.userId = '';
      this.profile = {};
      this.authToken = { accessToken: '' };
      this.roles = this.privileges = this.privileges = [];
    }
  }
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useMySessionStore, import.meta.hot));
}
