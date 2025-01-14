import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "main",
      component: () => import("@/views/MainView.vue"),
    },
    {
      path: "/socialing",
      name: "socialing",
      component: () => import("@/views/SocialView.vue"),
    },
    {
      path: "/club",
      name: "club",
      component: () => import("@/views/ClubView.vue"),
    },
    {
      path: "/challenge",
      name: "challenge",
      component: () => import("@/views/ChallengeView.vue"),
    },
    {
      path: "/lounge",
      name: "lounge",
      component: () => import("@/views/LoungeView.vue"),
    },
    {
      path: "/signIn",
      name: "signIn",
      component: () => import("@/views/SignInView.vue"),
    },
    {
      path: "/signUp",
      name: "signUp",
      component: () => import("@/views/SignUpView.vue"),
    },
    {
      path: "/user",
      name: "user",
      component: () => import("@/views/UserView.vue"),
    },
    {
      path: "/:pathMatch(.*)*",
      name: "NotFound",
      component: () => import("@/views/NotFoundView.vue"),
    },
  ],
});

export default router;
