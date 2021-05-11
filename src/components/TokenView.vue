<template>
  <div
    class="flex flex-col items-center component p-5"
    :class="{
      'text-green-300': !answer,
      'bg-indigo-50 rounded-lg selected': selected,
      'cursor-pointer hover:text-indigo-500': answer,
      'text-red-500 incorrect': correctness === 'incorrect',
      'text-green-500 correct': correctness === 'correct',
    }"
  >
    <CheckMark
      v-if="correctness === 'correct'"
      width="20"
      height="20"
    ></CheckMark>
    <CrossMark
      v-if="correctness === 'incorrect'"
      width="20"
      height="20"
    ></CrossMark>
    <div v-if="correctness === ''" style="width: 20px; height: 20px"></div>
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
import CheckMark from "./icons/CheckMark";
import CrossMark from "./icons/CrossMark";
export default {
  components: { CheckMark, CrossMark },
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
    correctness: {
      type: String,
      validate(val) {
        const possible = ["", "correct", "incorrect"];
        return possible.includes(val);
      },
      default: "",
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