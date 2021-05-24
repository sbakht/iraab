// Arabic = Phrase | Word | Token

const utils = {
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
}

export default utils;