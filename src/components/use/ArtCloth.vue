<template>

  <div class="artHeader">
    <label class="visually-hidden" for="LevelArt">{{ getLocalizedText('Level') }}</label>
    <select 
    id="LevelArt"
    :disabled="!selectionResolution"
    name="loadingByFilters" 
    v-model="lvlSelect" 
    @change="loadingByFilters" 
    class="select-css">
    <option value="change" disabled selected>{{ getLocalizedText('Level') }}</option>
    <option v-for="l in lvlArt" :key="l">{{ l }}</option>
  </select>


  <label class="visually-hidden" for="typeArt">{{ getLocalizedText('type') }}</label>
  <select 
  v-if="!selectionResolution"
  id="typeArt"
  name="loadingByFilters" v-model="wSelect" @change="loadingByWeaponFilters" class="select-css">
    <option value="change" disabled selected>Тип</option>
    <option v-for="w in typeWeapon" :key="w.type" :value="w.type">{{ w.name }}</option>
  </select>

  <button 
  @click.stop="putOnThing"
  class="tab-button">
              <p class="p__tab-button">{{ getLocalizedText('PutOn') }}</p>
  </button>

  </div>

<AppLoader 
v-if="isLoading"
/>
  <div 
  class="art" 
  :style="{ maxHeight: `${windowInnerHeight * 0.65}px` }"
  v-if="Object.keys(artParams).length > 0">
    <p
    v-if="errorClassFlag"
    :class="{ error: errorClassFlag }"
    >{{ getLocalizedText('Remainder') }} {{ breedingPoints }}</p>
    <table class="table table_param">
      <thead>
        <tr>
          <td></td>
          <th :colspan="artParams.maxDstamina !== undefined ? 4 : 3">{{ getLocalizedText('MaximumPoint') }}</th>
        </tr>
        <tr>
          <th>{{ getLocalizedText('DistributionPoints') }}</th>
          <th>{{ getLocalizedText('Stats') }}</th>
          <th>{{ getLocalizedText('Armor') }}</th>
          <th>{{ getLocalizedText('ProtectMagic') }}</th>
          <td v-if="artParams.maxDstamina">{{ getLocalizedText('dstamina') }}</td>
        </tr>
      </thead>
      <tbody class="options__tbody">
        <tr>
          <td>{{ breedingPoints }}</td>
          <td>{{ artParams.maxStat }}</td>
          <td>{{ artParams.maxArmor }}</td>
          <td>{{ artParams.maxMagicProtect }}</td>
          <td v-if="artParams.maxDstamina">{{ artParams.maxDstamina }}</td>
        </tr>
      </tbody>
    </table>

    <table class="table">
      <thead>
        <tr>
          <td>{{ getLocalizedText('Parameters') }}</td>
          <td>{{ getLocalizedText('Sum') }}</td>

          <td><span class="material-symbols-outlined">add</span></td>
          <td><span class="material-symbols-outlined">remove</span></td>
        </tr>
      </thead>

      <tbody class="options__tbody">
        <tr v-for="p in artArrPersParams" :key="p.key">
          <td>
            <img :src="p.link" :alt="p.key" />
            {{ getLocalizedText(p.key) }}
          </td>
          <td>
            
            <input
            aria-label="{{ getLocalizedText(p.key) }}"
              type="number"
              :key="inputUpdate"
              :name="p.key"
              :value="p.summStatBonusAndBase"
              @change="handleStatInputChange(p, $event)"
              class="options__input"
            />
          </td>

          <td>
            <button
              :disabled="Number(artParams.distributionPoints) === 0"
              @click="handleStatIncrease(p)"
              class="button__reset"
            >
              <span class="material-symbols-outlined">stat_2</span>
            </button>
          </td>
          <td>
            <button
              @click="handleStatDecrease(p)"
              class="button__reset"
              :class="{ noactive: Number(artParams.distributionPoints) === null }"
            >
              <span class="material-symbols-outlined">stat_minus_2</span>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useStore } from 'vuex'
import { fetchAPIData } from '../../api/fetchApi'
import AppLoader from '../AppLoader.vue'
import { arrayVariableStats } from '../../initialization/baseParams'
import { getLocalizedText } from '@/locale/index'


const emits = defineEmits({
  isClose: null
})
const props = defineProps({
  cellOptions: {
    type: Object,
    required: true
  },
  idMannequin: {
    type: Number,
    required: true
  },
  lvlPerson: {
    type: Number,
    required: true
  }
})
const filtersClasses = {
  category: 'artefact',
  typeid: []
}

const artParams = ref([])
const store = useStore()
const persParams = computed(() => store.getters['listManeken'](props.idMannequin).statModule)
const lvlSelect = ref('change')
const wSelect = ref('change')
const lvlArt = ref(0)
const artTypeParams = ref([])
const inputUpdate = ref(0)
const breedingPoints = ref(0)
let finalAmount = 0
const errorClassFlag = ref(false)
const isLoading = ref(false)
const COUNT_POINGHTS = [
  { type: 'stat', count: 3, maxEl: 'maxStat' },
  { type: 'armor', count: 1, maxEl: 'maxArmor' },
  { type: 'protectionMagick', count: 2, maxEl: 'maxMagicProtect' },
  { type: 'protectionMagick', count: 3, maxEl: 'astralmagicprotection' },
  { type: 'dstamina', count: 36, maxEl: 'maxDstamina' },
]

const windowInnerHeight = document.documentElement.clientHeight

let addParamPoint = arrayVariableStats
addParamPoint.push({ key: 'dstamina', count: 0 })


const artArrPersParams = ref(
  persParams.value.map((item) => {
    return {
      ...item,
      summStatBase: 0,
      summStatBonusAndBase: 0
    }
  })
)
const typeAtrWithDstamina = [40, 55];

if (Array.isArray(props.cellOptions.typeid)) {
  const shouldFilter = !props.cellOptions.typeid.some(value => typeAtrWithDstamina.includes(value));
  if (shouldFilter) {
    artArrPersParams.value = artArrPersParams.value.filter(item => item.type !== 'dstamina');
  }
}


const typeWeapon = [
  { type : 8, name: getLocalizedText('Spear2nd') },
  { type : 9, name: getLocalizedText('Ax2nd') },
  { type : 12, name: getLocalizedText('Sword') },
  { type : 14, name: getLocalizedText('Bow') },
  { type : 15, name: getLocalizedText('Shield') },
  { type : 30, name: getLocalizedText('Staff') },
  { type : 31, name: getLocalizedText('Hammer') },
  { type : 32, name: getLocalizedText('Hammer2nd') },
  { type : 33, name: getLocalizedText('Ax') },
  { type : 35, name: getLocalizedText('Sword2nd') },
  { type : 37, name: getLocalizedText('Rod') },
  { type : 38, name: getLocalizedText('Chestnut') },
  { type : 39, name: getLocalizedText('Knife') },
]

const selectionResolution = ref(true)

const observerType = computed( () => props.cellOptions )

watch(observerType, val => {
  const hasMatch = val.typeid.some((id) => {
    return typeWeapon.some((item) => item.type === id);
  });
  if (hasMatch) {
    selectionResolution.value = false;
  }
}, { immediate: true }  )

function maxLvlArt(lvlPerson) {
  let arrRezult = []
  const maxLvl = lvlPerson <= 24 ? lvlPerson : 24
  for (let i = 6; i <= maxLvl; i++) {
    arrRezult.push(i)
  }
  return arrRezult
}

onMounted(async () => {
  isLoading.value = true
  filtersClasses.typeid = props.cellOptions.typeid
  if(selectionResolution.value) {
    artTypeParams.value = await fetchAPIData(filtersClasses)
  }
  lvlArt.value = maxLvlArt(props.lvlPerson)
  isLoading.value = false
})

const loadingByWeaponFilters = async () => {
  filtersClasses.typeid = wSelect.value
  isLoading.value = true
  artTypeParams.value = await fetchAPIData(filtersClasses)
  selectionResolution.value = true
  isLoading.value = false
}

const loadingByFilters = () => {
  
  artParams.value = artTypeParams.value.find(
    (item) => Number(item.lvlArt) === Number(lvlSelect.value)
  )
  breedingPoints.value = Number(artParams.value.distributionPoints)
}

function changeStat(p, count) {
  errorClassFlag.value = false
  const MIN_STAT_VALUE = 0;
  // определение ценность характеристики в очках
  let COUNT_POINGHTS_STAT;
const statWithType = COUNT_POINGHTS.find((stat) => stat.type === p.type);

if (p.key === 'astralmagicprotection') {
  COUNT_POINGHTS_STAT = Number(statWithType.maxEl === p.key ? statWithType.count : 0);
} else {
  COUNT_POINGHTS_STAT = Number(statWithType ? statWithType.count : 0);
}

// Получаю название переменной максимального значения на точку
const MAX_EL = statWithType ? statWithType.maxEl : null;

  const oldStat = Number(p.summStatBonusAndBase)
  let newstat = Number(count)

  if (newstat < MIN_STAT_VALUE) newstat = MIN_STAT_VALUE;

  if (oldStat > newstat && oldStat !== MIN_STAT_VALUE) {
    newstat = -(oldStat - newstat)
  } else if (oldStat < newstat && oldStat !== MIN_STAT_VALUE) {
    newstat = newstat - oldStat
  }

  // считаю итоговый стат
  const sumParam = oldStat + newstat

  if (sumParam <= artParams.value[MAX_EL]) {
    finalAmount = sumParam
  } else if (sumParam < MIN_STAT_VALUE) {
    finalAmount = MIN_STAT_VALUE
  } else {
    finalAmount = Number(artParams.value[MAX_EL])
  }
  let different = finalAmount - oldStat

  // считаю логику остатка не распределенных стат
  if (breedingPoints.value < different * COUNT_POINGHTS_STAT) {
    finalAmount = Math.floor(breedingPoints.value / COUNT_POINGHTS_STAT)
    different = finalAmount - oldStat
    breedingPoints.value = breedingPoints.value - different * COUNT_POINGHTS_STAT
  } else {
    breedingPoints.value = breedingPoints.value - different * COUNT_POINGHTS_STAT
  }

  // сохраняю изменения
  artArrPersParams.value = artArrPersParams.value.map((item) => {
    if (item.key === p.key) {
      return {
        ...item,
        summStatBonusAndBase: finalAmount
      }
    } else {
      return {
        ...item
      }
    }
  })
  addParamPoint.forEach(item => {
  if (item.key === p.key) {
    item.count = Number(finalAmount);
  }
});

}



const putOnThing = () => {
  if(breedingPoints.value !== 0) {
    errorClassFlag.value = true
  } else {
    errorClassFlag.value = false
   const updateStats = artArrPersParams.value.map(item => {
    return {
      key: item.key,
      count: item.summStatBonusAndBase
    }
   })

   store.dispatch('dummy/changeDummyEl', {
    idMannequin: props.idMannequin,
    addParam: [{ bonusAndBase: updateStats }, { priseInfo: { goldprice: artParams.value.price} }],
    typeid: props.cellOptions.typeid,
    imgLink: '',
    cellName: props.cellOptions.name,
    key: 'artefact',
  })
  }
  if(!errorClassFlag.value) {
    emits('isClose')
  }

}

const handleStatDecrease = (p) => {
  const findParamPoint = addParamPoint.find(item => item.key === p.key)
  const newStat = findParamPoint.count - 1
  changeStat(p, newStat)
}
const handleStatIncrease = (p) => {
  const findParamPoint = addParamPoint.find(item => item.key === p.key)
  const newStat = findParamPoint.count + 1
  changeStat(p, newStat)
}

const handleStatInputChange = (p, event) => {
  changeStat(p, event.target.value)
}



</script>

<script>
export default {
  name: 'ArtCloth'
}
</script>

<style scoped>

.table_param {
  text-align: center;
}

.options__input {
    width: 40px;
}

.artHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.error {
  color: brown;
}

</style>

