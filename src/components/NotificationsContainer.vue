<script setup lang="ts">
import { useNotificationsStore } from '#src/stores/notificationsStore'
import IconClose from '~icons/carbon/close'

const notificationsStore = useNotificationsStore()
</script>

<template>
  <ul
    class="notifications-container max-w-xs h-screen w-full pointer-events-none overflow-y-auto pt-5 pr-5"
  >
    <li
      v-for="notification in notificationsStore.notifications"
      :key="`notification-${notification.id}`"
      class="pointer-events-auto rounded-md p-5 shadow-lg first:mt-0 mt-4 flex items-center"
      :class="{
        'bg-success text-success-content': notification.status === 'success',
        'bg-info text-info-content': notification.status === 'info',
        'bg-error text-error-content': notification.status === 'error',
        'bg-warning text-warning-content': notification.status === 'warning',
      }"
    >
      <span class="grow">{{ notification.content }}</span>

      <button v-on:click="notificationsStore.remove(notification)">
        <IconClose></IconClose>
        <span class="sr-only">Delete notification</span>
      </button>
    </li>
  </ul>
</template>
