<template>
  <div class="modal" @click.stop="isClose"></div>
  <div class="modal-content">
    <span @click="isClose" class="close">&times;</span>

    <div class="wrapperAccordion">
      <div class="accordionFace">
        <button class="tab-button maneckenBtn" @click="accordionChildOpen('whitemagic')">
          <p class="p__tab-button p__tab-button-elix">Рассвет</p>
        </button>
      </div>

      <div class="accordionFace">
        <button id="black" class="tab-button maneckenBtn" @click="accordionChildOpen('blackmagic')">
          <p class="p__tab-button p__tab-button-elix">Полнолуние</p>
        </button>
      </div>

      <div class="accordionFace">
        <button class="tab-button maneckenBtn" @click="accordionChildOpen('astralmagic')">
          <p class="p__tab-button p__tab-button-elix">Астрал</p>
        </button>
      </div>
    </div>


    <div 
    v-if="ollSpells"
    class="accordionFaceInfo panel" :class="{ open: openPanel === 'whitemagic' }">
      <form>
        <div class="formSpells" v-for="spell in ollSpells.whitemagic" :key="spell.id">
          <label :for="spell.id">{{ spell.spell }}:</label>
          <input type="checkbox" :id="spell.id" :name="spell.id" v-model="spell.check" />
        </div>

        <div class="wrappperBtnSpellsForm">
        <button
          class="tab-button maneckenBtn spellsBtn"
          @click.prevent="trackCheckboxes(ollSpells, 'whitemagic')"
        >
          <p class="p__tab-button p__tab-button-elix">{{ nameBtnSpells }}</p>
        </button>

        <button
          class="tab-button maneckenBtn spellsBtn"
          @click.prevent="updateCheckboxes(ollSpells)"
        >
          <p class="p__tab-button p__tab-button-elix">Сразу обновить</p>
        </button>
      </div>
      </form>
    </div>

    <div 
    v-if="ollSpells"
    class="accordionFaceInfo panel" :class="{ open: openPanel === 'blackmagic' }">
      <form>
        <div class="formSpells" v-for="spell in ollSpells.blackmagic" :key="spell.id">
          <label :for="spell.id">{{ spell.spell }}:</label>
          <input type="checkbox" :id="spell.id" :name="spell.id" v-model="spell.check" />
        </div>

        <div class="wrappperBtnSpellsForm">
        <button
          class="tab-button maneckenBtn spellsBtn"
          @click.prevent="trackCheckboxes(ollSpells, 'blackmagic')"
        >
          <p class="p__tab-button p__tab-button-elix">{{ nameBtnSpells }}</p>
        </button>

        <button
          class="tab-button maneckenBtn spellsBtn"
          @click.prevent="updateCheckboxes(ollSpells)"
        >
          <p class="p__tab-button p__tab-button-elix">Сразу обновить</p>
        </button>

      </div>
      </form>
    </div>

    <div 
    v-if="ollSpells"
    class="accordionFaceInfo panel" :class="{ open: openPanel === 'astralmagic' }">
      <form>
        <div class="formSpells" v-for="spell in ollSpells.astralmagic" :key="spell.id">
          <label :for="spell.id">{{ spell.spell }}:</label>
          <input type="checkbox" :id="spell.id" :name="spell.id" v-model="spell.check" />
        </div>


        <div class="wrappperBtnSpellsForm">
          <button
          class="tab-button maneckenBtn spellsBtn"
          @click.prevent="trackCheckboxes(ollSpells, 'astralmagic')"
        >
          <p class="p__tab-button p__tab-button-elix">{{ nameBtnSpells }}</p>
        </button>

        <button
          class="tab-button maneckenBtn spellsBtn"
          @click.prevent="updateCheckboxes(ollSpells)"
        >
          <p class="p__tab-button p__tab-button-elix">Сразу обновить</p>
        </button>
        </div>

      </form>
    </div>


  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { fetchAPIData } from '../api/fetchApi'
import { useStore } from 'vuex'

const emits = defineEmits({
  isCloseSpells: null,
})

const props = defineProps({
  idMannequin: {
    type: Number,
    requared: true
  }
})

const isClose = () => {
  emits('isCloseSpells')
}

const store = useStore()
const subClassList = ref()
const openPanel = ref()
const listStat = computed(() => store.getters['statChange/listStat'](props.idMannequin))
const listSpells = computed(() => store.getters['spells/spells'](props.idMannequin))
const ollSpells = ref()
const nameBtnSpells = ref('Далее')
const nameSubclass = [
  ['Defender', 'Guardsman', 'Knight', 'Cavalier', 'Titan', 'Nephilim'],
  ['Shooter', 'Archer', 'Huntsman', 'Sniper', 'Ancient', 'Conqueror'],
  ['Cutter', 'Gladiator', 'Berserker', 'Chieftain', 'Reaper', 'Ataman'],
  ['Shieldbearer', 'Legionary', 'Centurion', 'Champion', 'Monolith', 'Commander'],
  ['Priest', 'Cleric', 'Crusader', 'Paladin', 'Bishop', 'Cardinal'],
  ['Initiate', 'Acolyte', 'Adept', 'Magister', 'Patriarh', 'Overlord']
]

const filtersClasses = ref({
  category: 'spells',
  requiredSubclass: []
})
//  проверяет наличиее записи  оподкласе, если есть, берет массив всех класов и подклассов, с него берет нужный клас, 
// и фильтрует в новую переменную от записей подмасивов что старше уровнем
function filterHigherLevelSubclasses() {
  let findSubClasses = listStat.value.find((item) => item.type === 'subclass')
  if (findSubClasses) {
    const itsOwnSubclass = nameSubclass.find((item) => {
      return item.includes(`${findSubClasses.name}`)
    })

    // если есть подкласс создаю записи для filtersClasses фетча
    if (itsOwnSubclass) {
      const index = itsOwnSubclass.indexOf(findSubClasses.name)
      if (index !== -1) {
        let subclassSubset = itsOwnSubclass.slice(0, index + 1)
        subclassSubset.unshift('oll')
        filtersClasses.value.requiredSubclass = subclassSubset
        subClassList.value = subclassSubset
      }
    }
  }
}
// проверяю наличие подкласса для фильтрации заклинаний
if (listStat.value) {
  filterHigherLevelSubclasses()
}
// Функция для проверки наличия различий в массивах подкласса
function checkForDifferences(arr1, arr2) {
    const areDifferent = JSON.stringify(arr1) !== JSON.stringify(arr2);
    if (areDifferent) {
      fetchSpellsAndSorts()
      console.log("add fetch Spell");
      return false
    } else {
        return true
    }
}

let nextBlockSpells = [
  { idListSpells: 'whitemagic', nextList: false },
  { idListSpells: 'blackmagic', nextList: false },
  { idListSpells: 'astralmagic', nextList: false },
]


function toggleAccordionItem(type) {
  const updatedSpells = nextBlockSpells.map(c => ({
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
    accordionChildOpen(searchUnprocessedCategorySpells.idListSpells);
  } else {
    updateCheckboxes(spellsList)
  }
  nextBlockSpells = updatedSpells;
};

function updateCheckboxes(spellsList) {
  const update = {
      idMannequin: props.idMannequin,
      subclassList: subClassList.value,
      spellsList,
    };
    store.dispatch('spells/spellsChange', update);
    openPanel.value = false;
    setTimeout(() => {
      emits('isCloseSpells')
    }, 600 )

}

async function fetchSpellsAndSorts() {
  let spells = await fetchAPIData(filtersClasses.value)
  spells.map(spell => ({ ...spell, check: false }));
  const spellsWhite = spells.filter((s) => s.magicalCategory === 'whitemagic')
  const spellsBlack = spells.filter((s) => s.magicalCategory === 'blackmagic')
  const spellsAstral = spells.filter((s) => s.magicalCategory === 'astralmagic')
  ollSpells.value = 
    { whitemagic: spellsWhite, blackmagic: spellsBlack, astralmagic: spellsAstral};
}

onMounted(async () => {
  const stateSubclassList = listSpells.value.find((el) => el.subclassList)
//если записей нет, закачиваю с сервера массив заклинаний и делю на категории
if (stateSubclassList && stateSubclassList.subclassList.length === 0) {
  fetchSpellsAndSorts()
} 
else {
const subclassChangesResult = checkForDifferences(stateSubclassList.subclassList, subClassList.value)
if(subclassChangesResult) {
  const stateSpellsList = listSpells.value.find((el) => el.spellsList)
  if(stateSpellsList) {
    ollSpells.value = stateSpellsList.spellsList
  }
}
}
})

const accordionChildOpen = (panelId) => {
  openPanel.value = openPanel.value === panelId ? '' : panelId // Переключение состояния
}
</script>

<script>
export default {
  name: 'AppSpells'
}
</script>

<style scoped>
.modal-content {
  width: 599px;
}

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
  padding: 5px 13px;
  width: calc(33% - 38px);
  text-align: left;
  outline: none;
}

.accordionFace {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}

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

.wrapperAccordion {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  width: 100%;
  justify-content: space-around;
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
.accordionChild {
  margin: 5px;
  padding: 0px 10px;
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

@media screen and (max-width: 600px) {
  .modal-content {
    width: 400px;
  }

  .accordionFace {
    margin-bottom: 0;
  }
}

@media screen and (max-width: 450px) {
  .modal-content {
    width: 300px;
  }

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
