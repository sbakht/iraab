<template>
  <div>
    <div class="p-4 flex justify-center">
      <ConnectionChips
        :tabs="connectionTypes.all"
        :selected="connectionType"
        @select="setConnectionType"
      ></ConnectionChips>
    </div>
    <div class="p-4 flex flex-row-reverse justify-center">
      <Word
        :clickable="true"
        @clickWord="clickWord"
        @clickToken="click"
        @shiftClickWord="shiftClickWord"
        @shiftClickToken="shiftClick"
        v-for="word in sentence.words"
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

    <submit-multi-select
      v-if="selectedWord"
      @submit="onMultiSelectChange"
    ></submit-multi-select>

    <div class="p-4 flex flex-row justify-center space-x-4">
      <div
        v-for="connection in sentence.connections"
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
        "<span class="arabic">{{ selectedConnection.from.name }}</span
        >" is {{ selectedConnection.grammar.name }} to "<span class="arabic">{{
          selectedConnection.to.name
        }}</span
        >"
      </div>
      <div v-if="isPhrase(selectedConnection.from)">
        "<span class="arabic">{{
          selectedConnection.from.words.map((word) => word.label).join(" ")
        }}</span
        >" is a {{ selectedConnection.from.phrase.description }} that is
        {{ selectedConnection.grammar.name }} to "<span class="arabic">{{
          selectedConnection.to.name
        }}</span
        >"
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
import { wordsToTokens, isSubset } from "@/utils/GraphUtils";
import Word from "@/components/Word";
import Utils from "@/utils/Utils";
import { data, connectionTypes } from "@/data/data";
import { Phrase } from "@/api/Phrase";
import ConnectionChips from "@/components/Chips";
import SubmitMultiSelect from "./common/SubmitMultiSelect.vue";

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

function sortTokens(index, items) {
  const cloned = [...items];
  cloned.sort((a, b) => {
    if (index(a) < index(b)) {
      return -1;
    }
    if (index(a) > index(b)) {
      return 1;
    }
  });
  return cloned;
}

export default {
  components: { Word, ConnectionChips, SubmitMultiSelect },
  props: ["sentence"],
  data() {
    return {
      selectedConnection: null,
      from: [],
      to: null,
      fromWord: null,
      connectionType: null,
      connectionTypes,
      selectedWord: null,
    };
  },
  methods: {
    ...Utils,
    clickWord(word) {
      this.click({ token: word });
    },
    shiftClickWord(word) {
      this.shiftClick({ token: word });
    },
    click({ token }) {
      this.clearFocusedConnection();
      this.from = this.getUpdatedSelection(token);

      const { resultWords, resultTokens } = Utils.tokensToWords(
        this.from,
        this.sentence.words
      );
      if (resultWords.length === 1 && !resultTokens.length) {
        this.selectedWord = resultWords[0];
      } else {
        this.selectedWord = null;
      }
    },
    shiftClick({ token }) {
      this.to = token;
      const toTokens = this.toTokens(token);
      this.from = this.removeFromSelected(token);
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
        this.addPhraseAndConnection(this.from, toToken);
      }
      this.$emit("change");
    },
    removeFromSelected(word) {
      const tokens = Utils.toTokens(word);
      return Utils.filterByArray(tokens, this.from, { param: "id" });
    },
    getUpdatedSelection(word) {
      if (this.isSelected(this.from, word)) {
        return this.removeFromSelected(word);
      } else {
        const tokens = Utils.toTokens(word);
        this.fromWord = word;
        return [...new Set(this.from.concat(tokens))];
      }
    },
    getPhraseBoundry(data) {
      const tokens = Utils.wordsToTokens(this.sentence.words);
      const tokenIds = tokens.map((t) => t.id);
      const indexOf = (arr) => (token) => arr.indexOf(token && token.id);
      const index = indexOf(tokenIds);

      const items = sortTokens(index, data.items);

      return { from: items[0], to: items[items.length - 1] };
    },
    invalidConnection(connection, { from, to }) {
      const tokens = Utils.wordsToTokens(this.sentence.words);
      const tokenIds = tokens.map((t) => t.id);
      const indexOf = (arr) => (token) => arr.indexOf(token && token.id);
      const index = indexOf(tokenIds);

      const inbetween = tokenIds.slice(index(from), index(to));
      return indexOf(inbetween)(connection.to) > -1;
    },
    isDuplicate(connection) {
      if (connection.from.range) {
        const newFrom = connection.from.range.from;
        const newTo = connection.from.range.to;
        for (let con of this.sentence.connections) {
          const phrase = con.from;

          const isSameFrom = phrase.from && phrase.from.id === newFrom.id;
          const isSameTo = phrase.to && phrase.to.id === newTo.id;

          if (isSameFrom && isSameTo) {
            return con;
          }
        }
      } else {
        const newFrom = connection.from;
        const newTo = connection.to;
        for (let connection of this.sentence.connections) {
          const { from, to } = connection;

          const isSameFrom = from.id === newFrom.id;
          const isSameTo = to.id === newTo.id;

          if (isSameFrom && isSameTo) {
            return connection;
          }
        }
      }
    },
    addPhraseAndConnection(items, to) {
      const boundry = this.getPhraseBoundry({ items });
      const grammar = this.connectionType || data.Empty;
      const phrase = Utils.mkPhrase({
        phrase: Phrase.PP,
        from: boundry.from,
        to: boundry.to,
        preferObject: true,
      });
      const connection = Utils.mkConnection({
        from: phrase,
        to,
        grammar,
        preferObject: true,
      });

      if (this.isDuplicate(connection)) {
        return this.updateConnection(connection);
      }

      if (this.invalidConnection(connection, boundry)) {
        return;
      }

      return this.$store
        .dispatch("Graph/addPhraseAndConnection", {
          sentenceId: this.sentence.id,
          sentence: this.sentence,
          connection,
        })
        .then((connection) => {
          this.focusConnection(connection);
          this.clearConnectionType();
        })
        .catch(() => {});
    },
    addConnection(from, to) {
      const grammar = this.connectionType || data.Empty;
      const connection = Utils.mkConnection({
        from,
        to,
        grammar,
        preferObject: true,
      });

      if (this.isDuplicate(connection)) {
        return this.updateConnection(connection);
      }
      return this.$store
        .dispatch("Graph/addConnection", {
          sentence: this.sentence,
          connection,
        })
        .then((connection) => {
          this.focusConnection(connection);
          this.clearConnectionType();
        });
    },
    updateConnection(connection) {
      const duplicate = this.isDuplicate(connection);
      return this.$store.commit("Graph/updateConnectionGrammar", {
        id: duplicate.id,
        grammar: connection.grammar,
      });
    },
    setConnectionType(type) {
      this.connectionType = type;
    },
    clearConnectionType() {
      this.connectionType = null;
    },
    clearSelection() {
      this.to = null;
      this.from = [];
      this.selectedWord = null;
    },
    isSelected(from, word) {
      return Utils.containsArray(this.toTokens(word), from);
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
      this.$store.commit("Graph/deleteConnection", {
        ...this.selectedConnection,
        sentenceId: this.sentence.id,
      });
      this.clearFocusedConnection();
      this.$emit("change");
    },
    onMultiSelectChange(obj) {
      const word = this.selectedWord;
      const token = Utils.mkToken({ name: obj.tag });
      this.$store.commit("Graph/addToken", token);
      this.$store.commit("Graph/addTokenToWord", { word, token });
      this.$emit("change");
      this.clearSelection();
    },
  },
};
</script>

<style>
</style>