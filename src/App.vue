<template>
  <div>
    <Graph></Graph>
    <!-- <Konva></Konva> -->
  </div>
</template>

<script lang="ts">
import Graph from "./components/Graph.vue";

export default {
  name: "App",
  components: { Graph },
  mounted() {
    this.$store.dispatch("fetch");
  },
};
</script>

<style>
#app {
  margin: 0 auto;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
}

@font-face {
  font-family: "uthmani-hafs";
  src: url("./assets/Uthmani-Hafs.woff2") format("woff2"),
    url("./assets/Uthmani-Hafs.woff") format("woff");
}

.arabic {
  font-family: "uthmani-hafs";
}
</style>
