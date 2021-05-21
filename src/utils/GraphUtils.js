var graphlib = require("graphlib");
import { v4 as uuidv4 } from 'uuid';

function rangeToWords({ range }) {
  const tokens = this.words;
  const from = range.from;
  const to = range.to; //?
  const result = []
  const words = [] //?
  let started = false;

  function go(token) {
    let added = false;
    if (token.id === from) {
      started = true;
    }
    if (started) {
      result.push(token);
      added = true;
    }
    if (token.id === to) {
      return { done: true, added };
    }
    return { done: false, added };
  }

  for (let obj of tokens) {
    if (obj.token) {
      const x = go(obj.token);
      if (x.added) {
        words.push(obj)
        if (x.done) {
          return words;
        }
      }
    }
    if (obj.tokens) {
      for (let token of obj.tokens) {
        const x = go(token);
        if (x.added) {
          words.push(obj)
          if (x.done) {
            return words;
          }
          break;
        }
      }
    }
  }
  return words;
}
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
    return token.toWord();
  })
}

function words() {

}

function makeWord(tokens, label) {
  const id = uuidv4();
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
    obj.tokens = tokens.map(token => ({ ...token, id: token.id || 'token-' + uuidv4() }));
    if (!obj.id) {
      obj.id = 'word-' + uuidv4
    }
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
    obj.token.id = 'token-' + id
    obj.id = 'word-' + id
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
  this.createTokenNodes();
}

function makePhrase(phrase) {
  return { ...phrase, id: phrase.id || 'phrase-' + uuidv4() }
}

function addPhrases(phrases) {
  this.phrases = this.phrases.concat(phrases);
  this.createPhraseNodes();
}

function createPhraseNodes() {
  const phrases = this.phrases;
  phrases.forEach(phrase => {
    this.graph.setNode(phrase.id, phrase)
  });
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

function createTokenNodes() {
  const tokens = this.getTokenObjects();
  tokens.forEach(token => {
    this.graph.setNode(token.id, token);
  })
}

function createGrammarLink(o1, o2, grammar) {
  const id1 = o1.id || o1
  const id2 = o2.id || o2
  this.graph.setEdge(id1, id2, grammar);
}

function setGraph(graph) {
  if (graph instanceof graphlib.Graph) {
    this.graph = graph;
  } else {
    this.graph = graphlib.json.read(graph);
  }
}

export function createGraph(seed, words = [], phrases = []) {
  let graph;
  if (seed) {
    graph = graphlib.json.read(seed);
  } else {
    graph = new graphlib.Graph()
  }
  const obj = Object.assign(Object.create(GraphUtils), { graph, tokens: [], words: [], phrases: [] });
  obj.addWords(words);
  obj.addPhrases(phrases);
  return obj;
}

export function loadGraph(data) {
  const obj = Object.assign(Object.create(GraphUtils), { graph: new graphlib.Graph(), tokens: [], words: [], phrases: [] });

  const words = data.words.allIds.map(id => {
    const word = data.words.byId[id];
    if (word.token) {
      const token = data.tokens.byId[word.token];
      return { ...word, label: word.label || token.name, token }
    }
    if (word.tokens) {
      const tokens = word.tokens.map(token => data.tokens.byId[token]);
      return { ...word, tokens }
    }
  })
  obj.addWords(words);
  obj.addPhrases(data.phrases.allIds.map(id => data.phrases.byId[id]))

  const connections = data.connections.allIds.map(id => data.connections.byId[id]);
  connections.map(({ from, to, grammar }) => {
    obj.createGrammarLink(from, to, grammar)
  })

  return obj;
}

export function wordsToTokens(words) {
  return words.map(word => {
    if (word.token) {
      return word.token;
    }
    if (word.tokens) {
      return word.tokens;
    }
  }).flat()
}

export function isSubset(outer, inner, { param, strict }) {
  if (!param) {
    const isSubset = inner.filter(innerVal => outer.some(outerVal => outerVal === innerVal)).length === inner.length
    if (strict) {
      return isSubset && inner.length < outer.length
    }
    return isSubset
  }
  const isSubset = inner.filter(innerVal => outer.some(outerVal => outerVal[param] === innerVal[param])).length === inner.length
  if (strict) {
    return isSubset && inner.length < outer.length
  }
  return isSubset
}

function getLevel(data) {
  const self = this;
  function containedWordsInPhrase(phrase) {
    return self.rangeToWords(phrase)
  }

  function isPhraseContainedInOtherPhrase(outer, inner) {
    const outerTokens = wordsToTokens(containedWordsInPhrase(outer))
    const innerTokens = wordsToTokens(containedWordsInPhrase(inner))

    return innerTokens.filter(token => outerTokens.some(o => o.id === token.id)).length === innerTokens.length && innerTokens.length < outerTokens.length
  }

  if (data.grammar) {
    const connection = data;
    const containedPhrases = this.phrases.filter(inner => isPhraseContainedInOtherPhrase({ ...connection, range: { from: connection.from, to: connection.to } }, inner))
    if (!containedPhrases.length) {
      return 1;
    }

    // const internals = 
    return 1 + Math.max(...containedPhrases.map(getLevel.bind(this)));
  } else {
    const phrase = data;
    const containedPhrases = this.phrases.filter(inner => isPhraseContainedInOtherPhrase(phrase, inner))
    if (!containedPhrases.length) {
      return 1;
    }

    // const internals = 
    return 1 + Math.max(...containedPhrases.map(getLevel.bind(this)));
  }
}

export function fromGraph(graph) {
  return graphlib.json.write(graph)
}

const GraphUtils = {
  wordsToString,
  rangeToTokens,
  rangeToWords,
  makeWord,
  toHead,
  getTokens,
  getPhrases,
  getTokenObjects,
  addWords,
  setGraph,
  words,
  createTokenNodes,
  addPhrases,
  createPhraseNodes,
  makePhrase,
  createGrammarLink,
  getLevel,
};

export default GraphUtils;