<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'

const infos = defineModel()

class inputs {
    room: string|undefined
    user: string|undefined
}

const schema = z.object({
  room: z.string().nonempty("Must be set"),
  user: z.string().nonempty("Must be set"),
})

type Schema = z.output<typeof schema>

const state = reactive(new inputs())

async function onSubmit(event: FormSubmitEvent<Schema>) {
    infos.value = state
}
</script>

<template>

    <UForm :schema="schema" :state="state" class="space-y-4 flex-[300px]" @submit="onSubmit">
        <UFormGroup label="user" name="user">
        <UInput v-model="state.user" />
        </UFormGroup>
        <UFormGroup label="room" name="room">
        <UInput v-model="state.room" />
        </UFormGroup>
        <UButton type="submit">
            Submit
        </UButton>
    </UForm>

</template>

