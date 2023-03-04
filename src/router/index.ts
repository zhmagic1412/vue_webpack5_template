import {
  createRouter,
  createWebHashHistory,
  createWebHistory,
  RouteRecordRaw,
} from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    component: () => import("@/views/Layout.vue"),
  }
  /*     {
        path: '/login',
        component: () => import('@/components/frame/Login.vue'),
    } */
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
