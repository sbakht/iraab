var graphlib = require("graphlib");

function rangeToTokens(tokens, { range }) {
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

function tokensToString(tokens) {
  return tokens.map(token => {
    return token.toWord();
  })
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

export function createGraph() {
  return Object.assign(Object.create(GraphUtils), { graph: new graphlib.Graph() })
}

const GraphUtils = {
  tokensToString,
  rangeToTokens,
  makeWord,
  toHead,
  getTokens,
  getPhrases,
};

export default GraphUtils;