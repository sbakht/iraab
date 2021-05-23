<template>
  <div>
    <Graph></Graph>
  </div>
</template>

<script>
import Graph from "@/components/Graph.vue";

export default {
  name: "App",
  components: { Graph },
  mounted() {
    this.$store.dispatch("Graph/fetch");
  },
};
</script>

<style>
</style>
