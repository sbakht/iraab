<template>
  <div>
    <SelectBox
      :items="sentenceIds"
      :selected="2"
      @change="selectSentence"
    ></SelectBox>
    <SentenceFull :words="words" :connections="connections"></SentenceFull>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import SelectBox from "@/components/common/SelectBox";
import SentenceFull from "@/components/search/SentenceFull";

export default {
  components: { SelectBox, SentenceFull },
  computed: {
    ...mapGetters("Graph", {
      words: "words",
      connections: "connections",
    }),
    sentenceIds() {
      return this.$store.state.Graph.sentences.allIds;
    },
  },
};
</script>

<style>
</style>
