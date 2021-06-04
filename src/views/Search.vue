<template>
  <div v-for="sentence in sentences" :key="sentence.id">
    <router-link :to="`/sentence/${sentence.id}`">
      <SentenceFull :sentence="sentence" class=""></SentenceFull>
    </router-link>
    <router-link :to="`/sentence/${sentence.id}`">
      <SentenceFull :sentence="sentence" class=""></SentenceFull>
    </router-link>
    <router-link :to="`/sentence/${sentence.id}`">
      <SentenceFull :sentence="sentence" class=""></SentenceFull>
    </router-link>
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
