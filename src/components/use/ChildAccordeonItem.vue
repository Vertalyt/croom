
<template>
        <div @click="accordionChildOpen(typeParam)" class="accordion">
          <div class="accordionFaceButton">
            <h3>{{ label }}</h3>
          </div>
        </div>
        <div class="panel" :class="{ open: openChildPanel === typeParam }">
          <div v-for="(value, key) in items" :key="key">
            <p>{{ getStatName(key, typeParam) }} {{ value }}</p>
          </div>
        </div>
</template>


<script setup>
import { ref } from 'vue'

const props = defineProps({
  items: {
    type: Object,
    required: true
  },
  label : {
    type: String,
    required: true
  },
  typeParam:  {
    type: String,
    required: true
  },
})

const openChildPanel = ref(null)

const accordionChildOpen = (panelId) => {
  openChildPanel.value = openChildPanel.value === panelId ? null : panelId // Переключение состояния
}


const nameStat = [
  { minParam: 'minstrength', addParam: 'dstrength', name: 'Сила' },
  { minParam: 'mindexterity', addParam: 'ddexterity', name: 'Ловкость' },
  { minParam: 'minconst', addParam: 'dconst', name: 'Сложение' },
  { minParam: 'minintel', addParam: 'dintel', name: 'Интеллект' },
  { minParam: 'minwisdom', addParam: 'dwisdom', name: 'Мудрость' },
  { minParam: 'minluck', addParam: 'dluck', name: 'Удача' },
  { minParam: 'minreaction', addParam: 'dreaction', name: 'Реакция' }
]

const getStatName = (key, type) => {
  const stat = nameStat.find((i) => i[type] === key)
  return stat ? stat.name : ''
}

</script>

<script>
export default {
  name: 'ChildAccordeonItem',
}
</script>

<style scoped>
/* Style the buttons that are used to open and close the accordion panel */

.accordion {
  background-color: #eee;
  border-radius: 10px;
  border: 1px solid #413e3e2f;
  margin-bottom: 2px;
  color: #444;
  cursor: pointer;
  padding: 10px 18px;
  width: calc(100% - 38px);
  text-align: left;
  outline: none;
}

/* Style the accordion panel. Note: hidden by default */
.panel {
  padding: 0 18px;
  background-color: white;
  max-height: 0;
  overflow: hidden;
  transition:
    max-height 0.5s ease-out,
    opacity 0.5s ease-out;
  opacity: 0; /* Начальная непрозрачность */
  transform: translateY(-10px); /* Начальное смещение */
}

.open {
  height: fit-content;
  max-height: 200px; /* Максимальная высота для открытой панели */
  opacity: 1; /* Полная непрозрачность */
  transform: translateY(0); /* Смещение отсутствует */
  transition:
    max-height 0.5s ease-out,
    opacity 0.5s ease-out,
    transform 0.5s ease-out;
}
</style>