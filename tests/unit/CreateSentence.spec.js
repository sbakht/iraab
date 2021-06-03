
import { mount } from '@vue/test-utils'
import { graphSeed } from '../../src/api/Seed'
import Component from '@/components/CreateSentence.vue'
import { seed } from '../../src/store/index'

let seedFromGraph = JSON.parse(JSON.stringify(graphSeed))

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
