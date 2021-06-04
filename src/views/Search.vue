<template>
  <div>
    <SentenceFull :words="words" :connections="connections"></SentenceFull>
  </div>
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
      words: "words",
      connections: "connections",
    }),
  },
};
</script>

<style>
</style>
