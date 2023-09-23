<template>
  <div class="modal" @click.stop="isClose"></div>
  <div class="modal-content">
    <span @click="isClose" class="close">&times;</span>

    <div class="wrapperAccordion">
      <div class="accordionFace" v-for="cat in nextBlockSpells" :key="cat.idListSpells">
        <button class="tab-button maneckenBtn" @click="accordionChildOpen(cat.idListSpells)">
          <p class="p__tab-button p__tab-button-elix">{{ cat.name }}</p>
        </button>
      </div>
    </div>

    <SpellsAccordeon 
    v-if="ollSpells && openPanel"
    :openPanel="openPanel"
    :ollSpells="ollSpells"
    :nextBlockSpells="nextBlockSpells"
    @updateSpellsCheck="updateSpellsCheck"
    />

  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { fetchAPIData } from '../api/fetchApi'
import { useStore } from 'vuex'
import SpellsAccordeon from './SpellsAccordeon.vue'


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
const subClassList = ref([])
const openPanel = ref()
const listStat = computed(() => store.getters['statChange/listStat'](props.idMannequin))
const listSpells = computed(() => store.getters['spells/spells'](props.idMannequin))
const ollSpells = ref()

const nameSubclass = [
  ['Defender', 'Guardsman', 'Knight', 'Cavalier', 'Titan', 'Nephilim'],
  ['Shooter', 'Archer', 'Huntsman', 'Sniper', 'Ancient', 'Conqueror'],
  ['Cutter', 'Gladiator', 'Berserker', 'Chieftain', 'Reaper', 'Ataman'],
  ['Shieldbearer', 'Legionary', 'Centurion', 'Champion', 'Monolith', 'Commander'],
  ['Priest', 'Cleric', 'Crusader', 'Paladin', 'Bishop', 'Cardinal'],
  ['Initiate', 'Acolyte', 'Adept', 'Magister', 'Patriarh', 'Overlord']
]

let nextBlockSpells = [
  { idListSpells: 'whitemagic', nextList: false, name: 'Рассвет' },
  { idListSpells: 'blackmagic', nextList: false, name: 'Полнолуние'  },
  { idListSpells: 'astralmagic', nextList: false, name: 'Астрал'  },
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
// Функция для проверки наличия различий в массивах подкласса и при разлии закачиваю
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


function updateSpellsCheck(spellsList) {
  const update = {
      idMannequin: props.idMannequin,
      subclassList: subClassList.value,
      spellsList: [ 
      {"whitemagic":spellsList.whitemagic},
      {"blackmagic":spellsList.blackmagic},
      {"astralmagic":spellsList.astralmagic}
       ],
    };
    store.commit('spells/spellsChange', update);
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
  const stateSubclassList = listSpells.value.find((el) => el.spellsList).spellsList
  let containsElements = false;
  stateSubclassList.forEach(item => {
    for (const key in item) {
        if (item[key].length > 0) {
            containsElements = true;
            break;
        }
    }
    if (containsElements) {
        // Если хотя бы один массив содержит элементы, прекратить проверку
        return;
    }
});

//если записей нет, закачиваю с сервера массив заклинаний и делю на категории
if (stateSubclassList && !containsElements) {
  // загружаю массив заклинаний и сортирую согласно подкатегориям
  fetchSpellsAndSorts()
} 
else {
const stateSubclassList = listSpells.value.find((el) => el.subclassList)
const subclassChangesResult = checkForDifferences(stateSubclassList.subclassList, subClassList.value)
if(subclassChangesResult) {
  const stateSpellsList = listSpells.value.find((el) => el.spellsList)
  if(stateSpellsList) {
    const whitemagic = stateSpellsList.spellsList.find(item => item.whitemagic).whitemagic
    const blackmagic = stateSpellsList.spellsList.find(item => item.blackmagic).blackmagic
    const astralmagic = stateSpellsList.spellsList.find(item => item.astralmagic).astralmagic
    ollSpells.value = { whitemagic, blackmagic, astralmagic}
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

.accordionFace {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}

.wrapperAccordion {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  width: 100%;
  justify-content: space-around;
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
  
}
</style>
