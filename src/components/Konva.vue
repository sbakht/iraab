<template>
  <v-stage :config="configKonva">
    <v-layer>
      <v-circle :config="configCircle"></v-circle>
    </v-layer>
  </v-stage>
</template>

<script>
export default {
  data() {
    return {
      configKonva: {
        width: 1800,
        height: 1000,
      },
      configCircle: {
        x: 100,
        y: 100,
        radius: 70,
        fill: "red",
        stroke: "black",
        strokeWidth: 4,
        draggable: true,
      },
    };
  },
  mounted() {
    // const stage = this.$refs.stage.getNode();
    // const layer = this.$refs.layer.getNode();
    // const rect = this.$refs.rect.getNode();
  },
};
</script>

<style scoped>
* {
  background: lightblue;
}
</style>