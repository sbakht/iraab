<template>
  <div>
    <Selectable></Selectable>
    <SelectableCreate></SelectableCreate>
  </div>
</template>

<script>
import Selectable from "@/components/Selectable.vue";
import SelectableCreate from "@/components/SelectableCreate.vue";

export default {
  name: "App",
  components: { Selectable, SelectableCreate },
  mounted() {
    this.$store.dispatch("Graph/fetch");
  },
};
</script>

<style>
</style>
