<template>
  <v-shape
    :config="{
      sceneFunc: mkLine,
      stroke: 'red',
      strokeWidth: 4,
    }"
  />
</template>

<script>
export default {
  props: {
    from: {
      type: Object,
      required: true,
    },
    control: {
      type: Object,
      required: true,
    },
    to: {
      type: Object,
      required: true,
    },
  },
  methods: {
    mkLine(ctx, shape) {
      ctx.beginPath();
      ctx.moveTo(this.from.x(), this.from.y());
      ctx.quadraticCurveTo(
        this.control.x(),
        this.control.y(),
        this.to.x(),
        this.to.y()
      );
      ctx.fillStrokeShape(shape);
    },
  },
};
</script>

<style>
</style>