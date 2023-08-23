<template>
  <select class="select-css"
  :class="left ? 'form__input_left' : 'form__input'"
  v-model="itemsvalue">
    <option value="none" disabled selected>{{ itemsName }}</option>
    <option  :disabled="isDisabled(p)" v-for="p in items" :value="p.name_en" :key="p.name_en">{{ p.name }}</option>
  </select>
</template>

<script setup>
import { ref, watch } from 'vue'
const itemsvalue = ref('none')

const emits = defineEmits({
  'update:modelValue': () => String
})

const props = defineProps({
  modelValue: {
    type: String,
    required: true
  },
  items: {
    type: Array,
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
  lvlSelect: {
    type: Number,
    required: false
  }
})

const isDisabled = (item) => {
  
  return Number(props.lvlSelect + 1) < Number(item.lvl_req)
}

watch(itemsvalue, (val) => {
  emits('update:modelValue', val)
})
</script>
