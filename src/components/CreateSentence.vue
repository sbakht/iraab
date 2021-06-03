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

function createSentence(str) {
  const tokens = str.split(" ").map((str) => Utils.mkToken({ name: str }));
  const words = tokens.map((token) =>
    Utils.mkWord({ tokens: [token], preferObject: true })
  );
  return Utils.mkSentence({ words, preferObject: true });
}

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
      const sentence = createSentence(this.input);
      this.$store.dispatch("Graph/addSentence", sentence).then(() => {
        this.$store.dispatch("Graph/setActiveSentence", sentence.id);
      });
    },
  },
};
</script>

<style>
</style>