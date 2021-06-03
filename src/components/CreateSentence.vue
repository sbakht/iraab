<template>
  <div class="flex flex-col items-center">
    <input class="border bg-white p-6 max-w-4xl" type="text" v-model="input" />
    <button @click="create">Create</button>
  </div>

  <div v-for="word in words" :key="word.id">
    <div v-if="word.token">
      {{ word.token.name }}
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Utils from "../utils/Utils";

export default {
  data() {
    return {
      input: "",
    };
  },
  computed: {
    ...mapGetters("Graph", {
      words: "activeWords",
    }),
  },
  methods: {
    create() {
      const tokens = this.input
        .split(" ")
        .map((str) => Utils.mkToken({ name: str }));
      const words = tokens.map((token) =>
        Utils.mkWord({ tokens: [token], preferObject: true })
      );
      const sentence = Utils.mkSentence({ words, preferObject: true });
      this.$store.dispatch("Graph/addSentence", sentence).then((sentence) => {
        this.$store.dispatch("Graph/setActiveSentence", sentence.id);
      });
    },
  },
};
</script>

<style>
</style>