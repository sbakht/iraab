<template>
  <div class="flex flex-col" :class="{'text-green-800': answer}">
    <div class="arabic text-6xl">{{token}}</div>

    <div class="text-gray-500 text-sm font-semibold self-center">
      <template v-if="answer && !properties.length">
        <p v-if="properties.length === 0">?</p>
      </template>
      <p v-for="property in properties" :key="property">{{property}}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    token: {
      type: String,
      required: true
    },
    properties: {
      type: Object,
      default: []
    },
    answer: {
      type: Boolean,
      default: false,
    }
  }
};
</script>

<style>
</style>