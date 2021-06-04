<template>
  <div v-for="sentence in sentences" :key="sentence.id">
    <SentenceFull :sentence="sentence"></SentenceFull>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import SentenceFull from "@/components/search/SentencePreview.vue";

export default {
  components: { SentenceFull },
  mounted() {
    this.$store.dispatch("Graph/fetch");
  },
  computed: {
    ...mapGetters("Graph", {
      sentences: "sentences",
    }),
  },
};
</script>

<style>
</style>
