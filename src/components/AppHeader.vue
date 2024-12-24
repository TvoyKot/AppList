<script setup lang="ts">
import { ref } from 'vue'

interface IMenuItem {
  label: String,
  icon: String,
  path: String,
}

const items = ref<IMenuItem[]>([
  {
    label: 'Авторизация',
    icon: 'pi pi-user',
    path: '/auth',
  },
  {
    label: 'Добавить',
    icon: 'pi pi-plus',
    path: '/',
  },
  {
    label: 'Список собеседований',
    icon: 'pi pi-list',
    path: '/list',
  },
  {
    label: 'Статистика',
    icon: 'pi pi-chart-pie',
    path: '/statistic',
  },
])
</script>
<template>
  <app-menubar :model="items" class="menu">
    <template #item="{ item, props }">
      <router-link :to="item.path" v-bind="props.action" class="flex align-items-center">
        <span :class="item.icon" class="p-menuitem-icon"></span>
        <span class="ml-2">{{ item.label }}</span>
      </router-link>
    </template>
  </app-menubar>
</template>
<style scoped>
.menu {
  margin: 30px 0;
}
.menu-exit {
  cursor: pointer;
}
</style>
