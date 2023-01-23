import { z } from 'zod'

const NotificationSchema = z.object({
  content: z.string(),
  id: z.string(),
  status: z.enum(['info', 'success', 'warning', 'error']),
  timeout: z.number().optional(),
})

export type Notification = z.infer<typeof NotificationSchema>

export const useNotificationsStore = defineStore('notifications', () => {
  const notifications = ref<Notification[]>([])

  function remove(notification: Notification): void
  function remove(notificationId: string): void
  function remove(param: unknown): void {
    let id: string | undefined

    if (typeof param === 'string') {
      id = param
    }

    const parsedResult = NotificationSchema.safeParse(param)

    if (parsedResult.success) {
      id = parsedResult.data.id
    }

    if (id === undefined) {
      return
    }

    notifications.value = notifications.value.filter((notif) => notif.id !== id)
  }

  function add(notification: Omit<Notification, 'id'>) {
    const newNotification = {
      ...notification,
      id: uuid(),
    }

    notifications.value.push(newNotification)

    setTimeout(() => {
      remove(newNotification)
    }, notification.timeout ?? 3500)
  }

  return {
    notifications,
    add,
    remove,
  }
})
