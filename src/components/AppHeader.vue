
<template>
        <header class="header">
          <div class="header__left">
            <button 
            @click="mannequinIDChange(1)"
            class="tab-button"
            :class="{ 'active' : IdButtom === 1 }"
            >
              <p class="p__tab-button">{{ getLocalizedText('Dummy') }} 1</p>
            </button>
            <button 
            @click="mannequinIDChange(2)"
            class="tab-button"
            :class="{ 'active' : IdButtom === 2 }"
            >
              <p class="p__tab-button">{{ getLocalizedText('Dummy') }} 2</p>
              <!-- <div class="delete-tab-icon"></div> -->
            </button>
            <!-- <button class="add-tab-button" /> -->
          </div>


          <div class="header__right">
            <button 
            @click="$emit('isOpenPivot')"
            class="tab-button">
              <p class="p__tab-button">{{ getLocalizedText('SummaryTable') }}</p>
            </button>
            <button 
            @click="$emit('isOpenProfile')"
            class="tab-button">
              <p class="p__tab-button">{{ getLocalizedText('Profile') }}</p>
            </button>
          </div>
        </header>
</template>


<script setup>
import { ref } from 'vue'
import { getLocalizedText } from '@/locale/index'

const emits = defineEmits({
  mannequinChange: Number,
  isOpenProfile: null,
  isOpenPivot: null,
})



const IdButtom = ref(1)
const mannequinIDChange = (id) => {
  IdButtom.value = id
  emits('mannequinChange', id)
}

</script>

<script>
export default {
  name: 'AppHeader',
}
</script>

<style scoped>


.active {
  width: 130px;
  height: 28px;
    background-color: #31343ac2;
    background-image: url('../assets//img/tab3.png');
    border-radius: 9px;
    transition: transform 0.3s ease, width 0.3s ease, height 0.3s ease, background-color 0.3s ease;
}

.active > .active:hover {
    background-color: rgba(39, 90, 201, 0.761);
}

</style>