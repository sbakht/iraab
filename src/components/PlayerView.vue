<template>
  <div>
    <TokenView
      v-for="(token, i) in findSentence(123)"
      :key="token.id"
      :token="token.name"
      :answer="token.answer"
      :properties="token.properties || token.userAnswer"
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
import { mapState, mapGetters } from "vuex";

export default {
  components: { MultiSelect, TokenView },
  methods: {
    onClick(i) {
      this.$store.commit("setAnswerIndex", i);
    },
  },
  computed: {
    ...mapState({
      userAnswers: "userAnswers",
      index: "answerIndex",
    }),
    ...mapGetters({
      findSentence: "findSentence",
    }),
  },
};
</script>

<style>
</style>