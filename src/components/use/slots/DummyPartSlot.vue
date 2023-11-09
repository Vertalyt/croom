<template>
  <div
    v-for="(d, idx) in dummyItems"
    class="parameter__mat__img"
    :class="addClass"
    :key="d.name"
    :id="`${d.name}_${idx}`"
    @click="handleClothesChoice(d)"
    @contextmenu.prevent
    @touchstart.passive="startTouch"
    @touchend="endTouch(d.name)"
    @mouseenter="mouseEnterHandler(d.name, d.location)"
    @mouseleave="mouseLeaveHandler"
  >
    <div v-if="hideButton(d.name)" @click.stop="takeOff(d.name)" class="cl-btn-4"></div>
    <img class="mat_img" :src="d.link" :alt="d.name" :width="sizeImg" :height="sizeImg" />
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useStore } from 'vuex'
import { initialSetupEntries } from '../../../initialization/baseParams'

const emits = defineEmits({
  handleClothesChoice: () => Array,
  isClothInfo: () => Object
})

const props = defineProps({
  dummyItems: {
    type: Array,
    required: true
  },
  sizeClass: {
    type: String,
    required: false
  },
  idMannequin: {
    type: Number,
    required: true
  }
})

const store = useStore()

const takeOff = (el) => {
  store.dispatch('statChange/delEl', {
    idMannequin: props.idMannequin,
    el,
  })
}




const statNames = initialSetupEntries.map((entry) => entry.name)
const selectedEl = computed(() => store.getters['statChange/listStat'](props.idMannequin))
const activeEl = ref([])

watch(selectedEl, (stats) => {
  activeEl.value = []
  stats.forEach((stat) => {
    if (statNames.includes(stat.type)) {
      activeEl.value.push(stat.type)
    }
  })
})

function hideButton(el) {
  return activeEl.value.includes(el)
}

const classParametr = {
  small: 'parameter__mat__small',
  big: 'parameter__mat__Armor__img'
}

const sizesImg = 
  { 'small' : 65,
   'norm' : 90,
   'big' : 120 }


const sizeImg = sizesImg[props.sizeClass] || sizesImg['norm']
const addClass = classParametr[props.sizeClass] || ''

let isOpen = false
let timer
const isLongPress = ref(false) // Флаг для отслеживания долгого касания
let timeDelay = 0
const TIME_DELAY_PC = 600
const TIME_TOUCH_DURATION = 400
let touchStartTime = 0

const startTouch = () => {
  touchStartTime = Date.now()
}

const endTouch = (el_name) => {
  const touchEndTime = Date.now()
  const touchDuration = touchEndTime - touchStartTime

  if (touchDuration >= TIME_TOUCH_DURATION) {
    isInfoCloth('open', el_name)
    isLongPress.value = true // Устанавливаем флаг долгого касания
  } else {
    isInfoCloth('close')
    isLongPress.value = false // Сбрасываем флаг долгого касания
  }
}

const mouseEnterHandler = (el_name, location) => {
  if ('ontouchstart' in window === false) {
    // Если устройство не сенсорное (десктоп)
    timeDelay = TIME_DELAY_PC
    isInfoCloth('open', el_name, location)
  }
}

const mouseLeaveHandler = () => {
  if ('ontouchstart' in window === false) {
    // Если устройство не сенсорное (десктоп)
    timeDelay = TIME_DELAY_PC
    isInfoCloth('close')
  }
}

const openCloth = (el_name, location) => {
  emits('isClothInfo', { status: true, name: el_name, location })
  isOpen = true
}

const closeCloth = () => {
  if (isOpen) {
    emits('isClothInfo', { status: false })
    isOpen = false
    isLongPress.value = false
  }
}

const isInfoCloth = (status, el_name, location) => {
  if (status === 'open') {
    // Если окно было открыто ранее, отмените предыдущий таймер
    clearTimeout(timer)

    // Задайте новый таймер для открытия окна через 600 миллисекунд
    timer = setTimeout(openCloth(el_name, location), timeDelay)
  } else {
    // Если окно закрыто, просто очистите таймер
    clearTimeout(timer)
    closeCloth()
  }
}

const handleClothesChoice = (d) => {
  if (!isLongPress.value) {
    // Проверяем флаг долгого касания перед обработкой click
    emits('handleClothesChoice', d)
  }
}
</script>

<style scoped>
.parameter__mat__img {
  position: relative;
}
.cl-btn-4 {
  position: absolute;
  top: 6%;
  right: 3%;
  width: 20px;
  height: 20px;
  box-shadow: 0px 10 10px 10px rgba(0, 0, 0, 0.25);
  border-radius: 6px;
  background: #1d2c38;
  margin: 20px auto;
  /* position: relative; */
  display: block;
  z-index: 5;
  text-indent: -9999px;
  outline: 2px solid #fde2e26b;
  cursor: pointer;
  margin: 5px;
}
.cl-btn-4:before,
.cl-btn-4:after {
  content: '';
  width: 80%;
  height: 5px;
  background: #526675c0;
  position: absolute;
  top: 40%;
  left: 10%;
  transform: rotate(45deg);
  transition: all 0.3s ease-out;
}
.cl-btn-4:after {
  transform: rotate(-45deg);
  transition: all 0.3s ease-out;
}
.cl-btn-4:hover:before,
.cl-btn-4:hover:after {
  transform: rotate(180deg);
  background: #526675c0;
}

.parameter__mat__small > .cl-btn-4 {
  top: 5%;
  right: 2%;
}

.parameter__mat__Armor__img > .cl-btn-4 {
  top: 5%;
}
</style>
