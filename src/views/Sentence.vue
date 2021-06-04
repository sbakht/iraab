<template>
  <SentenceFull
    :sentence="findSentence('sentence-' + $route.params.id)"
  ></SentenceFull>
</template>

<script>
import { mapGetters } from "vuex";
import SentenceFull from "@/components/search/SentenceFull.vue";

export default {
  components: { SentenceFull },
  mounted() {
    this.$store.dispatch("Graph/fetch");
  },
  computed: {
    ...mapGetters("Graph", {
      findSentence: "findSentence",
    }),
  },
};
</script>

<style>
</style>
