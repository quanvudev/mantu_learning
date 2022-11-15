<template>
  <div
    class="container"
    :class="{
      vertical: $props.isVertical,
    }"
  >
    <q-btn
      v-for="(l, idx) in linkList"
      :key="`${idx}-${l.title}`"
      :icon="l.icon"
      :class="{
        vertical: $props.isVertical,
        active: l.active,
      }"
      v-bind="{
        outline: l.active,
        flat: !l.active,
      }"
      @click="l.actions ? l.actions() : navigate(l.routeName)"
    >
      {{ l.title }}
    </q-btn>
  </div>
</template>

<script setup lang="ts">
import { RouteNames } from '@/constants';
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

export interface NavigationLinkItem {
  title: string;
  routeName: RouteNames;
  icon: string;
  actions?: VoidFunction;
}

interface LayoutHeaderProps {
  links: NavigationLinkItem[];
  isVertical?: boolean;
}

const props = defineProps<LayoutHeaderProps>();

const linkList = computed(() =>
  props.links.map((i) => ({ ...i, active: route.name === i.routeName }))
);

const route = useRoute();

const router = useRouter();

const navigate = (routeName: RouteNames) => {
  router.push({ name: routeName });
};
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: row;
  gap: 4px;

  .q-btn {
    :deep(.q-icon) {
      margin-right: 4px;
    }

    &.q-btn--outline::before,
    &::before {
      transition: all var(--animate-duration);
    }

    &.vertical {
      color: #c4c4c4;

      &.active {
        color: var(--q-primary);
      }

      &::before {
        border-width: 0;
        width: 0;
      }

      &.active::before {
        border-radius: 0px;
        width: 100%;
        border-bottom-width: 2px;
      }
    }
  }

  &.vertical {
    flex-direction: column;
  }
}
</style>
