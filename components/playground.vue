<template>
    <div v-if="isLoaded">
      <Repl :store="store" :editor="CodeMirror"/>
    </div>
  </template>  
<script setup>
import { watchEffect, ref, onMounted, onUnmounted } from 'vue'

// 定义响应式引用
const Repl = ref(null)
const CodeMirror = ref(null)
const store = ref(null)
const isLoaded = ref(false) // 新增加载状态

onMounted(async () => {
  console.log('组件创建')

  // 同时动态导入依赖项
  const [replModule, codeMirrorModule] = await Promise.all([
    import('@vue/repl'),
    import('@vue/repl/codemirror-editor')
  ]);

  // 设置加载的模块
  Repl.value = replModule.Repl
  store.value = replModule.useStore()
  store.value.setFiles(props.files)
  CodeMirror.value = codeMirrorModule.default

  // 所有依赖加载完毕，更新加载状态
  isLoaded.value = true
})

onUnmounted(() => {
  console.log('组件销毁')
})

// 传进来的props
const props = defineProps({
  files: Object,
})
</script>
<style>
.container .main .name {
    max-width: 580px
}
.aside-container{
    width: 590px !important;
}
.content {
    max-width: 850px !important;
}
.split-pane {
    height: 400px !important;
}
.split-pane .right {
    height: 100% !important
}
</style>