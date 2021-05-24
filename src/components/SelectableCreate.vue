<template>
  <div>
    <div class="p-4 flex flex-row-reverse justify-center">
      <Word
        :clickable="true"
        @clickWord="click"
        @clickToken="click"
        @shiftClickWord="shiftClick"
        @shiftClickToken="shiftClick"
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
        @click="focusConnection(connection)"
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
import { data } from "../data/data";
import { Phrase } from "../api/Phrase";

function highlight(outerTokens, word) {
  const tokens = wordsToTokens([word]);
  if (isSubset(outerTokens, tokens, { param: "id", partial: false })) {
    return { match: true, word: true };
  }

  if (isSubset(outerTokens, tokens, { param: "id", partial: true })) {
    return { match: true, token: outerTokens[0].id };
  }
  return { match: false };
}

export default {
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
    ...Utils,
    click(word) {
      this.clearFocusedConnection();
      this.from = this.getUpdatedSelection(word);
      console.log("click word", this.from);
    },
    shiftClick(word) {
      this.to = word;
      const toToken = this.toTokens(word)[0];
      console.log("shift click", this.from, toToken);
      if (this.from.length === 1) {
        this.addConnection(this.from[0], toToken);
      } else {
        this.addPhrase(this.from).then((phrase) => {
          this.addConnection(phrase, toToken);
        });
      }
      this.clearSelection();
    },
    getUpdatedSelection(word) {
      const tokens = Utils.toTokens(word);
      if (this.isSelected(word)) {
        return Utils.filterByArray(tokens, this.from, { param: "id" });
      } else {
        return this.from.concat(tokens);
      }
    },
    addPhrase(items) {
      return this.$store.dispatch("Graph/addPhrase", {
        items: items,
        phrase: Phrase.PP,
      });
    },
    addConnection(phrase, toToken) {
      this.$store
        .dispatch("Graph/addConnection", {
          from: phrase,
          to: toToken,
          grammar: data.Empty,
        })
        .then((connection) => {
          this.focusConnection(connection);
        });
    },
    clearSelection() {
      this.to = null;
      this.from = [];
    },
    isSelected(word) {
      return Utils.containsArray(this.toTokens(word), this.from);
    },
    highlightFrom(word) {
      if (!this.selectedConnection) return { match: false };

      const outerTokens = this.toTokens(this.selectedConnection.from);
      return highlight(outerTokens, word);
    },
    highlightTo(word) {
      if (!this.selectedConnection) return { match: false };

      const outerTokens = this.toTokens(this.selectedConnection.to);
      return highlight(outerTokens, word);
    },
    focusConnection(connection) {
      this.selectedConnection = connection;
      this.clearSelection();
    },
    clearFocusedConnection() {
      this.selectedConnection = null;
    },
  },
};
</script>

<style>
</style>
