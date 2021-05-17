<template>
  <v-shape
    v-if="ready"
    :config="{
      sceneFunc: mkLine,
      stroke: 'red',
      strokeWidth: 4,
    }"
  />
  <v-circle
    :config="{ ...circle, x: center(), y: 250 }"
    ref="controller"
  ></v-circle>
</template>

<script>
export default {
  props: {
    from: {
      type: String,
      required: true,
    },
    control: {
      type: String,
      required: true,
    },
    to: {
      type: String,
      required: true,
    },
    context: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      ready: false,
      fromObj: null,
      controlObj: null,
      toObj: null,
      circle: {
        radius: 20,
        fill: "red",
        stroke: "black",
        strokeWidth: 4,
        draggable: true,
      },
    };
  },
  mounted() {
    this.ready = true;
    this.fromObj = this.context[this.from].getNode();
    this.controlObj = this.$refs.controller.getNode();
    this.toObj = this.context[this.to].getNode();
  },
  methods: {
    mkLine(ctx, shape) {
      ctx.beginPath();
      ctx.moveTo(this.fromObj.x(), this.fromObj.y());
      ctx.quadraticCurveTo(
        this.controlObj.x(),
        this.controlObj.y(),
        this.toObj.x(),
        this.toObj.y()
      );
      ctx.fillStrokeShape(shape);
    },
    getCenter(obj) {
      const x1 = obj.x();
      const x2 = obj.width();
      return (x1 + x2) / 2;
    },
    center() {
      try {
        const x1 = this.fromObj.x();
        const x2 = this.toObj.x();
        return (x1 + x2) / 2;
      } catch (e) {
        return 0;
      }
    },
  },
};
</script>

<style>
</style>