<template>
  <div>
    <div class="p-4">
      <div
        v-for="word in words"
        :key="word.label"
        :class="{ 'font-bold': highlight(word) }"
      >
        <template v-if="word.token">
          {{ word.label }} - {{ word.token && word.token.pos.tag }}
        </template>
        <template v-if="word.tokens">
          {{ word.label }} -
          <span>
            {{ word.tokens.map((token) => token.pos.tag).join(", ") }}
          </span>
        </template>
      </div>
    </div>

    <div class="p-4">
      <div v-for="token in tokens" :key="token.id">
        <span v-if="head(token.id)">
          {{ token.name }} is {{ Graph.toHead(token.id).connection.name }} to
          {{ getToken(Graph.toHead(token.id).head).name }}
        </span>
      </div>
      <div v-for="phrase in phrases" :key="phrase.id">
        {{ phrase.phrase }}
        "{{
          Graph.rangeToWords(phrase)
            .map((token) => token.label)
            .join(" ")
        }}" is a {{ phrase.phrase.tag }} that is
        {{ Graph.toHead(phrase.id).connection.name }} to
        {{ getToken(Graph.toHead(phrase.id).head).name }}
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { wordsToTokens, isSubset } from "../utils/GraphUtils";

export default {
  name: "test",
  data() {
    return {};
  },
  computed: {
    ...mapGetters("Graph", {
      Graph: "graph",
      words: "words",
      connections: "connections",
      findPhrase: "findPhrase",
    }),
    tokens() {
      return this.Graph.getTokens().map((id) => this.Graph.graph.node(id));
    },
    phrases() {
      return this.Graph.getPhrases().map((id) => this.Graph.graph.node(id));
    },
  },
  methods: {
    highlight(word) {
      const range = [{ id: "token-3" }, { id: "token-4" }];
      const tokens = wordsToTokens([word]);
      return isSubset(range, tokens, { param: "id" });
    },
    test(token) {
      const connection = this.Graph.toHead(token.id).connection;
      return this.Graph.getLevel(connection);
    },
    isPhraseConnection(connection) {
      return connection.from.includes("phrase");
    },
    head(id) {
      return this.Graph.toHead(id);
    },
    getToken(id) {
      return this.Graph.graph.node(id);
    },
    addNode() {
      console.log("add");
      this.$store.dispatch("Graph/addNode", Math.random());
    },
  },
};
</script>

<style>
</style>
