<script setup lang="ts">
import { z } from 'zod'
import { nextTick, ref } from 'vue'
import type { FormSubmitEvent } from '#ui/types'
import { useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()

const quizCode = computed(() => route.query.code as string | undefined);
const infos = ref<{ room?: string, user?: string }>({})

console.log(quizCode.value);
const schema = z.object({
  room: z.string().nonempty("Must be set"),
  user: z.string().nonempty("Must be set"),
})

type Schema = z.output<typeof schema>

const state = ref<Schema>({ room: quizCode.value || '', user: '' })

async function onSubmit(event: FormSubmitEvent<Schema>) {
    event.preventDefault(); 
    infos.value = { ...state.value };
    await nextTick();
    router.push(`/quiz/${infos.value.room}/waiting?user=${infos.value.user}`)
}


</script>

<template>
  <UContainer class="min-h-screen flex flex-col items-center justify-center">
    <h1 class="text-2xl font-bold mb-4">Rejoindre une Room</h1>

    <UForm :schema="schema" :state="state" class="space-y-4 w-96" @submit="onSubmit">
      <UFormGroup label="Nom d'utilisateur" name="user">
        <UInput v-model="state.user" />
      </UFormGroup>

      <UFormGroup label="Code de la Room" name="room" v-if="!quizCode">
        <UInput v-model="state.room" />
      </UFormGroup>

      <UButton type="submit" block>Rejoindre</UButton>
    </UForm>
  </UContainer>
</template>