<template>
  <div>
    <PlayerView></PlayerView>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import PlayerView from "./components/PlayerView.vue";

export default defineComponent({
  name: "App",
  components: {
    PlayerView,
  },
});
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
