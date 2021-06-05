<template>
  <div>
    <label v-if="label" class="typo__label">{{ label }}</label>
    <multiselect
      :disabled="disabled"
      v-model="value"
      :options="options"
      :multiple="true"
      :hide-selected="false"
      :close-on-select="false"
      :clear-on-select="false"
      :preserve-search="true"
      :placeholder="placeholder"
      open-direction="bottom"
      :label="itemLabel"
      :track-by="trackBy"
      :preselect-first="false"
    >
    </multiselect>
    <!-- <pre class="language-json"><code>{{ value  }}</code></pre> -->
  </div>
</template>

<script>
import "@/vue-multiselect.css";
import Multiselect from "@suadelabs/vue3-multiselect";

export default {
  components: { Multiselect },
  props: {
    options: {
      type: Array,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
      required: true,
    },
    itemLabel: {
      type: String,
      required: true,
    },
    trackBy: {
      type: String,
      required: true,
    },
    placeholder: {
      type: String,
    },
  },
  data() {
    return {
      value: [],
    };
  },
  watch: {
    value(newVal) {
      this.$emit("change", newVal);
    },
  },
};
</script>

<style></style>