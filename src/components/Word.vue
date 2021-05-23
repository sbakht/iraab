<template>
  <div
    class="arabic mx-4 text-6xl"
    :class="{
      'active-from': activeFrom,
      'active-to': activeTo,
      [word.id]: true,
    }"
  >
    <template v-if="word.token">
      {{ word.label }}
    </template>
    <template v-if="word.tokens"> {{ word.label }}</template>
  </div>
</template>

<script>
export default {
  props: {
    word: {
      type: Object,
      required: true,
    },
    activeFrom: {
      type: Boolean,
      default: false,
    },
    activeTo: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style>
.active-from {
  @apply text-blue-500 bg-gray-100;
}

.active-to {
  @apply text-red-500;
}
</style>