<template>
  <div
    class="note-item"
    :data-deleted="Boolean(data.deletedAt)"
    :id="`note-item-${data.id}`"
  >
    <div class="note-item-header">
      <p class="note-item-id">#{{ data.id }}</p>
      <div class="note-item-actions">
        <q-btn
          :icon="isEditing ? 'done' : 'edit'"
          v-if="data.editable"
          @click="dynamicToggle"
          color="primary"
          flat
          round
          size="sm"
          :loading="isUpdating"
        >
          <q-tooltip v-if="isEditing">
            {{ $t('note.edit.done') }}
          </q-tooltip>
          <q-tooltip v-else>
            {{ $t('note.edit.label') }}
          </q-tooltip>
        </q-btn>

        <q-btn
          icon="delete_outline"
          v-if="data.deleteable"
          color="negative"
          flat
          round
          @click="onDelete()"
          size="sm"
          :loading="isDeleting"
        />

        <q-btn
          icon="restore"
          v-if="Boolean(data.deletedAt)"
          color="positive"
          flat
          round
          size="sm"
          @click="onRecover()"
          :loading="isRecovering"
        />
      </div>
    </div>
    <q-item class="note-item-info">
      <q-item-section side>
        <q-avatar
          size="md"
          :style="{ backgroundColor: generateColor(data.user.name) }"
        >
          {{ data.user.name[0] }}
        </q-avatar>
      </q-item-section>
      <q-item-section side>
        <q-item-label class="name">
          {{ data.user.name }}
          <span>
            <q-icon
              name="verified_user"
              v-if="Boolean(props.note.user)"
              color="positive"
            />
          </span>
        </q-item-label>
      </q-item-section>
    </q-item>
    <component
      :is="componentName"
      v-bind="componentProps"
      :readonly="isUpdating"
    />
    <div class="note-item-footer">
      <p class="note-item-date">{{ data.createdAt }}</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useNote } from '@/composables/useNote';
import { ProvideKey } from '@/constants';
import { generateColor } from '@/utils/generateColor';
import { computed, inject, ref } from 'vue';

const props = defineProps<{ note: API.Note }>();
const {
  data,
  isUpdating,
  updateNote,
  recoverNote,
  isRecovering,
  deleteNote,
  isDeleting,
} = useNote(props.note);
const isEditing = ref(false);
const editValue = ref<string>();

const componentName = computed(() =>
  isEditing.value && data.value.editable ? 'q-editor' : 'div'
);

const noteListInjector = inject<Provide.NoteList>(ProvideKey.NOTE_LIST);

const componentProps = computed(() =>
  isEditing.value && data.value.editable
    ? {
        modelValue: editValue.value,
        'onUpdate:modelValue': (v: string) => {
          editValue.value = v;
        },
      }
    : {
        innerHTML: data.value.content,
        class: 'note-item-content',
      }
);

function dynamicToggle() {
  if (isEditing.value) {
    if (editValue.value) {
      updateNote(editValue.value, () => {
        isEditing.value = !isEditing.value;
      });
      return;
    }
  } else {
    editValue.value = data.value.content;
  }
  isEditing.value = !isEditing.value;
}

function onRecover() {
  recoverNote();
}

function onDelete() {
  deleteNote(() => {
    noteListInjector?.onRefetch();
  });
}
</script>

<style lang="scss" scoped>
.note-item {
  padding: 16px;
  background-color: #fff;
  border-radius: 8px;
  border: 1px solid #c4c4c4;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  display: flex;
  flex-direction: column;

  &[data-deleted='true'] {
    background-color: #ff00000f;
  }

  &-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
  }

  &-id,
  &-date {
    color: #555;
    margin: 0;
  }

  &-id {
    font-size: 18px;
  }

  &-info {
    color: #000;
    padding-left: 0;
    padding-right: 0;

    .name {
      color: #000;
      font-weight: 500;
    }
  }

  &-footer {
    justify-content: flex-end;
    display: flex;
    margin-top: auto;
    padding-top: 1rem;
  }

  &-content,
  .q-editor {
    :deep(code),
    :deep(pre) {
      background-color: #f4f4f4 !important;
      transition: all 0.15s cubic-bezier(0.165, 0.84, 0.44, 1);
      color: #476582;
    }

    :deep(a) {
      font-weight: 600;
    }
  }

  &-actions {
    display: flex;
  }
}
</style>
