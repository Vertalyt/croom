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
          </div>

          <button class="button" @click.stop="dress(c)">Вдягти</button>
        </div>
      </div>

      <div class="panel" :class="{ open: openPanel === idx }">
        <ChildAccordeonItem
          :items="c.minParam"
          :openChildPanel="openChildPanel"
          label="Требуемые параметры"
          typeParam="minParam"
          @changeChildPanel="accordionChildOpen"
        />
        <ChildAccordeonItem
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
import { ref } from 'vue'
import ChildAccordeonItem from './ChildAccordeonItem.vue'
import { useStore } from 'vuex'

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

function parameterConversion(params, convertedData) {
  for (const key in params) {
    if (Object.hasOwnProperty.call(params, key)) {
      convertedData.push({
        key: key,
        count: parseInt(params[key])
      })
    }
  }
}

const dress = (item) => {
  // Проверка наличия ключей с "class": "error" в minParam
  const errorKeys = Object.keys(item.minParam).filter((key) => item.minParam[key].class === 'error')

  // Если есть ключи с "class": "error", выведите сообщение и завершите проверку
  if (errorKeys.length > 0) {
    console.log('Ваши параметры ниже минимальных')
    return
  }
  const addParam = item.addParam
  const minBaseParam = item.minParam

  // Преобразовываем данные
  const convertedAdd = []

  // Преобразование минимальных требований
  const convertedMin = Object.keys(minBaseParam).map((key) => {
    return {
      key: key.replace('min', 'd'), // Преобразуем "minstrength" в "dstrength" и т.д.
      count: parseInt(minBaseParam[key].value, 10)
    }
  })

  parameterConversion(addParam, convertedAdd)

  store.dispatch('dummy/changeDummyEl', {
    idMannequin: props.idMannequin,
    addParam: [{ base: convertedMin }, { bonusAndBase: convertedAdd }],
    typeid: item.otherInfo.typeid,
    imgLink: item.otherInfo.image
  })
  emits('modalClose')
}
</script>

<script>
export default {
  name: 'ListCloth'
}
</script>

<style scoped>
/* Style the buttons that are used to open and close the accordion panel */

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
</style>
