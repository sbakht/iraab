<template>
  <div v-for="sentence in sentences" :key="sentence.id">
    <router-link :to="`/sentence/${sentence.id.split('-')[1]}`">
      <SentenceFull :sentence="sentence" class=""></SentenceFull>
    </router-link>
    <router-link :to="`/sentence/${sentence.id.split('-')[1]}`">
      <SentenceFull :sentence="sentence" class=""></SentenceFull>
    </router-link>
    <router-link :to="`/sentence/${sentence.id.split('-')[1]}`">
      <SentenceFull :sentence="sentence" class=""></SentenceFull>
    </router-link>
    <router-link :to="`/sentence/${sentence.id.split('-')[1]}`">
      <SentenceFull :sentence="sentence" class=""></SentenceFull>
    </router-link>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Utils from "@/utils/Utils";
import SentenceFull from "@/components/search/SentencePreview.vue";

function hasPos(words, tag) {
  return Utils.wordsToTokens(words).some((token) => token.pos.tag === tag);
}
function hasGrammar(connections, name) {
  return connections.some((connection) => connection.grammar.name === name);
}
export default {
  components: { SentenceFull },
  data() {
    return {
      pos: ["PRONS", "V", "PP"],
      grammar: ["Kabr"],
    };
  },
  mounted() {
    this.$store.dispatch("Graph/fetch");
  },
  computed: {
    ...mapGetters("Graph", {
      allSetences: "sentences",
    }),
    sentences() {
      return this.allSetences.filter(
        (sentence) =>
          this.filterPos(sentence.words, false) &&
          this.filterGrammar(sentence.connections, false)
      );
    },
  },
  methods: {
    filterPos(words, isAnd) {
      const type = isAnd ? "every" : "some";
      return !this.pos.length || this.pos[type]((tag) => hasPos(words, tag));
    },
    filterGrammar(connections, isAnd) {
      const type = isAnd ? "every" : "some";
      return (
        !this.grammar.length ||
        this.grammar[type]((name) => hasGrammar(connections, name))
      );
    },
  },
};
</script>

<style>
</style>
