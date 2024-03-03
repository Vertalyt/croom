<script setup>
import { ref, watch, computed } from 'vue'
import { useStore } from 'vuex'
import MainLayout from './layout/MainLayout.vue'
import AppNotification from '@/components/AppNotification.vue'
import AppProfile from './components/AppProfile.vue'
import AppHeader from './components/AppHeader.vue'

const store = useStore()
const closeOpenProfile = ref(false)
const closeOpenProfileChange = () => {
  closeOpenProfile.value = !closeOpenProfile.value
}

const isProfileInfo = computed(() => store.getters['requests/clientInfo'])
const refreshProfile = ref(0)

watch(isProfileInfo, (_) => {
  refreshProfile.value++
})

const idMannequin = ref(1)
const mannequinChange = (val) => {
  idMannequin.value = val
}

const openPivot = ref(false)
</script>

<template>
  <AppNotification />

  <AppProfile
    v-if="closeOpenProfile"
    :key="refreshProfile"
    @isClose="closeOpenProfileChange"
    @refresh="refreshProfile = refreshProfile + 1"
  />

  <div class="room-container">
    <div class="wrapper">
      <div class="conteiner">
        <AppHeader
          @mannequinChange="mannequinChange"
          @isOpenProfile="closeOpenProfile = true"
          @isOpenPivot="openPivot = !openPivot"
        />

        <MainLayout
          :idMannequin="idMannequin"
          :openPivot="openPivot"
          @OpenProfile="closeOpenProfile = true"
        />
      </div>
    </div>
  </div>
</template>
