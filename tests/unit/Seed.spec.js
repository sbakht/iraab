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
  allIds.map(id => {
    expect(byId[id].sentences.length).toBeGreaterThanOrEqual(1)
    expect(byId[id].sentences.length).toEqual(Object.keys(byId[id].answers).length)
    byId[id].sentences.map(sentenceId => {
      const sentence = byId[id].answers[sentenceId];
      expect(sentence).toBeDefined();
      expect(sentence.answerKey).toBeDefined();
      expect(sentence.answerable).toBeDefined();
      if (sentence.hideAnswer) {
        expect(sentence.answerable).toBe(false);
      }
    })
  })
})