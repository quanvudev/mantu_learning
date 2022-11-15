<template>
  <q-layout view="hHh Lpr lff">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title> Quasar App </q-toolbar-title>
        <NavigationLinks :links="linkWithAuth" />
        <q-btn-dropdown v-if="auth.isAuth && auth.user" flat class="user-dropdown">
          <template #label>
            <q-avatar>
              {{ auth.user.name[0] }}
            </q-avatar>
            {{ auth.user.name }}
          </template>
          <q-list>
            <q-item clickable v-ripple>
              <q-item-section avatar>
                <q-avatar color="secondary">
                  {{ auth.user.name[0] }}
                </q-avatar>
              </q-item-section>
              <q-item-section>
                {{ auth.user?.name }}
              </q-item-section>
            </q-item>
            <q-item clickable v-ripple @click="auth.logout">
              <q-item-section avatar>
                <q-avatar color="secondary" icon="logout" />
              </q-item-section>
              <q-item-section>
                Logout
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <q-drawer v-model="leftDrawerOpen" show-if-above bordered class="main-drawer">
        <NavigationLinks :links="linkWithAuth" isVertical />
      </q-drawer>
      <main class="page-container">
        <router-view />
      </main>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import NavigationLinks, {
  NavigationLinkItem,
} from '@/components/layouts/NavigationLinks.vue';
import { RouteNames } from '@/constants';
import { computed } from 'vue';
import { useAuthStore } from '@/stores/auth-store';

const links: NavigationLinkItem[] = [
  {
    title: 'Home',
    icon: 'dashboard',
    routeName: RouteNames.Home,
  },
  {
    title: 'Notes',
    icon: 'description',
    routeName: RouteNames.Notes,
  },
];

const leftDrawerOpen = ref(false);

const auth = useAuthStore();

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

const linkWithAuth = computed(() => {
  let _links = [...links];
  if (!auth.isAuth)
    _links.push({
      title: 'Login',
      icon: 'login',
      routeName: RouteNames.Auth,
    });

  return _links;
});
</script>

<style lang="scss" scoped>
:deep(.main-drawer) {
  padding: 16px 8px 0px;
}

.user-dropdown {
  margin-left: 8px;
}
</style>
