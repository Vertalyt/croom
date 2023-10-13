
<template>
    <option  
    v-for="p in items" 
    :value="p.id" 
    :key="p.id"
    :disabled="p.disabled"
    
    >{{ getLocalizedText(p.id) }}</option>
</template>

<script setup>
import { getLocalizedText } from '@/locale/index'

defineProps({
  items : {
  type: Array,
  requared: true
  },
})

</script>

<script>
export default {
  name: 'BasicSlotOpteons',
}
</script>

