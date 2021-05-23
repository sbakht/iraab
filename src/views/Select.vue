<template>
  <div>
    <Selectable></Selectable>
  </div>
</template>

<script>
import Selectable from "@/components/Selectable.vue";

export default {
  name: "App",
  components: { Selectable },
  mounted() {
    this.$store.dispatch("Graph/fetch");
  },
};
</script>

<style>
</style>
