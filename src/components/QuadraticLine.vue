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
    :config="{ ...circle, x: center(), y: height }"
    ref="controller"
  ></v-circle>
  <!-- <v-text
    :config="{ ...text, text: connection.name, x: center(), y: 250 }"
    ref="controller"
  ></v-text> -->
</template>

<script>
export default {
  props: {
    from: {
      type: Object,
      required: true,
    },
    control: {
      type: String,
      required: true,
    },
    to: {
      type: Object,
      required: true,
    },
    context: {
      type: Object,
      required: true,
    },
    phrase: {
      type: Boolean,
      default: false,
    },
    connection: {
      type: Object,
      required: true,
    },
    height: {
      type: Number,
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
      text: {
        y: 15,
        fontSize: 30,
        fontFamily: "Calibri",
        fill: "green",
      },
    };
  },
  mounted() {
    this.ready = true;
    this.fromObj = this.context[this.from.id].getNode();
    this.controlObj = this.$refs.controller.getNode();
    this.toObj = this.context[this.to.id].getNode();
  },
  methods: {
    mkLine(ctx, shape) {
      ctx.beginPath();
      ctx.moveTo(this.getX(this.fromObj), this.getY(this.fromObj));
      ctx.quadraticCurveTo(
        this.controlObj.x(),
        this.controlObj.y(),
        this.getX(this.toObj),
        this.getY(this.toObj)
      );
      ctx.fillStrokeShape(shape);
    },
    getX(obj) {
      const x1 = obj.x();
      const x2 = obj.width();
      return (x1 * 2 + x2) / 2;
    },
    getY(obj) {
      const x1 = obj.y();
      const x2 = obj.height();
      return x1 + x2;
    },
    center() {
      try {
        let x1;
        let x2;
        if (this.phrase) {
          x1 = this.fromObj.x() + this.fromObj.width() / 2;
        } else {
          x1 = this.fromObj.x() + this.fromObj.width();
        }
        x2 = this.getX(this.toObj);
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