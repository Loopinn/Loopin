<script setup></script>
<template>
  <div class="mt-5">
    <div class="text-[#FF0000]">댓글</div>
    <div class="font-bold">소셜링이 궁금하다면 댓글을 남겨보세요</div>
    <div class="mt-2 flex gap-3">
      <div class="flex gap-1">
        <button>
          <img src="@/assets/images/likeblack.svg" alt="like" />
        </button>
        <span>00</span>
      </div>
      <div class="flex gap-1">
        <button>
          <img src="@/assets/images/comment.svg" alt="comment" />
        </button>
        <span>00</span>
      </div>
      <div class="flex gap-2">
        <img
          src="https://i.pinimg.com/474x/2e/36/de/2e36dee43874ca143efb4c6323188be6.jpg"
          alt="userProfile"
          class="rounded-full w-[20px] h-[20px] mt-[6px]"
        />
        <img
          src="https://i.pinimg.com/474x/2e/36/de/2e36dee43874ca143efb4c6323188be6.jpg"
          alt="userProfile"
          class="rounded-full w-[20px] h-[20px] mt-[6px]"
        />
        <img
          src="https://i.pinimg.com/474x/2e/36/de/2e36dee43874ca143efb4c6323188be6.jpg"
          alt="userProfile"
          class="rounded-full w-[20px] h-[20px] mt-[6px]"
        />
        <img
          src="https://i.pinimg.com/474x/2e/36/de/2e36dee43874ca143efb4c6323188be6.jpg"
          alt="userProfile"
          class="rounded-full w-[20px] h-[20px] mt-[6px]"
        />
      </div>
    </div>
    <div class="mt-2 flex gap-2">
      <img
        src="https://i.pinimg.com/474x/2e/36/de/2e36dee43874ca143efb4c6323188be6.jpg"
        alt="userProfile"
        class="rounded-full w-[20px] h-[20px]"
      />
      <textarea
        type="text"
        placeholder="댓글 달기 ..."
        class="w-[300px] resize-none placeholder-[#B1B1B1] bg-[#f1f1f1]"
      />
    </div>
  </div>
</template>
<style scoped></style>
