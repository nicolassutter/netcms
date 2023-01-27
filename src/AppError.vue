<template>
  <div class="bg-base min-h-full">
    <div class="max-w-4xl mx-auto p-5">
      <p
        role="alert"
        class="bg-error text-error-content p-3 rounded-md"
      >
        An error occured, most likely you config is invalid.
      </p>

      <div class="max-w-full overflow-x-auto mt-5">
        <code class="">
          <pre>{{ error }}</pre>
        </code>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  error: unknown
}>()
</script>
