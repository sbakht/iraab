<template>
  <div>
    <label class="typo__label">Iraab selection:</label>
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
      <template v-slot:selection="{ values, isOpen }"
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
import { data } from "../data/data.js";

const { Ism, Fil, Harf, mafool, Mubtada, Kabr, Fial, fils, jars } = data;
const initialOptions = [Ism, Fil, Harf];

function hasNoTopLevelOptions(values) {
  const strs = initialOptions.map(({ name }) => name);
  return !values.some(({ name }) => strs.includes(name));
}
const getItems = (group) => {
  const groupId = group.id;
  return group.items.map((item) => ({ ...item, groupId }));
};

function excluder(options, values) {
  const valuesIds = values.map((val) => val.id);
  const isSelected = (id) => valuesIds.includes(id);

  const excludes = values.map((val) => val.exclude || []).flat();
  const groups = values.map((val) => val.excludeGroup || []).flat();
  const filteredExcluded = options.filter(
    (val) => !excludes.includes(val.id) || isSelected(val.id)
  );
  const filteredGroup = filteredExcluded.filter(
    (val) => !groups.includes(val.groupId) || isSelected(val.id)
  );
  return filteredGroup;
}

export default {
  components: { Multiselect },
  props: {
    result: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  watch: {
    result(newVal) {
      this.value = JSON.parse(JSON.stringify(newVal));
    },
  },
  data() {
    return {
      value: JSON.parse(JSON.stringify(this.result)),
    };
  },
  computed: {
    options() {
      if (hasNoTopLevelOptions(this.value)) {
        return initialOptions;
      }

      const contains = (val) => this.value.some(({ name }) => name === val);

      if (contains("Ism")) {
        return excluder(this.ismOptions(), this.value);
      }

      if (contains("Fil")) {
        return this.filOptions();
      }

      if (contains("Harf")) {
        return this.harfOptions();
      }

      throw new Error("invalid state");
    },
  },
  methods: {
    onSelect(option) {
      this.value = [...this.value, option];
      this.onValueChange();
    },
    onRemove(option) {
      this.value = this.value.filter((val) => val.name !== option.name);
      if (hasNoTopLevelOptions(this.value)) {
        this.value = [];
      }
      this.onValueChange();
    },
    onValueChange() {
      this.$emit("value", this.value);
    },
    ismOptions() {
      return [Mubtada, Kabr, Fial, ...getItems(mafool)];
    },
    filOptions() {
      return getItems(fils);
    },
    harfOptions() {
      return getItems(jars);
    },
  },
};
</script>

<style></style>