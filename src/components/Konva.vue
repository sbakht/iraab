<template>
  <v-stage :config="configKonva">
    <v-layer>
      <v-circle :config="configCircle" ref="start"></v-circle>
      <v-circle :config="configCircle2" ref="control"></v-circle>
      <v-circle :config="configCircle3" ref="end"></v-circle>
      <v-shape
        :config="{
          sceneFunc: mkLine,
          stroke: 'red',
          strokeWidth: 4,
        }"
      />
    </v-layer>
  </v-stage>
</template>

<script>
const width = window.innerWidth;
const height = window.innerHeight;
export default {
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
    // const stage = this.$refs.stage.getNode();
    // const layer = this.$refs.layer.getNode();
    // const rect = this.$refs.rect.getNode();
    console.log(this.quad);
    this.quad.start = this.$refs.start.getNode();
    this.quad.control = this.$refs.control.getNode();
    this.quad.end = this.$refs.end.getNode();
  },
  methods: {
    mkLine(ctx, shape) {
      const quad = this.quad;
      if (this.quad.start) {
        ctx.beginPath();
        ctx.moveTo(quad.start.x(), quad.start.y());
        ctx.quadraticCurveTo(
          quad.control.x(),
          quad.control.y(),
          quad.end.x(),
          quad.end.y()
        );
        ctx.fillStrokeShape(shape);
      }
    },
  },
};
</script>

<style scoped>
* {
  background: lightblue;
}
</style>