<template>
  <v-stage :config="configKonva">
    <v-layer>
      <v-circle :config="configCircle" ref="start"></v-circle>
      <v-circle :config="configCircle2" ref="control"></v-circle>
      <v-circle :config="configCircle3" ref="end"></v-circle>
      <QuadraticLine
        v-if="mounted"
        :from="quad.start"
        :control="quad.control"
        :to="quad.end"
      ></QuadraticLine>
    </v-layer>
  </v-stage>
</template>

<script>
import QuadraticLine from "./QuadraticLine";
const width = window.innerWidth;
const height = window.innerHeight;

export default {
  components: { QuadraticLine },
  data() {
    const circle = {
      radius: 70,
      fill: "red",
      stroke: "black",
      strokeWidth: 4,
      draggable: true,
    };
    return {
      quad: {},
      mounted: false,
      configKonva: {
        width: width,
        height: height,
      },
      configCircle: {
        ...circle,
        x: 100,
        y: 100,
      },
      configCircle2: {
        ...circle,
        x: 300,
        y: 150,
      },
      configCircle3: {
        ...circle,
        x: 100,
        y: 300,
      },
    };
  },
  mounted() {
    this.quad.start = this.$refs.start.getNode();
    this.quad.control = this.$refs.control.getNode();
    this.quad.end = this.$refs.end.getNode();
    this.mounted = true;
  },
  methods: {},
};
</script>

<style scoped>
* {
  background: lightblue;
}
</style>