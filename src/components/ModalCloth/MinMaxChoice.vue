
<template>
  <div class="form__items">
    <label class="visually-hidden" for="minLvlFilters">{{ getLocalizedText('MinLevel') }}</label>
    <select
      id="minLvlFilters"
      name="minMaxLvlFilters"
      :value="minLvlComputed"
      @change="minMaxLvlFilters('minLvl', $event)"
      class="select-css"
    >
      <option value="change" disabled selected>{{ getLocalizedText('MinLevel') }}</option>
      <option>0</option>
      <option v-for="l in lvlPerson" :key="l">{{ l }}</option>
    </select>

    <label class="visually-hidden" for="MaxLvlFilters">{{ getLocalizedText('MaxLevel') }}</label>
    <select
      id="MaxLvlFilters"
      name="minMaxLvlFilters"
      :value="maxLvlComputed"
      @change="minMaxLvlFilters('maxLvl', $event)"
      class="select-css"
    >
      <option value="change" disabled selected>{{ getLocalizedText('MaxLevel') }}</option>
      <option>0</option>
      <option v-for="l in lvlPerson" :key="l">{{ l }}</option>
    </select>
  </div>
</template>


<script setup>
import { computed } from 'vue';
import { getLocalizedText } from '@/locale/index'

const emits = defineEmits({
  updateLvl: Object
});
const props = defineProps({
  lvlSearch: {
    type: Array,
    required: true
  },
  lvlPerson: {
    type: [String, Number],
    required: true
  },
})

const minLvlComputed = computed( () => {
  return props.lvlSearch.find(s => s.id === 'minLvl').count
} )
const maxLvlComputed = computed( () => {
  return props.lvlSearch.find(s => s.id === 'maxLvl').count
} )


// подготавливаю минимальные и максимальные значения для поиска
const minMaxLvlFilters = async (id, event) => {
  const lvlMinMax = props.lvlSearch.map(c => {
    if(c.id === id) {
      return {
        ...c,
        count: Number(event.target.value)
      }
    } else {
      return c
    }
  })
  emits('updateLvl', lvlMinMax)
}

</script>

<script>
export default {
  name: 'MinMaxChoice',
}
</script>


<style>

.tabLvlButton {
  height: 32px;
}

.disabled {
  opacity: 0.6;
}

@media only screen and (max-device-width: 400px) {
  .form__items {
    flex-wrap: wrap;
  }

  .select-css {
    margin-bottom: 10px;
  }

  .tabLvlButton {
    height: 32px;
  }
}
</style>