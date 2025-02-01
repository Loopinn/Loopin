import CenteredHeader from "@/components/header/CenteredHeader.vue";
import supabase from "@/config/supabase";
import { useAuthStore } from "@/stores/authStore";
import { createRouter, createWebHistory } from "vue-router";
import { toast } from "vue3-toastify";

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
      path: "/socialing/:maincategory?/:subcategory?",
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
      path: "/club/:maincategory?/:subcategory?",
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
      path: "/challenge/:maincategory?/:subcategory?",
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
      meta: { requireAuth: true },
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
      path: "/user/:id/posts/club",
      name: "userPostsClub",
      component: () => import("@/views/UserPostsClubView.vue"),
      meta: { layout: "CenteredHeader" },
    },
    {
      path: "/user/:id/posts/socialing",
      name: "userPostsSocialing",
      component: () => import("@/views/UserPostsSocialingView.vue"),
      meta: { layout: "CenteredHeader" },
    },
    {
      path: "/user/:id/posts/challenge",
      name: "userPostsChallenge",
      component: () => import("@/views/UserPostsChallengeView.vue"),
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
      path: "/profile/posts/club",
      name: "profilePostsClub",
      component: () => import("@/views/MyPostsClubView.vue"),
      meta: { layout: "CenteredHeader", requireAuth: true },
    },
    {
      path: "/profile/posts/socialing",
      name: "profilePostsSocialing",
      component: () => import("@/views/MyPostsSocialingView.vue"),
      meta: { layout: "CenteredHeader", requireAuth: true },
    },
    {
      path: "/profile/posts/challenge",
      name: "profilePostsChallenge",
      component: () => import("@/views/MyPostsChallengeView.vue"),
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
  const authStore = useAuthStore();
  const { loginUser } = authStore;

  const { data } = await supabase.auth.getSession();
  const isLoggedIn = !!data.session;

  // 게시글 수정 페이지 접근 제한
  if (to.name === "update") {
    const postId = to.params.id;
    const postType = to.params.type;

    try {
      // 게시글 정보 가져오기
      const { data: post, error } = await supabase
        .from(`${postType}_posts`) // 예: lounge_posts
        .select("creator") // 작성자 ID만 가져오기
        .eq("id", postId)
        .single();

      if (error || !post) {
        toast.error("게시글을 찾을 수 없습니다.");
        return next({ name: "main" });
      }

      // 작성자와 로그인 유저 비교
      if (!loginUser || post.creator !== loginUser.id) {
        toast.warning("작성자만 수정할 수 있습니다.");
        return next({ name: "main" });
      }

      next();
    } catch (error) {
      console.error("게시글 정보를 불러오는 중 오류 발생:", error);
      toast.error("게시글 정보를 가져오는 데 실패했습니다.");
      next({ name: "main" });
    }
  } else if (to.matched.some((record) => record.meta.requireAuth)) {
    if (!isLoggedIn) {
      toast.warning("인증이 필요합니다.");
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
