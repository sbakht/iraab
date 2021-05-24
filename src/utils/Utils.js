const utils = {
  isConnection(obj) {
    return obj.id.includes("connection");
  },
  isPhrase(obj) {
    return obj.id.includes("phrase");
  },
  isToken(obj) {
    return obj.id.includes("token");
  },
  isWord(obj) {
    return obj.id.includes("word");
  },
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
  },
  filterByArray(tokens, arr, { param } = {}) {
    const val = (x) => (param ? x[param] : x);
    return arr.filter((t) => !tokens.some((t2) => val(t) === val(t2)));
  },
}

export default utils;