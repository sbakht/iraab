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
      @click="onClick(i)"
    ></TokenView>
    <MultiSelect></MultiSelect>
  </div>
</template>

<script>
import MultiSelect from "./MultiSelect";
import TokenView from "./TokenView";
import { mapState } from "vuex";

export default {
  components: { MultiSelect, TokenView },
  methods: {
    onClick(i) {
      this.$store.commit("setAnswerIndex", i);
    },
  },
  computed: {
    ...mapState({
      tokens: "sentences",
      userAnswers: "userAnswers",
      index: "answerIndex",
    }),
  },
};
</script>

<style>
</style>