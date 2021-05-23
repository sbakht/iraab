<template>
  <div>
    <div class="p-4 flex flex-row-reverse justify-center">
      <Word
        @click="click(word)"
        @click.shift="shiftClick(word)"
        v-for="word in words"
        class="cursor-pointer"
        :word="word"
        :key="word.id"
        :activeFrom="highlightFrom(word)"
        :activeTo="highlightTo(word)"
      ></Word>
    </div>

    <div class="p-4 flex flex-row justify-center space-x-4">
      <div
        v-for="connection in connections"
        :key="connection.id"
        @click="selectConnection(connection)"
      >
        <button class="rounded p-2 border" :data-testid="connection.id">
          {{ connection.grammar.name }}
        </button>
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
import { mapGetters } from "vuex";
import { wordsToTokens, isSubset } from "../utils/GraphUtils";
import Word from "@/components/Word";

export default {
  name: "test",
  components: { Word },
  data() {
    return {
      selectedConnection: null,
      from: [],
      to: null,
    };
  },
  computed: {
    ...mapGetters("Graph", {
      Graph: "graph",
      words: "words",
      connections: "connections",
      findPhrase: "findPhrase",
      phrases: "phrases",
    }),
    tokens() {
      return this.Graph.getTokens().map((id) => this.Graph.graph.node(id));
    },
  },
  methods: {
    click(word) {
      this.from.push(word);
    },
    shiftClick(word) {
      this.to = word;
      this.$store.commit("Graph/addConnection", {
        from: this.from[0].token,
        to: this.to.token,
      });
    },
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
    selectConnection(connection) {
      this.selectedConnection = connection;
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
    test(token) {
      const connection = this.Graph.toHead(token.id).connection;
      return this.Graph.getLevel(connection);
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
