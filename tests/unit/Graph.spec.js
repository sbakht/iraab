
import { mount } from '@vue/test-utils'
import { graphSeed } from '../../src/api/Graph'
import Component from '@/components/Graph.vue'
import { seed } from '../../src/store/index'
import { fromGraph } from '../../src/utils/GraphUtils'


function expectIntialOptions({ selections, wrapper }) {
  const tags = wrapper.find('.multiselect__tag')

  expect(tags.exists()).toBe(false);
  expect(selections.html()).toContain('Ism')
  expect(selections.html()).toContain('Fil')
  expect(selections.html()).toContain('Harf')
  expect(wrapper.findAll('.multiselect__element')).toHaveLength(3)
}

function mkAnswers(byId) {
  return {
    byId,
    allIds: Object.keys(byId),
  }
}

function mkWrapper(data = {}, rest) {
  const wrapper = mount(Component, {
    global: {
      plugins: [seed(data.store)]
    },
    ...rest,
  })
  return wrapper;
}

test('renders words and their parts of speech', () => {
  const wrapper = mkWrapper({
    store: {
      state: {
        graph: fromGraph(graphSeed.graph),
        graphwords: graphSeed.words,
        phrases: graphSeed.phrases,
      }
    }
  });

  expect(wrapper.text()).toContain('zayd - PN')
  expect(wrapper.text()).toContain('he - PRON')
  expect(wrapper.text()).toContain('went - V')
  expect(wrapper.text()).toContain('to - P')
  expect(wrapper.text()).toContain("his masjid - PN, PRON")
})

test('renders token and their relationship', () => {
  const wrapper = mkWrapper({
    store: {
      state: {
        graph: fromGraph(graphSeed.graph),
        graphwords: graphSeed.words,
        phrases: graphSeed.phrases,
      }
    }
  });

  expect(wrapper.text()).toContain('masjid is Majroor to to')
  expect(wrapper.text()).toContain('his is Mudaf Ilayhi to masjid')
})

test('renders phrase and their relationship', () => {
  const wrapper = mkWrapper({
    store: {
      state: {
        graph: fromGraph(graphSeed.graph),
        graphwords: graphSeed.words,
        phrases: graphSeed.phrases,
      }
    }
  });

  expect(wrapper.text()).toContain('"to his masjid" is a PP that is Mutaalliq to went')
  expect(wrapper.text()).toContain('"went to his masjid" is a VS that is Kabr to he')
  expect(wrapper.text()).toContain('"he went to his masjid" is a NS that is Kabr to zayd')
})