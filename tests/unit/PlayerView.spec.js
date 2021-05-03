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

test('sets properties for tokens', async () => {
  const wrapper = mkWrapper({
    store: {
      state: {
        sentences: [
          {
            id: 1,
            name: 'arabic',
            answer: true,
          },
          {
            id: 2,
            name: 'word',
            answer: true,
          }
        ],
        userAnswers: [[Ism, Mubtada], [Fil]],
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
        sentences: [
          {
            id: 1,
            name: 'arabic',
            answer: true,
          },
          {
            id: 2,
            name: 'word',
            answer: true,
          }
        ],
        userAnswers: [[Ism, Mubtada], [Fil]],
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
        sentences: [
          {
            id: 1,
            name: 'arabic',
            answer: true,
          },
          {
            id: 2,
            name: 'word',
            answer: true,
          }
        ],
        userAnswers: [[Ism, Mubtada], [Fil]],
      }
    }
  });

  const tokenViews = wrapper.findAllComponents({ name: 'TokenView' });
  await tokenViews[1].trigger('click')

  expect(tokenViews[0].classes()).not.toContain('selected');
  expect(tokenViews[1].classes()).toContain('selected');
})
