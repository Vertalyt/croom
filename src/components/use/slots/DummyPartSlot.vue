
<template>
        <div
          v-for="(d, idx) in dummyItems"
          class="parameter__mat__img"
          :class="addClass"

          :key="d.name"
          :id="`${d.name}_${idx}`"
          @click="handleClothesChoice(d)"
        >
          <img :src="d.link" :alt="d.name" />
        </div>
</template>


<script setup>
const emits = defineEmits({
  handleClothesChoice: () => Array
})
const props = defineProps({
  dummyItems: {
    type: Array,
    required: true
  },
  sizeClass: {
    type: String,
    required: false
  }
})

const classParametr = {
  'small': "parameter__mat__small",
  'big': "parameter__mat__Armor__img",
};

const addClass = classParametr[props.sizeClass] || ''

const handleClothesChoice = (d) => {
  emits('handleClothesChoice', d)
}
</script>

<script>
export default {
  name: 'DummyPartSlot',
}
</script>

