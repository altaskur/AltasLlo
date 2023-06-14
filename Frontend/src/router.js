import { createRouter, createWebHistory } from 'vue-router';
import LoggingPage from './components/pages/LoggingPage.vue';
import UserPanel from './components/pages/UserPanel.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: LoggingPage
  },
{
    path: '/userPanel',
    name: 'userPanel',
    component: UserPanel
}

];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
