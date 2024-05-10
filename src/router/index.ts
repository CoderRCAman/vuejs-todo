import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import Bookmark from "../views/Bookmark.vue";
import { getAuth, User } from "firebase/auth";
import { ref } from "vue";
import Login from "../views/Login.vue";
export const UserProfile = ref<User | null>(null);

const routes = [
  {
    path: "/",
    component: Home,
    name: "Home",
  },
  {
    path: "/bookmarks",
    component: Bookmark,
    name: "Bookmark",
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
];

const router = createRouter({
  history: createWebHistory(""),
  routes: routes,
});

const auth = getAuth();
router.beforeEach(async (to, _, next) => {
  let user = await getCurrentUser();
  console.log(user)
  UserProfile.value = user;
  if (to.name !== "Login" && !user) next({ name: "Login" });
  else if (to.name == "Login" && user) next({ name: "Home" });
  else next();
});

export default router;
export async function getCurrentUser(): Promise<User | null> {
  return new Promise((resolve, reject) => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      unsubscribe();
      resolve(user);
    }, reject);
  });
}
