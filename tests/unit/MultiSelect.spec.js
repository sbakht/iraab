import { mount, shallowMount } from '@vue/test-utils'
import MultiSelect from '@/components/MultiSelect.vue'


test('has a label with text', () => {
  const wrapper = mount(MultiSelect)

  const label = wrapper.get('label');

  expect(label.text()).toBe('Iraab selection:')
})

test('default selection to ism fil harf', () => {
  const wrapper = mount(MultiSelect)

  const selections = wrapper.find('.multiselect__content');

  expect(selections.html()).toContain('Ism')
  expect(selections.html()).toContain('Fil')
  expect(selections.html()).toContain('Harf')
  expect(wrapper.findAll('.multiselect__element')).toHaveLength(3)
})

test('update selection when selecting ism', async () => {
  const wrapper = mount(MultiSelect)

  await wrapper.vm.onSelect({ name: 'Ism' })
  const selections = wrapper.find('.multiselect__content');

  expect(selections.html()).toContain('Mubtada')
  expect(selections.html()).toContain('Kabr')
  expect(selections.html()).toContain('Fial')
  expect(selections.html()).toContain('Mafool bihi')
  expect(wrapper.findAll('.multiselect__element')).toHaveLength(4)
})

test('update selection when selecting fil', async () => {
  const wrapper = mount(MultiSelect)

  await wrapper.vm.onSelect({ name: 'Fil' })
  const selections = wrapper.find('.multiselect__content');

  expect(selections.html()).toContain('Mubtada')
  expect(selections.html()).toContain('Kabr')
  expect(selections.html()).toContain('Fial')
  expect(selections.html()).toContain('Mafool bihi')
  expect(wrapper.findAll('.multiselect__element')).toHaveLength(4)
})