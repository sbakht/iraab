<template>
  <div @click="addNode">
    <div class="p-4">
      <div v-for="word in words" :key="word.label">
        <template v-if="word.token">
          {{ word.label }} - {{ word.token && word.token.pos.tag }}
        </template>
        <template v-if="word.tokens">
          {{ word.label }}
          <span v-for="token in word.tokens" :key="token.name">
            {{ token.pos.tag }}
          </span>
        </template>
      </div>
    </div>

    <div class="p-4">
      <div v-for="phrase in phrases" :key="phrase.id">
        {{ Graph.rangeToTokens(phrase).map((token) => token.name) }} is a
        {{ phrase.phrase.tag }} that is
        {{ Graph.toHead(phrase.id).connection.name }} to
        {{ getToken(Graph.toHead(phrase.id).head).name }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapGetters } from "vuex";

export default defineComponent({
  name: "App",
  components: {},
  mounted() {
    this.$store.dispatch("fetch");
  },
  computed: {
    ...mapGetters({ Graph: "graph" }),
    tokens() {
      return this.Graph.getTokens();
    },
    words() {
      return this.Graph.words;
    },
    phrases() {
      return this.Graph.getPhrases().map((id) => this.Graph.graph.node(id));
    },
  },
  methods: {
    getToken(id) {
      return this.Graph.graph.node(id);
    },
    addNode() {
      this.$store.dispatch("addNode", Math.random());
    },
  },
});
</script>

<style>
#app {
  margin: 0 auto;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
}

@font-face {
  font-family: "uthmani-hafs";
  src: url("./assets/Uthmani-Hafs.woff2") format("woff2"),
    url("./assets/Uthmani-Hafs.woff") format("woff");
}

.arabic {
  font-family: "uthmani-hafs";
}
</style>
