<template>
  <div class="flex flex-col items-center">
    <input class="border bg-white p-6 max-w-4xl" type="text" v-model="input" />
    <button @click="create">Create</button>
  </div>

  <apply-grammar
    v-if="sentence"
    :sentence="sentence"
    @change="getSentence"
  ></apply-grammar>
</template>

<script>
import { mapGetters } from "vuex";
import Utils from "../utils/Utils";
import ApplyGrammar from "@/components/ApplyGrammar.vue";

function createSentence(str) {
  const tokens = str.split(" ").map((str) => Utils.mkToken({ name: str }));
  const words = tokens.map((token) =>
    Utils.mkWord({ tokens: [token], preferObject: true })
  );
  return Utils.mkSentence({ words, preferObject: true });
}

export default {
  components: { ApplyGrammar },
  data() {
    return {
      input: "",
      sentence: null,
      id: null,
    };
  },
  computed: {
    ...mapGetters("Graph", {
      findSentence: "findSentence",
    }),
  },
  methods: {
    create() {
      const sentence = createSentence(this.input);
      this.id = sentence.id;
      this.$store.dispatch("Graph/addSentence", sentence).then(() => {
        this.sentence = this.findSentence(sentence.id);
      });
    },
    getSentence() {
      this.sentence = this.findSentence(this.id);
    },
  },
};
</script>

<style>
</style>