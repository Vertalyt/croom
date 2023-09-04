<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { baseStatFromLvl } from '../utils/baseStatFromLvl'
import { modifyStat } from '../utils/modifyStat'
import ManekenStatParams from './Manekenstatparams.vue'
import ManekenSlot from './use/slots/ManekenSlot.vue'
import { fetchAPIData } from '../api/fetchApi'
import ManeckenSelectItems from './use/ManeckenSelectItems.vue'
import { baseStatClasses, fortressParam, raseParams } from '../initialization/baseParams'
import DummyPartSlot from './use/slots/DummyPartSlot.vue'
import ManeckenOptionSelect from './use/slots/ManeckenOptionSelect.vue'
import BasicSlotOpteons from './use/slots/BasicSlotOptions.vue'
import { useStore } from 'vuex'


const props = defineProps({
  isDummyLoaded: {
    type: Array,
    required: true
  },
  updatedStatConfigurations: {
    type: Array,
    required: true
  },
  idMannequin: {
    type: Number,
    required: true
  }
})
const emits = defineEmits({
  changeRase: String,
  modalOpen: Array,
  updateLvl: Number,
})

const raseModel = ref('human')
const lvlSelect = ref('change')
const accessibleStats = ref(null) //количество стат для распределения
const baseStat = ref(baseStatFromLvl())
const classModel = ref('none')
const OllParamClass = ref([])
const parentClassItems = ref(null)
const parentClassModel = ref('none')
const parentClasses = ref([])
const store = useStore()


// массив с изменениями параметров
const addParam = ref([
  { key: 'dstrength', count: 0 },
  { key: 'ddexterity', count: 0 },
  { key: 'dintel', count: 0 },
  { key: 'dluck', count: 0 },
  { key: 'dreaction', count: 0 },
  { key: 'dwisdom', count: 0 },
  { key: 'dconst', count: 0 },
  { key: 'whitemagicprotection', count: 0 },
  { key: 'blackmagicprotection', count: 0 },
  { key: 'astralmagicprotection', count: 0 }
])

const fortress = ref('none')
const availableFortressOptions = fortressParam
const availableRaces = raseParams
//props
const leftDummyPart = props.isDummyLoaded.filter((d) => d.location === 'leftDummyPart')
const rightDummyPart = props.isDummyLoaded.filter((d) => d.location === 'rightDummyPart')
const centerTopDummyPart = props.isDummyLoaded.filter((d) => d.location === 'centerTopDummyPart')
const centerBottomDummyPart = props.isDummyLoaded.filter(
  (d) => d.location === 'centerBottomDummyPart'
)
//

const filtersClasses = ref({
  category: 'classes'
  // parent: 8
})

onMounted(async () => {
  // OllParamClass.value = await fetchAPIData(filtersClasses.value)
  OllParamClass.value = baseStatClasses
  parentClasses.value = OllParamClass.value.filter((p) => p.parent == 0)
})

// слежение за изменением суммарного массива updatedStatConfigurations
const statParams = computed(() => props.updatedStatConfigurations.filter((d) => d.type === 'stat'))

// emits

const handleRaseSelectChange = (availableRaces) => {
  emits('changeRase', {
    raseModel: availableRaces,
  })
}

const handleClassSelectChange = (className) => {
  parentClassItems.value = OllParamClass.value.filter((p) => p.parent_name === className)
}

// массив с бонусами от класа
const addClassParam = addParam.value.map((item) => ({ ...item, count: 0 }))

// массив с требониями класа, что нужно автоматически распределить
const addClassMinParam = [
  { key: 'minstrength', count: 0 },
  { key: 'mindexterity', count: 0 },
  { key: 'minreaction', count: 0 },
  { key: 'minconst', count: 0 },
  { key: 'minintel', count: 0 },
  { key: 'minwisdom', count: 0 },
  { key: 'minluck', count: 0 }
]

function recalculationValues(parent, items) {
  const parentClassItem = OllParamClass.value.filter((p) => p.name_en === parent)
  for (const item of parentClassItem) {
    // Перебираем элементы массива
    for (const param of items) {
      // Если значения ключей совпадают и значение не равно null
      if (item[param.key] !== null) {
        param.count = parseInt(item[param.key]) // Преобразуем значение в число и записываем в count
      }
    }
  }
}

const handleParentClassSelectChange = (parent) => {
  recalculationValues(parent, addClassParam)
  recalculationValues(parent, addClassMinParam)

  const updateMinParam = addClassMinParam.map((item) => {
    switch (item.key) {
      case 'minstrength':
        return { key: 'dstrength', count: item.count }
      case 'mindexterity':
        return { key: 'ddexterity', count: item.count }
      case 'minreaction':
        return { key: 'dreaction', count: item.count }
      case 'minconst':
        return { key: 'dconst', count: item.count }
      case 'minintel':
        return { key: 'dintel', count: item.count }
      case 'minwisdom':
        return { key: 'dwisdom', count: item.count }
      case 'minluck':
        return { key: 'dluck', count: item.count }
      default:
        return item
    }
  })
  // Проходим по каждой строке в updatedStatConfigurations
  const updatedStats = updateMinParam.map((item) => {
    const matchingConfig = props.updatedStatConfigurations.find(
      (statConfig) => statConfig.key === item.key
    )

    if (matchingConfig) {
      const diff =
        matchingConfig.summStatBase < item.count ? item.count - matchingConfig.summStatBase : 0
      return {
        key: item.key,
        count: diff
      }
    }
    return item
  })
  const totalSum = updatedStats.reduce((accumulator, item) => accumulator + item.count, 0)

  if (accessibleStats.value > totalSum) {
    accessibleStats.value -= totalSum
 
    store.commit('listStatObjects/statChange', { addParam: [{'oll': updatedStats},{'bonusAndBase': addClassParam }], type: 'addShoes', idMannequin: props.idMannequin }  )
  } else {
    console.log('Не достаточно очков')
  }
}

let oldAccessibleStats = 0 // остаток не распределенных стат
let oldCountStat = 0 // старое количество стат на уровне
const different = ref(0)
// сброс массива addParam изменения стат при смене уровня
const lvlSelectChange = () => {
  const newCountStat = baseStat.value.find((l) => l.lvl === Number(lvlSelect.value)).stat // получаю стартовое количество стат на уровне
  oldAccessibleStats = accessibleStats.value // остаток не распределенных стат
  const lvlStatDifference = Number(newCountStat) - Number(oldCountStat) // разница стат на уровне
  different.value = lvlStatDifference + oldAccessibleStats

  if (lvlStatDifference > 0 || different.value > -1) {
    updateStatsAndEmitEvent(different.value, newCountStat);
    emits('updateLvl', Number(lvlSelect.value))
  } else {
    console.log(`Распределено стат больше, чем возможно на уровне на ${Math.abs(different.value)}`);
  }
}

const updateStatsAndEmitEvent = (difference, newCountStat) => {
  accessibleStats.value = difference;
  oldCountStat = newCountStat;
  const addClassParam = addParam.value.map((item) => ({ ...item, count: 0 }));
  classModel.value = 'none';

  store.commit('listStatObjects/statChange', { addParam: [{'oll': addClassParam}], type: 'changeLvl', idMannequin: props.idMannequin }  )



};

const modifyStatAndEmit = (statKey, increment) => {
  const { addParam: updatedAddParam, accessibleStats: updatedAccessibleStats } = modifyStat({
    accessibleStats: accessibleStats.value,
    addParam: addParam.value,
    statKey,
    increment
  })
  addParam.value = updatedAddParam
  accessibleStats.value = updatedAccessibleStats

  store.commit('listStatObjects/statChange', { addParam: [{'oll': addParam.value}], type: 'freeStats', idMannequin: props.idMannequin }  )

  
}

watch(accessibleStats, val => {
  const newCountStat = baseStat.value.find((l) => l.lvl === Number(lvlSelect.value)).stat;
  baseStat.value.forEach(item => {
    item.disabled = item.stat < (Number(newCountStat) - Number(val));
  });
});


const handleStatIncrease = (statKey) => {
  modifyStatAndEmit(statKey, Number(1))
}
const handleStatDecrease = (statKey) => {
  modifyStatAndEmit(statKey, Number(-1))
}

const handleStatInputChange = (stat) => {
  // изменение стат через инпут
  const oldBaseStat = statParams.value.find((s) => s.key === stat.key).summStatBonusAndBase // ищу предыдущие значение стата
  let statChange = Number(stat.summStatBase) - Number(oldBaseStat) //высчитываю разницу, на которое буду изменять
  if (accessibleStats.value < statChange) {
    statChange = accessibleStats.value // при избыточной разнице
  }
  modifyStatAndEmit(stat.key, statChange)
}

const handleResetManecken = () => {
  addParam.value.map((p) => (p.count = 0))
  emits('changeRase', {
    raseModel: 'human',
  })
  raseModel.value = 'human'
  lvlSelect.value = 'change'
  accessibleStats.value = null
  classModel.value = 'none'
}

const handleClothesChoice = async (param) => {
  emits('modalOpen', param)
}

const handleFortressUpdate = (fortress) => {
  console.log(fortress)
}

</script>

<script>
export default {
  name: 'AppManeken'
}
</script>

<template>
  <div class="isDummyLoaded" v-if="isDummyLoaded">
    <div class="dummy__part">
      <DummyPartSlot :dummyItems="leftDummyPart" @handleClothesChoice="handleClothesChoice" />
    </div>
    <div class="dummy__center">
      <div class="dummy__center__top">
        <DummyPartSlot
          :dummyItems="centerTopDummyPart"
          @handleClothesChoice="handleClothesChoice"
          :sizeClass="'small'"
        />
      </div>

      <div class="dummy__center__center">
        <div class="options">
          <div class="options__itemBlock">
            <ManekenStatParams :statParams="statParams" :accessibleStats="accessibleStats">
              <template #statManeken="{ summBase }">
                <ManekenSlot
                  :statParam="summBase"
                  :accessibleStats="accessibleStats"
                  @handleStatDecrease="handleStatDecrease"
                  @handleStatIncrease="handleStatIncrease"
                  @handleStatInputChange="handleStatInputChange"
                />
              </template>
              <tr v-if="accessibleStats !== null">
                <td class="options__table__title" colspan="5">
                  <small>Очки розподілу:</small> {{ accessibleStats }}
                </td>
              </tr>
            </ManekenStatParams>
          </div>

          <div class="options__itemBlock">
            <div class="form__items">
              <ManeckenSelectItems
                v-if="availableRaces"
                itemsName="Виберіть расу"
                v-model="raseModel"
                @update:modelValue="handleRaseSelectChange"
              >
                <template #optionSelect>
                  <BasicSlotOpteons :items="availableRaces" />
                </template>
              </ManeckenSelectItems>

              <select v-model="lvlSelect" @change="lvlSelectChange" class="select-css">
                <option value="change" disabled selected>Виберіть рівень</option>
                <option :disabled="l.disabled" v-for="l in baseStat" :key="l.lvl">{{ l.lvl }}</option>
              </select>
            </div>

            <div class="form__items">
              <ManeckenSelectItems
                v-if="lvlSelect >= 8"
                v-model="classModel"
                itemsName="Виберіть класс"
                @update:modelValue="handleClassSelectChange"
              >
                <template #optionSelect>
                  <ManeckenOptionSelect :items="parentClasses" :lvlSelect="Number(lvlSelect)" />
                </template>
              </ManeckenSelectItems>

              <ManeckenSelectItems
                v-if="parentClassItems && lvlSelect >= 8"
                v-model="parentClassModel"
                itemsName="Вибери підкласс"
                @update:modelValue="handleParentClassSelectChange"
              >
                <template #optionSelect>
                  <ManeckenOptionSelect :items="parentClassItems" :lvlSelect="Number(lvlSelect)" />
                </template>
              </ManeckenSelectItems>
            </div>

            <div class="form__items">
              <ManeckenSelectItems
                v-if="availableFortressOptions"
                itemsName="Крепость"
                v-model="fortress"
                @update:modelValue="handleFortressUpdate"
              >
                >
                <template #optionSelect>
                  <BasicSlotOpteons :items="availableFortressOptions" />
                </template>
              </ManeckenSelectItems>
            </div>

            <div class="form__items">
              <a href="#" class="form__link">Випити еліксир</a>
              <p>Випито: 0</p>
            </div>

            <div class="form__items">
              <a @click="handleResetManecken" href="#" class="form__link">Скинути все</a>
            </div>
          </div>
        </div>
      </div>
      <div class="dummy__center__buttom">
        <DummyPartSlot
          :dummyItems="centerBottomDummyPart"
          @handleClothesChoice="handleClothesChoice"
          :sizeClass="'big'"
        />
      </div>
    </div>

    <div class="dummy__part">
      <DummyPartSlot :dummyItems="rightDummyPart" @handleClothesChoice="handleClothesChoice" />
    </div>
  </div>
</template>
