<template>
  <apply-grammar :sentence="sentence"></apply-grammar>
</template>

<script>
import { mapGetters } from "vuex";
import ApplyGrammar from "@/components/ApplyGrammar.vue";

export default {
  components: { ApplyGrammar },
  data() {
    return {};
  },
  computed: {
    ...mapGetters("Graph", {
      sentence: "activeSentence",
    }),
  },
  methods: {},
};
</script>

<style>
</style>