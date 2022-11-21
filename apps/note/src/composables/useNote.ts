import { ref, computed } from 'vue';
import { dateFormat } from '@/utils/dateFormater';
import { useAuthStore } from '@/stores/auth-store';
import { NOTE } from '@/apis';
import { useMutation } from 'vue-query';
import { useQuasar } from 'quasar';

export function useNote(note: API.Note) {
  const authStore = useAuthStore();
  const $q = useQuasar();

  const noteRef = ref<API.Note>(note);
  const afterCallback = ref<(n: API.Note) => void>();

  const { mutate: excuteUpdateNote, isLoading: isUpdating } = useMutation(
    ['Update Note', note.id],
    (value: string) => {
      return NOTE.updateNote(noteRef.value.id, value);
    },
    {
      onSuccess: (d) => {
        noteRef.value = {
          ...noteRef.value,
          content: d.content
        };
        if (afterCallback.value) {
          afterCallback.value(d);
          afterCallback.value = undefined;
        }
      }
    }
  );

  const { mutate: excuteDeleteNote, isLoading: isDeleting } = useMutation(
    ['Delete Note', note.id],
    (hard: boolean) => {
      return NOTE.deleteNote(noteRef.value.id, hard);
    },
    {
      onSuccess: (d) => {
        noteRef.value = {
          ...noteRef.value,
          deletedAt: Date.now().toString()
        };
        if (afterCallback.value) {
          afterCallback.value(d);
          afterCallback.value = undefined;
        }
      }
    }
  );
  const { mutate: excuteRecoverNote, isLoading: isRecovering } = useMutation(
    ['Recover Note', note.id],
    () => {
      return NOTE.recoverNote(noteRef.value.id);
    },
    {
      onSuccess: (d) => {
        noteRef.value = {
          ...noteRef.value,
          deletedAt: undefined
        };
        if (afterCallback.value) {
          afterCallback.value(d);
          afterCallback.value = undefined;
        }
      }
    }
  );

  const data = computed(() => ({
    ...noteRef.value,
    createdAt: dateFormat(noteRef.value.createdAt),
    updatedAt: dateFormat(noteRef.value.updatedAt),
    user: noteRef.value.user || { id: -1, authId: -1, name: 'Guest' },
    editable: authStore.isAuth && authStore.user?.id === noteRef.value.user?.id,
    deleteable:
      authStore.isAuth && authStore.user?.id === noteRef.value.user?.id
  }));

  const updateNote = (v: string, callback?: (n: API.Note) => void) => {
    excuteUpdateNote(v);
    afterCallback.value = callback;
  };

  const deleteNote = (callback?: (n: API.Note) => void) => {
    const hard = Boolean(noteRef.value.deletedAt);
    if (hard)
      return $q
        .dialog({
          title: 'Confirm',
          message: 'Do you want to delete this note forever?'
        })
        .onOk(() => {
          excuteDeleteNote(true);
          afterCallback.value = callback;
        });

    return excuteDeleteNote(hard);
  };

  const recoverNote = (callback?: (n: API.Note) => void) => {
    excuteRecoverNote();
    afterCallback.value = callback;
  };

  return {
    noteRef,
    data,
    updateNote,
    isUpdating,
    deleteNote,
    isDeleting,
    recoverNote,
    isRecovering
  };
}
