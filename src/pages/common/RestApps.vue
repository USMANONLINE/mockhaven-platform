<template>
  <q-page padding>
    <q-banner rounded class="bg-info text-white">

      We can't find your saved recipes until you sign in.

      <template v-slot:action>
        <q-btn flat color="white" label="Continue as a Guest" />
        <q-btn flat color="white" label="Sign in" />
      </template>
    </q-banner>

    <q-dialog v-model="createRestAppDialog" position="top">
      <q-card style="width: 500px">
        <q-toolbar class="bg-primary text-white">
          <q-toolbar-title>New Rest App</q-toolbar-title>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-toolbar>

        <q-form @submit.prevent="createRestApp">
          <q-card-section>
            <q-input
              label="Name"
              v-model.trim="restApp.name"
              outlined
              autofocus
              lazy-rules
              :rules="[val => val && val.length > 3 || 'Please input a valid name']"
            />
            <q-input
              label="Base Path"
              v-model.trim="restApp.basePath"
              outlined
              autofocus
              hint="Base Path of your api"
            />
            <q-select
              label="Allowed Headers"
              v-model.trim="restApp.headers"
              new-value-mode="add-unique"
              use-input
              use-chips
              multiple
              outlined
              autofocus
              hint="Allowed Custom header names to be used in Request or Response."
            />
            <q-select
              label="Allowed Origins"
              v-model.trim="restApp.origins"
              new-value-mode="add-unique"
              use-input
              use-chips
              multiple
              outlined
              autofocus
              hint="Allowed Origins to access your api. (*) for all origins."
            />
            <q-select
              label="Allowed Methods"
              v-model="restApp.methods"
              :options="allowedMethods"
              multiple
              outlined
              autofocus
              hint="Allowed Method to access your api. (*) for all origins."
            />
            <q-checkbox
              v-model="restApp.persistRequestPayload"
              label="Persist Request Payload"
              checked-icon="task_alt"
              unchecked-icon="highlight_off"
            />
          </q-card-section>
          <q-card-actions align="right">
            <q-btn label="Create" color="primary" type="submit" :loading="createRestAppLoader" />
            <q-btn label="Close" color="grey" />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { api } from 'boot/axios';
import { errorNotification } from 'boot/util';
import type { BaseResponseData, RestApplication } from 'src/models/CustomTypes';

const allowedMethods = ['POST', 'PUT', 'DELETE', 'PATCH', 'GET', 'HEAD', 'OPTIONS'];
const emptyRestApp: RestApplication = {
  name: '',
  description: '',
  basePath: 'api/v1',
  headers: ['X-API-KEY'],
  origins: ['*'],
  methods: ['POST', 'PUT', 'DELETE', 'PATCH', 'GET'],
  persistRequestPayload: false
}

const createRestAppLoader = ref(false);
const createRestAppDialog = ref(false);
const restApp = ref<RestApplication>(emptyRestApp);

async function createRestApp () {
  createRestAppLoader.value = true;
  try {
    const createRestAppResp = await api.post<BaseResponseData<RestApplication>>('rest-provider/new-service', restApp.value);
    if (createRestAppResp.data.code == -1) {
      errorNotification(createRestAppResp.data.message);
      return;
    }
    createRestAppDialog.value = false;
    createRestAppLoader.value = false;
    restApp.value = emptyRestApp;
  } catch (error) {
    createRestAppLoader.value = false;
    console.error(error);
  }
}

onMounted(async () => {
  try {
    const restApps = await api.get('rest-provider/rest-apps?page=0&limit=10');
    console.log(restApps)
  } catch (error) {
    console.log(error)
  }
})
</script>
