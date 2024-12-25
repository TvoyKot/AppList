<script setup lang="ts">
import { ref, computed } from 'vue'
import type { ComputedRef } from 'vue'
import { useUserStore } from '../stores/user'

const userStore = useUserStore()

interface IMenuItem {
  label: String
  icon: String
  path: String
  show: ComputedRef<boolean>
}

const items = ref<IMenuItem[]>([
  {
    label: 'Авторизация',
    icon: 'pi pi-user',
    path: '/auth',
    show: computed((): boolean => !userStore.userId),
  },
  {
    label: 'Добавить',
    icon: 'pi pi-plus',
    path: '/',
    show: computed((): boolean => !!userStore.userId),
  },
  {
    label: 'Список собеседований',
    icon: 'pi pi-list',
    path: '/list',
    show: computed((): boolean => !!userStore.userId),
  },
  {
    label: 'Статистика',
    icon: 'pi pi-chart-pie',
    path: '/statistic',
    show: computed((): boolean => !!userStore.userId),
  },
])
</script>

<template>
  <app-menubar :model="items" class="menu">
    <template #item="{ item, props }">
      <template v-if="item.show">
        <router-link :to="item.path" v-bind="props.action" class="flex align-items-center">
          <span :class="item.icon" class="p-menuitem-icon" />
          <span class="ml-2">{{ item.label }}</span>
        </router-link>
      </template>
    </template>
    <template #end>
      <div class="menu-exit">
        <span v-if="userStore.userId" @click="userStore.userId = ''" class="flex align-items-center menu-exit">
          <span class="pi pi-sign-out p-menuitem-icon" />
          <span class="ml-2">Выход</span>
        </span>
      </div>
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
