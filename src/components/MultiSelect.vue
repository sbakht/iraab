<template>
  <div>
    <label class="typo__label">Iraab selection:</label>
    <multiselect
      :disabled="disabled"
      :modelValue="value"
      :options="options"
      :multiple="true"
      :hide-selected="false"
      :close-on-select="false"
      :clear-on-select="false"
      :preserve-search="true"
      placeholder="Select iraab"
      open-direction="bottom"
      label="name"
      track-by="name"
      :preselect-first="false"
      @select="onSelect"
      @remove="onRemove"
    >
    </multiselect>
    <!-- <pre class="language-json"><code>{{ value  }}</code></pre> -->
  </div>
</template>

<script>
import "../vue-multiselect.css";
import Multiselect from "@suadelabs/vue3-multiselect";
import { data } from "../data/data.js";
import { mapGetters } from "vuex";

const { Ism, Fil, Harf, IsmOptions, fils, jars } = data;
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
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapGetters({ value: "currentAnswer" }),
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
      this.$store.commit("addToAnswer", {
        addition: option,
      });
    },
    onRemove(option) {
      this.$store.commit("removeFromAnswer", {
        removal: option,
      });
    },
    ismOptions() {
      return IsmOptions;
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