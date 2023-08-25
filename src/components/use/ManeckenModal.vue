<template>
  <div class="modal" @click.stop="isClose"></div>
  <div 
  class="modal-content"
  >
    <span @click="isClose" class="close">&times;</span>

    <div class="form__items">
      <select v-model="lvlSelect" @change="lvlSelectChange" class="form__input select-css">
        <option value="change" disabled selected>Виберіть рівень</option>
        <option>0</option>
        <option v-for="l in optionLvl" :key="l">{{ l }}</option>
      </select>
    </div>

    <AppLoader v-if="isloading"/>

    <div v-if="newResult" 
    class="accordionWrap"
    :class="{ active: openAccordion }"
    >
      <template v-for="(c, idx) in newResult" :key="c.otherInfo.id">
        <div @click="accordionOpen(idx)" class="accordion">
          <div class="accordionFaceButton">
            <img
              :src="`https://files.nura.biz/site/images/things100x100/${c.otherInfo.image}.png`"
              :alt="c.otherInfo.name"
              class="accordionFaceImg"
            />
            {{ c.otherInfo.name }}
          </div>
        </div>
        <div class="panel" :class="{ open: openPanel === idx }">
          <p>{{ c.otherInfo.name }}</p>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { fetchAPIData } from '../../api/fetchApi'
import { helm_10Lvl } from '../../initialization/Helm0_10'
import AppLoader from '../AppLoader.vue'


const props = defineProps({
  cellOptions: {
    type: Object,
    required: true
  }
})

const emits = defineEmits({
  isClose: null
})

const openPanel = ref(null)
const lvlSelect = ref('change')
const optionLvl = 24
const newResult = ref('')
const openAccordion = ref(false)
const isloading = ref(false)

const isClose = () => {
  emits('isClose')
}

const accordionOpen = (panelId) => {
  openPanel.value = openPanel.value === panelId ? null : panelId // Переключение состояния
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
  { astralmagicprotection: 0 }
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
const otherInfo = [{ minlevel: 0 }, { name: 0 }, { rarity: 0 }, { id: 0 }, { image: '' }]

const dataSets = [
  { key: 'addParam', array: addParam },
  { key: 'minParam', array: minParam },
  { key: 'otherInfo', array: otherInfo }
]

function filterArr(rezultArr, request, compareWithZero = true) {
  return request.map((requestItem) => {
    const newData = {}

    rezultArr.forEach((item) => {
      const key = Object.keys(item)[0] // Получаем ключ из объекта
      if (requestItem[key] !== undefined && (compareWithZero ? requestItem[key] !== '0' : true)) {
        newData[key] = requestItem[key]
      }
    })

    return newData
  })
}

const lvlSelectChange = async () => {
  isloading.value = true
  openAccordion.value = false


  const sanitizedTypeids = props.cellOptions.typeid.map((item) => {
    if (typeof item === 'string' && !isNaN(item)) {
      return parseInt(item)
    }
    return item
  })
  const filtersClasses = {
    category: 'items',
    typeid: sanitizedTypeids,
    minlevel: parseInt(lvlSelect.value)
    // rarity: 1
  }

  // const request = await fetchAPIData(filtersClasses)
  const request = helm_10Lvl

  newResult.value = request.map((requestItem) => {
    const filteredData = {}
    dataSets.forEach((dataSet) => {
      const filteredArray = filterArr(dataSet.array, [requestItem])
      filteredData[dataSet.key] = filteredArray[0]
    })
    return filteredData
  })

  setTimeout(() => {  
    isloading.value = false
    openAccordion.value = true
  }, 500 )
}

const components = {
  AppLoader
}


</script>

<script>
export default {
  name: 'ManeckenModal'
}
</script>

<style scoped>
/* Style the buttons that are used to open and close the accordion panel */

.accordionWrap {
  border-radius: 10px;
  opacity: 0;
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

.accordionFaceButton {
  display: flex;
  align-items: center;
  justify-content: flex-start;
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
  height:fit-content;
  max-height: 200px; /* Максимальная высота для открытой панели */
  opacity: 1; /* Полная непрозрачность */
  transform: translateY(0); /* Смещение отсутствует */
  transition:
    max-height 0.5s ease-out,
    opacity 0.5s ease-out,
    transform 0.5s ease-out;
}
</style>
