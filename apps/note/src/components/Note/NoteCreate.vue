<template :inheritAttrs="false">
  <q-form
    class="note-create-container q-gutter-md"
    @submit="onSubmit"
    autocorrect="off"
    autocapitalize="off"
    autocomplete="off"
    spellcheck="false"
  >
    <q-editor
      v-model="form"
      :placeholder="$t('note.create.placeholder')"
      :label="$t('note.create.label')"
      :disable="isLoading"
    >
    </q-editor>
    <q-btn
      icon="create"
      type="submit"
      color="primary"
      :label="$t('note.create.label')"
      :disable="!form"
      :loading="isLoading"
    />
  </q-form>
</template>

<script lang="ts" setup>
import { NOTE } from '@/apis';
import { useAuthStore } from '@/stores/auth-store';
import { useQuasar } from 'quasar';
import { ref } from 'vue';
import { useMutation } from 'vue-query';
import { useI18n } from 'vue-i18n';

const emits = defineEmits<{
  (event: 'created', n: API.Note): void;
}>();

const $q = useQuasar();

const { t } = useI18n();

const form = ref<string>('');

const authStore = useAuthStore();

const { mutate, isLoading } = useMutation('NoteCreation', NOTE.createNote, {
  onSuccess: (d) => {
    form.value = '';
    emits('created', d);
    $q.notify({
      color: 'positive',
      message: t('note.create.message.created.success'),
    });
  },
  onError: () => {
    $q.notify({
      color: 'negative',
      message: t('note.create.message.created.error'),
    });
  },
});

function onSubmit() {
  const message = authStore.isAuth
    ? t('note.create.message.default')
    : t('note.create.message.anonymous');

  $q.dialog({
    color: 'primary',
    title: 'Confirm',
    message,
  }).onOk(() => {
    mutate(form.value);
  });
}
</script>

<style lang="scss" scoped>
.note-create-container {
  display: flex;
  flex-direction: column;
  .q-editor {
    flex: 1;
    max-height: 300px;
    overflow-y: auto;

    :deep(.q-editor__toolbars-container) {
      position: sticky;
      top: 0;
      overflow: hidden;
      z-index: 100;
      background-color: white;
    }
  }

  .action {
    margin-top: auto;
    margin-bottom: 20px;
  }
}
</style>
