
<template>
    <option  :disabled="isDisabled(p)" v-for="p in items" :value="p.name_en" :key="p.name_en">{{ localeName(p) }}</option>
</template>


<script setup>


const props = defineProps({
  items : {
  type: Array,
  required: true
  },
  lvlSelect: {
    type: Number,
    required: false
  },
  locale: {
    type: [Object, null],
    required: true
  }
})

const isDisabled = (item) => {
  return Number(props.lvlSelect) < Number(item.minlevel) || item.disabled
}

function localeName(p) {
  if(props.locale && props.locale.locale === 'en-US') {
    return p.name_en
  } else {
    return p.name
  }
}

</script>

<script>
export default {
  name: 'ManeckenOptionSelect',
}
</script>