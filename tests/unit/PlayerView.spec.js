import { mount } from '@vue/test-utils'
import { data } from '../../src/data/data.js'
import PlayerView from '@/components/PlayerView.vue'
import { seed } from '../../src/store/index'

const { Ism, Mubtada, Fil } = data

function mkWrapper(data = {}) {
  const wrapper = mount(PlayerView, {
    global: {
      plugins: [seed(data.store)]
    }
  })
  return wrapper;
}
const sentences = {
  byId: {
    123: [
      {
        id: 1,
        name: 'arabic',
        answer: true,
        userAnswer: '5'
      },
      {
        id: 2,
        name: 'word',
        answer: true,
        userAnswer: '6'
      }
    ]
  },
  allIds: ['123'],
}
const userAnswers = {
  byId: {
    5: [Ism, Mubtada],
    6: [Fil],
  },
  allIds: ['5', '6'],
};

test('sets properties for tokens', async () => {
  const wrapper = mkWrapper({
    store: {
      state: {
        sentences,
        userAnswers,
      }
    }
  });

  const first = wrapper.findAll('[data-token="1"] [data-test=property]')
  const second = wrapper.findAll('[data-token="2"] [data-test=property]')

  expect(first[0].text()).toBe('Ism');
  expect(first[1].text()).toBe('Mubtada');
  expect(second[0].text()).toBe('Fil');
})

test('defaults to first token being selected', async () => {
  const wrapper = mkWrapper({
    store: {
      state: {
        sentences,
        userAnswers,
      }
    }
  });

  const tokenViews = wrapper.findAllComponents({ name: 'TokenView' });

  expect(tokenViews[0].classes()).toContain('selected');
  expect(tokenViews[1].classes()).not.toContain('selected');
})

test('switch active token to clicked token', async () => {
  const wrapper = mkWrapper({
    store: {
      state: {
        sentences,
        userAnswers,
      }
    }
  });

  const tokenViews = wrapper.findAllComponents({ name: 'TokenView' });
  await tokenViews[1].trigger('click')

  expect(tokenViews[0].classes()).not.toContain('selected');
  expect(tokenViews[1].classes()).toContain('selected');
})
