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

const Ism = { id: 1, name: "Ism" };
const Fil = { id: 2, name: "Fil" };
const Harf = { id: 3, name: "Harf" };
const initialOptions = [Ism, Fil, Harf];

function hasNoTopLevelOptions(values) {
  const strs = initialOptions.map(({ name }) => name);
  return !values.some(({ name }) => strs.includes(name));
}

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
  data() {
    return {
      value: [],
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
    },
    onRemove(option) {
      this.value = this.value.filter((val) => val.name !== option.name);
      if (hasNoTopLevelOptions(this.value)) {
        this.value = [];
      }
    },
    ismOptions() {
      const mafool = {
        id: 1,
        items: [
          { id: 7, name: "Mafool bihi", exclude: [6] },
          { id: 8, name: "Mafool fi", exclude: [6] },
          { id: 9, name: "Mafool laho", exclude: [6] },
          { id: 10, name: "Mafool mutlaq", exclude: [6] },
          { id: 11, name: "Mafool hal", exclude: [6] },
        ],
      };
      const getItems = (group) => {
        const groupId = group.id;
        return group.items.map((item) => ({ ...item, groupId }));
      };
      return [
        { id: 4, name: "Mubtada", exclude: [5] },
        { id: 5, name: "Kabr", exclude: [4] },
        { id: 6, name: "Fial", exclude: [], excludeGroup: [1] },
        ...getItems(mafool),
      ];
    },
    filOptions() {
      return [{ name: "Madhi" }, { name: "Mudhari" }, { name: "Amr" }];
    },
    harfOptions() {
      return [{ name: "Jar" }, { name: "Zaida" }];
    },
  },
};
</script>

<style></style>