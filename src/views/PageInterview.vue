div
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { doc, getFirestore, getDoc, updateDoc } from 'firebase/firestore'
import { useUserStore } from '../stores/user'
import type { IInterview, IStage } from '../interfaces'
import dayjs from 'dayjs'

const db = getFirestore()
const userStore = useUserStore()
const route = useRoute()

const isLoading = ref<boolean>(true)
const interview = ref<IInterview>()
const docref = doc(db, `users/${userStore.userId}/interviews`, route.params.id as string)

const getData = async (): Promise<void> => {
  isLoading.value = true
  const docSnap = await getDoc(docref)
  interview.value = docSnap.data() as IInterview
  isLoading.value = false
}

const addStage = () => {
  if (interview.value) {
    if (!interview.value.stages) {
      interview.value.stages = []
    }
    interview.value.stages.push({ name: '', date: '', description: '' })
  }
}

const removeStage = (index: number) => {
  if (interview.value) {
    if (interview.value.stages) {
      interview.value.stages.splice(index, 1)
    }
  }
}

const saveInterview = async (): Promise<void> => {
  isLoading.value = true
  await updateDoc(docref, { ...interview.value })
  await getData()
  isLoading.value = false
}

const saveDateStage = (index: number) => {
  if (interview.value?.stages && interview.value.stages.length) {
    const date = interview.value.stages[index].date
    interview.value.stages[index].date = dayjs(date).format('DD/MM/YYYY')
  }
}

onMounted(async () => await getData())
</script>

<template>
  <app-progress v-if="isLoading" />
  <div v-else-if="interview?.id && !isLoading" class="content-interview">
    {{ interview }}
    <app-card>
      <template #title>Собеседование в кампанию {{ interview.company }}</template>
      <template #content>
        <div class="flex flex-column gap-2">
          <label for="company">Кампания</label>
          <app-input-text
            v-model="interview.company"
            class="input mb-3"
            id="company"
          ></app-input-text>
        </div>
        <div class="flex flex-column gap-2">
          <label for="vacancyLink">Описание вакансии (ссылка)</label>
          <app-input-text
            v-model="interview.vacancyLink"
            class="input mb-3"
            id="vacancyLink"
          ></app-input-text>
        </div>
        <div class="flex flex-column gap-2">
          <label for="hrName">Контакт (имя)</label>
          <app-input-text
            v-model="interview.hrName"
            class="input mb-3"
            id="hrName"
          ></app-input-text>
        </div>
        <div class="flex flex-column gap-2">
          <label for="contactTelegram">Telegram HR</label>
          <app-input-text
            v-model="interview.contactTelegram"
            class="input mb-3"
            id="contactTelegram"
          ></app-input-text>
        </div>
        <div class="flex flex-column gap-2">
          <label for="contactWhatsApp">WhatsApp HR</label>
          <app-input-text
            v-model="interview.contactWhatsApp"
            class="input mb-3"
            id="contactWhatsApp"
          ></app-input-text>
        </div>
        <div class="flex flex-column gap-2">
          <label for="contactPhone">Телефон HR</label>
          <app-input-text
            v-model="interview.contactPhone"
            class="input mb-3"
            id="contactPhone"
          ></app-input-text>
        </div>
        <div class="flex gap-3 mb-3 w-full">
          <div class="flex-auto">
            <app-input-number
              v-model="interview.salaryFrom"
              class="input"
              inputId="salaryFrom"
              placeholder="Зарплатная вилка от"
            ></app-input-number>
          </div>
          <div class="flex-auto">
            <app-input-number
              v-model="interview.salaryTo"
              class="input"
              inputId="salaryTo"
              placeholder="Зарплатная вилка до"
            ></app-input-number>
          </div>
        </div>
        <app-button
          @click="addStage()"
          label="Добавить этап"
          severity="info"
          icon="pi pi-plus"
          class="mb-3"
        ></app-button>
        <template v-if="interview.stages">
          <div v-for="(stage, index) in interview.stages" :key="index" class="interview-stage">
            <div class="flex flex-column gap-2 mb-3">
              <label :for="`stage-name-${index}`">Название этапа</label>
              <app-input-text
                v-model="stage.name"
                :id="`stage-name-${index}`"
                placeholder="Онлайн-тестирование"
              ></app-input-text>
            </div>
            <div class="flex flex-column gap-2 mb-3">
              <label :for="`stage-calendar-${index}`">Дата прохождения этапа</label>
              <app-datepicker
                @date-select="saveDateStage(index)"
                v-model="stage.date"
                :id="`stage-calendar-${index}`"
                placeholder="03/05/2025"
                dataFormat="dd/mm/yyyy"
              >
              </app-datepicker>
            </div>
            <div class="flex flex-column gap-2 mb-3">
              <label :for="`stage-description-${index}`">Комментарий</label>
              <app-textarea
                v-model="stage.description"
                class="input"
                :id="`stage-description-${index}`"
                placeholder="Введите текст..."
                rows="3"
                maxlength="300"
              ></app-textarea>
            </div>
            <app-button
              @click="removeStage(index)"
              label="Удалить этап"
              severity="danger"
              class="mb-2"
            />
          </div>
        </template>
        <div class="flex flex-wrap gap-2 mb-3">
          <div class="flex align-items-center">
            <app-radio
              v-model="interview.result"
              inputId="interviewResult1"
              name="result"
              value="Refusal"
            ></app-radio>
            <label for="interviewResult1" class="ml-1">Отказ</label>
          </div>
          <div class="flex align-items-center">
            <app-radio
              v-model="interview.result"
              inputId="interviewResult2"
              name="result"
              value="Offer"
            ></app-radio>
            <label for="interviewResult2" class="ml-1">Оффер</label>
          </div>
        </div>
        <app-button @click="saveInterview()" label="Сохранить" icon="pi pi-save"></app-button>
      </template>
    </app-card>
  </div>
</template>
<style scoped>
.content-interview {
  max-width: 600px;
  margin: auto;
}
.input {
  width: 100%;
}
.interview-stage {
  border: 1px solid #ccc;
  border-radius: 6px;
  padding: 10px;
  margin-bottom: 10px;
}
</style>
