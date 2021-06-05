
const Ism = {
  Noun: {
    N: { tag: 'N', arabic: '', description: 'Noun' },
    PN: { tag: 'PN', arabic: '', description: 'Proper noun' },
  },
  Derived: {
    ADJ: { tag: 'ADJ', arabic: '', description: 'Adjective' },
    IMPN: { tag: 'IMPN', arabic: '', description: 'Imperative verbal noun' },
  },
  Pronoun: {
    PRON: { tag: 'PRON', arabic: '', description: 'Personal pronoun' },
  },
  Adverb: {

  },
}
const Fil = {
  Verb: {
    V: { tag: 'V', arabic: '', description: 'Verb' },
  }
};
const Harf = {
  Preposition: {
    P: { tag: 'P', arabic: '', description: 'Preposition' },
  },
  Lam: {

  },
  Conjunction: {

  },
  Disconnected: {

  },
}
export const Speech = {
  Empty: { tag: '?', arabic: '?', description: '?' },
  Ism, Fil, Harf,
}

function getValues(obj) {
  const vals = Object.values(obj).flatMap(val => {
    if (val.tag) {
      return [val];
    } else {
      return getValues(val)
    }
  })
  return vals;
}


export const speechArray = getValues({ Ism, Fil, Harf });