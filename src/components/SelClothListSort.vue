
<template>
    <div class="form__items">
      <div class="form__items form__items_modal">
        <input
          class="custom-checkbox"
          v-model="reqParameterVal"
          @click="clothesfilter"
          id="cloth"
          type="checkbox"
        />
        <label for="cloth">Те, що можна одягнути</label>
      </div>

      <select 
      name="loadingByFilters"
      v-model="lvlSelect" @change="loadingByFilters" class="select-css">
        <option value="change" disabled selected>Рівень</option>
        <option>0</option>
        <option v-for="l in lvlPerson" :key="l">{{ l }}</option>
      </select>
    </div>

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
        <label :for="t.key" class="labelChexpox">{{ t.name }}</label>
      </div>
    </div>

    <AppLoader v-if="isloading" />

    <ListCloth v-if="newResult" :cellOptions="cellOptions" :newResult="newResult" :openAccordion="openAccordion" :idMannequin="idMannequin" @modalClose="isClose"/>

    <span v-if="spanErrorText" class="spanError"> {{ spanErrorText }} </span>

</template>


<script setup>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { fetchAPIData } from '../api/fetchApi'
import AppLoader from '../components/AppLoader.vue'
import ListCloth from '../components/use/ListCloth.vue'

const props = defineProps({
  cellOptions: {
    type: Object,
    required: true
  },
  minStats: {
    type: Object,
    required: true
  },
  idMannequin:{
    type: Number,
    required: true
  },
})

const emits = defineEmits({
  isClose: null
})

const lvlSelect = ref('change')

const newResult = ref(null)
const isloading = ref(false)
const spanErrorText = ref('')
const openAccordion = ref(false)
const reqParameterVal = ref(true)

const store = useStore()
const lvlPerson = computed( () => store.getters['listManeken'](props.idMannequin).lvl )

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
  { dstamina: 0 },
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
  { rarity: 0 },
  { id: 0 },
  { image: '' },
  { class: '' },
  { typeid: '' },
]
// массив для отображение стоимостецй по вещи по вещи
const priseInfo = [
  { price: '' },
  { goldprice: '' },
  { obmenprice: '' },
  { reliktprice: '' },
  { ratnikprice: '' },
  { artcrystalsprice: '' },
]

const dataSets = [
  { key: 'addParam', array: addParam },
  { key: 'minParam', array: minParam },
  { key: 'otherInfo', array: otherInfo },
  { key: 'priseInfo', array: priseInfo }
]

const rarity = ref([
  { key: 'goss', id: '1', name: 'Звичайна річ', checked: true },
  { key: 'craft', id: '2', name: 'Крафтова річ', checked: true },
  { key: 'rarity', id: '3', name: 'Раритетна річ', checked: true },
  { key: 'reward', id: '5', name: 'Нагородна річ', checked: true },
  { key: 'epic', id: '6', name: 'Епична річ', checked: true },
  { key: 'ratnic', id: '7', name: 'Річ ратника', checked: true },
  { key: 'mythical', id: '8', name: 'Міфічна річ', checked: true },
  { key: 'unique', id: '9', name: 'Уникальна річ', checked: false }
])

//меняем в массиве rarity состояние включенности в чекбоксе
const toggleCheckbox = (key) => {
  rarity.value = rarity.value.map((item) => {
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
  if (!isNaN(lvlSelect.value)) {
    loadingByFilters()
  }
}

// фильтруем готовый массив вещей от значений содержащих undefined и '0'
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

function suitableThings() {
  return newResult.value.filter((item) => {
    const minParamValues = Object.values(item.minParam)
    const hasError = minParamValues.some((param) => param.class === 'error')
    return !hasError
  })
}

const rarityId = []

function rarityFilter() {
  rarity.value.map((item) => {
    if (item.checked === true) {
      rarityId.push(item.id)
    }
  })

  if (rarityId.length === 0) {
    spanErrorText.value = 'Заповни хоча б один фільтр'
    isloading.value = false
    openAccordion.value = true
    return
  }
}

function sanitizedTypeids() {
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

function updateMinParamClass(p, key, value, classValue) {
  if (Object.prototype.hasOwnProperty.call(p.minParam, key)) {
    p.minParam[key] = {
      value: value,
      class: classValue
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

        if (minStatValue < minParamValue) {
          updateMinParamClass(p, key, p.minParam[key], 'error')
        } else {
          updateMinParamClass(p, key, p.minParam[key], 'norm')
        }
      }
    })
  })
}

// загружаем данные с севера
const loadingByFilters = async () => {
  isloading.value = true
  openAccordion.value = false
  // записываем в массив название выбранных ключей раритетности
  rarityFilter()
  const filtersClasses = {
    category: 'items',
    typeid: sanitizedTypeids(), // очищаем от пустых строк
    minlevel: parseInt(lvlSelect.value),
    rarity: rarityId
  }

  const request = await fetchAPIData(filtersClasses)
  if (request.length === 0) {
    spanErrorText.value = 'Нема результатів по фільтру'
  }

  if (request.length !== 0) {
    //разбиваю массив на под элементы, согласно dataSets
    newResult.value = request.map((requestItem) => {
      return filterDataSets(requestItem, dataSets)
    })

    // добавляю каждой строчке newResult класс
    processMinStats(newResult, props.minStats)

    // если стоит чекбокс, фильтрую массив по статам
    if (reqParameterVal.value === true) {
      newResult.value = suitableThings()
    }

    spanErrorText.value = null
  }
  setTimeout(() => {
    isloading.value = false
    openAccordion.value = true
  }, 500)
}

const clothesfilter = () => {
  reqParameterVal.value = !reqParameterVal.value
  
  if (newResult.value !== null && lvlSelect.value !== 'change') {
    loadingByFilters()
  }
}

</script>

<script>
export default {
  name: 'SelClothListSort',
}
</script>

<style>
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
	background-color: #337AB7;
	border-radius: 87px;
	cursor: pointer;
	transition: 0.4s ease background-color;  
    border: 4px solid #BFE2FF;
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
	transition: 0.4s ease left, 0.4s ease background-position;
	z-index: 2;
	border: 4px solid #BFE2FF;
}
#bg-checkbox-button #not-ok,
#bg-checkbox-button #ok {
	position: absolute;
	top: 50%;
	transform: translateY(-50%);
	color: #fff;
	font-size: 13px;
	font-weight: bold;
	font-family: Verdana, sans-serif;
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


</style>