<script setup>
import { ref } from 'vue'
import AppHeader from './components/AppHeader.vue'
import AppManeken from './components/AppManeken.vue'
import AppManekenResult from './components/AppManekenResult.vue'
import { initialSetupEntries, basickParamsRase, baseStatModule } from './initialization/baseParams'
import ManeckenModal from './components/use/ManeckenModal.vue'

const isDummyLoaded = initialSetupEntries
const baseStatConfigurations = ref(baseStatModule) // базовое значение конкретной расы, и их переменные, стартовое люди
const basickParams = ref(basickParamsRase) // поиск значений по расе
const summaryUpdatedStatConfigurations = ref([]) // массив хранит в каждом обьекте тип бонуса и его характеристики
const updatedStatConfigurations = ref(baseStatModule) // передаю в таблицу итоговый суммарный результат
const isOpen = ref(false)
const cellOptions = ref()

// переменная для записи всех дополнительных значений, помимо  базовых, от всего шмота например.
const paramsPlus = ref([
  { key: 'dstrength', count: 0 },
  { key: 'ddexterity', count: 0 },
  { key: 'dintel', count: 0 },
  { key: 'dluck', count: 0 },
  { key: 'dreaction', count: 0 },
  { key: 'dwisdom', count: 0 },
  { key: 'dconst', count: 0 }
])

const statChange = ({ addParam, baseAndCommonStats = 'bonusAndBase', type }) => {
  // Создаем новый массив с обновленными данными
  const updatedConfigurations = summaryUpdatedStatConfigurations.value.map((item) => {
    if (item.type === type) {
      // Если тип совпадает, возвращаем объект с обновленным параметром
      return { ...item, param: addParam }
    }
    return item // Возвращаем неизмененный элемент
  })
  // Проверяем, есть ли тип в массиве, и добавляем новый элемент, если нет
  const existingTypes = summaryUpdatedStatConfigurations.value.map((item) => item.type)
  if (!existingTypes.includes(type)) {
    updatedConfigurations.push({ type, param: addParam, baseAndCommonStats })
  }

  // Обновляем массив с обновленными данными
  summaryUpdatedStatConfigurations.value = updatedConfigurations

  summ()
}

// берем все записи с массива суммарных записей и приводит в эдинную сумму стат для базовых характеристик и общих.
function summ() {
  // Очищаем массивы перед началом работы
  let commonStats = []
  let bonusOllStats = []

  updatedStatConfigurations.value = baseStatConfigurations.value

  // Проходимся по каждому элементу исходного массива
  summaryUpdatedStatConfigurations.value.forEach((item) => {
    const baseAndCommonStats = item.baseAndCommonStats
    const params = item.param
    // commonStats добавлять только в Базовые.
    // bonusOllStats добавлять и в Бонусы и в Базовые
    // Выбираем нужный массив в зависимости от значения baseAndCommonStats
    const resultArray =
      baseAndCommonStats === 'bonusAndBase'
        ? commonStats
        : baseAndCommonStats === 'oll'
        ? bonusOllStats
        : null

    if (resultArray) {
      // Суммируем значения статов для текущего элемента
      params.forEach((param) => {
        const key = param.key
        const count = param.count
        const existingStat = resultArray.find((stat) => stat.key === key)

        if (existingStat) {
          existingStat.count += count
        } else {
          resultArray.push({ key, count })
        }
      })
    }
  })

  if (commonStats) {
    // Выводим результаты
    const commonStat = updatedStatConfigurations.value.map((item) => {
      const common = commonStats.find((i) => i.key === item.key)
      if (common) {
        return {
          ...item,
          summStatBonusAndBase: item.summStatBonusAndBase + common.count
        }
      } else {
        return {
          ...item
        }
      }
    })
    updatedStatConfigurations.value = commonStat
  }

  if (bonusOllStats) {
    // Выводим результаты
    const commonStat = updatedStatConfigurations.value.map((item) => {
      const common = bonusOllStats.find((i) => i.key === item.key)
      if (common) {
        return {
          ...item,
          summStatBonusAndBase: item.summStatBonusAndBase + common.count,
          summStatBase: item.summStatBase + common.count
        }
      } else {
        return {
          ...item
        }
      }
    })
    updatedStatConfigurations.value = commonStat
  }
}


const changeRase = ({ raseModel }) => {
  const raseParams = basickParams.value.find((r) => r.availableRaces === raseModel)?.date;

  baseStatConfigurations.value = baseStatConfigurations.value.map((i) => {
    const updatedStats = raseParams ? {
      summStatBase: raseParams.find(param => param.key === i.key)?.count || i.summStatBase,
      summStatBonusAndBase: raseParams.find(param => param.key === i.key)?.count || i.summStatBonusAndBase
    } : {};
    
    return {
      ...i,
      ...updatedStats
    };
  });
  summ()
}



const modalOpen = (param) => {
  cellOptions.value = param
  isOpen.value = true
}
const isClose = () => {
  isOpen.value = false
}

// eslint-disable-next-line no-unused-vars
const components = {
  AppHeader,
  ManeckenModal,
  AppManekenResult,
  AppManeken
}
</script>
<template>
  <div class="room-container">
    <div class="wrapper">
      <div class="conteiner">
        <ManeckenModal
          v-if="isOpen"
          :cellOptions="cellOptions"
          :minStats="updatedStatConfigurations"
          @isClose="isClose"
        />
        <AppHeader />

        <main class="main-wrapper">
          <AppManeken
            v-if="isDummyLoaded"
            :isDummyLoaded="isDummyLoaded"
            :updatedStatConfigurations="updatedStatConfigurations"
            @statChange="statChange"
            @changeRase="changeRase"
            @modalOpen="modalOpen"
          />
          <AppManekenResult
            v-if="updatedStatConfigurations"
            :updatedStatConfigurations="updatedStatConfigurations"
          />
        </main>
      </div>
    </div>
  </div>
</template>
