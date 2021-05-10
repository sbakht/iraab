import { mount } from '@vue/test-utils'
import { data } from '../../src/data/data.js'
import MultiSelect from '@/components/MultiSelect.vue'
import { seed } from '../../src/store/index'

const { Ism, Fil, Fial, Harf, Mubtada, Kabr, MafoolBihi } = data;


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

function mkWrapper(data = {}) {
  const wrapper = mount(MultiSelect, {
    global: {
      plugins: [seed(data.store)]
    }
  })
  return wrapper;
}

test('has a label with text', () => {
  const wrapper = mkWrapper();

  const label = wrapper.get('label');

  expect(label.text()).toBe('Iraab selection:')
})

test('default selection to ism fil harf', () => {
  const wrapper = mkWrapper();

  const selections = wrapper.find('.multiselect__content');

  expectIntialOptions({ selections, wrapper });
})

test('update selection when selecting ism', async () => {
  const wrapper = mkWrapper();

  await wrapper.vm.onSelect(Ism)
  const selections = wrapper.find('.multiselect__content');

  expect(selections.html()).toContain('Mubtada')
  expect(selections.html()).toContain('Kabr')
  expect(selections.html()).toContain('Fial')
  expect(selections.html()).toContain('Mafool bihi')
  expect(wrapper.findAll('.multiselect__element').length).toBeGreaterThanOrEqual(4)
})

test('update selection when selecting fil', async () => {
  const wrapper = mkWrapper();

  await wrapper.vm.onSelect(Fil)
  const selections = wrapper.find('.multiselect__content');

  expect(selections.html()).toContain('Madhi')
  expect(selections.html()).toContain('Mudhari')
  expect(selections.html()).toContain('Amr')
  expect(wrapper.findAll('.multiselect__element')).toHaveLength(3)
})

test('update selection when selecting harf', async () => {
  const wrapper = mkWrapper();

  await wrapper.vm.onSelect(Harf)
  const selections = wrapper.find('.multiselect__content');

  expect(selections.html()).toContain('Jar')
  expect(selections.html()).toContain('Zaida')
  expect(wrapper.findAll('.multiselect__element')).toHaveLength(2)
})

test('clear selection when deselect ism', async () => {
  const wrapper = mkWrapper({
    store: {
      state: {
        userAnswers: mkAnswers(
          {
            456: [[Ism, Mubtada]]
          }
        )
      }
    }
  })

  await wrapper.vm.onRemove(Ism)
  const selections = wrapper.find('.multiselect__content');

  expectIntialOptions({ selections, wrapper });
})

test('clear selection when deselect fil', async () => {
  const wrapper = mkWrapper({
    store: {
      state: {
        userAnswers: mkAnswers(
          {
            456: [[Fil]]
          }
        )
      }
    }
  })

  await wrapper.vm.onRemove(Fil)
  const selections = wrapper.find('.multiselect__content');

  expectIntialOptions({ selections, wrapper });
})

test('clear selection when deselect harf', async () => {
  const wrapper = mkWrapper({
    store: {
      state: {
        userAnswers: mkAnswers(
          {
            456: [[Harf]]
          }
        )
      }
    }
  })

  await wrapper.vm.onRemove(Harf)
  const selections = wrapper.find('.multiselect__content');

  expectIntialOptions({ selections, wrapper });
})

test('Ism properties remain selectable on select', async () => {
  const wrapper = mkWrapper({
    store: {
      state: {
        userAnswers: mkAnswers(
          {
            456: [[Ism]]
          }
        )
      }
    }
  })

  await wrapper.vm.onSelect(Mubtada)
  const selections = wrapper.find('.multiselect__content');

  expect(selections.html()).toContain('Mubtada')
  expect(selections.html()).toContain('Fial')
  expect(selections.html()).toContain('Mafool bihi')
  expect(wrapper.findAll('.multiselect__element').length).toBeGreaterThanOrEqual(3)
})

test('Cannot select kabr when selected mubtada', async () => {
  const wrapper = mkWrapper({
    store: {
      state: {
        userAnswers: mkAnswers(
          {
            456: [[Ism, Mubtada]]
          }
        )
      }
    }
  })

  const selections = wrapper.find('.multiselect__content');

  expect(selections.html()).toContain('Mubtada')
  expect(selections.html()).not.toContain('Kabr')
})

test('Cannot select mubtada when selected kabr', async () => {
  const wrapper = mkWrapper({
    store: {
      state: {
        userAnswers: mkAnswers(
          {
            456: [[Ism, Kabr]]
          }
        )
      }
    }
  })


  const selections = wrapper.find('.multiselect__content');

  expect(selections.html()).not.toContain('Mubtada')
  expect(selections.html()).toContain('Kabr')
})

test('Cannot select any mafool when selected fial', async () => {
  const wrapper = mkWrapper({
    store: {
      state: {
        userAnswers: mkAnswers(
          {
            456: [[Ism, Fial]]
          }
        )
      }
    }
  })


  const selections = wrapper.find('.multiselect__content');

  expect(selections.html()).toContain('Fial')
  expect(selections.html()).not.toContain('Mafool bihi')
  expect(selections.html()).not.toContain('Mafool fi')
  expect(selections.html()).not.toContain('Mafool laho')
  expect(selections.html()).not.toContain('Mafool mutlaq')
  expect(selections.html()).not.toContain('Mafool hal')
})

test('Cannot select any other mafool when selected a mafool', async () => {
  const wrapper = mkWrapper({
    store: {
      state: {
        userAnswers: mkAnswers(
          {
            456: [[Ism, MafoolBihi]]
          }
        )
      }
    }
  })


  const selections = wrapper.find('.multiselect__content');

  expect(selections.html()).toContain('Mafool bihi')
  expect(selections.html()).not.toContain('Mafool fi')
  expect(selections.html()).not.toContain('Mafool laho')
  expect(selections.html()).not.toContain('Mafool mutlaq')
  expect(selections.html()).not.toContain('Mafool hal')
})