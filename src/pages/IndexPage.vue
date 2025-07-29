<template>
  <q-layout>
    <q-page-container>
      <q-page>
        <div class="row window-height">
          <div class="col-xs-12 col-sm-12 col-md-7 bg-secondary"></div>
          <div class="col-xs-12 col-sm-12 col-md-5 flex flex-center">
            <div style="width: 500px">
              <p class="text-subtitle1 text-bold">MockHaven - Sign In</p>
              <form>
                <q-input
                  autofocus
                  label="Email Address"
                  type="email"
                  model-value=""
                  outlined
                  dense
                />
                <q-input
                  label="Password"
                  type="password"
                  model-value=""
                  outlined
                  dense
                />
                <div class="q-mt-sm">
                  <router-link  to="/">Forgot Password?</router-link>
                  <q-btn
                    label="Sign In"
                    type="submit"
                    class="float-right"
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
// import { ref } from 'vue';
// import type { Todo, Meta } from 'components/models';
// import ExampleComponent from 'components/ExampleComponent.vue';
//
// const todos = ref<Todo[]>([
//   {
//     id: 1,
//     content: 'ct1'
//   },
//   {
//     id: 2,
//     content: 'ct2'
//   },
//   {
//     id: 3,
//     content: 'ct3'
//   },
//   {
//     id: 4,
//     content: 'ct4'
//   },
//   {
//     id: 5,
//     content: 'ct5'
//   }
// ]);
//
// const meta = ref<Meta>({
//   totalCount: 1200
// });
</script>
