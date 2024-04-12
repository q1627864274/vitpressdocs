export default {
    memo: {
       'App.vue': `
 <template>
    <div>
      <div @click="select(item.id)"   :key="item.id" v-for="(item) in arr" v-memo="[item.id === active]">
        {{ item.id }} - selected： {{ item.id == active }}
      </div>
    </div>
 </template>
 <script setup >
    import { ref, reactive } from 'vue'
 
    const arr = reactive([])
    for (let i = 0; i < 10000; i++) {
    arr.push({
       id: i + 1,
       name: "test"
    })
    }
    const active = ref(1)
    const select = async (index) => {
    active.value = index;
    console.time()
    await Promise.resolve()
    console.timeEnd()
    }
 </script>
  <style scoped lang='less'>
  </style>
       `
    }
 }