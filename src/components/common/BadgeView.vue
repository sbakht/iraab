<template>
  <span
    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
    :class="{ large }"
  >
    {{ text }}
  </span>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      required: true,
    },
    large: {
      type: Boolean,
      required: true,
    },
  },
};
</script>

<style>
.large {
  @apply px-3 text-sm;
}
</style>