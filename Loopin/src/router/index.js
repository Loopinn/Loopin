import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "main",
      component: () => import("@/views/MainView.vue"),
      meta: { layout: "LogoHeader" },
    },
    {
      path: "/socialing",
      name: "socialing",
      component: () => import("@/views/SocialView.vue"),
      meta: { layout: "CenteredHeader" },
    },
    {
      path: "/club",
      name: "club",
      component: () => import("@/views/ClubView.vue"),
      meta: { layout: "CenteredHeader" },
    },
    {
      path: "/challenge",
      name: "challenge",
      component: () => import("@/views/ChallengeView.vue"),
      meta: { layout: "CenteredHeader" },
    },
    {
      path: "/uploadfeed",
      name: "uploadfeed",
      component: () => import("@/components/EXLoungePosts.vue"),
      meta: { layout: "CenteredHeader" },
    },
    {
      path: "/lounge",
      name: "lounge",
      component: () => import("@/views/LoungeView.vue"),
      meta: { layout: "CenteredHeader" },
    },
    {
      path: "/lounge/write",
      name: "loungeWriteView",
      component: () => import("@/views/LoungeWriteView.vue"),
      meta: { layout: "CenteredHeader" },
    },
    {
      path: "/lounge/:id",
      name: "loungeDetail",
      component: () => import("@/views/LoungeDetailView.vue"),
      meta: { layout: "CenteredHeader" },
    },
    {
      path: "/signIn",
      name: "signIn",
      component: () => import("@/views/SignInView.vue"),
      meta: { layout: "CenteredHeader" },
    },
    {
      path: "/signUp",
      name: "signUp",
      component: () => import("@/views/SignUpView.vue"),
      meta: { layout: "CenteredHeader" },
    },
    {
      path: "/user",
      name: "user",
      component: () => import("@/views/UserView.vue"),
      meta: { layout: "CenteredHeader" },
    },
    {
      path: "/user/:id",
      name: "userinfo",
      component: () => import("@/views/UserInfoView.vue"),
      meta: { layout: "CenteredHeader" },
    },
    {
      path: "/profile/edit",
      name: "profileEdit",
      component: () => import("@/views/ProfileEdit.vue"),
      meta: { layout: "CenteredHeader" },
    },
    {
      path: "/:pathMatch(.*)*",
      name: "NotFound",
      component: () => import("@/views/NotFoundView.vue"),
      meta: { layout: "LogoHeader" },
    },
  ],
});

export default router;
