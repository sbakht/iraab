<template>
  <div>
    <TokenView
      v-for="(token, i) in tokens"
      :key="token.id"
      :token="token.name"
      :answer="token.answer"
      :properties="token.properties || userAnswers[i] || []"
      :selected="i === index"
      :data-token="token.id"
      @click="index = i"
    ></TokenView>
    <MultiSelect :result="focusedAnswer" @value="onValue"></MultiSelect>
  </div>
</template>

<script>
import MultiSelect from "./MultiSelect";
import TokenView from "./TokenView";

export default {
  components: { MultiSelect, TokenView },
  props: {
    tokens: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      index: 0,
      userAnswers: [],
    };
  },
  methods: {
    onValue(value) {
      this.userAnswers[this.index] = value;
    },
  },
  computed: {
    focusedAnswer() {
      return this.userAnswers[this.index] || [];
    },
  },
};
</script>

<style>
</style>