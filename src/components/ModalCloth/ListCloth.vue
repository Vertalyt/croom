<template>
  <div class="accordionWrap" :class="{ active: openAccordion }">
   
    <template v-for="(c, idx) in newResult" :key="c.otherInfo.id">
      <div @click="accordionOpen(idx)" class="accordion">
        <div class="accordionFace">
          <div class="accordionFaceInfo">
            <img
              :src="`https://files.nura.biz/site/images/things100x100/${c.otherInfo.image}.png`"
              :alt="c.otherInfo.name_en"
              class="accordionFaceImg"
            />
            <p>{{ localeName(c) }}</p>
            <p>
              {{ getLocalizedText('Level') }}: <small>{{ c.otherInfo.minlevel }}</small>
            </p>
          </div>

          <div class="dressAddGroup">
            <button 
            v-if="ringsAndRelics || earrings"
            class="button buttonX4" @click.stop="dressX(c)">{{ nameX }}</button>
            <button class="button" @click.stop="dress(c)">{{ getLocalizedText('Dress') }}</button>
          </div>
        </div>

        <div 
        v-for="(value, key) in c.priseInfo"
        :key="key" 
        class="priseInfo" >
        <p v-if="value" >
          {{ getLocalizedText(key) }}: <small>{{ value }}</small>
          </p>
        </div>

      </div>

      <div class="panel" :class="{ open: openPanel === idx }">
        <div v-if="foundShortageDifference(c.minParam)" class="addRequiredParameters">
          <p class="smallText error">
            {{ getLocalizedText('distributeDress') }}
          </p>
          <button @click.stop="addMinParamCloth(c)" class="button">
            {{ getLocalizedText('DistributeAndDress') }}
          </button>
        </div>

        
        <p class="descriptionInfo">{{ c.otherInfo.description }}</p>
        <ChildAccordeonItem
          v-if="Object.entries(c.minParam).length > 0"
          :items="c.minParam"
          :openChildPanel="openChildPanel"
          :label="getLocalizedText('RequiredParameters')"
          typeParam="minParam"
          @changeChildPanel="accordionChildOpen"
        />
        <ChildAccordeonItem
          v-if="Object.entries(c.addParam).length > 0"
          :items="c.addParam"
          :openChildPanel="openChildPanel"
          :label="getLocalizedText('BonusOptions')"
          typeParam="addParam"
          @changeChildPanel="accordionChildOpen"
        />
      </div>
    </template>


  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import ChildAccordeonItem from './ChildAccordeonItem.vue'
import { useStore } from 'vuex'
import { distributedStatuses } from '../../utils/index'

import { getLocalizedText } from '@/locale/index'

const props = defineProps({
  newResult: {
    type: Array,
    required: true
  },
  openAccordion: {
    type: Boolean,
    required: true
  },
  idMannequin: {
    type: Number,
    required: true
  },
  cellOptions: {
    type: Object,
    required: true
  }
})


const emits = defineEmits({
  modalClose: null
})
const openPanel = ref(null)
const openChildPanel = ref('')
const store = useStore()

const locale = store.getters['requests/clientInfo']

function localeName(c) {
  if(locale && locale.locale === "en-US") {
    return c.otherInfo.name_en
  } else {
    return c.otherInfo.name
  }
}


const observerType = computed( () => props.cellOptions )
const ringsAndRelics = ref()
const earrings = ref()

const nameX = ref('')

watch(observerType, (val) => {
  ringsAndRelics.value = val.typeid.find(item => item === 40 || item === 7)
  if(ringsAndRelics.value) {
    nameX.value = 'x4';
  }
  earrings.value = val.typeid.find(item => item === 55)
  if(earrings.value) {
    nameX.value = 'x2';
  }
}, { immediate: true });


const accordionChildOpen = (panelId) => {
  openChildPanel.value = openChildPanel.value === panelId ? '' : panelId // Переключение состояния
}

const accordionOpen = (panelId) => {
  openPanel.value = openPanel.value === panelId ? '' : panelId // Переключение состояния
  openChildPanel.value = ''
}

function parameterConversion(params) {
  const convertedData = []
  for (const key in params) {
    if (Object.hasOwnProperty.call(params, key)) {
      convertedData.push({
        key: key,
        count: parseInt(params[key])
      })
    }
  }
  return convertedData
}

function checkingForImpossibility(item) {
  // Проверка наличия ключей с "class": "error" в minParam
  const errorKeys = Object.keys(item.minParam).filter((key) => item.minParam[key].class === 'error')

  // Если есть ключи с "class": "error", выведите сообщение и завершите проверку
  if (errorKeys.length > 0) {
    store.dispatch('setMessage', `Ваши параметры ниже минимальных`)
    return false
  } else {
    return true
  }

}

function preparingRequestArray(item) {
  const addParam = item.addParam
  const minBaseParam = item.minParam
  const priseInfo = item.priseInfo
  const otherInfo = item.otherInfo


  // Создаем новый массив для хранения преобразованных минимальных базовых значений
  const transformedMinBaseParam = Object.keys(minBaseParam).map((key) => {
    return {
      key: key.replace('min', 'd'), // Преобразуем "minstrength" в "dstrength" и т.д.
      count: parseInt(minBaseParam[key].value, 10),
      class: minBaseParam[key].class
    }
  })

  // Преобразовываем данные с addParam
  const convertedAdd = parameterConversion(addParam)
  //     addParam: [{ base: transformedMinBaseParam }, { bonusAndBase: convertedAdd }, { priseInfo }, { otherInfo }],

  return [
    { base: transformedMinBaseParam },
    { bonusAndBase: convertedAdd },
    { priseInfo },
    { otherInfo }
  ]
}

const dressX = (item) => {
  const check = checkingForImpossibility(item)
  if (check) {
    store.dispatch('dummy/changeDummyElX', {
      idMannequin: props.idMannequin,
      addParam: preparingRequestArray(item),
      typeid: item.otherInfo.typeid,
      imgLink: item.otherInfo.image,
      cellName: props.cellOptions.name
    })
    emits('modalClose')
  }
}

const dress = (item) => {

  const check = checkingForImpossibility(item)
  if (check) {
    store.dispatch('dummy/changeDummyEl', {
      idMannequin: props.idMannequin,
      addParam: preparingRequestArray(item),
      typeid: item.otherInfo.typeid,
      imgLink: item.otherInfo.image,
      cellName: props.cellOptions.name
    })
    emits('modalClose')
  }
}

const accessibleStats = computed(
  () => store.getters['listManeken'](props.idMannequin).accessibleStats
)

const foundShortageDifference = (ollParam) => {
  let sumShortageDifference = 0
  for (const key in ollParam) {
    if (Object.prototype.hasOwnProperty.call(ollParam, key)) {
      sumShortageDifference += ollParam[key].shortageDifference
    }
  }
  if (accessibleStats.value >= Math.abs(sumShortageDifference) && sumShortageDifference !== 0) {
    return true
  } else {
    return false
  }
}

function modifyAddParam(key, addParam, item) {
  const modifiedKey = key.replace(/^min/, 'd')
  const statAddParam = addParam.find((item) => item.key === modifiedKey)
  if (statAddParam) {
    statAddParam.count += Math.abs(item.shortageDifference)
  }
}




const addMinParamCloth = (cloth) => {
  let sumShortageDifference = 0
  const updatedMinParam = {}
  let addParam = []

    // проверяю, добавлялись ли ранее статы шмотками или статами
  const statChange = store.getters['statChange/listStat'](props.idMannequin)
    addParam = distributedStatuses(statChange)
  
  // Переберите ключи в новом объекте minParam и обновите соответствующие элементы
  for (const key in cloth.minParam) {
    const item = cloth.minParam[key]

    if (item.shortageDifference < 0) {
      modifyAddParam(key, addParam, item)
      sumShortageDifference += Math.abs(item.shortageDifference)

      updatedMinParam[key] = {
        ...item,
        value: String(item.value),
        shortageDifference: 0,
        class: 'norm'
      }
    } else {
      updatedMinParam[key] = { ...item }
    }
  }

  store.commit('statChange/statChange', {
    addParam: [{ base: addParam }],
    type: 'freeStats',
    idMannequin: props.idMannequin
  })

  const newAccessibleStats = Number(accessibleStats.value) - Number(sumShortageDifference)

  store.commit('updateManekenInfo', {
    accessibleStats: newAccessibleStats,
    idMannequin: props.idMannequin
  })

  // Сохраните обновленные minParam в cloth
  cloth.minParam = updatedMinParam


  dress(cloth)
}
</script>

<script>
export default {
  name: 'ListCloth'
}
</script>

<style scoped>
.addRequiredParameters {
  display: grid;
  justify-items: center;
  align-items: center;
  margin-bottom: 15px;
}

.smallText {
  font-size: 12px;
}

.error {
  color: #af3f3f;
}

.active {
  opacity: 1;
  transition: opacity 0.5s linear;
}

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

.accordionFace {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.accordionFaceInfo {
  display: grid;
  justify-items: center;
}

.accordionFaceImg {
  width: 40px;
  height: auto;
  margin-right: 10px;
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
  max-height: 600px; /* Максимальная высота для открытой панели */
  opacity: 1; /* Полная непрозрачность */
  transform: translateY(0); /* Смещение отсутствует */
  transition:
    max-height 0.5s ease-out,
    opacity 0.5s ease-out,
    transform 0.5s ease-out;
}

.priseInfo {
  display: flex;
  flex-wrap: wrap;
}

small {
  font-weight: 400;
  color: #9f6426;
}

.dressAddGroup {
  display: grid;

  align-items: center;
  justify-items: center;
}

.buttonX4 {
  border-radius: 20px;
  padding: 8px;
  margin-bottom: 20px;
}

.descriptionInfo {
    font-size: 12px;
    font-style: italic;
    text-align-last: center;
}
</style>
