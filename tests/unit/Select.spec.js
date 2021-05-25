
import { mount } from '@vue/test-utils'
import { graphSeed } from '../../src/api/Seed'
import Component from '@/components/Selectable.vue'
import { seed } from '../../src/store/index'

const token1 = graphSeed.tokens.byId['token-1'].name;
const token2 = graphSeed.tokens.byId['token-2'].name;
const token3 = graphSeed.tokens.byId['token-3'].name;
const token4 = graphSeed.tokens.byId['token-4'].name;
const token5 = graphSeed.tokens.byId['token-5'].name;
const token6 = graphSeed.tokens.byId['token-6'].name;
const word5 = graphSeed.words.byId['word-5'].label;

const activeFromClass = 'active-from'
const activeToClass = 'active-to'

function noActiveClass(wrapper, selector) {
  expect(wrapper.find(selector).classes()).not.toContain(activeFromClass)
  expect(wrapper.find(selector).classes()).not.toContain(activeToClass)
}


function mkWrapper(data = {}, rest) {
  const wrapper = mount(Component, {
    global: {
      plugins: [seed({}, data.store)]
    },
    ...rest,
  })
  return wrapper;
}

test('renders text of token and relationship on click', async () => {
  const wrapper = mkWrapper({
    store: {
      state: {
        ...graphSeed
      }
    }
  });

  await wrapper.find('button[data-testid="connection-1"').trigger('click')

  expect(wrapper.text()).toContain('"masjid" is Majroor to "to"')
})

test('renders text of phrase and relationship on click', async () => {
  const wrapper = mkWrapper({
    store: {
      state: {
        ...graphSeed
      }
    }
  });

  await wrapper.find('button[data-testid="connection-3"').trigger('click')

  expect(wrapper.text()).toContain(`"${text1}" is a Prepositional Sentence that is Mutaalliq to "went"`)
})

test('no active words on initialize', () => {
  const activeFromClass = 'active-from'
  const wrapper = mkWrapper({
    store: {
      state: {
        ...graphSeed
      }
    }
  });

  noActiveClass(wrapper, '.word-1')
  noActiveClass(wrapper, '.word-2')
  noActiveClass(wrapper, '.word-3')
  noActiveClass(wrapper, '.word-4')
  noActiveClass(wrapper, '.word-5')
})

test('sets active to and from classes on words when clicking on a grammer button', async () => {
  const wrapper = mkWrapper({
    store: {
      state: {
        ...graphSeed
      }
    }
  });

  await wrapper.find('button[data-testid="connection-1"').trigger('click')

  noActiveClass(wrapper, '.word-1')
  noActiveClass(wrapper, '.word-2')
  noActiveClass(wrapper, '.word-3')
  expect(wrapper.find('.word-4').classes()).toContain(activeToClass)
  expect(wrapper.find('.word-5').classes()).toContain(activeFromClass)

  await wrapper.find('button[data-testid="connection-2"').trigger('click')

  noActiveClass(wrapper, '.word-1')
  noActiveClass(wrapper, '.word-2')
  noActiveClass(wrapper, '.word-3')
  noActiveClass(wrapper, '.word-4')
  expect(wrapper.find('.word-5').classes()).toContain(activeFromClass)
  expect(wrapper.find('.word-5').classes()).toContain(activeToClass)

  await wrapper.find('button[data-testid="connection-3"').trigger('click')

  noActiveClass(wrapper, '.word-1')
  noActiveClass(wrapper, '.word-2')
  expect(wrapper.find('.word-3').classes()).toContain(activeToClass)
  expect(wrapper.find('.word-4').classes()).toContain(activeFromClass)
  expect(wrapper.find('.word-5').classes()).toContain(activeFromClass)

  await wrapper.find('button[data-testid="connection-4"').trigger('click')

  noActiveClass(wrapper, '.word-1')
  expect(wrapper.find('.word-2').classes()).toContain(activeToClass)
  expect(wrapper.find('.word-3').classes()).toContain(activeFromClass)
  expect(wrapper.find('.word-4').classes()).toContain(activeFromClass)
  expect(wrapper.find('.word-5').classes()).toContain(activeFromClass)

  await wrapper.find('button[data-testid="connection-5"').trigger('click')

  expect(wrapper.find('.word-1').classes()).toContain(activeToClass)
  expect(wrapper.find('.word-2').classes()).toContain(activeFromClass)
  expect(wrapper.find('.word-3').classes()).toContain(activeFromClass)
  expect(wrapper.find('.word-4').classes()).toContain(activeFromClass)
  expect(wrapper.find('.word-5').classes()).toContain(activeFromClass)
})