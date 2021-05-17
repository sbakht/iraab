<template>
  <div>
    <div class="p-4">
      <div v-for="word in words" :key="word.label">
        <template v-if="word.token">
          {{ word.label }} - {{ word.token && word.token.pos.tag }}
        </template>
        <template v-if="word.tokens">
          {{ word.label }} -
          <span>
            {{ word.tokens.map((token) => token.pos.tag).join(", ") }}
          </span>
        </template>
      </div>
    </div>

    <div class="p-4">
      <div v-for="token in tokens" :key="token.id">
        <span v-if="head(token.id)">
          {{ token.name }} is {{ Graph.toHead(token.id).connection.name }} to
          {{ getToken(Graph.toHead(token.id).head).name }}
        </span>
      </div>
      <div v-for="phrase in phrases" :key="phrase.id">
        {{ phrase.phrase }}
        "{{
          Graph.rangeToWords(phrase)
            .map((token) => token.label)
            .join(" ")
        }}" is a {{ phrase.phrase.tag }} that is
        {{ Graph.toHead(phrase.id).connection.name }} to
        {{ getToken(Graph.toHead(phrase.id).head).name }}
      </div>
    </div>
    <v-stage :config="configKonva">
      <v-layer>
        <v-circle :config="configCircle" ref="start"></v-circle>
        <v-circle :config="configCircle2" ref="control"></v-circle>
        <v-circle :config="configCircle3" ref="end"></v-circle>
        <div v-for="(token, i) in tokens" :key="token.id">
          <v-text
            :config="{ ...text, x: i * 300 + 150, text: token.name }"
            :ref="token.id"
          ></v-text>
          <QuadraticLine
            v-if="mounted && head(token.id)"
            :context="$refs"
            :from="token.id"
            control="control"
            :to="getToken(Graph.toHead(token.id).head).id"
          ></QuadraticLine>
        </div>
        <template v-if="mounted">
          <div v-for="(phrase, i) in phrases" :key="phrase.id">
            <v-line
              :config="{
                ...line,
                x: $refs[phrase.range.from].getNode().x(),
                y: i * 150,
                points: [0, 0, $refs[phrase.range.to].getNode().x(), 0],
              }"
              :ref="phrase.id"
            ></v-line>
            <QuadraticLine
              :context="$refs"
              :from="phrase.id"
              control="control"
              :to="getToken(Graph.toHead(phrase.id).head).id"
            ></QuadraticLine>
            <!-- {{ phrase.phrase }}
          "{{
            Graph.rangeToWords(phrase)
              .map((token) => token.label)
              .join(" ")
          }}" is a {{ phrase.phrase.tag }} that is
          {{ Graph.toHead(phrase.id).connection.name }} to
          {{ getToken(Graph.toHead(phrase.id).head).name }} -->
          </div>
        </template>
      </v-layer>
    </v-stage>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import QuadraticLine from "./QuadraticLine";
const width = window.innerWidth;
const height = window.innerHeight;

export default {
  name: "App",
  components: { QuadraticLine },
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
      mounted: false,
      configKonva: {
        width: width,
        height: height,
      },
      line: {
        stroke: "red",
        strokeWidth: 15,
        lineCap: "round",
        lineJoin: "round",
      },
      text: {
        x: width / 2,
        y: 15,
        text: "Simple Text",
        fontSize: 30,
        fontFamily: "Calibri",
        fill: "green",
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
    this.$store.dispatch("Graph/fetch").then(() => {
      this.$nextTick(function () {
        this.mounted = true;
      });
    });
  },
  computed: {
    ...mapGetters("Graph", { Graph: "graph" }),
    tokens() {
      return this.Graph.getTokens().map((id) => this.Graph.graph.node(id));
    },
    words() {
      return this.Graph.words;
    },
    phrases() {
      return this.Graph.getPhrases().map((id) => this.Graph.graph.node(id));
    },
  },
  methods: {
    head(id) {
      return this.Graph.toHead(id);
    },
    getToken(id) {
      return this.Graph.graph.node(id);
    },
    addNode() {
      console.log("add");
      this.$store.dispatch("Graph/addNode", Math.random());
    },
  },
};
</script>

<style>
</style>
