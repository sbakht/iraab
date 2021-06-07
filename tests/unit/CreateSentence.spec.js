
import { mount } from '@vue/test-utils'
import { graphSeed } from '../../src/api/Seed'
import Component from '@/components/CreateSentence.vue'
import { seed } from '../../src/store/index'

let seedFromGraph = JSON.parse(JSON.stringify(graphSeed))

function getSelectableConnections(wrapper) {
  return wrapper.findAll('[data-testid=select-connection]')
}

beforeEach(() => {
  seedFromGraph = JSON.parse(JSON.stringify(graphSeed))
})

function mkWrapper(data = {}, rest) {
  const wrapper = mount(Component, {
    global: {
      plugins: [seed({}, data.store)]
    },
    ...rest,
  })
  return wrapper;
}

test('adds new sentence by rendering', async () => {
  const wrapper = mkWrapper({
    store: {
      state: {
        ...seedFromGraph
      }
    }
  });

  const textInput = wrapper.find('input[type="text"]')
  await textInput.setValue('this is great')
  await wrapper.find('button').trigger('click')


  expect(wrapper.text()).toContain(`thisisgreat`)
})

test('can add grammar to the new sentence', async () => {
  const wrapper = mkWrapper({
    store: {
      state: {
        ...seedFromGraph
      }
    }
  });

  const textInput = wrapper.find('input[type="text"]')
  await textInput.setValue('this is great')
  await wrapper.find('button').trigger('click')
  const words = wrapper.findAll('[data-testid^=word]')

  await words[0].trigger('click')
  await words[1].trigger("click", { shiftKey: true });


  const connections = getSelectableConnections(wrapper);
  expect(connections.length).toBe(1);

  expect(words[0].classes()).toContain('active-from')
  expect(words[1].classes()).toContain('active-to')
})

test('can add grammar to the new sentence for phrase', async () => {
  const wrapper = mkWrapper({
    store: {
      state: {
        ...seedFromGraph
      }
    }
  });

  const textInput = wrapper.find('input[type="text"]')
  await textInput.setValue('this is great')
  await wrapper.find('button').trigger('click')
  const words = wrapper.findAll('[data-testid^=word]')

  await words[0].trigger('click')
  await words[1].trigger('click')
  await words[2].trigger("click", { shiftKey: true });

  const connections = getSelectableConnections(wrapper);
  expect(connections.length).toBe(1);

  expect(words[0].classes()).toContain('active-from')
  expect(words[1].classes()).toContain('active-from')
  expect(words[2].classes()).toContain('active-to')
})