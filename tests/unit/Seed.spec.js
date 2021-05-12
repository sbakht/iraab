import { seed } from '../../src/api/Seed';

test('each words byId corresponds is contained in allIds', () => {
  const byId = seed.words.byId;
  const allIds = seed.words.allIds;

  expect(Object.keys(byId)).toHaveLength(allIds.length);
  allIds.map(id => {
    expect(byId[id]).toBeDefined()
  })
})

test('each answerKey byId corresponds is contained in allIds', () => {
  const byId = seed.answerKey.byId;
  const allIds = seed.answerKey.allIds;

  expect(Object.keys(byId)).toHaveLength(allIds.length);
  allIds.map(id => {
    expect(byId[id]).toBeDefined()
  })
})

test('each answers byId corresponds is contained in allIds', () => {
  const byId = seed.answers.byId;
  const allIds = seed.answers.allIds;

  expect(Object.keys(byId)).toHaveLength(allIds.length);
  allIds.map(id => {
    expect(byId[id]).toBeDefined()
  })
})

test('each word is associated with valid sentences', () => {
  const byId = seed.words.byId;
  const allIds = seed.words.allIds;

  expect(Object.keys(byId)).toHaveLength(allIds.length);
  allIds.map(id => {
    expect(byId[id].sentences.length).toBeGreaterThanOrEqual(1)
    byId[id].sentences.map(sentenceId => {
      expect(seed.sentences.byId[sentenceId]).toBeDefined();
    })
  })
})

test('each word has answers object for each sentence', () => {
  const byId = seed.words.byId;
  const allIds = seed.words.allIds;

  expect(Object.keys(byId)).toHaveLength(allIds.length);
  allIds.forEach(id => {
    expect(byId[id].sentences.length).toBeGreaterThanOrEqual(1)
    expect(byId[id].sentences.length).toEqual(Object.keys(byId[id].answers).length)
    byId[id].sentences.map(sentenceId => {
      const sentence = byId[id].answers[sentenceId];
      expect(sentence).toBeDefined();
      expect(sentence.answerKey).toBeDefined();
      expect(seed.answerKey.byId[sentence.answerKey]).toBeDefined()
      expect(sentence.answerable).toBeDefined();

      if (sentence.answerable) {
        expect(sentence.key).toBeDefined();
        expect(seed.answers.byId[sentence.key]).toBeDefined()
        expect(!!sentence.hideAnswer).toBe(false);
      } else {
        expect(sentence.key).toBeUndefined();
      }

      if (sentence.hideAnswer) {
        expect(sentence.key).toBeUndefined();
        expect(sentence.answerable).toBe(false);
      }
    })
  })
})
test('each words object id should equal the id property on the word', () => {
  const byId = seed.words.byId;
  const allIds = seed.words.allIds;

  expect(Object.keys(byId)).toHaveLength(allIds.length);
  allIds.map(id => {
    expect(byId[id].id).toBe(id)
  })
})

test('each sentence has words that exist', () => {
  const byId = seed.sentences.byId;
  const allIds = seed.sentences.allIds;

  allIds.map(id => {
    byId[id].words.map(wordId => {
      expect(seed.words.byId[wordId]).toBeDefined();
    })
  })
})