
<template>
  <div class="checkboxWrapper">
    <div class="checkbox" v-for="t in rarity" :key="t.key">
      <input
        class="custom-checkbox"
        type="checkbox"
        :checked="t.checked"
        :id="t.key"
        :name="t.name"
        :value="t.name"
        v-model="t.checked"
        @click="toggleCheckbox(t.key)"
      />
      <label :for="t.key" class="labelCheckBox">{{ t.name }}</label>
    </div>

    <button
    v-if="isOllToggle === false"
    class="tab-button"
    @click="ollToggle(true)"
    > 
    {{ getLocalizedText('ChooseAll') }}
    </button>

    <button
    v-if="isOllToggle === true"
    class="tab-button"
    @click="ollToggle(false)"
    > 
    {{ getLocalizedText('resetEverything') }}
    </button>

  </div>

</template>


<script setup>
import { ref } from 'vue';
import { getLocalizedText } from '@/locale/index'

const emit = defineEmits({
  update: Object
});
const props = defineProps({
  rarity: {
    type: Object,
    required: true
  }
})

//меняем в массиве rarity состояние включенности в чекбоксе
const toggleCheckbox = (key) => {
  const rarityUpdate = props.rarity.map((item) => {
    if (item.key === key) {
      return {
        ...item,
        checked: !item.checked
      }
    } else {
      return {
        ...item
      }
    }
  })
  emit('update', rarityUpdate)
}

// флаг что все пункты выбраны/убраны
const isOllToggle = ref(false)

const ollToggle = (check) => {
  const rarityUpdate = props.rarity.map((item) => {
    return {
      ...item,
      checked: check === true ? true : false
    }
})
isOllToggle.value = check
emit('update', rarityUpdate)
}

</script>

<script>
export default {
  name: 'CheckClothList',
}
</script>

