import { createRouter, createWebHistory } from "vue-router";
import LoggingPage from "./components/pages/LoggingPage.vue";
import UserPanel from "./components/pages/UserPanel.vue";
import TaskBoard from "./components/pages/TaskBoard.vue";
const routes = [
  {
    path: "/",
    name: "Home",
    component: LoggingPage,
  },
  {
    path: "/userPanel",
    name: "userPanel",
    component: UserPanel,
  },
  {
    path: "/taskBoard/:id",
    name: "taskBoard",
    component: TaskBoard,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
