
<template>
        <div @click="accordionChildOpen(typeParam)" class="accordion accordionChild">
          <div class="accordionFaceButton">
            <h3>{{ label }}</h3>
          </div>
        </div>
        <div class="panel statWrapper" :class="{ open: openChildPanel === typeParam }">
          <template 
          v-for="(value, key) in items" 
          :key="key"
          >
            <div           
            class="stat"
            :class="value.class"
            >{{ getStatName(key, typeParam) }} {{ getStatCoast(value) }}</div>


          </template>
        </div>
</template>


<script setup>
import { getLocalizedText } from '@/locale/index'

const emits = defineEmits({
  changeChildPanel: () => String
})

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
  openChildPanel: {
    type: String,
    required: false
  }
})

const accordionChildOpen = (panelId) => {
  emits('changeChildPanel', panelId)
}


const nameStat = [
  { minParam: 'minstrength', addParam: 'dstrength', name: getLocalizedText('dstamina') },
  { minParam: 'mindexterity', addParam: 'ddexterity', name: getLocalizedText('ddexterity') },
  { minParam: 'minconst', addParam: 'dconst', name: getLocalizedText('dconst') },
  { minParam: 'minintel', addParam: 'dintel', name: getLocalizedText('dintel') },
  { minParam: 'minwisdom', addParam: 'dwisdom', name: getLocalizedText('dwisdom') },
  { minParam: 'minluck', addParam: 'dluck', name: getLocalizedText('dluck') },
  { minParam: 'minreaction', addParam: 'dreaction', name: getLocalizedText('dreaction') },
  { minParam: 'whitemagicprotection', addParam: 'whitemagicprotection', name: getLocalizedText('whitemagicprotection') },
  { minParam: 'blackmagicprotection', addParam: 'blackmagicprotection', name: getLocalizedText('blackmagicprotection') },
  { minParam: 'astralmagicprotection', addParam: 'astralmagicprotection', name: getLocalizedText('astralmagicprotection') },
  { minParam: 'headarmor', addParam: 'headarmor', name: getLocalizedText('headarmor2') },
  { minParam: 'bodyarmor', addParam: 'bodyarmor', name: getLocalizedText('bodyarmor2') },
  { minParam: 'righthandarmor', addParam: 'righthandarmor', name: getLocalizedText('righthandarmor2') },
  { minParam: 'lefthandarmor', addParam: 'lefthandarmor', name: getLocalizedText('lefthandarmor2') },
  { minParam: 'lagsarmor', addParam: 'lagsarmor', name: getLocalizedText('lagsarmor2') },
  { addParam: 'dstamina', name: getLocalizedText('dstamina')},
]

const getStatName = (key, type) => {
  const stat = nameStat.find((i) => i[type] === key)
  return stat ? stat.name : ''
}

const getStatCoast = (value) => {
  return props.typeParam === 'minParam' ? value.value : value
}

</script>

<script>
export default {
  name: 'ChildAccordeonItem',
}
</script>

<style scoped>
/* Style the buttons that are used to open and close the accordion panel */

.error {
    color: #ff2121;
    border: 1px solid #ff000038;
    border-radius: 5px;
}

.statWrapper {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
}

.stat {
    padding: 1px 10px;
    border-radius: 5px;
    border: 1px solid rgba(85, 71, 41, 0.466);
    margin: 3px;
}

.accordion {
  background-color: #eee;
  border-radius: 10px;
  border: 1px solid #413e3e2f;
  margin-bottom: 7px;
  color: #444;
  cursor: pointer;
  padding: 10px 18px;
  width: calc(100% - 38px);
  text-align: left;
  outline: none;
}

.accordionChild {
    margin: 5px;
    padding: 0px 10px;
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