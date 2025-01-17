<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  getFirestore,
  collection,
  query,
  orderBy,
  getDocs,
  deleteDoc,
  doc,
} from '@firebase/firestore'
import type { IInterview } from '@/interfaces'
import { useUserStore } from '@/stores/user'
import { useConfirm } from 'primevue/useconfirm'

const db = getFirestore()
const userStore = useUserStore()
const confirm = useConfirm()

const interviews = ref<IInterview[]>([])
const isLoading = ref<boolean>(true)

const getAllInterviews = async <T extends IInterview>(): Promise<T[]> => {
  const getData = query(
    collection(db, `users/${userStore.userId}/interviews`),
    orderBy('createdAt', 'desc'),
  )
  const listDocks = await getDocs(getData)
  return listDocks.docs.map((doc) => doc.data() as T)
}

const confirmRemoveInterview = async (id: string): Promise<void> => {
  confirm.require({
    message: 'Вы действительно хотите удалить собеседование?',
    header: 'Удаление собеседования',
    icon: 'pi pi-info-circle',
    rejectLabel: 'Отмена',
    acceptLabel: 'Удалить',
    rejectClass: 'p-button-secondary p-button-outlined',
    acceptClass: 'p-button-danger',
    accept: async () => {
      isLoading.value = true
      await deleteDoc(doc(db, `users/${userStore.userId}/interviews`, id))
      const listInterviews: Array<IInterview> = await getAllInterviews()
      interviews.value = listInterviews
      isLoading.value = false
    },
  })
}

onMounted(async () => {
  const listInterviews: Array<IInterview> = await getAllInterviews()
  interviews.value = [...listInterviews]
  isLoading.value = false
  console.log(interviews.value)
})
</script>

<template>
  <app-dialog />
  <app-progress v-if="isLoading" />
  <app-message v-else-if="!isLoading && interviews.length === 0" severity="info" size="large"
    >Нет добавленных собеседований.</app-message
  >
  <div v-else>
    <h1>Список собеседований</h1>
    <app-data-table :value="interviews">
      <app-column field="company" header="Компания"></app-column>
      <app-column filed="hrName" header="ИмяHR">
        <template #body="slotProps">
          <span>{{ slotProps.data.hrName || '-' }}</span>
        </template>
      </app-column>
      <app-column field="vacancyLink" header="Вакансия">
        <template #body="slotProps">
          <a :href="slotProps.data.vacancyLink" target="_blank">Ссылка на вакансию</a></template
        >>
      </app-column>
      <app-column header="Контакты">
        <template #body="slotProps">
          <div class="contacts">
            <a
              v-if="slotProps.data.contactTelegram"
              :href="`https://t.me/${slotProps.data.contactTelegram}`"
              class="contacts__telegram"
              target="_blank"
            >
              <span class="contacts__icon pi pi-telegram"></span>
            </a>
            <a
              v-if="slotProps.data.contactWhatsApp"
              :href="`https://wa.me/${slotProps.data.contactWhatsApp}`"
              class="contacts__whatsapp"
              target="_blank"
            >
              <span class="contacts__icon pi pi-whatsapp"></span>
            </a>
            <a
              v-if="slotProps.data.contactPhone"
              :href="`https://tell:${slotProps.data.contactPhone}`"
              class="contacts__phone"
              target="_blank"
            >
              <span class="contacts__icon pi pi-phone"></span>
            </a>
          </div>
        </template>
      </app-column>
      <app-column field="stages" header="Пройденные этапы">
        <template #body="slotProps">
          <div v-if="!slotProps.data.stages">Не заполнено</div>
          <div v-else class="interview-stage">
            <app-badge
              v-for="(stage, i) in slotProps.data.stages"
              :key="i"
              :value="i + 1"
            ></app-badge>
          </div>
        </template>
      </app-column>
      <app-column filed="salaryFrom" header="Запрлатная вилка">
        <template #body="slotProps">
          <span v-if="!slotProps.data.salaryFrom">Не заполнено</span>
          <span v-else>{{ slotProps.data.salaryFrom }} - {{ slotProps.data.salaryTo }}</span>
        </template>
      </app-column>
      <app-column header="Результат">
        <template #body="slotProps">
          <span v-if="!slotProps.data.result">Не заполнено</span>
          <template v-else>
            <div class="flex justify-between align-items-center gap-2">
              <app-overlay-badge :severity="slotProps.data.result === 'Offer' ? '' : 'danger'">
                <i
                  :class="
                    slotProps.data.result === 'Offer'
                      ? 'pi pi-thumbs-up-fill'
                      : 'pi pi-thumbs-down-fill'
                  "
                />
              </app-overlay-badge>
              <app-badge
                :severity="slotProps.data.result === 'Offer' ? 'success' : 'danger'"
                :value="slotProps.data.result === 'Offer' ? 'Оффер' : 'Отказ'"
              ></app-badge>
            </div>
          </template>
        </template>
      </app-column>
      <app-column>
        <template #body="slotProps">
          <div class="flex gap-2">
            <router-link :to="`/interview/${slotProps.data.id}`">
              <app-button icon="pi pi-pencil" severity="info"></app-button>
            </router-link>
            <app-button
              icon="pi pi-trash"
              severity="danger"
              @click="confirmRemoveInterview(slotProps.data.id)"
            ></app-button>
          </div>
        </template>
      </app-column>
    </app-data-table>
  </div>
</template>
<style scoped>
.contacts {
  display: flex;
  align-items: center;
  gap: 20px;
}
.contacts__telegram {
  color: #0088cc;
}
.contacts__whatsapp {
  color: #25d366;
}
.contacts__phone {
  color: #371777;
}
.contacts__icon {
  font-size: 20px;
}
.interview-stages {
  display: flex;
  gap: 5px;
}
</style>
