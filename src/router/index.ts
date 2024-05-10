import { createRouter, createWebHistory,  } from "vue-router";
import Home from "../views/Home.vue";
import Bookmark from "../views/Bookmark.vue";
const routes = [
  {
    path: "/",
    component: Home,
  },
  {
    path: "/bookmarks",
    component: Bookmark,
  },
];

const router = createRouter({
  history: createWebHistory(''),
  routes: routes,
});

export default router;
