import { v4 as uuidv4 } from 'uuid';
import { Speech } from '../api/PartsOfSpeech'
import { filterItems } from './Array';
// Arabic = Phrase | Word | Token

function mkID(prefix) {
  return prefix + '-' + uuidv4();
}

const is = {
  // Arabic -> Bool
  isConnection(obj) {
    return obj.id.includes("connection");
  },
  // Arabic -> Bool
  isPhrase(obj) {
    return obj.id.includes("phrase");
  },
  // Arabic -> Bool
  isToken(obj) {
    return obj.id.includes("token");
  },
  // Arabic -> Bool
  isWord(obj) {
    return obj.id.includes("word");
  },
}

const mk = {
  mkToken({ name, pos }) {
    return {
      id: mkID('token'),
      name,
      pos: pos || Speech.Empty,
    }
  },
  mkWord({ tokens, label, preferObject = true }) {
    const word = {
      id: mkID('word'),
    }

    if (label) {
      word.label = label;
    }

    if (tokens.length === 0) {
      throw new Error('empty tokens')
    }

    if (tokens.length === 1) {
      const token = tokens[0];
      word.label = token.name;
      if (preferObject) {
        word.token = token;
      } else {
        word.token = token.id || token;
      }
    }

    if (tokens.length > 1) {
      if (preferObject) {
        word.tokens = [...tokens];
      } else {
        word.tokens = tokens.map(token => token.id || token);
      }
    }

    return word;
  },
  mkPhrase({ phrase, from, to, preferObject = true }) {
    const obj = {
      id: mkID('phrase'),
      phrase,
    };

    if (preferObject) {
      obj.range = {
        from,
        to
      }
    } else {
      obj.range = {
        from: from.id || from,
        to: to.id || to,
      }
    }

    return obj;
  },
  mkConnection({ from, to, grammar, preferObject = true }) {
    const connection = {
      id: mkID('connection'),
      grammar
    };

    if (preferObject) {
      connection.from = from;
      connection.to = to;
    } else {
      connection.from = from.id || from;
      connection.to = to.id || to;
    }

    return connection;
  },
  mkSentence({ words, preferObject = true }) {
    const sentence = {
      id: mkID('sentence'),
      connections: [],
      phrases: [],
    };

    if (preferObject) {
      sentence.words = [...words]
    } else {
      sentence.words = words.map(word => word.id || word)
    }

    return sentence;
  },
}

const utils = {
  ...is,
  // Arabic -> [Token]
  toTokens(obj) {
    if (utils.isPhrase(obj)) {
      return obj.tokens;
    }
    if (utils.isToken(obj)) {
      return [obj];
    }
    if (utils.isWord(obj)) {
      return obj.token ? [obj.token] : obj.tokens;
    }
    if (utils.isConnection(obj)) {
      throw new Error('Need to implement toTokens for connection')
    }
    return [];
  },
  ...mk,
  // [a] -> [a] -> [a]
  filterByArray(tokens, arr, { param } = {}) {
    const val = (x) => (param ? x[param] : x);
    return arr.filter((t) => !tokens.some((t2) => val(t) === val(t2)));
  },
  // [a] -> [a] -> Bool 
  containsArray(inner, outer) {
    if (inner.length > outer.length) {
      return false
    }

    return outer.filter((t) => inner.some((t2) => t.id === t2.id)).length === inner.length
  },
  isSameArray(arr1, arr2) {
    return arr1.length === arr2.length && utils.containsArray(arr1, arr2);
  },
  toIds(obj) {
    if (obj instanceof Array) {
      return obj.map(el => el.id);
    }
    throw new Error('not passing array to toIds()')
  },
  wordsToTokens(words) {
    return words.flatMap(utils.toTokens);
  },
  tokensToWords(tokens, words) {
    const resultWords = words.filter(word => {
      const wordTokens = utils.toTokens(word)
      return utils.containsArray(wordTokens, tokens)
    })

    const resultTokens = filterItems(utils.wordsToTokens(resultWords), tokens, 'id');

    return {
      resultWords,
      resultTokens,
    }
  }
}

export default utils;