<template>
  <div class="p-4">
    <div class="py-0 flex flex-row justify-end space-x-4">
      <div v-for="(name, i) in uniqueNames(sentence.connections)" :key="i">
        <badge-view :text="name" :large="false" :square="false"></badge-view>
      </div>
    </div>
    <div class="flex justify-between pt-6">
      <router-link
        :to="`/sentence/${sentence.id.split('-')[1]}`"
        class="sentence-link"
      >
        <button
          type="button"
          class="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Open
        </button>
      </router-link>
      <div class="flex flex-row-reverse justify-start">
        <Word v-for="word in sentence.words" :word="word" :key="word.id"></Word>
      </div>
    </div>
  </div>
</template>

<script>
import { wordsToTokens, isSubset } from "@/utils/GraphUtils";
import Word from "@/components/Word";
import BadgeView from "@/components/common/BadgeView.vue";
import * as _ from "ramda";

export default {
  props: {
    sentence: {
      type: Object,
      required: true,
    },
  },
  components: { Word, BadgeView },
  methods: {
    highlightFrom(word) {
      if (!this.selectedConnection) return false;

      const outerTokens = this.toTokens(this.selectedConnection.from);
      const tokens = wordsToTokens([word]);
      return isSubset(outerTokens, tokens, { param: "id", partial: true });
    },
    highlightTo(word) {
      if (!this.selectedConnection) return false;

      const outerTokens = this.toTokens(this.selectedConnection.to);
      const tokens = wordsToTokens([word]);
      return isSubset(outerTokens, tokens, { param: "id", partial: true });
    },
    toTokens(obj) {
      if (this.isPhrase(obj)) {
        return obj.tokens;
      }
      if (this.isToken(obj)) {
        return [obj];
      }
      if (this.isWord(obj)) {
        return obj.token ? [obj.token] : obj.tokens;
      }
    },
    isConnection(obj) {
      return obj.id.includes("connection");
    },
    isPhrase(obj) {
      return obj.id.includes("phrase");
    },
    isToken(obj) {
      return obj.id.includes("token");
    },
    isWord(obj) {
      return obj.id.includes("word");
    },
    isPhraseConnection(connection) {
      return connection.from.includes("phrase");
    },
    selectSentence(sentenceId) {
      this.$store.dispatch("Graph/setActiveSentence", sentenceId);
    },
    uniqueNames(connections) {
      return _.uniq(connections.map((connection) => connection.grammar.name));
    },
  },
};
</script>

<style>
.sentence-link {
  margin-top: 27px;
}
</style>
