<template>
  <div class="max-w-screen-lg m-auto">
    <div class="flex flex-row-reverse flex-wrap">
      <div class="px-3" v-for="token in sentence.words" :key="token.id">
        <TokenView
          :token="token.name"
          :answer="token.answerable"
          :properties="
            (token.hideAnswer && []) ||
            (!token.answerable && token.answerKey) ||
            token.answer
          "
          :selected="token.id === activeWordId"
          :data-token="token.id"
          @click.stop="focusWord(token)"
        ></TokenView>
      </div>
    </div>
    <MultiSelect :disabled="!activeWordId"></MultiSelect>
  </div>
</template>

<script>
import MultiSelect from "./MultiSelect";
import TokenView from "./TokenView";
import { mapState, mapGetters } from "vuex";

export default {
  components: { MultiSelect, TokenView },
  methods: {
    focusWord(word) {
      this.$store.commit("setFocusedWord", word);
    },
  },
  computed: {
    ...mapState({
      userAnswers: "userAnswers",
      activeWordId: "activeWordId",
    }),
    ...mapGetters({
      sentence: "currentSentence",
    }),
  },
};
</script>

<style>
</style>