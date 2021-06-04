<template>
  <div>
    <div class="p-4 flex flex-row-reverse justify-center">
      <Word
        v-for="word in sentence.words"
        :word="word"
        :key="word.id"
        :activeFrom="highlightFrom(word)"
        :activeTo="highlightTo(word)"
      ></Word>
    </div>

    <div class="p-4 flex flex-row justify-center space-x-4">
      <div v-for="(name, i) in uniqueNames(sentence.connections)" :key="i">
        <badge-view :text="name" :large="false"></badge-view>
      </div>
    </div>

    <div v-if="selectedConnection" class="p-4">
      <div v-if="isToken(selectedConnection.from)">
        "{{ selectedConnection.from.name }}" is
        {{ selectedConnection.grammar.name }} to "{{
          selectedConnection.to.name
        }}"
      </div>
      <div v-if="isPhrase(selectedConnection.from)">
        "{{
          selectedConnection.from.words.map((word) => word.label).join(" ")
        }}" is a {{ selectedConnection.from.phrase.description }} that is
        {{ selectedConnection.grammar.name }} to "{{
          selectedConnection.to.name
        }}"
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
  data() {
    return {
      selectedConnection: null,
    };
  },
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
</style>
