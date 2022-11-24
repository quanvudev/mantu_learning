<template>
  <q-page padding class="column">
    <NoteCreate @created="onRefetch" />
    <NoteList :data="data" @load="loadNext" />
  </q-page>
</template>

<script lang="ts" setup>
import NoteCreate from '@/components/Note/NoteCreate.vue';
import NoteList from '@/components/Note/NoteList.vue';

import { NoteService } from '@/services';
import { useInfiniteQuery } from 'vue-query';
import last from 'lodash/last';
import { onUnmounted, provide, ref } from 'vue';
import { ProvideKey } from '@/constants';

const totalPages = ref(0);
const currentAction = ref<((stop?: boolean) => void) | null>(null);

const { fetchNextPage, data, isFetchingNextPage, remove, refetch } =
  useInfiniteQuery(
    'NoteListPage',
    ({ pageParam }) => {
      return NoteService.getNotes(2, pageParam);
    },
    {
      onSuccess: (d) => {
        const lastPage = last(d.pages);
        if (lastPage) {
          totalPages.value = lastPage?.meta.totalPages;
          if (lastPage?.links.next) {
            currentAction.value?.();
            return;
          }
          currentAction.value?.(true);
        }
      },
    }
  );

function loadNext(idx = 1, done: (stop?: boolean) => void) {
  if (isFetchingNextPage.value) return;
  fetchNextPage.value({ pageParam: idx });
  currentAction.value = done;
}

function onRefetch() {
  refetch.value();
}

provide<Provide.NoteList>(ProvideKey.NOTE_LIST, { onRefetch });

onUnmounted(() => {
  remove.value();
});
</script>
