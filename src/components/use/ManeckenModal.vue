<template>
  <div>
    <div class="modal" @click.stop="isClose"></div>
    <div class="modal-content">
      <span @click="isClose" class="close">&times;</span>

      <div class="form__items">
      <select v-model="lvlSelect" @change="lvlSelectChange" class="form__input select-css">
                <option value="change" disabled selected>Виберіть рівень</option>
                <option>0</option>
                <option v-for="l in optionLvl" :key="l">{{ l }}</option>
      </select>
    </div>
      <button
      key="1"
      @click="accordionOpen(1)"
      class="accordion"
      >Section 1</button>
      <div 
      class="panel"
      :class="{'open': openPanel === 1}"
      >
        <p>Lorem ipsum...</p>
      </div>

      <button 
      key="2"
      @click="accordionOpen(2)"
      class="accordion">Section 2</button>
      <div class="panel"
      :class="{'open': openPanel === 2}"
      >
        <p>Lorem ipsum...</p>
      </div>

      <button 
      key="3"
      @click="accordionOpen(3)"
      class="accordion">Section 3</button>
      <div class="panel"
      :class="{'open': openPanel === 3}"
      >
        <p>Lorem ipsum...</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { fetchAPIData } from '../../api/fetchApi'

const props = defineProps({
  cellOptions: {
    type: Object,
    required: true,
  }
})

const emits = defineEmits({
  isClose: null,
})

const openPanel  = ref(null) 
const lvlSelect = ref('change')
const optionLvl = 24

const isClose = () => {
  emits('isClose')
}

const accordionOpen = (panelId) => {
  openPanel.value = openPanel.value === panelId ? null : panelId // Переключение состояния
}



const lvlSelectChange = async () => {
  const sanitizedTypeids = props.cellOptions.typeid.map(item => {
    if (typeof item === 'string' && !isNaN(item)) {
        return parseInt(item);
    }
    return item;
});

  const filtersClasses = {
  category: 'items',
  typeid : sanitizedTypeids,
  minlevel : parseInt(lvlSelect.value),
  // rarity: 1
}

const request = await fetchAPIData(filtersClasses)
console.log(request);
}


</script>

<script>
export default {
  name: 'ManeckenModal'
}
</script>

<style scoped>
/* Style the buttons that are used to open and close the accordion panel */
.accordion {
    background-color: #eee;
    color: #444;
    cursor: pointer;
    padding: 18px;
    width: 100%;
    text-align: left;
    border: none;
    outline: none;
    transition: 5.4s;
}

/* Add a background color to the button if it is clicked on (add the .active class with JS), and when you move the mouse over it (hover) */
.active, .accordion:hover {
    background-color: #ccc;
}

/* Style the accordion panel. Note: hidden by default */
.panel {
  padding: 0 18px;
  background-color: white;
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.5s ease-out, opacity 0.5s ease-out;
  opacity: 0; /* Начальная непрозрачность */
  transform: translateY(-10px); /* Начальное смещение */
}

.open {
  max-height: 100px; /* Максимальная высота для открытой панели */
  opacity: 1; /* Полная непрозрачность */
  transform: translateY(0); /* Смещение отсутствует */
  transition: max-height 0.5s ease-out, opacity 0.5s ease-out, transform 0.5s ease-out;
}

</style>