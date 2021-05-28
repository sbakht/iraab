<template>
  <div v-for="type in connections.map" :key="type.id">
    <button data-testid="select-kabr" @click="setConnectionType(type)">
      {{ type.name }}
    </button>
  </div>
</template>

<script>
export default {
  props: {
    connections: {
      type: Object,
      required: true,
    },
  },
  methods: {
    setConnectionType(type) {
      this.$emit("select", type);
    },
  },
};
</script>

<style>
</style>