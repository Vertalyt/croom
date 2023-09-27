<template>
  <div
    v-for="(d, idx) in dummyItems"
    class="parameter__mat__img"
    :class="addClass"
    :key="d.name"
    :id="`${d.name}_${idx}`"
    @click="handleClothesChoice(d)"
    @contextmenu.prevent
    @touchstart="startTouch"
    @touchend="endTouch(d.name)"
    @mouseenter="mouseEnterHandler(d.name)"
    @mouseleave="mouseLeaveHandler"
  >
    <img class="mat_img" :src="d.link" :alt="d.name" />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const emits = defineEmits({
  handleClothesChoice: () => Array,
  isClothInfo: () => Object
});

const props = defineProps({
  dummyItems: {
    type: Array,
    required: true
  },
  sizeClass: {
    type: String,
    required: false
  }
});

const classParametr = {
  'small': "parameter__mat__small",
  'big': "parameter__mat__Armor__img"
};

const addClass = classParametr[props.sizeClass] || '';

let isOpen = false;
let timer;
const isLongPress = ref(false); // Флаг для отслеживания долгого касания
let timeDelay = 0
const TIME_DELAY_PC = 600
const TIME_TOUCH_DURATION = 400
let touchStartTime = 0; 

const startTouch = () => {
  touchStartTime = Date.now();
};

const endTouch = (el_name) => {
  const touchEndTime = Date.now();
  const touchDuration = touchEndTime - touchStartTime;

  if (touchDuration >= TIME_TOUCH_DURATION) {
    isInfoCloth('open', el_name);
    isLongPress.value = true; // Устанавливаем флаг долгого касания
  } else {
    isInfoCloth('close');
    isLongPress.value = false; // Сбрасываем флаг долгого касания
  }
};

const mouseEnterHandler = (el_name) => {
  if ('ontouchstart' in window === false) {
    // Если устройство не сенсорное (десктоп)
    timeDelay = TIME_DELAY_PC
    isInfoCloth('open', el_name);
  }
};

const mouseLeaveHandler = () => {
  if ('ontouchstart' in window === false) {
    // Если устройство не сенсорное (десктоп)
    timeDelay = TIME_DELAY_PC
    isInfoCloth('close');
  }
};

const openCloth = (el_name) => {
  emits('isClothInfo', {status: true, name: el_name});
  isOpen = true;
};

const closeCloth = () => {
  if (isOpen) {
    emits('isClothInfo', { status: false });
    isOpen = false;
    isLongPress.value = false
  }
};

const isInfoCloth = (status, el_name) => {
  if (status === 'open') {
    // Если окно было открыто ранее, отмените предыдущий таймер
    clearTimeout(timer);

    // Задайте новый таймер для открытия окна через 600 миллисекунд
    timer = setTimeout(openCloth(el_name), timeDelay);
  } else {
    // Если окно закрыто, просто очистите таймер
    clearTimeout(timer);
    closeCloth();
  }
};

const handleClothesChoice = (d) => {
  if (!isLongPress.value) {
    // Проверяем флаг долгого касания перед обработкой click
    emits('handleClothesChoice', d);
  }
};
</script>
