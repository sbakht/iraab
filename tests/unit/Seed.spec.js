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