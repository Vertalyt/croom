
<template>
    <option  v-for="p in items" :value="p.id" :key="p.id">{{ p.name }}</option>
</template>

<script setup>
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

