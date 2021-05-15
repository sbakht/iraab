var graphlib = require("graphlib");

function rangeToTokens({ range }) {
  const tokens = this.words;
  const from = range.from;
  const to = range.to;
  const result = []
  let started = false;

  function go(token) {
    if (token.name === from) {
      started = true;
    }
    if (started) {
      result.push(token);
    }
    if (token.name === to) {
      return true;
    }
    return false;
  }

  for (let obj of tokens) {
    if (obj.token) {
      go(obj.token);
    }
    if (obj.tokens) {
      for (let token of obj.tokens) {
        const x = go(token);
        if (x) {
          return result;
        }
      }
    }
  }

  return result;
}

function wordsToString() {
  return this.words.map(token => {
    return token.toWord(); //?
  })
}

function words() {

}

function makeWord(tokens, label) {
  function makeMultiWords(label, tokens) {
    const proto = {
      toWord() {
        return this.tokens.map(token => {
          return token.name;
        }).join('-');
      }
    }
    const obj = Object.create(proto);
    obj.label = label;
    obj.tokens = tokens;
    return obj
  }

  function makeSingleWord(token) {
    const proto = {
      toWord() {
        return this.token.name;
      }
    }
    const obj = Object.create(proto);
    obj.label = token.name;
    obj.token = token;
    return obj
  }

  if (tokens instanceof Array && tokens.length > 1) {
    return makeMultiWords(label, tokens);
  }
  if (tokens instanceof Array) {
    return makeSingleWord(tokens[0]);
  }
  return makeSingleWord(tokens);
}

function toHead(node) {
  const self = this;
  function getHead(node) {
    const edge = self.graph.outEdges(node)[0]
    if (edge) {
      return edge.w
    }
    return null;
  }
  const head = getHead(node);
  if (head) {
    return {
      head,
      connection: this.graph.edge(this.graph.outEdges(node)[0])
    }
  }
  return null
}

function getTokens() {
  return this.graph.nodes().filter(str => str.includes('token'))
}

function getPhrases() {
  return this.graph.nodes().filter(str => str.includes('phrase'))
}

function addWords(words) {
  this.words = this.words.concat(words);
}

function getTokenObjects() {
  let tokens = [];
  this.words.map(word => {
    if (word.token) {
      tokens.push(word.token)
    }
    if (word.tokens) {
      tokens = tokens.concat(word.tokens)
    }
  })
  return tokens;
}

function setGraph(graph) {
  if (graph instanceof graphlib.Graph) {
    this.graph = graph;
  } else {
    this.graph = graphlib.json.read(graph);
  }
}

export function createGraph(seed, words = []) {
  let graph;
  if (seed) {
    graph = graphlib.json.read(seed);
  } else {
    graph = new graphlib.Graph()
  }
  const obj = Object.assign(Object.create(GraphUtils), { graph, tokens: [], words: [] });
  obj.addWords(words);
  return obj;
}

export function fromGraph(graph) {
  return graphlib.json.write(graph)
}

const GraphUtils = {
  wordsToString,
  rangeToTokens,
  makeWord,
  toHead,
  getTokens,
  getPhrases,
  getTokenObjects,
  addWords,
  setGraph,
  words,
};

export default GraphUtils;