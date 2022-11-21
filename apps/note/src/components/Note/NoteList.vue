<template :inheritAttrs="false">
  <div class="note-list-container">
    <div class="note-list-header">
      <q-btn
        flat
        round
        :color="view === 'list' ? 'primary' : undefined"
        icon="list"
        @click="toggleView('list')"
      />
      <q-btn
        flat
        round
        :color="view === 'grid' ? 'primary' : undefined"
        @click="toggleView('grid')"
        icon="window"
      />
    </div>

    <QInfiniteScroll
      :class="view"
      v-bind="{ ...$props, ...$attrs }"
      :offset="250"
    >
      <template v-for="page in props.data?.pages">
        <NoteItem v-for="item in page.items" :key="item.id" :note="item" />
      </template>
      <template v-slot:loading>
        <div class="row justify-center q-my-md">
          <q-spinner-dots color="primary" size="40px" />
        </div>
      </template>
    </QInfiniteScroll>
  </div>
</template>

<script lang="ts" setup>
import { InfiniteData } from 'vue-query/types';
import NoteItem from './NoteItem.vue';
import { QInfiniteScrollProps } from 'quasar';
import { onBeforeMount, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { RouteNames } from '@/constants';

type ViewState = 'grid' | 'list';

interface NLProps extends QInfiniteScrollProps {
  data?: InfiniteData<API.PaginationResponse<API.Note>>;
}

const props = defineProps<NLProps>();

const view = ref<ViewState>('list');

const router = useRouter();
const route = useRoute();

function toggleView(s: ViewState = 'list') {
  view.value = s;
  router.replace({
    name: route.name as RouteNames,
    query: { view: view.value },
  });
}

onBeforeMount(() => {
  const viewQuery = route.query['view'];
  let _view = (
    Array.isArray(viewQuery) ? String(viewQuery[0]) : String(viewQuery)
  ) as ViewState;
  const listViewState: ViewState[] = ['list', 'grid'];
  if (listViewState.includes(_view)) view.value = _view;
});
</script>

<style lang="scss" scoped>
.note-list {
  * {
    transition: all 0.3s ease-in-out;
  }
  &-header {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding: 12px 0;
  }

  &-container {
    display: flex;
    flex-direction: column;
    margin-top: 24px;
    flex: 1;
    max-width: 100%;

    :deep(.q-infinite-scroll) {
      gap: 16px;
      display: flex;
      flex-direction: column;
      &.grid {
        flex-wrap: wrap;
        flex: 1;
        flex-direction: row;
        .note-item {
          flex: calc(50% - 16px);
          width: 100%;
          overflow: hidden;
        }
      }
    }
  }
}
</style>
