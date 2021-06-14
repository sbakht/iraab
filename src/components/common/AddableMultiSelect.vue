<template>
  <div>
    <label class="typo__label">Select nested word</label>
    <multiselect
      v-model="value"
      tag-placeholder="Add this as new tag"
      placeholder="Search or add a tag"
      label="description"
      track-by="english"
      :options="options"
      :multiple="false"
      :taggable="true"
      @tag="addTag"
    ></multiselect>
    <!-- <pre class="language-json"><code>{{ value  }}</code></pre> -->
  </div>
</template>

<script>
import Multiselect from "@suadelabs/vue3-multiselect";
import "@/vue-multiselect.css";

export default {
  components: {
    Multiselect,
  },
  props: {
    options: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      value: [],
      localOptions: this.options,
    };
  },
  watch: {
    value(newVal) {
      this.$emit("change", newVal);
    },
  },
  methods: {
    addTag(newTag) {
      const tag = {
        english: newTag,
        arabic: newTag,
      };
      this.value = tag;
      this.localOptions.push(tag);
      // this.value.push(tag);
    },
  },
};
</script>

<style>
</style>