<template>
  <label class="visually-hidden" :for="itemsName">{{ itemsName }}</label>
  <select 
  :id="itemsName"
  :name="itemsName"
  class="select-css"
  v-model="itemsvalue"
  :disabled="isDIsabled"
  >
    <option value="none" disabled selected>{{ itemsName }}</option>
    <slot name="optionSelect"/>
</select>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
const itemsvalue = ref('none')
const oldValueParam = ref()

const emits = defineEmits({
  'update:modelValue': () => String,
  'oldValueCheck': null,
})

const props = defineProps({
  modelValue: {
    type: String,
    required: true
  },
  itemsName: {
    type: String,
    required: true
  },
  oldValueCheck: {
    type: Boolean,
    required: false
  },
  disabledSel: {
    type: Boolean,
    required: false
  }
})
const computedCheckOld = computed( () =>  props.oldValueCheck)

const isDIsabled = computed( () =>  {
  return props.disabledSel || false
})

watch(computedCheckOld, (val) => {
  if(val === false) {
    itemsvalue.value = oldValueParam.value
  }
})

watch(itemsvalue, (newValue, oldValue) => {
  emits('update:modelValue', newValue)
  oldValueParam.value = oldValue
})
</script>
