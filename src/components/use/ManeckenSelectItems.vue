<template>
  <select class="select-css"
  :class="left ? 'form__input_left' : 'form__input'"
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
  left: {
    type: Boolean,
    required: false
  },

})


watch(itemsvalue, (val) => {
  emits('update:modelValue', val)
})
</script>
