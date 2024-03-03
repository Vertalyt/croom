<template>

  <WhatCanWear 
  :modelValue="reqParameterVal"
  @update:modelValue="(val) => reqParameterVal = val"
  />

  <MinMaxChoice 
  :lvlSearch="lvlSearch"
  :lvlPerson="lvlPerson"
  @updateLvl="emits('lvlMinMaxChange', $event)"
  />

  <div class="form__items">
    <button
      @click="loadingByFilters"
      :disabled="!readyDownload"
      class="tab-button tabLvlButton"
      :class="{ disabled: !readyDownload }"
    >
      <p class="p__tab-button">{{ getLocalizedText('Send') }}</p>
    </button>
  </div>

  <CheckClothList 
  :rarity="rarity"
  @update="(val) => rarity = val"
  />


  <AppLoader v-if="isLoading" />
  
  <div class="wrapperSearchCloth">
    <input
      v-if="newResult"
      :placeholder="getLocalizedText('Search3Letters')"
      v-model="searchCloth"
      class="searchCloth"
    />
  </div>

  <ListCloth
    v-if="newResult"
    :cellOptions="cellOptions"
    :newResult="newResult"
    :openAccordion="openAccordion"
    :idMannequin="idMannequin"
    @modalClose="isClose"
  />

  <span v-if="spanErrorText" class="spanError">{{ spanErrorText }} </span>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useStore } from 'vuex'
import { fetchAPIData } from '../api/fetchApi'
import { getLocalizedText } from '@/locale/index'

import AppLoader from '../components/AppLoader.vue'
import ListCloth from './modalCloth/ListCloth.vue'
import CheckClothList from './modalCloth/CheckClothList.vue'
import MinMaxChoice from './modalCloth/MinMaxChoice.vue'
import WhatCanWear from './modalCloth/WhatCanWear.vue'


const props = defineProps({
  cellOptions: {
    type: Object,
    required: true
  },
  minStats: {
    type: Object,
    required: true
  },
  idMannequin: {
    type: Number,
    required: true
  },
  lvlSearch: {
    type: Array,
    required: true
  },
})

const emits = defineEmits({
  isClose: null,
  lvlMinMaxChange: Object
})

const newResult = ref(null)
const isLoading = ref(false)
const spanErrorText = ref()
const openAccordion = ref(false)
const reqParameterVal = ref(true)
const fullRequests = ref()

const store = useStore()
const lvlPerson = computed(() => store.getters['listManeken'](props.idMannequin).lvl)

const isClose = () => {
  emits('isClose')
}

// массив для отображение бонусных стат
const addParam = [
  { dstrength: 0 },
  { ddexterity: 0 },
  { dintel: 0 },
  { dluck: 0 },
  { dreaction: 0 },
  { dwisdom: 0 },
  { dconst: 0 },
  { whitemagicprotection: 0 },
  { blackmagicprotection: 0 },
  { astralmagicprotection: 0 },
  { headarmor: 0 },
  { bodyarmor: 0 },
  { righthandarmor: 0 },
  { lefthandarmor: 0 },
  { lagsarmor: 0 },
  { dstamina: 0 }
]

// массив для отображение требуемых стат
const minParam = [
  { minstrength: 0 },
  { mindexterity: 0 },
  { minconst: 0 },
  { minintel: 0 },
  { minwisdom: 0 },
  { minluck: 0 },
  { minreaction: 0 }
]

// массив для отображение разной информации по вещи
const otherInfo = [
  { minlevel: 0 },
  { name: 0 },
  { name_en: 0 },
  { rarity: 0 },
  { id: 0 },
  { image: '' },
  { class: '' },
  { typeid: '' },
  { durability: '' },
  { description: '' }
]
// массив для отображение стоимостей по вещи
const priseInfo = [
  { price: '' },
  { goldprice: '' },
  { obmenprice: '' },
  { reliktprice: '' },
  { ratnikprice: '' },
  { artcrystalsprice: '' }
]

const dataSets = [
  { key: 'addParam', array: addParam },
  { key: 'minParam', array: minParam },
  { key: 'otherInfo', array: otherInfo },
  { key: 'priseInfo', array: priseInfo }
]

// типы вещей
const rarity = ref([
  { key: 'goss', id: '1', name: getLocalizedText('goss'), checked: true },
  { key: 'craft', id: '2', name: getLocalizedText('craft'), checked: false },
  { key: 'rarity', id: '3', name: getLocalizedText('rarity'), checked: false },
  { key: 'reward', id: '5', name: getLocalizedText('reward'), checked: false },
  { key: 'epic', id: '6', name: getLocalizedText('epic'), checked: false },
  { key: 'ratnic', id: '7', name: getLocalizedText('ratnic'), checked: false },
  { key: 'mythical', id: '8', name: getLocalizedText('mythical'), checked: false }
  // { key: 'unique', id: '9', name: 'Уникальна річ', checked: false }
])


// фильтруем готовый массив вещей от значений содержащих undefined и '0'
function filterArr(resultArr, request, compareWithZero = true) {
  return request.map((requestItem) => {
    const newData = {}
    resultArr.forEach((item) => {
      const key = Object.keys(item)[0] // Получаем ключ из объекта
      if (requestItem[key] !== undefined && (compareWithZero ? requestItem[key] !== '0' : true)) {
        newData[key] = requestItem[key]
      }
    })
    return newData
  })
}

function suitableThings() {
  return newResult.value.filter((item) => {
    const minParamValues = Object.values(item.minParam)
    const hasError = minParamValues.some((param) => param.class === 'error')
    return !hasError
  })
}

const searchCloth = ref()

watch(searchCloth, (val) => {
  if (val.length > 2) {
    newResult.value = fullRequests.value.filter((item) => item.otherInfo.name.includes(val))
  } else {
    newResult.value = fullRequests.value
  }
})

const rarityId = []

function rarityFilter() {
  rarityId.length = 0
  rarity.value.map((item) => {
    if (item.checked === true) {
      rarityId.push(item.id)
    }
  })

  if (rarityId.length === 0) {
    spanErrorText.value = getLocalizedText('FillOneFilter')
    isLoading.value = false
    openAccordion.value = true
    return
  }
}

function sanitizedTypeIds() {
  return props.cellOptions.typeid.map((item) => {
    if (typeof item === 'string' && !isNaN(item)) {
      return parseInt(item)
    }
    return item
  })
}

function filterDataSets(requestItem, dataSets) {
  const filteredData = {}

  dataSets.forEach((dataSet) => {
    const filteredArray = filterArr(dataSet.array, [requestItem])
    filteredData[dataSet.key] = filteredArray[0]
  })

  return filteredData
}

function updateMinParamClass(p, key, value, classValue, difference = 0) {
  if (Object.prototype.hasOwnProperty.call(p.minParam, key)) {
    p.minParam[key] = {
      value: value,
      class: classValue,
      shortageDifference: difference
    }
  }
}

function processMinStats(newResult, minStats) {
  newResult.value.forEach((p) => {
    Object.keys(p.minParam).forEach((key) => {
      const statInfo = minStats.find((stat) => stat.minKey === key)
      if (statInfo) {
        const minParamValue = parseInt(p.minParam[key])
        const minStatValue = parseInt(statInfo.summStatBase)
        const difference = minStatValue - minParamValue
        if (minStatValue < minParamValue) {
          updateMinParamClass(p, key, p.minParam[key], 'error', difference)
        } else {
          updateMinParamClass(p, key, p.minParam[key], 'norm')
        }
      }
    })
  })
}

const resultArray = []
let readyDownload = ref(false)

const checkDowland = computed(() => props.lvlSearch)
watch(
  checkDowland,
  (val) => {
      // Находим значения count для minLvl и maxLvl
      const minCount = val.find(s => s.id === 'minLvl').count
       
      const maxCount = val.find(s => s.id === 'maxLvl').count
       
      // сортирую по возрастанию
      const sort = [minCount, maxCount].sort((a, b) => a - b)
      // Создаем массив чисел от минимального к максимальному
      resultArray.length = 0
      for (let i = sort[0]; i <= sort[1]; i++) {
        resultArray.push(i)
      }
      readyDownload.value = true

  },
  { immediate: true, deep: true }
)

async function loadingByFilters() {
  if (!readyDownload.value) {
    store.dispatch('setMessage', getLocalizedText('FillRangeLevels'))
    return
  }
  spanErrorText.value = null
  isLoading.value = true
  openAccordion.value = false
  // записываем в массив название выбранных ключей раритетности
  rarityFilter()
  if(rarityId.length) {
    const filtersClasses = {
    category: 'items',
    typeid: sanitizedTypeIds(), // очищаем от пустых строк
    // minlevel: parseInt(lvlSelect.value),
    minlevel: resultArray,
    rarity: rarityId
  }

  newResult.value = null
  const request = await fetchAPIData(filtersClasses)

  if (request.length !== 0) {
    //разбиваю массив на под элементы, согласно dataSets
    newResult.value = request.map((requestItem) => {
      return filterDataSets(requestItem, dataSets)
    })
    fullRequests.value = newResult.value
    // добавляю каждой строчке newResult класс
    processMinStats(newResult, props.minStats)

    // если стоит чекбокс, фильтрую массив по статам
    if (reqParameterVal.value === true) {
      newResult.value = suitableThings()
      fullRequests.value = newResult.value
    }

    // Отсортировать по возрастанию параметра "minlevel"
    newResult.value = newResult.value.sort((a, b) => {
      const minLevelA = parseInt(a.otherInfo.minlevel, 10)
      const minLevelB = parseInt(b.otherInfo.minlevel, 10)
      return minLevelA - minLevelB
    })

    if (newResult.value.length === 0) {
      spanErrorText.value = getLocalizedText('AreNoResults')
    }
  } else {
    store.dispatch('setMessage', getLocalizedText('AreNoResults'))
  }
  }

  setTimeout(() => {
    isLoading.value = false
    openAccordion.value = true
  }, 500)
}


</script>

<script>
export default {
  name: 'SelClothListSort'
}
</script>

<style>
.wrapperSearchCloth {
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
}

.searchCloth {
  border-radius: 10px;
  padding-left: 10px;
}
/* Style the buttons that are used to open and close the accordion panel */
.form__items_modal {
  justify-content: flex-start;
  width: auto;
}
.spanError {
  display: block;
  border: 1px solid #ff000042;
  border-radius: 5px;
  width: 100%;
  text-align: center;
}

.checkbox {
  margin-bottom: 0.4em;
}

.bg-checkbox-wrap * {
  box-sizing: content-box;
}
.bg-checkbox-wrap {
  display: flex;
  justify-content: center;
}
#bg-checkbox {
  display: none;
}
#bg-checkbox-button {
  position: relative;
  display: block;
  width: 225px;
  height: 94px;
  background-color: #337ab7;
  border-radius: 87px;
  cursor: pointer;
  transition: 0.4s ease background-color;
  border: 4px solid #bfe2ff;
}
#bg-checkbox-button #knob {
  width: 72px;
  height: 72px;
  background-image: url('http://images.vfl.ru/ii/1575406053/e9154da5/28793388.jpg');
  background-size: 225px;
  position: relative;
  top: 7px;
  left: 7px;
  border-radius: 50%;
  transition:
    0.4s ease left,
    0.4s ease background-position;
  z-index: 2;
  border: 4px solid #bfe2ff;
}
#bg-checkbox-button #not-ok,
#bg-checkbox-button #ok {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  color: #fff;
  font-size: 13px;
  font-weight: bold;
  text-transform: uppercase;
  margin-left: 102px;
  z-index: 1;
  transition: 0.4s ease opacity;
}
#bg-checkbox-button #ok {
  margin-left: 30px;
  opacity: 0;
}
#bg-checkbox:checked + #bg-checkbox-button #ok {
  opacity: 1;
}
#bg-checkbox:checked + #bg-checkbox-button #not-ok {
  opacity: 0;
}
#bg-checkbox:checked + #bg-checkbox-button #knob {
  left: 138px;
  background-position: -125px 0;
}

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


  .tabLvlButton {
    height: 32px;
  }
}
</style>
