<template>
  <div class="border-b pb-10">
    <div class="flex items-center">
      <BasicMultiSelect
        class="flex-grow"
        :options="allPartsOfSpeech"
        @change="(vals) => (pos = vals)"
        label="Parts of Speech"
        itemLabel="description"
        trackBy="tag"
      ></BasicMultiSelect>
      <div class="mt-5 ml-3">
        <toggle-view
          label="Exact"
          :val="allPos"
          @change="allPos = !allPos"
        ></toggle-view>
      </div>
    </div>
    <div class="flex items-center mt-4">
      <BasicMultiSelect
        class="flex-grow"
        :options="connections"
        @change="(vals) => (grammar = vals)"
        placeholder="Select grammar"
        label="Grammar"
        itemLabel="name"
        trackBy="name"
      ></BasicMultiSelect>
      <div class="mt-5 ml-3">
        <toggle-view
          label="Exact"
          :val="allGrammar"
          @change="allGrammar = !allGrammar"
        ></toggle-view>
      </div>
    </div>
  </div>

  <div class="mt-5" v-for="sentence in sentences" :key="sentence.id">
    <router-link :to="`/sentence/${sentence.id.split('-').slice(1).join('-')}`">
      <SentenceFull :sentence="sentence" class=""></SentenceFull>
    </router-link>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Utils from "@/utils/Utils";
import SentenceFull from "@/components/search/SentencePreview.vue";
import ToggleView from "@/components/common/ToggleView";
import BasicMultiSelect from "@/components/common/BasicMultiSelect";
import { connectionTypes } from "@/data/data.js";
import { speechArray } from "@/api/PartsOfSpeech.js";

function hasPos(words, pos) {
  return Utils.wordsToTokens(words).some((token) => token.pos.tag === pos.tag);
}
function hasGrammar(connections, con) {
  console.log(connections, con);
  return connections.some((connection) => connection.grammar.id === con.id);
}
export default {
  components: { SentenceFull, ToggleView, BasicMultiSelect },
  data() {
    return {
      pos: [],
      grammar: [],
      allPos: true,
      allGrammar: true,
    };
  },
  mounted() {
    this.$store.dispatch("Graph/fetch");
  },
  computed: {
    ...mapGetters("Graph", {
      allSetences: "sentences",
    }),
    connections() {
      return connectionTypes.all;
    },
    allPartsOfSpeech() {
      return speechArray;
    },
    sentences() {
      return this.allSetences.filter(
        (sentence) =>
          this.filterPos(sentence.words, this.allPos) &&
          this.filterGrammar(sentence.connections, this.allGrammar)
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
        this.grammar[type]((connection) => hasGrammar(connections, connection))
      );
    },
  },
};
</script>

<style>
</style>
