<template>
  <div>
    <div class="sm:hidden">
      <label for="tabs" class="sr-only">Select a tab</label>
      <select
        id="tabs"
        name="tabs"
        class="block w-full focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md"
      >
        <option v-for="tab in tabs" :key="tab.name" :selected="isSelected(tab)">
          {{ tab.name }}
        </option>
      </select>
    </div>
    <div class="hidden sm:block">
      <nav class="flex space-x-4" aria-label="Tabs">
        <button
          v-for="tab in tabs"
          :key="tab.name"
          :class="[
            isSelected(tab)
              ? 'bg-indigo-100 text-indigo-700'
              : 'text-gray-500 hover:text-gray-700',
            'px-3 py-2 font-medium rounded-md',
          ]"
          :aria-current="isSelected(tab) ? 'page' : undefined"
          @click="setConnectionType(tab)"
          :data-testid="`select-${tab.name.toLowerCase()}`"
        >
          {{ tab.name }}
        </button>
      </nav>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    tabs: {
      type: Object,
      required: true,
    },
    selected: {
      type: Object,
    },
  },
  data() {
    return {
      val: null,
    };
  },
  methods: {
    setConnectionType(tab) {
      this.$emit("select", tab);
    },
    isSelected(tab) {
      return tab.id == (this.selected && this.selected.id);
    },
  },
};
</script>

<style>
button {
  outline: none !important;
}
</style>