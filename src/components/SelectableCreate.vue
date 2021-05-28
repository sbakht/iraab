<template>
  <div>
    <div class="p-4 flex flex-row-reverse justify-center">
      <ConnectionChips
        :connections="connectionTypes"
        @select="setConnectionType"
      ></ConnectionChips>
      {{ connectionType && connectionType.name }}
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
        :selected="from"
        :activeFrom="highlightFrom(word).word"
        :activeFromToken="highlightFrom(word).token"
        :activeTo="highlightTo(word).word"
        :activeToToken="highlightTo(word).token"
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
          data-testid="select-connection"
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
    <button
      v-if="selectedConnection"
      class="text-white bg-red-800 p-3 rounded"
      data-testid="delete"
      @click="onDelete"
    >
      Delete
    </button>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { wordsToTokens, isSubset } from "../utils/GraphUtils";
import Word from "@/components/Word";
import Utils from "../utils/Utils";
import { data, connectionTypes } from "../data/data";
import { Phrase } from "../api/Phrase";
import ConnectionChips from "@/components/Chips";

function highlight(outerTokens, word) {
  const tokens = wordsToTokens([word]);
  if (isSubset(outerTokens, tokens, { param: "id", partial: false })) {
    return { word: true, token: "" };
  }

  if (isSubset(outerTokens, tokens, { param: "id", partial: true })) {
    return { word: false, token: outerTokens[0].id };
  }
  return { word: false, token: "" };
}

export default {
  components: { Word, ConnectionChips },
  data() {
    return {
      selectedConnection: null,
      from: [],
      to: null,
      fromWord: null,
      connectionType: null,
      connectionTypes,
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
    },
    shiftClick(word) {
      this.to = word;
      const toTokens = this.toTokens(word);
      this.from = this.removeFromSelected(word);
      if (toTokens.length > 1 || this.from.length === 0) {
        return;
      }

      const toToken = toTokens[0];

      if (
        this.fromWord &&
        this.fromWord.tokens &&
        this.fromWord.tokens.some((token) => token.id === toToken.id)
      ) {
        return;
      }

      if (this.from.length === 1) {
        this.addConnection(this.from[0], toToken);
      } else {
        this.addPhaseAndConnection(this.from, toToken);
      }
    },
    removeFromSelected(word) {
      const tokens = Utils.toTokens(word);
      return Utils.filterByArray(tokens, this.from, { param: "id" });
    },
    getUpdatedSelection(word) {
      if (this.isSelected(word)) {
        return this.removeFromSelected(word);
      } else {
        const tokens = Utils.toTokens(word);
        this.fromWord = word;
        return [...new Set(this.from.concat(tokens))];
      }
    },
    addPhrase(items, to) {
      return this.$store.dispatch("Graph/addPhrase", {
        items: items,
        to,
        phrase: Phrase.PP,
      });
    },
    addPhaseAndConnection(items, to) {
      return this.$store
        .dispatch("Graph/addPhraseAndConnection", {
          items: items,
          to,
          phrase: Phrase.PP,
        })
        .then((connection) => {
          this.focusConnection(connection);
        })
        .catch(() => {});
    },
    addConnection(phrase, toToken) {
      console.log(this.connectionType);
      return this.$store
        .dispatch("Graph/addConnection", {
          from: phrase,
          to: toToken,
          grammar: this.connectionType || data.Empty,
        })
        .then((connection) => {
          this.focusConnection(connection);
        });
    },
    setConnectionType(type) {
      this.connectionType = type;
    },
    clearSelection() {
      this.to = null;
      this.from = [];
    },
    isSelected(word) {
      return Utils.containsArray(this.toTokens(word), this.from);
    },
    highlightFrom(word) {
      if (!this.selectedConnection) return { word: false, token: "" };

      const outerTokens = this.toTokens(this.selectedConnection.from);
      return highlight(outerTokens, word);
    },
    highlightTo(word) {
      if (!this.selectedConnection) return { word: false, token: "" };

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
    onDelete() {
      this.$store.commit("Graph/deleteConnection", this.selectedConnection);
      this.clearFocusedConnection();
    },
  },
};
</script>

<style>
</style>