<template>
  <div class="accordionWrap" :class="{ active: openAccordion }">

    <template v-for="(c, idx) in newResult" :key="c.otherInfo.id">

      <div @click ="accordionOpen(idx)" class="accordion">
        <div class="accordionFace">
          
          <div class="accordionFaceInfo">
            <img
            :src="`https://files.nura.biz/site/images/things100x100/${c.otherInfo.image}.png`"
            :alt="c.otherInfo.name"
            class="accordionFaceImg"
          />
          <p>{{ c.otherInfo.name }}</p>
          </div>

          <button class="button" @click.stop ="dress(c)">Вдягти</button>
        </div>
      </div>

      <div class="panel" :class="{ open: openPanel === idx }">
        <ChildAccordeonItem :items="c.minParam"  :openChildPanel="openChildPanel" label="Требуемые параметры" typeParam="minParam"  @changeChildPanel="accordionChildOpen"/>
        <ChildAccordeonItem :items="c.addParam" :openChildPanel="openChildPanel"  label="Бонусные параметры" typeParam="addParam"  @changeChildPanel="accordionChildOpen"/>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ChildAccordeonItem from './ChildAccordeonItem.vue'


defineProps({
  newResult: {
    type: Array,
    required: true
  },
  openAccordion: {
    type: Boolean,
    required: true
  }
})

const openPanel = ref(null)
const openChildPanel = ref('')

const accordionChildOpen = (panelId) => {
  openChildPanel.value = openChildPanel.value === panelId ? '' : panelId // Переключение состояния
}

const accordionOpen = (panelId) => {
  openPanel.value = openPanel.value === panelId ? '' : panelId // Переключение состояния
  openChildPanel.value = ''
}

const dress = (c) => {
  console.log(c);
}

const components = {
  ChildAccordeonItem
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
