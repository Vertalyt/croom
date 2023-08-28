<template>
  <div class="modal" @click.stop="isClose"></div>
  <div class="modal-content">
    <span @click="isClose" class="close">&times;</span>

    <div class="form__items">
      <select v-model="lvlSelect" @change="loadingByFilters" class="select-css">
        <option value="change" disabled selected>Рівень</option>
        <option>0</option>
        <option v-for="l in optionLvl" :key="l">{{ l }}</option>
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
        />
        <label :for="t.name" @click="toggleCheckbox(t.key)" class="labelChexpox">{{
          t.name
        }}</label>
      </div>
    </div>

    <AppLoader v-if="isloading" />

    <ListCloth v-if="newResult" :newResult="newResult" :openAccordion="openAccordion" />

    <span v-if="spanErrorText" class="spanError"> {{ spanErrorText }} </span>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { fetchAPIData } from '../../api/fetchApi'
import { helm_10Lvl } from '../../initialization/Helm0_10'
import AppLoader from '../AppLoader.vue'
import ListCloth from './ListCloth.vue'

const props = defineProps({
  cellOptions: {
    type: Object,
    required: true
  },
  minStats: {
    type: Object,
    required: true
  }
})

const emits = defineEmits({
  isClose: null
})

const lvlSelect = ref('change')
const optionLvl = 24
const newResult = ref(null)
const isloading = ref(false)
const typeRarity = ref('none')
const spanErrorText = ref('')
const openAccordion = ref(false)

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
  { class: '' }
]

const dataSets = [
  { key: 'addParam', array: addParam },
  { key: 'minParam', array: minParam },
  { key: 'otherInfo', array: otherInfo }
]

const rarity = ref([
  { key: 'goss', id: '1', name: 'Звичайна річ', checked: true },
  { key: 'craft', id: '2', name: 'Крафтова річ', checked: true },
  { key: 'rarity', id: '3', name: 'Раритетна річ', checked: true },
  { key: 'reward', id: '5', name: 'Нагородна річ', checked: true },
  { key: 'epic', id: '6', name: 'Епична річ', checked: true },
  { key: 'ratnic', id: '7', name: 'Річ ратника', checked: true },
  { key: 'mythical', id: '8', name: 'Міфічна річ', checked: true },
  { key: 'unique', id: '9', name: 'Уникальна річ', checked: true }
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
    return newResult.value.filter(item => {
        const minParamValues = Object.values(item.minParam);
        const hasError = minParamValues.some(param => param.class === 'error');
        return !hasError;
    });
}



const loadingByFilters = async () => {
  isloading.value = true
  openAccordion.value = false

  const rarityId = []
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

  const sanitizedTypeids = props.cellOptions.typeid.map((item) => {
    if (typeof item === 'string' && !isNaN(item)) {
      return parseInt(item)
    }
    return item
  })
  const filtersClasses = {
    category: 'items',
    typeid: sanitizedTypeids,
    minlevel: parseInt(lvlSelect.value),
    rarity: rarityId
  }

  // const request = await fetchAPIData(filtersClasses)
  let request = helm_10Lvl
  if (request.length === 0) {
    spanErrorText.value = 'Нема результатів по фільтру'
  }

  if (request.length !== 0) {

    newResult.value = request.map((requestItem) => {
      const filteredData = {}
      dataSets.forEach((dataSet) => {
        const filteredArray = filterArr(dataSet.array, [requestItem])
        filteredData[dataSet.key] = filteredArray[0]
      })
      return filteredData
    })


    newResult.value.forEach(p => {
    Object.keys(p.minParam).forEach(key => {
        const statInfo = props.minStats.find(stat => stat.minKey === key);
        if (statInfo) {
          //требуемые статы одежды
            const minParamValue = parseInt(p.minParam[key]);
            
            //базовые статы персонажа, проверка при одевании
            const minStatValue = parseInt(statInfo.summStatBase);

            if (minStatValue < minParamValue) {
                p.minParam[key] = {
                    value: p.minParam[key],
                    class: 'error'
                };
            } else {
                p.minParam[key] = {
                    value: p.minParam[key],
                    class: 'norm'
                };
            }
        }
    });
});
console.log( newResult.value);

const rezult = suitableThings()
console.log(rezult);

    spanErrorText.value = null
  }
  setTimeout(() => {
    isloading.value = false
    openAccordion.value = true
  }, 500)
}




// eslint-disable-next-line no-unused-vars
const components = {
  AppLoader,
  ListCloth
}
</script>

<script>
export default {
  name: 'ManeckenModal'
}
</script>

<style scoped>
/* Style the buttons that are used to open and close the accordion panel */

.spanError {
  display: block;
  border: 1px solid #ff000042;
  border-radius: 5px;
  width: 100%;
  text-align: center;
}

/* для элемента input c type="checkbox" */
.custom-checkbox {
  position: absolute;
  opacity: 0;
}

/* для элемента label, связанного с .custom-checkbox */
.custom-checkbox + label {
  display: inline-flex;
  align-items: center;
  user-select: none;
}

/* создание в label псевдоэлемента before со следующими стилями */
.custom-checkbox + label::before {
  content: '';
  display: inline-block;
  width: 1em;
  height: 1em;
  flex-shrink: 0;
  flex-grow: 0;
  border: 1px solid #adb5bd;
  border-radius: 0.25em;
  margin-right: 0.5em;
  background-repeat: no-repeat;
  background-position: center center;
  background-size: 50% 50%;
}

/* стили при наведении курсора на checkbox */
.custom-checkbox:not(:disabled):not(:checked) + label:hover::before {
  border-color: #b3d7ff;
  cursor: pointer;
}

/* стили для активного чекбокса (при нажатии на него) */
.custom-checkbox:not(:disabled):active + label::before {
  background-color: #b3d7ff;
  border-color: #b3d7ff;
}

/* стили для чекбокса, находящегося в фокусе */
.custom-checkbox:focus + label::before {
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

/* стили для чекбокса, находящегося в фокусе и не находящегося в состоянии checked */
.custom-checkbox:focus:not(:checked) + label::before {
  border-color: #80bdff;
}

/* стили для чекбокса, находящегося в состоянии checked */
.custom-checkbox:checked + label::before {
  border-color: #0b76ef;
  background-color: #0b76ef;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3e%3cpath fill='%23fff' d='M6.564.75l-3.59 3.612-1.538-1.55L0 4.26 2.974 7.25 8 2.193z'/%3e%3c/svg%3e");
}

/* стили для чекбокса, находящегося в состоянии disabled */
.custom-checkbox:disabled + label::before {
  background-color: #e9ecef;
}

body {
  padding: 20px 50px;
}

.checkbox {
  margin-bottom: 0.4em;
}

.labelChexpox {
  padding: 5px;
  cursor: pointer;
}

.labelChexpox:hover {
  border-radius: 10px;
  outline: 1px solid #80808094;
}
</style>
