
<template>
    <option  :disabled="isDisabled(p)" v-for="p in items" :value="p.name_en" :key="p.name_en">{{ p.name }}</option>
</template>


<script setup>
const props = defineProps({
  items : {
  type: Array,
  requared: true
  },
  lvlSelect: {
    type: Number,
    required: false
  }
})

const isDisabled = (item) => {
  return Number(props.lvlSelect + 1) < Number(item.minlevel)
}

</script>

<script>
export default {
  name: 'ManeckenOptionSelect',
}
</script>