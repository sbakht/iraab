<template>
  <div>
    <SelectableCreate></SelectableCreate>
  </div>
</template>

<script>
import SelectableCreate from "@/components/SelectableCreate.vue";

export default {
  name: "App",
  components: { SelectableCreate },
  mounted() {
    this.$store.dispatch("Graph/fetch");
  },
};
</script>

<style>
</style>
