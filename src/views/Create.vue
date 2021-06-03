<template>
  <div>
    <CreateSentence></CreateSentence>
  </div>
</template>

<script>
import CreateSentence from "@/components/CreateSentence.vue";

export default {
  name: "App",
  components: { CreateSentence },
  mounted() {
    this.$store.dispatch("Graph/fetch");
  },
};
</script>

<style>
</style>
