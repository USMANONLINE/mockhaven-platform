<template>
  <q-page padding>
    <q-banner rounded class="bg-info text-white">

      We can't find your saved recipes until you sign in.

      <template v-slot:action>
        <q-btn flat color="white" label="Continue as a Guest" />
        <q-btn flat color="white" label="Sign in" />
      </template>
    </q-banner>
  </q-page>
</template>

<script setup lang="ts">
//
</script>
