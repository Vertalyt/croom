
<template>
  <div class="form__items">
    <div class="form__items form__items_modal">
      <input
        class="custom-checkbox"
        :checked="modelValue"
        @click="emit('update:modelValue', !modelValue)"
        id="cloth"
        type="checkbox"
      />
      <label for="cloth">{{ getLocalizedText('ThoseCanBeDressed') }}</label>
    </div>
  </div>
</template>


<script setup>
import { getLocalizedText } from '@/locale/index'

const emit = defineEmits({
  'update:modelValue': [Boolean],
});
defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  }
})


</script>

<script>
export default {
  name: 'WhatCanWear',
}
</script>

