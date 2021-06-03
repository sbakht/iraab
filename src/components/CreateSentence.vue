<template>
  <div class="flex flex-col items-center">
    <input class="border bg-white p-6 max-w-4xl" type="text" v-model="input" />
    <button @click="create">Create</button>
  </div>
</template>

<script>
import Utils from "../utils/Utils";
export default {
  data() {
    return {
      input: "",
    };
  },
  methods: {
    create() {
      const tokens = this.input
        .split(" ")
        .map((str) => Utils.toToken({ name: str }));
      const words = tokens.map((token) =>
        Utils.toWord({ tokens: [token], preferObject: true })
      );
      const sentence = Utils.toSentence({ words, preferObject: true });
      this.$store.dispatch("Graph/addSentence", sentence).then((sentence) => {
        this.$store.dispatch("Graph/setActiveSentence", sentence.id);
      });
    },
  },
};
</script>

<style>
</style>