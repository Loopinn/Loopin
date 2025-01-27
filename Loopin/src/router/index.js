import CenteredHeader from "@/components/header/CenteredHeader.vue";
import supabase from "@/config/supabase";
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
      component: () => import("@/views/ChannelView.vue"),
      meta: { layout: "CenteredHeader" },
    },
    {
      path: "/socialing/:id",
      name: "socialingPosts",
      component: () => import("@/views/SocialPostView.vue"),
      meta: { layout: "CenteredHeader" },
    },
    {
      path: "/club",
      name: "club",
      component: () => import("@/views/ChannelView.vue"),
      meta: { layout: "CenteredHeader" },
    },
    {
      path: "/club/:id",
      name: "clubPosts",
      component: () => import("@/views/ClubPostView.vue"),
      meta: { layout: "CenteredHeader" },
    },
    {
      path: "/challenge",
      name: "challenge",
      component: () => import("@/views/ChannelView.vue"),
      meta: { layout: "CenteredHeader" },
    },
    {
      path: "/challenge/:id",
      name: "challengePosts",
      component: () => import("@/views/ChallengePostView.vue"),
      meta: { layout: "CenteredHeader" },
    },
    {
      path: "/write",
      name: "write",
      component: () => import("@/views/PostCreateView.vue"),
    },
    {
      path: "/write/:type/:id",
      name: "update",
      component: () => import("@/views/PostCreateView.vue"),
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
      path: "/lounge/:id",
      name: "loungeDetail",
      component: () => import("@/views/LoungeDetailView.vue"),
      meta: { layout: "CenteredHeader" },
    },
    {
      path: "/lounge/write",
      name: "loungeWriteView",
      component: () => import("@/views/LoungeWriteView.vue"),
      meta: { layout: "CenteredHeader" },
    },
    {
      path: "/lounge/write/:id?",
      name: "loungeWriteView",
      component: () => import("@/views/LoungeWriteView.vue"),
      meta: { layout: "CenteredHeader", requireAuth: true },
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
      path: "/profile",
      name: "profile",
      component: () => import("@/views/UserInfoView.vue"),
      meta: { layout: "CenteredHeader", requireAuth: true },
    },
    {
      path: "/profile/edit",
      name: "profileEdit",
      component: () => import("@/views/ProfileEdit.vue"),
      meta: { layout: "CenteredHeader", requireAuth: true },
    },
    {
      path: "/:pathMatch(.*)*",
      name: "NotFound",
      component: () => import("@/views/NotFoundView.vue"),
      meta: { layout: "LogoHeader" },
    },
  ],
});
router.beforeEach(async (to, from, next) => {
  const { data } = await supabase.auth.getSession();
  const isLoggedIn = !!data.session;

  if (to.matched.some((record) => record.meta.requireAuth)) {
    if (!isLoggedIn) {
      alert("인증이 필요합니다.");
      next({ name: "signIn" });
    } else {
      next();
    }
  } else {
    next();
  }
});

router.afterEach(() => {
  window.scrollTo(0, 0);
});
export default router;
