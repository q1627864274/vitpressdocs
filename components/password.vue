<template>
    <div v-if="!isAuthenticated" class="overlay">
      <div class="modal">
        <input type="password" v-model="password" placeholder="请输入密码">
        <button @click="checkPassword">提交</button>
        
        <p v-if="showError" class="error">密码错误，请重试。</p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const password = ref('');
  const isAuthenticated = ref(false);
  const showError = ref(false);
  
  const checkPassword = () => {
    const correctPassword = '123'; // 这里替换为你的密码
    if (password.value === correctPassword) {
      isAuthenticated.value = true;
    } else {
      showError.value = true;
      setTimeout(() => (showError.value = false), 3000); // 3秒后隐藏错误信息
    }
  };
  </script>
  
  <style scoped>
  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.9);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999;
  }
  
  .modal {
    background: white;
    padding: 20px;
    border-radius: 5px;
  }
  
  .error {
    color: red;
    margin-top: 10px;
  }
  </style>
  