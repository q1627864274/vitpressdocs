export default {
    example: {
        'App.vue': `
        <template>
          <h1>{{ msg }}</h1>
          <input v-model="msg">
          <Fuben/>
        </template>
        <script setup>
        import { ref } from 'vue'
        import Fuben from "./Fuben.vue"
        const msg = ref('你好 林大大1哟!')
        </script>
        `,
        'Fuben.vue': `
        <template>
          <h1>{{ msg }}</h1>
          <input v-model="msg">
        </template>
        
        <script setup>
        import { ref } from 'vue'
        const msg = ref('我是副本')
        </script>
        `,
    },
    triangle: {
        'App.vue':
         `
<template>
    <div class="border"></div>
</template>
<script setup>
</script>
<style>
.border {
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 50px;
    border-top: 0;
    border-color: transparent transparent #d9534f;
}
</style>
       `
    },
    emptTriangle: {
        'App.vue':
        `
<template>
  <div class="border"></div>
</template>
<script setup>
</script>
<style>
.border {
    width: 0;
    height: 0;
    border-style:solid;
    border-width: 0 50px 50px;
    border-color: transparent transparent #d9534f;
    position: relative;
}
.border:after {
    content: '';
    border-style: solid;
    border-width: 0 40px 40px;
    border-color: transparent transparent #96ceb4;
    position: absolute;
    top: 6px;
    left: -40px;
}
</style>
        `
    }

}

