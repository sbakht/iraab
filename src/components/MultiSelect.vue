<template>
  <div>
    <label class="typo__label">Simple select / dropdown</label>
    <multiselect
      :modelValue="value"
      :options="options"
      :multiple="true"
      :hide-selected="false"
      :close-on-select="false"
      :clear-on-select="false"
      :preserve-search="true"
      placeholder="Pick some"
      label="name"
      track-by="name"
      :preselect-first="false"
      @select="onSelect"
      @remove="onRemove"
    >
      <template v-slot:singleLabel>hi</template>
      <template v-slot:selection="{ values, search, isOpen }"
        ><span class="multiselect__single" v-if="values.length && isOpen"
          >{{ values.length }} options selected</span
        ></template
      >
    </multiselect>
    <pre class="language-json"><code>{{ value  }}</code></pre>
  </div>
</template>

<script>
import "../vue-multiselect.css";
import Multiselect from "@suadelabs/vue3-multiselect";

function filterList(arr, items) {
  return arr.filter(item => !items.find(m => item.name === m.name))
}

export default {
  components: { Multiselect },
  data() {
    return {
      value: [],
      reset: false,
      options: [
        { name: "Ism"},
        { name: "Fil"},
        { name: "Harf"},
      ],
    };
  },
  methods: {
    onSelect(option, id) {
      this.value = [...this.value, option]
      if(option.name === 'Ism') {
        this.options = this.ismOptions();
        return;
      }
      if(option.name === 'Fil') {
        this.options = this.filOptions();
        return;
      }
      if(option.name === 'Harf') {
        this.options = this.harfOptions();
        return;
      }
    },
    onRemove(option, id) {
      this.value = this.value.filter(val => val.name !== option.name)

      const strs = ['Ism', 'Fil', 'Harf'];
      const missingType = !this.value.some(({name}) => strs.includes(name))
      if(missingType) {
        this.options = [
          { name: "Ism"},
          { name: "Fil"},
          { name: "Harf"},
        ]
        this.value = [];
      }

    },
    ismOptions() {
      return [
        { name: 'Mubtada' },
        { name: 'Kabr' },
        { name: 'Fial' },
        { name: 'Mafool bihi' },
      ]
    },
    filOptions() {
      return [
        { name: 'Madhi' },
        { name: 'Mudhari' },
        { name: 'Amr' },
      ]
    },
    harfOptions() {
      return [
        { name: 'Jar' },
        { name: 'Zaida' },
      ]
    },
  }
};
</script>

<style></style>