<template>
  <div>
    <div class="m-16">
      <multi-select></multi-select>
    </div>
    <div class="flex justify-center">
      <TokenView
        :answer="true"
        token="مُساِمونَ"
        :properties="properties"
      ></TokenView>
    </div>
    <div class="flex justify-center">
      <TokenView token="مُساِمونَ" :properties="properties"></TokenView>
    </div>
    <div class="flex justify-center">
      <TokenView :answer="true" token="مُساِمونَ"></TokenView>
    </div>
    <div class="flex justify-center">
      <TokenView token="مُساِمونَ"></TokenView>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import MultiSelect from "./components/MultiSelect.vue";
import TokenView from "./components/TokenView.vue";

export default defineComponent({
  name: "App",
  components: {
    TokenView,
    MultiSelect,
  },
  data() {
    return {
      properties: ["Mubatada", "Rafa", "Proper", "Masculine", "Plural"],
    };
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
