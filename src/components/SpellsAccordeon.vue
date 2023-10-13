
<template>
      <div 
    v-if="ollSpells"
    class="accordionFaceInfo panel"
    :class="{ open : fide}"
    >
      <form>
        <div class="formSpells" v-for="spell in ollSpells[openCategorySpells]" :key="spell.id">
          <label :for="spell.id">{{ spell.spell }}:</label>
          <input type="checkbox" :id="spell.id" :name="spell.id" v-model="spell.check" />
        </div>

        <div class="wrappperBtnSpellsForm">
        <button
          class="tab-button maneckenBtn spellsBtn"
          @click.prevent="trackCheckboxes(ollSpells, openCategorySpells)"
        >
          <p class="p__tab-button p__tab-button-elix">{{ nameBtnSpells }}</p>
        </button>

        <button
          class="tab-button maneckenBtn spellsBtn"
          @click.prevent="updateSpellsCheck(ollSpells)"
        >
          <p class="p__tab-button p__tab-button-elix">{{ getLocalizedText('UpdateImmediately') }}</p>
        </button>
      </div>
      </form>
    </div>


</template>


<script setup>
import { ref, computed, watch } from 'vue'

import { getLocalizedText } from '@/locale/index'

const emits = defineEmits({
  updateSpellsCheck: Object,
});
const props = defineProps({
  openPanel: {
    type: String,
    requared: true
  },
  ollSpells: {
    type: Object,
    requared: true
  },
  nextBlockSpells:{
    type: Array,
    requared: true
  }
})

const categorySpells = computed ( () => props.openPanel ) 
const openCategorySpells = ref()
const nameBtnSpells = ref('Далее')
const fide = ref(false)
const count = ref(0)
let timeDelay = 600
const nextBlockSpellsAndName = ref(props.nextBlockSpells)

watch(categorySpells, val => {
  if(count.value === 0) {
    timeDelay = 200
    count.value++
  } else {
    timeDelay = 600
  }

  fide.value = false
  setTimeout( () => {
    openCategorySpells.value = val
    fide.value = true
  }, timeDelay )
}, { immediate: true })



function toggleAccordionItem(type) {
  const updatedSpells = nextBlockSpellsAndName.value.map(c => ({
    ...c,
    nextList: c.idListSpells === type ? true : c.nextList,
  }));

  const unprocessedCount = updatedSpells.filter(c => !c.nextList).length;

  if (unprocessedCount === 1) {
    nameBtnSpells.value = 'Отправить';
  }
  return updatedSpells
}

// проверяю, прошел ли по всем категориям заклинаний и принимаю действие
const trackCheckboxes = (spellsList, type) => {

const updatedSpells = toggleAccordionItem(type)

const searchUnprocessedCategorySpells = updatedSpells.find(c => !c.nextList);

if (searchUnprocessedCategorySpells) {
  fide.value = false
  setTimeout( () => {
    openCategorySpells.value = searchUnprocessedCategorySpells.idListSpells
    fide.value = true
  }, 600 )
} else {
  emits('updateSpellsCheck', spellsList)
}
nextBlockSpellsAndName.value = updatedSpells;
};

const updateSpellsCheck = (ollSpells) => {
 emits('updateSpellsCheck', ollSpells)
}

</script>

<script>
export default {
  name: 'SpellsAccordeon',
}
</script>

<style scoped>
.accordionFaceInfo {
  display: flex;
  justify-items: center;
  border-radius: 15px;
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
  max-height: 1200px; /* Максимальная высота для открытой панели */
  opacity: 1; /* Полная непрозрачность */
  transform: translateY(0); /* Смещение отсутствует */
  transition:
    max-height 0.5s ease-out,
    opacity 0.5s ease-out,
    transform 0.5s ease-out;
}
.formSpells {
  margin: 5px 5px;
  display: flex;
  justify-content: flex-start;
  width: calc(50% - 20px);
  align-items: center;
  outline: 1px solid #877e7ead;
  border-radius: 6px;
  padding-left: 5px;
}

.spellsBtn {
  margin: 8px;
}


.wrappperBtnSpellsForm {
    display: flex;
    width: 100%;
    justify-content: space-between;
}

@media only screen and (max-device-width: 450px) {
  .formSpells {
    margin: 6px 5px;
    width: calc(100% - 20px);
    justify-content: space-between;
    padding: 2px 10px;
  }

  .open {
    max-height: 3200px; /* Максимальная высота для открытой панели */
  }

  
  .wrappperBtnSpellsForm {
    justify-content: center;
    flex-wrap: wrap;
    align-items: center;
    align-content: center;
  }
  
}
</style>