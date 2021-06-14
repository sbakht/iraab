<template>
  <AddableMultiSelect
    :options="[speech.Ism.Pronoun.PRON, speech.Fil.Verb.V]"
    @change="onChange"
  ></AddableMultiSelect>
  <button @click="submit">Submit</button>
</template>

<script>
import AddableMultiSelect from "./AddableMultiSelect.vue";
import { Speech } from "@/api/PartsOfSpeech.js";

export default {
  components: { AddableMultiSelect },
  data() {
    return {
      val: null,
      speech: Speech,
    };
  },
  methods: {
    onChange(obj) {
      this.val = obj;
    },
    submit() {
      this.$emit("submit", this.val);
    },
  },
};
</script>

<style>
</style>