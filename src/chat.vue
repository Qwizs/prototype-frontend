<script setup lang="ts">
import {io} from 'socket.io-client'
import { ref, type Ref } from 'vue';
import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'

const props = defineProps(['infos'])

class message {
    user: string|undefined
    message: string|undefined
}

const schema = z.object({
  message: z.string().nonempty("Must be set")
})

type Schema = z.output<typeof schema>

const state = reactive(new message())

let messages : Ref<message[]> = ref([])

const socket = io(`http://chat-api.oracle.aquabx.ovh:443}`);

socket.on('connect', function() {
    console.log('Connected');
    console.log(props.infos.room)
    let a = socket.emit('connectionRoom', props.infos);
    console.log(a)
})

async function onSubmit(event: FormSubmitEvent<Schema>) {
  socket.emit('events',{...event.data, ...props.infos})
}

socket.on('events', function(data) {
    messages.value.push(data);
});
socket.on('exception', function(data) {
    console.log('event', data);
});
socket.on('disconnect', function() {
    console.log('Disconnected');
});

</script>

<template>
<UContainer class="min-h-screen max-h-screen h-screen flex flex-col justify-end p-4 gap-4">

    <UContainer class="flex-[1] w-full flex gap-2 flex-col overflow-y-scroll">
        <UCard v-for="msg of messages" class="w-full">
            <template #header>
                <h2 class="text-xl">{{ msg.user }}</h2>
            </template>

            <p class="text-md">{{ msg.message }}</p>

            <template #footer>
                <p class="text-sm"></p>
            </template>
        </UCard>
    </UContainer>
{{ messages.length }}
    <UForm :schema="schema" :state="state" class="space-y-4 flex-[300px]" @submit="onSubmit">

        <UFormGroup label="message" name="message">
        <UInput v-model="state.message" />
        </UFormGroup>

        <UButton type="submit">
            Submit
        </UButton>
    </UForm>
</UContainer>

</template>

