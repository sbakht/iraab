<template>
  <div @click="addNode">
    <div class="p-4">
      <div v-for="word in words" :key="word.label">
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

export default {
  name: "App",
  components: {},
  mounted() {
    this.$store.dispatch("fetch");
  },
  computed: {
    ...mapGetters({ Graph: "graph" }),
    tokens() {
      return this.Graph.getTokens().map((id) => this.Graph.graph.node(id));
    },
    words() {
      return this.Graph.words;
    },
    phrases() {
      return this.Graph.getPhrases().map((id) => this.Graph.graph.node(id));
    },
  },
  methods: {
    head(id) {
      return this.Graph.toHead(id);
    },
    getToken(id) {
      return this.Graph.graph.node(id);
    },
    addNode() {
      this.$store.dispatch("addNode", Math.random());
    },
  },
};
</script>

<style>
</style>
