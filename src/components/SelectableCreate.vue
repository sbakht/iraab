<template>
  <div>
    <div class="p-4 flex flex-row-reverse justify-center">
      <Word
        :clickable="true"
        @clickWord="click"
        @clickToken="clickToken"
        @shiftClickWord="shiftClick"
        @shiftClickToken="shiftClickToken"
        v-for="word in words"
        class="cursor-pointer"
        :word="word"
        :key="word.id"
        :selected="isSelected(word)"
        :activeFrom="highlightFrom(word).match && highlightFrom(word).word"
        :activeFromToken="
          (highlightFrom(word).match && highlightFrom(word).token) || ''
        "
        :activeTo="highlightTo(word).match && highlightTo(word).word"
        :activeToToken="
          (highlightTo(word).match && highlightTo(word).token) || ''
        "
      ></Word>
    </div>

    <div class="p-4 flex flex-row justify-center space-x-4">
      <div
        v-for="connection in connections"
        :key="connection.id"
        @click="selectConnection(connection)"
      >
        <button
          v-if="connection.userAdded"
          class="rounded p-2 border"
          :data-testid="connection.id"
        >
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
import Utils from "../utils/Utils";

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
      this.clearSelectedConnection();
      const tokens = this.toTokens(word);
      if (this.isSelected(word)) {
        this.from = this.from.filter(
          (t) => !tokens.some((t2) => t.id === t2.id)
        );
      } else {
        this.from = this.from.concat(tokens);
      }
      console.log("click word", this.from);
    },
    clickToken(token) {
      this.clearSelectedConnection();
      const tokens = this.toTokens(token);
      if (this.isSelected(token)) {
        this.from = this.from.filter(
          (t) => !tokens.some((t2) => t.id === t2.id)
        );
      } else {
        this.from = this.from.concat(tokens);
      }
      console.log("click token", this.from);
    },
    shiftClick(word) {
      this.to = word;
      const toToken = this.toTokens(word)[0];
      console.log("shift click", this.from, toToken);
      // TODO implement for multiple tokens
      if (this.from.length === 1) {
        this.$store.commit("Graph/addConnection", {
          from: this.from[0],
          to: toToken,
        });
      }
      this.resetSelections();
    },
    shiftClickToken(token) {
      this.to = token;
      const toToken = this.toTokens(token)[0];
      console.log("shift click token", this.from, toToken);
      // TODO implement for multiple tokens
      if (this.from.length === 1) {
        this.$store.commit("Graph/addConnection", {
          from: this.from[0],
          to: toToken,
        });
      }
      this.resetSelections();
    },
    resetSelections() {
      this.to = null;
      this.from = [];
    },
    isSelected(word) {
      const tokens = this.toTokens(word);
      return (
        this.from.filter((t) => tokens.some((t2) => t.id === t2.id)).length ===
        tokens.length
      );
    },
    highlightFrom(word) {
      if (!this.selectedConnection) return { match: false };

      const outerTokens = this.toTokens(this.selectedConnection.from);
      const tokens = wordsToTokens([word]);
      // return isSubset(outerTokens, tokens, { param: "id", partial: true });
      if (isSubset(outerTokens, tokens, { param: "id", partial: false })) {
        return { match: true, word: true };
      }

      if (isSubset(outerTokens, tokens, { param: "id", partial: true })) {
        return { match: true, token: outerTokens[0].id };
      }
      return { match: false };
    },
    highlightTo(word) {
      if (!this.selectedConnection) return { match: false };

      const outerTokens = this.toTokens(this.selectedConnection.to);
      const tokens = wordsToTokens([word]);
      console.log(outerTokens, tokens);
      if (isSubset(outerTokens, tokens, { param: "id", partial: false })) {
        return { match: true, word: true };
      }

      if (isSubset(outerTokens, tokens, { param: "id", partial: true })) {
        return { match: true, token: outerTokens[0].id };
      }
      return { match: false };
    },
    selectConnection(connection) {
      this.selectedConnection = connection;
      this.resetSelections();
    },
    clearSelectedConnection() {
      this.selectedConnection = null;
    },
    toTokens(obj) {
      return Utils.toTokens(obj);
    },
    test(token) {
      const connection = this.Graph.toHead(token.id).connection;
      return this.Graph.getLevel(connection);
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
