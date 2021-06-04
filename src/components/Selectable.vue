<template>
  <div>
    <SelectBox
      :items="sentenceIds"
      :selected="2"
      @change="selectSentence"
    ></SelectBox>
    <SentenceFull :sentence="sentence"></SentenceFull>
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
      sentence: "activeSentence",
    }),
    sentenceIds() {
      return this.$store.state.Graph.sentences.allIds;
    },
  },
  methods: {
    selectSentence(sentenceId) {
      this.$store.dispatch("Graph/setActiveSentence", sentenceId);
    },
  },
};
</script>

<style>
</style>
