<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useStore } from 'vuex'

import ManekenStatParams from './Manekenstatparams.vue'
import ManekenSlot from './use/slots/ManekenSlot.vue'
import ManeckenSelectItems from './use/ManeckenSelectItems.vue'
import DummyPartSlot from './use/slots/DummyPartSlot.vue'
import ManeckenOptionSelect from './use/slots/ManeckenOptionSelect.vue'
import BasicSlotOpteons from './use/slots/BasicSlotOptions.vue'
import AddElixir from './AddElixir.vue'
import AppSpells from './AppSpells.vue'
import AppLoader from './AppLoader.vue'
import DetailedClothing from './use/DetailedClothing.vue'

import { baseStatFromLvl } from '../utils/baseStatFromLvl'
import { modifyStat, statInputChange } from '../utils/modifyStat'
import { fetchAPIData } from '../api/fetchApi'
import { fortressParam, raseParams, arrayVariableStats } from '../initialization/baseParams'
import { updatedBaseStats, recalculationValues } from '../utils/updatedStats'
import { checkSubclassChangeFeasibilityWithGearRequirements } from '../utils/checkSubclassChangeFeasibilityWithGearRequirements'

const props = defineProps({
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
  updateLvl: [Number, null]
})
const store = useStore()

const lvlComputed = computed(() =>
  store.getters['listManekenSearch']({ id: props.idMannequin, element: 'lvl' }))

const computedAccessibleStats = computed(() =>
  store.getters['listManekenSearch']({ id: props.idMannequin, element: 'accessibleStats' }))

const raseNameComputed = computed(() =>
  store.getters['listManekenSearch']({ id: props.idMannequin, element: 'raseName' }))

const classComputed = computed(() =>
  store.getters['listManekenSearch']({ id: props.idMannequin, element: 'class' }))

const fortressComputed = computed(() =>
  store.getters['listManekenSearch']({ id: props.idMannequin, element: 'fortress' }))

const listManekenBase = computed(() =>
  store.getters['listManekenBase'](props.idMannequin).find((stat) => stat.key === 'dconst'))

const availableRaces = raseParams
const lvlSelect = ref(lvlComputed.value)
const raseModel = ref('human')
const classModel = ref('none')
const refrech = ref(0)
const fortress = ref('none')
const availableFortressOptions = ref(fortressParam)

const accessibleStats = ref(computedAccessibleStats.value) //количество стат для распределения
const baseStat = ref(baseStatFromLvl())
const itemsNameClass = ref('Виберіть класс')
const itemsNameSubClass = ref('Вибери підкласс')
const itemsNameRase = ref('Виберіть расу')
const itemsNameFortress = ref('Крепость')
const oldAccessibleStats = ref(computedAccessibleStats.value) // остаток не распределенных стат

const controllIdManeken = computed(() => props.idMannequin)
watch(controllIdManeken, (_) => {
  oldAccessibleStats.value = computedAccessibleStats.value
  accessibleStats.value = computedAccessibleStats.value
  lvlSelect.value = lvlComputed.value
  if (raseNameComputed.value) {
    raseModel.value = raseNameComputed.value
    itemsNameRase.value = availableRaces.find((item) => item.id === raseNameComputed.value).name
  } else {
    raseModel.value = 'human'
    itemsNameRase.value = 'Виберіть расу'
  }

  if (classComputed.value) {
    itemsNameClass.value = classComputed.value.className
    itemsNameSubClass.value = classComputed.value.subClassName
  } else {
    itemsNameClass.value = 'Виберіть класс'
    itemsNameSubClass.value = 'Вибери підкласс'
  }

  if (fortressComputed.value) {
    itemsNameFortress.value = availableFortressOptions.value.find(
      (item) => item.id === fortressComputed.value.fortress
    ).name
  } else {
    itemsNameFortress.value = 'Крепость'
  }
  refrech.value++
})

const OllParamClass = ref([])
const parentClassItems = ref(null)
const parentClassModel = ref('none')
const parentClasses = ref([])
const availabilityClassFlag = ref(true)
const oldValueSubclass = ref()
const elixFlag = ref(false)
const classMinParam = ref()
const spellsFlag = ref(false)
const raseMagicDefend = ref([])
const isLoading = ref(false)

// массив с изменениями параметров
const addParam = ref(arrayVariableStats)

const filtersClasses = ref({
  category: 'classes'
  // parent: 8
})

const isDummyLoaded = computed(() => store.getters['dummy/listsDummy'](props.idMannequin))
const leftDummyPart = computed(() =>
  isDummyLoaded.value.filter((d) => d.location === 'leftDummyPart')
)
const rightDummyPart = computed(() =>
  isDummyLoaded.value.filter((d) => d.location === 'rightDummyPart')
)
const centerTopDummyPart = computed(() =>
  isDummyLoaded.value.filter((d) => d.location === 'centerTopDummyPart')
)
const centerBottomDummyPart = computed(() =>
  isDummyLoaded.value.filter((d) => d.location === 'centerBottomDummyPart')
)

const listStat = computed(() => store.getters['statChange/listStat'](props.idMannequin))

onMounted(async () => {
  isLoading.value = true
  OllParamClass.value = await fetchAPIData(filtersClasses.value)
  raseMagicDefend.value = await fetchAPIData({ category: 'raseMagicDefend' })
  parentClasses.value = OllParamClass.value.filter((p) => p.parent == 0)
  isLoading.value = false
})

// слежение за изменением суммарного массива updatedStatConfigurations
const statParams = computed(() => props.updatedStatConfigurations.filter((d) => d.type === 'stat'))

// emits

const handleRaseSelectChange = (availableRaces) => {
  emits('changeRase', {
    raseModel: availableRaces
  })
}

const handleClassSelectChange = (className) => {
  parentClassItems.value = OllParamClass.value.filter((p) => p.parent_name === className)
  itemsNameClass.value = parentClasses.value.find((cl) => cl.name_en === className).name
}

watch(fortressComputed, val => {
  if(val) {
    const findRanger = parentClasses.value.find(item => item.name_en === "Ranger");
  if (findRanger) {
    findRanger.disabled = val.fortress === 'absent' ? false : true;
  }
  }

}, { immediate: true });



// массив с бонусами от класа
const addClassParam = addParam.value.map((item) => ({ ...item, count: 0 }))

async function changingSubclassParameters() {
  const subclass = listStat.value.find((item) => item.type === 'subclass')
  if (subclass && subclass.param) {
    // Найдем объект с ключом "base" в массиве "param"
    const baseObject = subclass.param.find((obj) => obj.base)
    if (baseObject) {
      // Получим массив значений из объекта "base"
      const baseValues = baseObject.base.map((item) => item.count)
      // Вычислим сумму значений
      const sum = baseValues.reduce((accumulator, currentValue) => accumulator + currentValue, 0)

      accessibleStats.value += sum
    } else {
      console.log('Объект с ключом "base" не найден в массиве "param"')
    }
    store.commit('statChange/listDelChange', {
      idMannequin: props.idMannequin,
      type: 'subclass'
    })
  }
}

const handleParentClassSelectChange = async (parent) => {
  availabilityClassFlag.value = checkSubclassChangeFeasibilityWithGearRequirements({
    id: props.idMannequin,
    ollParamClass: OllParamClass.value,
    parent
  })
  if (availabilityClassFlag.value === true) {
    oldValueSubclass.value = true
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
    // проверяю есть ли уже запись о подклассе, если есть, обнуляю о ней запись и восстанавливаю количество очков
    await changingSubclassParameters()

    recalculationValues({ ollParamClass: OllParamClass.value, parent, items: addClassParam })
    recalculationValues({ ollParamClass: OllParamClass.value, parent, items: addClassMinParam })

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
    classMinParam.value = updateMinParam
    // Проходим по каждой строке в updatedStatConfigurations преобразовывая данные
    const updatedStats = updatedBaseStats({
      arrMinParam: updateMinParam,
      ollStats: props.updatedStatConfigurations
    })
    const totalSum = updatedStats.reduce((accumulator, item) => accumulator + item.count, 0)
    // считаю можно ли сменить уровень ниже, в зависимости от количества оставшихся очков распределения, что бы
    //выполнить минимальную проверку требований подкласса
    if (accessibleStats.value > totalSum) {
      accessibleStats.value -= totalSum
      store.commit('statChange/statChange', {
        addParam: [{ base: updatedStats }, { bonusAndBase: addClassParam }],
        type: 'subclass',
        name: parent,
        idMannequin: props.idMannequin
      })
    } else {
      store.dispatch('setMessage', 'Не достаточно очков')
    }
  } else {
    oldValueSubclass.value = false
  }

  itemsNameSubClass.value = parentClassItems.value.find((sub) => sub.name_en === parent).name
  store.commit('updateManekenInfo', {
    idMannequin: props.idMannequin,
    class: { className: itemsNameClass.value, subClassName: itemsNameSubClass.value }
  })
}

// старое количество стат на уровне в каждом манекене, запись задана с избытком
let oldCountStat = [0, 0, 0, 0, 0]
const different = [0, 0, 0, 0, 0]

// сброс массива addParam изменения стат при смене уровня
const lvlSelectChange = () => {
  const newCountStat = baseStat.value.find((l) => l.lvl === Number(lvlSelect.value)).stat // получаю стартовое количество стат на уровне

  oldAccessibleStats.value = accessibleStats.value // остаток не распределенных стат

  const lvlStatDifference = Number(newCountStat) - Number(oldCountStat[props.idMannequin - 1]) // разница стат на уровне
  different[props.idMannequin - 1] = lvlStatDifference + oldAccessibleStats.value
  if (lvlStatDifference >= 0 || different[props.idMannequin - 1] > -1) {
    updateStatsAndEmitEvent(different[props.idMannequin - 1], newCountStat)
    emits('updateLvl', Number(lvlSelect.value))
  } else {
    store.dispatch('setMessage', `Распределено стат больше, чем возможно на уровне на ${Math.abs(
        different[props.idMannequin - 1]
      )}`)
  }
}

const updateStatsAndEmitEvent = (difference, newCountStat) => {
  accessibleStats.value = difference
  oldCountStat[props.idMannequin - 1] = Number(newCountStat)
  classModel.value = 'none'
}

const modifyStatAndEmit = (statKey, increment) => {
  const { addParam: updatedAddParam, accessibleStats: updatedAccessibleStats } = modifyStat({
    accessibleStats: accessibleStats.value,
    addParam: addParam.value,
    statKey,
    increment,
    id: props.idMannequin
  })

  addParam.value = updatedAddParam
  accessibleStats.value = updatedAccessibleStats
  store.commit('statChange/statChange', {
    addParam: [{ base: addParam.value }],
    type: 'freeStats',
    idMannequin: props.idMannequin
  })
}

watch(accessibleStats, (val) => {
  const newCountStat = baseStat.value.find((l) => l.lvl === Number(lvlSelect.value)).stat
  baseStat.value.forEach((item) => {
    item.disabled = item.stat < Number(newCountStat) - Number(val)
  })
})

watch([lvlSelect, raseModel], (val) => {
  if (val[0] > 0) {
    const newRaseOllLvlDefend = raseMagicDefend.value.filter((rase) => rase.rase === val[1])
    const newRaseDefend = newRaseOllLvlDefend.find(
      (item) => Number(item.lvlPers) === Number(val[0])
    )
    const update = [
      { key: 'whitemagicprotection', count: newRaseDefend.whitemagicprotection },
      { key: 'blackmagicprotection', count: newRaseDefend.blackmagicprotection },
      { key: 'astralmagicprotection', count: newRaseDefend.astralmagicprotection }
    ]
    store.commit('statChange/statChange', {
      addParam: [{ bonusAndBase: update }],
      type: 'magickDefend',
      idMannequin: props.idMannequin
    })
  }
})

watch(accessibleStats, (val) => {
  store.commit('updateManekenInfo', {
    accessibleStats: val,
    idMannequin: props.idMannequin
  })
})

const handleStatIncrease = (statKey) => {
  modifyStatAndEmit(statKey, Number(1))
}

const computedFreeStats = computed(() => store.getters['statChange/foundCloth'](props.idMannequin, 'freeStats')?.param);

const handleStatDecrease = (statKey) => {
  if (computedFreeStats.value) {
    const freeStatKey = computedFreeStats.value.find(item => item.base).base;
    if (freeStatKey) {

      const statChange = freeStatKey.find(stat => stat.key === statKey && stat.key > 0).statKey;
      if (statChange) {
        modifyStatAndEmit(statKey, -1);
      } else {
        store.dispatch('setMessage', 'Не достаточно стат от свободных очков распределения')
      }
    }
  }  else {
        store.dispatch('setMessage', 'Не достаточно стат от свободных очков распределения')
      }
};

const handleStatInputChange = (stat) => {
  // изменение стат через инпут
  const { key, statChange } = statInputChange({
    stat,
    statParams: statParams.value,
    accessibleStats: accessibleStats.value
  })
  modifyStatAndEmit(key, statChange)
}

const handleResetManecken = () => {
  addParam.value.map((p) => (p.count = 0))
  emits('changeRase', {
    raseModel: 'human'
  })
  raseModel.value = 'human'
  lvlSelect.value = 'change'
  accessibleStats.value = null
  classModel.value = 'none'
}

const handleClothesChoice = async (param) => {
  emits('modalOpen', param)
}

const drinksElix = ref(0)
const numberDrinks = (count) => {
  drinksElix.value = count
}

const isCloseElix = () => {
  elixFlag.value = false
}

const isCloseSpells = () => {
  spellsFlag.value = false
}



watch([listManekenBase, classComputed],  (val) => {
    const forbiddenClasses = ['Рейджер']
    availableFortressOptions.value = availableFortressOptions.value.map((item) => {
      const isMinconstGreaterThanSummStatBase = Number(item.minconst) > Number(val[0].summStatBase)
      const isClassForbidden = forbiddenClasses.includes(val[1]?.className)
      return {
        ...item,
        disabled: isMinconstGreaterThanSummStatBase || isClassForbidden
      }
    })
  },
  { immediate: true }
)

const handleFortressUpdate = (fortress) => {
  const fortnessParam = availableFortressOptions.value.find(item => item.id === fortress).bonusHealthMutiplier
  store.commit('updateManekenInfo', {
    fortress: {fortress, bonusHealthMutiplier: fortnessParam},
    idMannequin: props.idMannequin,
  })
}

const nameElCloth = ref()
const elementParam = ref()
const isOpenInfoCloth = ref(false)

const isClothInfo = ({ status, name}) => {
    isOpenInfoCloth.value = status

  if(status === true && name) {
    nameElCloth.value = name
    elementParam.value = store.getters['statChange/foundCloth'](props.idMannequin, name)
  }
}

</script>

<script>
export default {
  name: 'AppManeken'
}
</script>

<template>
  <AppLoader v-if="isLoading" />

    <DetailedClothing
  v-if="isOpenInfoCloth && elementParam"
  :isOpenInfoCloth="isOpenInfoCloth"
  :elementParam="elementParam"
  @isClothInfo="isClothInfo"
  />

  <div class="isDummyLoaded" v-if="isDummyLoaded">
    <div class="dummy__part">
      <DummyPartSlot :dummyItems="leftDummyPart" 
      @handleClothesChoice="handleClothesChoice" 
      @isClothInfo="isClothInfo"
      />
    </div>

    <div class="dummy__center">
      <div class="dummy__center__top">
        <DummyPartSlot
          :dummyItems="centerTopDummyPart"
          @handleClothesChoice="handleClothesChoice"
          @isClothInfo="isClothInfo"
          :sizeClass="'small'"
        />
      </div>

      <div class="dummy__center__center">
        <div class="options">
          <div class="options__itemBlock">
            <ManekenStatParams :statParams="statParams" :accessibleStats="computedAccessibleStats">
              <template #statManeken="{ summBase }">
                <ManekenSlot
                  :statParam="summBase"
                  :accessibleStats="computedAccessibleStats"
                  @handleStatDecrease="handleStatDecrease"
                  @handleStatIncrease="handleStatIncrease"
                  @handleStatInputChange="handleStatInputChange"
                />
              </template>
              <tr v-if="computedAccessibleStats !== null">
                <td class="options__table__title" colspan="5">
                  <small>Очки розподілу:</small> {{ computedAccessibleStats }}
                </td>
              </tr>
            </ManekenStatParams>
          </div>

          <div class="options__itemBlock">
            <div class="form__items">
              <ManeckenSelectItems
                v-if="availableRaces"
                :key="refrech"
                :itemsName="itemsNameRase"
                v-model="raseModel"
                @update:modelValue="handleRaseSelectChange"
              >
                <template #optionSelect>
                  <BasicSlotOpteons :items="availableRaces" />
                </template>
              </ManeckenSelectItems>

              <select
                :key="refrech"
                name="lvlSelectChange"
                v-model="lvlSelect"
                @change="lvlSelectChange"
                class="select-css"
              >
                <option value="change" disabled selected>Виберіть рівень</option>
                <option :disabled="l.disabled" v-for="l in baseStat" :key="l.lvl">
                  {{ l.lvl }}
                </option>
              </select>
            </div>

            <div class="form__items">
              <ManeckenSelectItems
                v-if="lvlSelect >= 8"
                v-model="classModel"
                :itemsName="itemsNameClass"
                :disabled="!availabilityClassFlag"
                :availabilityClassFlag="availabilityClassFlag"
                @update:modelValue="handleClassSelectChange"
              >
                <template #optionSelect>
                  <ManeckenOptionSelect :items="parentClasses" :lvlSelect="Number(lvlSelect)" />
                </template>
              </ManeckenSelectItems>

              <ManeckenSelectItems
                v-if="parentClassItems && lvlSelect >= 8"
                v-model="parentClassModel"
                :itemsName="itemsNameSubClass"
                :disabled="!availabilityClassFlag"
                :oldValueCheck="oldValueSubclass"
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
                :key="refrech"
                :itemsName="itemsNameFortress"
                v-model="fortress"
                @update:modelValue="handleFortressUpdate"
              >
                >
                <template #optionSelect>
                  <BasicSlotOpteons :items="availableFortressOptions" />
                </template>
              </ManeckenSelectItems>

              <div class="">
                <button class="tab-button maneckenBtn" @click="spellsFlag = true">
                  <p class="p__tab-button p__tab-button-elix">Заклинания</p>
                </button>
              </div>
            </div>

            <AddElixir
              v-if="elixFlag"
              :idMannequin="props.idMannequin"
              :statParams="statParams"
              :classMinParam="classMinParam"
              @numberDrinks="numberDrinks"
              @isCloseElix="isCloseElix"
            />

            <AppSpells
              v-if="spellsFlag"
              :idMannequin="props.idMannequin"
              @isCloseSpells="isCloseSpells"
            />

            <div class="form__items">
              <button class="tab-button maneckenBtn" @click="elixFlag = true">
                <p class="p__tab-button">Випити еліксир</p>
              </button>

              <p>Випито: {{ drinksElix }}</p>
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
          @isClothInfo="isClothInfo"
          :sizeClass="'big'"
        />
      </div>
    </div>

    <div class="dummy__part">
      <DummyPartSlot :dummyItems="rightDummyPart" @handleClothesChoice="handleClothesChoice" />
    </div>
  </div>
</template>

<style scoped>
.maneckenBtn {
  width: 125px;
  height: 26px;
}

.p__tab-button {
  font-size: 11px;
  margin: 3px;
  padding: 2px 5px;
  font-weight: 800;
  color: #e1dbdb;
}
</style>
