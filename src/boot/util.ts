import { defineBoot } from '#q-app/wrappers'
import { Notify } from 'quasar'

Notify.setDefaults({
  position: 'top-right'
})

export function successNotification (message: string): void {
  Notify.create({ type: 'positive', message });
}

export function errorNotification (message: string): void {
  Notify.create({ type: 'negative', message });
}

export function warningNotification (message: string): void {
  Notify.create({ type: 'warning', message });
}

export function infoNotification (message: string): void {
  Notify.create({ type: 'info', message });
}

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli-vite/boot-files
export default defineBoot(async (/* { app, router, ... } */) => {
  // something to do
})
