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
        <div v-for="(token, i) in tokens" :key="token.id">
          <!-- <v-text
            :config="{ ...text, x: i * 300 + 150, text: token.name }"
            :ref="token.id"
          ></v-text> -->
          <v-rect
            :config="{
              ...text,
              x: i * 300 + 150,
              width: 100,
              height: 50,
              fill: 'green',
              stroke: 'black',
              strokeWidth: 4,
              meme: i,
            }"
            :ref="token.id"
          ></v-rect>
          <!-- <QuadraticLine
            v-if="mounted && head(token.id)"
            :context="$refs"
            :from="token.id"
            control="control"
            :connection="Graph.toHead(token.id).connection"
            :to="getToken(Graph.toHead(token.id).head).id"
            :height="250"
          ></QuadraticLine> -->
        </div>
        <template v-if="mounted">
          <div v-for="phrase in phrases" :key="phrase.id">
            <v-line
              :config="{
                ...phraseLine,
                x: $refs[phrase.range.from].getNode().x(),
                y: 250 * Graph.getLevel(phrase),
                points: [
                  0,
                  0,
                  $refs[phrase.range.to].getNode().x() +
                    $refs[phrase.range.to].getNode().width() -
                    $refs[phrase.range.from].getNode().x(),
                  0,
                ],
              }"
              :ref="phrase.id"
            ></v-line>
          </div>
          <div v-for="connection in connections" :key="connection.id">
            <QuadraticLine
              v-if="mounted && isPhraseConnection(connection)"
              :context="$refs"
              :from="connection.from"
              :phrase="true"
              control="control"
              :connection="connection"
              :to="connection.to"
              :height="250 * Graph.getLevel(connection.from) + 100"
            ></QuadraticLine>
            <QuadraticLine
              v-if="mounted && !isPhraseConnection(connection)"
              :context="$refs"
              :from="connection.from"
              :phrase="false"
              control="control"
              :connection="connection"
              :to="connection.to"
              :height="250 * Graph.getLevel(connection)"
            ></QuadraticLine>
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
      phraseLine: {
        stroke: "#548DD4",
        strokeWidth: 2,
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
    ...mapGetters("Graph", {
      Graph: "graph",
      connections: "connections",
    }),
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
    test(token) {
      const connection = this.Graph.toHead(token.id).connection;
      return this.Graph.getLevel(connection);
    },
    isPhraseConnection(connection) {
      return connection.from.id.includes("phrase");
    },
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
