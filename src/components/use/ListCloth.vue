<template>
  <div class="accordionWrap" :class="{ active: openAccordion }">
    <template v-for="(c, idx) in newResult" :key="c.otherInfo.id">
      <div @click="accordionOpen(idx)" class="accordion">
        <div class="accordionFace">
          <div class="accordionFaceInfo">
            <img
              :src="`https://files.nura.biz/site/images/things100x100/${c.otherInfo.image}.png`"
              :alt="c.otherInfo.name"
              class="accordionFaceImg"
            />
            <p>{{ c.otherInfo.name }}</p>
            <p>Рівень: <small>{{ c.otherInfo.minlevel }}</small></p>
          </div>

          <button class="button" @click.stop="dress(c)">Вдягти</button>
        </div>
        <div class="priseInfo">
          <p v-if="c.priseInfo.price">Тали: <small>{{ c.priseInfo.price }}</small></p>
          <p v-if="c.priseInfo.goldprice">Золоті тали: <small>{{ c.priseInfo.goldprice }}</small></p> 
          <p v-if="c.priseInfo.ratnikprice">Ратник: <small>{{ c.priseInfo.ratnikprice }}</small></p> 
          <p v-if="c.priseInfo.obmenprice">Обміни: <small>{{ c.priseInfo.obmenprice }}</small></p> 
          <p v-if="c.priseInfo.reliktprice">Реліквії: <small>{{ c.priseInfo.reliktprice }}</small></p>
        </div>

      </div>

      <div class="panel" :class="{ open: openPanel === idx }">
        <div v-if="foundShortageDifference(c.minParam)" class="addRequiredParameters">
          <p class="smollText error">
            Ваші параметри не достатні, але є достатня кількість балів розводілу. Розподілити?
          </p>
          <button @click.stop="addMinParamCloth(c)" class="button">Розподілити та вдягти</button>
        </div>

        <ChildAccordeonItem
          v-if="Object.entries(c.minParam).length > 0"
          :items="c.minParam"
          :openChildPanel="openChildPanel"
          label="Требуемые параметры"
          typeParam="minParam"
          @changeChildPanel="accordionChildOpen"
        />
        <ChildAccordeonItem
          v-if="Object.entries(c.addParam).length > 0"
          :items="c.addParam"
          :openChildPanel="openChildPanel"
          label="Бонусные параметры"
          typeParam="addParam"
          @changeChildPanel="accordionChildOpen"
        />
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import ChildAccordeonItem from './ChildAccordeonItem.vue'
import { useStore } from 'vuex'
import { arrayVariableStats } from '../../initialization/baseParams'

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

const dress = (item) => {
  // Проверка наличия ключей с "class": "error" в minParam
  const errorKeys = Object.keys(item.minParam).filter((key) => item.minParam[key].class === 'error')

  // Если есть ключи с "class": "error", выведите сообщение и завершите проверку
  if (errorKeys.length > 0) {
    store.dispatch('setMessage', `Ваши параметры ниже минимальных`)
    return
  }
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
  store.dispatch('dummy/changeDummyEl', {
    idMannequin: props.idMannequin,
    addParam: [{ base: transformedMinBaseParam }, { bonusAndBase: convertedAdd }, { priseInfo }, { otherInfo }],
    typeid: item.otherInfo.typeid,
    imgLink: item.otherInfo.image,
    cellName: props.cellOptions.name
  })
  emits('modalClose')
}

const accessibleStats = computed(
  () => store.getters['listManeken'](props.idMannequin).accessibleStats
)


const foundShortageDifference = (ollparam) => {
  let sumShortageDifference = 0
  for (const key in ollparam) {
    if (Object.prototype.hasOwnProperty.call(ollparam, key)) {
      sumShortageDifference += ollparam[key].shortageDifference
    }
  }
  if (accessibleStats.value >= Math.abs(sumShortageDifference) && sumShortageDifference !== 0) {
    return true
  } else {
    return false
  }
}


function mofifyAddParam(key, addParam, item) {
  const modifiedKey = key.replace(/^min/, 'd')
      const statAddparam = addParam.find((item) => item.key === modifiedKey)
      if (statAddparam) {
        statAddparam.count += Math.abs(item.shortageDifference)
      }
}


const statChange = computed(() => store.getters['statChange/listStat'](props.idMannequin))

const addMinParamCloth = (cloth) => {
  let summShortageDifference = 0
  const updatedMinParam = {}
  let addParam = []


  const freestatFound = statChange.value.find((item) => item.type === 'freeStats')
  // Массив с изменениями параметров
  if (freestatFound) {
    addParam = freestatFound.param[0].base
  } else {
    addParam = arrayVariableStats
  }

  // Переберите ключи в новом объекте minParam и обновите соответствующие элементы
  for (const key in cloth.minParam) {
    const item = cloth.minParam[key]

    if (item.shortageDifference < 0) {

      mofifyAddParam(key, addParam, item)
      summShortageDifference += Math.abs(item.shortageDifference)

      updatedMinParam[key] = {
        ...item,
        value: String(parseInt(item.value) + Math.abs(item.shortageDifference)),
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

  const newAccessibleStats = Number(accessibleStats.value) - Number(summShortageDifference)

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
/* Style the buttons that are used to open and close the accordion panel */
.addRequiredParameters {
  display: grid;
  justify-items: center;
  align-items: center;
  margin-bottom: 15px;
}

.smollText {
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

</style>
