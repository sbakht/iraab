<template>
  <div
    class="arabic mx-4 text-6xl"
    :class="{
      selected: isSelected(word),
      'active-from': activeFrom,
      'active-to': activeTo,
    }"
  >
    <div
      v-if="word.token"
      @click.exact="clickWord"
      @click.shift="shiftClickWord"
      :class="{
        'active-from': activeFrom,
        'active-to': activeTo,
        'cursor-pointer': clickable,
        selected: isSelected(word),
        [word.id]: true,
      }"
      :data-testid="word.id"
    >
      {{ word.label }}
    </div>
    <template v-if="word.tokens">
      <div
        @click.exact="clickWord"
        @click.shift="shiftClickWord"
        :class="{
          'active-from': activeFrom,
          'active-to': activeTo,
          'cursor-pointer': clickable,
          selected: isSelected(word),
          [word.id]: true,
        }"
        :data-testid="word.id"
      >
        {{ word.label }}
      </div>
      <div class="text-2xl flex flex-row-reverse justify-between">
        <div
          v-for="token in word.tokens"
          :key="token.id"
          :class="{
            'active-from-token': activeFromToken === token.id,
            'active-to-token': activeToToken === token.id,
            selected: isSelected(token),
          }"
          @click.exact="clickToken(token)"
          @click.shift.stop="shiftClickToken(token)"
          :data-testid="token.id"
        >
          {{ token.name }}
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import Utils from "../utils/Utils";

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
    activeFromToken: {
      type: String,
      default: "",
    },
    activeTo: {
      type: Boolean,
      default: false,
    },
    activeToToken: {
      type: String,
      default: "",
    },
    clickable: {
      type: Boolean,
      default: false,
    },
    selected: {
      // type: Boolean,
      // default: false,
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  methods: {
    clickToken(token) {
      this.$emit("clickToken", { token, word: this.word });
    },
    shiftClickToken(token) {
      this.$emit("shiftClickToken", { token, word: this.word });
    },
    clickWord() {
      this.$emit("clickWord", this.word);
    },
    shiftClickWord() {
      this.$emit("shiftClickWord", this.word);
    },
    isSelected(wordOrToken) {
      return Utils.containsArray(Utils.toTokens(wordOrToken), this.selected);
    },
  },
};
</script>

<style>
.active-from,
.active-from-token {
  @apply text-blue-500 bg-gray-100;
}

.active-to,
.active-to-token {
  @apply text-red-500;
}

.selected {
  @apply bg-red-100;
}

/* .active-from-token {
  @apply font-bold;
}
.active-to-token {
  @apply font-bold;
} */

.arabic {
  user-select: none;
}
</style>