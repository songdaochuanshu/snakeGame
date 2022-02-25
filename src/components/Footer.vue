<!--
 * @Descripttion: 
 * @version: 
 * @Author: MiKin
 * @Date: 2022-02-25 14:45:31
 * @LastEditors: MiKin
 * @LastEditTime: 2022-02-25 16:00:43
 * @FilePath: \snakeGame\src\components\Footer.vue
-->
<script setup lang="ts">
import { isDark, toggleDark } from '~/composables'
</script>

<template>
  <nav text-xl mt-6 inline-flex gap-2>
    <button class="icon-btn !outline-none" @click="toggleDark()">
      <div v-if="isDark" i-carbon-moon />
      <div v-else i-carbon-sun />
    </button>

    <a
      class="icon-btn"
      i-carbon-logo-github
      rel="noreferrer"
      href="https://github.com/songdaochuanshu/snakeGame"
      target="_blank"
      title="GitHub"
    />
  </nav>
</template>
