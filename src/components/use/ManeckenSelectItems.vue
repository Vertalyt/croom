<template>
  <select class="select-css"
  v-model="itemsvalue">
    <option value="none" disabled selected>{{ itemsName }}</option>
    <slot name="optionSelect"/>
</select>
</template>

<script setup>
import { ref, watch } from 'vue'
const itemsvalue = ref('none')

const emits = defineEmits({
  'update:modelValue': () => String
})

defineProps({
  modelValue: {
    type: String,
    required: true
  },
  itemsName: {
    type: String,
    required: true
  },

})


watch(itemsvalue, (val) => {
  emits('update:modelValue', val)
})
</script>
