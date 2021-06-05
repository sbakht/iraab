<template>
  <span
    class="
      inline-flex
      items-center
      px-2.5
      py-0.5
      rounded-full
      text-xs
      font-medium
      bg-gray-100
      text-gray-800
    "
    :class="{
      large: large && !square,
      square: square && !large,
      'large-square': large && square,
      [color]: true,
    }"
    :title="title"
  >
    {{ label }}
  </span>
</template>

<script>
const colors = [
  "bg-gray-100 text-gray-800",
  "bg-red-100 text-red-800",
  "bg-yellow-100 text-yellow-800",
  "bg-green-100 text-green-800",
  "bg-blue-100 text-blue-800",
  "bg-indigo-100 text-indigo-800",
  "bg-purple-100 text-purple-800",
  "bg-pink-100 text-pink-800",
];

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

export default {
  props: {
    label: {
      type: String,
      required: true,
    },
    title: {
      type: String,
    },
    large: {
      type: Boolean,
      required: true,
    },
    square: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    color() {
      return colors[getRandomInt(colors.length)];
    },
  },
};
</script>

<style>
.large {
  @apply px-3 text-sm;
}
.square {
  @apply px-2 rounded;
}
.large-square {
  @apply px-2.5 rounded-md text-sm;
}
</style>