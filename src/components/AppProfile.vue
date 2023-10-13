<template>
  <div class="modal" @click.stop="isClose"></div>
  <div class="modal-content">
    <span @click="isClose" class="close">&times;</span>

    <AppLoader v-if="isLoading" />
    
    <p v-if="clientInfo">{{ getLocalizedText('Profile') }} {{ clientInfo.name }}</p>

    <div v-if="!checkUser" class="accordeonContent">
      <div @click="accordionOpen(1)" class="accordion" :class="{ accordionOpen: openRegister }">
        <div class="accordionFace">
          <div class="card-title">{{ getLocalizedText('Registration') }}</div>
        </div>
      </div>

      <div @click="accordionOpen(2)" class="accordion" :class="{ accordionOpen: openLogin }">
        <div class="accordionFace">
          <div class="card-title">{{ getLocalizedText('Authorization') }}</div>
        </div>
      </div>

      <div class="panel" :class="{ open: openRegister }">
        <FormRegIsteredLogin loginFlag="register" @isClose="isCloseForm" />
      </div>

      <div class="panel" :class="{ open: openLogin }">
        <FormRegIsteredLogin loginFlag="login" @isClose="isCloseForm" />
      </div>
    </div>

    <div class="profile_content">
      <button v-if="checkUser" class="button" @click.stop="logout">Вийти</button>

      <LocaleChange
        v-if="localeSait"
        :key="refrech"
        :localeSait="localeSait"
        @onChangeLocale="onChangeLocale"
      />
    </div>

    <div 
    v-if="checkUser"  
    class="profile_content">
      <button v-if="checkUser" class="button" @click.stop="saveManecken">{{ getLocalizedText('SaveDummy') }}</button>
    </div>
    <h3>{{ getLocalizedText('MannequinsAvailable') }}</h3>
    <div 
    v-if="checkUser && markManeckenSave"
    class="profile_content">
      <ul>
        <div 
        class="saveManecken"
        v-for="m in markManeckenSave" :key="m.mark">
          <li
          class="li_saveManecken"
          >{{ timeMarc(m.mark) }}</li>
        <button 
        @click="addManecken(m.mark)"
        class="button btn_manecken" >{{ getLocalizedText('Download') }}</button>
        <button 
        @click="delManecken(m.mark)"
        class="button btn_manecken" >{{ getLocalizedText('Remove') }}</button>
        </div>
      </ul>
    </div>

    <div
    v-if="Object.keys(markSave).length > 0"
    class="saveManecken"
    >
          <button
          class="button btn_manecken btn_currentPage"
            v-if="currentPage > 1"
            @click="currentPage = currentPage - 1"
         >
         {{ getLocalizedText('Back') }}
          </button>
          <button
          class="button btn_manecken btn_currentPage"
          v-if=hasNextPage
            @click="currentPage = currentPage + 1"
          >
          {{ getLocalizedText('Next') }}
          </button>
      </div>
  </div>
</template>

<script setup>
import { useStore } from 'vuex'
import { ref, onMounted, computed, watch } from 'vue'
import { getAuth } from 'firebase/auth'
import AppLoader from './AppLoader.vue'
import FormRegIsteredLogin from './use/FormRegIsteredLogin.vue'
import LocaleChange from './use/LocaleChange.vue'
import { getLocalizedText } from '@/locale/index'

const emits = defineEmits({
  isClose: null,
  refrech: null,
})
defineProps({})
const store = useStore()
const auth = getAuth()

const authComputed = computed(() => auth)
const checkUser = ref()

watch(
  authComputed,
  (val) => {
    checkUser.value = val.currentUser
  },
  { immediate: true }
)



const clientInfo = ref([])
const isLoading = ref(true)
const localeSait = ref()
const markSave = computed(() => store.getters['requests/markSave'] )


const markManeckenSave = ref()

// режу обьект с маркировками сохранений на части длчя пагинации
function slicedObject(obj, start, end) {
    const sliced = {};
    let count = 0;
    for (const key in obj) {
        if (count >= start && count < end) {
            sliced[key] = obj[key];
        }
        count++;
    }
    return sliced;
}


// сортирую, сначала новые
const sortedData = {};
watch(markSave, val => {

  // Получаем массив ключей (временных меток)
const keys = Object.keys(val);
// Сортируем массив ключей в порядке убывания (сначала самые новые)
keys.sort((a, b) => b - a);
// Создаем новый объект с отсортированными ключами

for (const key of keys) {
    sortedData[key] = val[key];
}
markManeckenSave.value = slicedObject(sortedData, currentPageData.value.start, currentPageData.value.end)
})


const currentPage = ref(1)
const hasNextPage = ref(true)

// количество записей на странице
const COUNT_RECORDS_IN_PAGE = 3
const currentPageData = computed(() => {
      const start = (currentPage.value - 1) * COUNT_RECORDS_IN_PAGE
      const end = currentPage.value * COUNT_RECORDS_IN_PAGE
      return { start, end }
    })

// слежу за тем какая открыта страница, решаю можно ли показывать кнопку вперед и режу обьект с маркировками сохранений на части длчя пагинации
watch(currentPage, _ => {
      hasNextPage.value = currentPageData.value.end < Object.keys(sortedData).length;
      markManeckenSave.value = slicedObject(sortedData, currentPageData.value.start, currentPageData.value.end)
    })


function timeMarc(time) {
  return new Date(time).toLocaleString('en-GB')
}

// гружу стартовые данные о клиенте и маркировках сохранений
async function isLoadingParam() {
  clientInfo.value = store.getters['requests/clientInfo']
  if (!clientInfo.value) {
    clientInfo.value = await store.dispatch('requests/clientInfo')
  }
  if (clientInfo.value) {
    localeSait.value = clientInfo.value.locale
    await store.dispatch('requests/addMarkSave')
  } else {
    localeSait.value = 'uk-UA'
  }
}

onMounted(async () => {
  isLoading.value = true
  isLoadingParam()
  markManeckenSave.value = store.getters['requests/markSave']
  setInterval(() => {
    isLoading.value = false
  }, 400)

})

const isClose = () => {
  emits('isClose')
}

const refrech = ref(0)

const logout = () => {
  store.dispatch('auth/logout')
  localeSait.value = 'uk-UA'
  refrech.value++
  checkUser.value = null
}

// при смене языка, смотрю зарегестрирован ли игрок, в зависимости от этого меняю.
const onChangeLocale = async (locale) => {
  let update = {}
  if (clientInfo.value && clientInfo.value.name && clientInfo.value.role) {
    update = {
      name: clientInfo.value.name,
      role: clientInfo.value.role,
      locale
    }
  } else {
    update = {
      locale
    }
  }
  await store.dispatch('requests/updateInfo', update)
}

const openRegister = ref(null)
const openLogin = ref(null)

const accordionOpen = (idx) => {
  if (idx === 1) {
    openRegister.value = !openRegister.value
    openLogin.value = false
  } else {
    openLogin.value = !openLogin.value
    openRegister.value = false
  }
}

const isCloseForm = () => {
  openRegister.value = false
  openLogin.value = false
}

const delManecken = async (id) => {
  isLoading.value = true
 await store.dispatch('requests/deleteRecord', id)
 emits('refrech')
 isLoading.value = false
}

const addManecken = async (id) => {
  isLoading.value = true
  await store.dispatch('requests/addManecken', id)
  emits('isClose')
  isLoading.value = false
}

const saveManecken = async () => {
await store.dispatch('requests/saveManecken')
emits('refrech')
}

</script>

<script>
export default {
  name: 'AppProfile'
}
</script>

<style scoped>

.modal-content {
  max-height: 90vH;
}
.profile_content {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.accordeonContent {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
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
  padding: 10px 0px;
  width: 40%;
  text-align: left;
  outline: none;
}
.accordionOpen {
  border: 2px solid;
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
  margin-top: 15px;
  padding: 0 18px;
  background-color: white;
  max-height: 0;
  overflow: hidden;
  transition:
    max-height 0.5s ease-out,
    opacity 0.5s ease-out;
  opacity: 0; /* Начальная непрозрачность */
  transform: translateY(-10px); /* Начальное смещение */
  border-radius: 10px;
}

.open {
  height: fit-content;
  max-height: 1000px; /* Максимальная высота для открытой панели */
  opacity: 1; /* Полная непрозрачность */
  transform: translateY(0); /* Смещение отсутствует */
  transition:
    max-height 0.5s ease-out,
    opacity 0.5s ease-out,
    transform 0.5s ease-out;
}

.card-title {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.saveManecken {
    display: flex;
    width: 95%;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-around;
    border-radius: 10px;
    border: 2px solid #413e3e2f;
    margin-bottom: 5px;
}

.li_saveManecken {
  width: 100%;
  text-align-last: center;
  margin: 10px 0;
}

.btn_manecken {
  margin-bottom: 15px;
}

.btn_currentPage {
  background-color: #3666ab;
  color: aliceblue;
}
</style>
