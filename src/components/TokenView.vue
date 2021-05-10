<template>
  <div
    class="flex flex-col items-center component p-5"
    :class="{
      'text-green-300': !answer,
      'bg-indigo-50 rounded-lg': selected,
      'cursor-pointer hover:text-indigo-500': answer,
    }"
  >
    <div class="arabic text-6xl">{{ token }}</div>

    <div
      v-if="answer && !properties.length"
      class="text-gray-500 text-sm font-semibold self-center mt-2"
      data-test="question"
    >
      <p>?</p>
    </div>

    <div
      v-if="properties.length"
      class="text-gray-500 text-sm font-semibold self-center mt-2"
      data-test="properties"
    >
      <p
        v-for="property in orderedProperties"
        :key="property"
        data-test="property"
      >
        {{ property.name }}
      </p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    token: {
      type: String,
      required: true,
    },
    properties: {
      type: Array,
      default() {
        return [];
      },
    },
    answer: {
      type: Boolean,
      default: false,
    },
    selected: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    orderedProperties() {
      const copy = JSON.parse(JSON.stringify(this.properties));
      return copy.sort((a, b) => {
        if (a.id < b.id) {
          return -1;
        } else if (a.id > b.id) {
          return 1;
        }
        return 0;
      });
    },
  },
};
</script>

<style>
.component {
  -webkit-user-select: none;
  -webkit-touch-callout: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
</style>