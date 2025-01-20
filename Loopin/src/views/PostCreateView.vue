<script setup>
import Funnel from "@/components/Funnel.vue";
import supabase from "@/config/supabase";
import { usePostStore } from "@/stores/postStore";
import { useFunnel } from "@/utils/useFunnel";
import { ref, computed } from "vue";

const postStore = usePostStore();
const { createSocialPost, createClubPost, createChallengePost } = postStore;

// 활동 선택에 따른 단계 배열
const socialSteps = ["활동선택", "타입선택", "참가비", "주제", "장소", "멤버", "시간", "소개"]; // 소셜링
const clubSteps = ["활동선택", "참가비", "주제", "장소", "멤버", "소개"]; // 클럽
const challengeSteps = ["활동선택", "참가비", "주제", "시작종료", "주몇회", "멤버", "소개"]; // 챌린지

// 기본 첫 단계 정의
const steps = ["활동선택"];

// Funnel 상태 관리
const { currentStep, nextStep, prevStep, reset, setState, state, updateSteps } = useFunnel(steps);

// 선택한 활동 상태 관리
const selectedActivity = ref("");
const socialingType = ref("");
const isFee = ref(null);
const fee = ref(null);
const feeInfo = ref([]);
const category = ref("");
const isOffline = ref(null);
const place = ref("");
const maxPeople = ref(0);
const gender = ref(null);
const age = ref(0);
const meetDate = ref(null);
const startDate = ref(null);
const endDate = ref(null);
const tpw = ref(0);
const selectedImage = ref(null);
const title = ref("");
const description = ref("");

// 다음 버튼 활성화 여부
const isNextEnabled = computed(() => {
  if (currentStep.value === "활동선택") {
    return selectedActivity.value !== ""; // 타입 선택 단계에서는 socialingType이 비어있지 않은지 확인
  } else if (currentStep.value === "타입선택") {
    return socialingType.value !== ""; // 타입 선택 단계에서는 socialingType이 비어있지 않은지 확인
  } else if (currentStep.value === "참가비") {
    if (isFee.value === true) {
      return fee.value > 0 && feeInfo.value.length > 0; // 참가비 입력 및 최소 체크박스 1개 확인
    }
    return isFee.value === false; // 참가비 없음을 선택한 경우 활성화
  } else if (currentStep.value === "주제") {
    return category.value !== ""; // 주제 선택 단계에서는 category 비어있지 않은지 확인
  } else if (currentStep.value === "장소") {
    if (isOffline.value === true) {
      return place.value !== "";
    }
    return isOffline.value === false; // 온라인을 선택한 경우 활성화
  } else if (currentStep.value === "멤버") {
    return maxPeople.value !== 0 && gender.value !== null && age.value !== 0;
  } else if (currentStep.value === "시간") {
    return meetDate.value !== null;
  } else if (currentStep.value === "시작종료") {
    return startDate.value !== null && endDate.value !== null;
  } else if (currentStep.value === "주몇회") {
    return tpw.value !== 0;
  } else if (currentStep.value === "소개") {
    return selectedImage.value !== null && title.value.length >= 5;
  }
});

// 활동 선택 로직
const selectActivity = (activity) => {
  selectedActivity.value = activity;

  if (activity === "소셜링") {
    setState({ ...state.value, activityType: "소셜링" });
    updateSteps(socialSteps);
  } else if (activity === "클럽") {
    setState({ ...state.value, activityType: "클럽" });
    updateSteps(clubSteps);
  } else if (activity === "챌린지") {
    setState({ ...state.value, activityType: "챌린지" });
    updateSteps(challengeSteps);
  }
};

// 체크박스 상태 업데이트
const toggleFeeSelection = (feeType) => {
  if (feeInfo.value.includes(feeType)) {
    feeInfo.value = feeInfo.value.filter((type) => type !== feeType);
  } else {
    feeInfo.value.push(feeType);
  }
};

//소개 이미지 선택
const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    selectedImage.value = file;
  } else {
    selectedImage.value = null;
  }
};

// 완료 버튼 액션
const finish = async () => {
  await handlePostSubmit();
  console.log("완료되었습니다!");
  handleReset();
};
const handlePostSubmit = async () => {
  let imageUrl = null;
  if (selectedImage.value) {
    const fileName = `${Date.now()}-${selectedImage.value.name}`;
    const { data, error } = await supabase.storage
      .from("post-images")
      .upload(`images/${fileName}`, selectedImage.value);

    if (error) {
      console.error("Image upload failed:", error.message);
      return;
    }

    // 업로드된 이미지의 public URL 가져오기
    const { data: publicUrlData, error: urlError } = supabase.storage
      .from("post-images")
      .getPublicUrl(`images/${fileName}`);
    imageUrl = publicUrlData.publicUrl;
  }


  //post 생성
  const { data: sessionData } = await supabase.auth.getSession();
  const userId = sessionData?.session?.user?.id;
  console.log(userId);

  if (selectedActivity.value === "소셜링") {
    createSocialPost(
      {
        fee: fee.value,
        fee_info: feeInfo.value,
        category: category.value,
        title: title.value,
        description: description.value,
        images: imageUrl,
        creator: userId,
        max_people: maxPeople.value,
        age_limit: age.value,
        gender: gender.value,
        place: place.value,
        type: socialingType.value,
        date: meetDate.value,
        // 시간추가
      },
      userId,
    );
  } else if (selectedActivity.value === "클럽") {
    createClubPost(
      {
        fee: fee.value,
        fee_info: feeInfo.value,
        category: category.value,
        title: title.value,
        description: description.value,
        images: imageUrl,
        max_people: maxPeople.value,
        age_limit: age.value,
        gender: gender.value,
        place: place.value,
      },
      userId,
    );
  } else if (selectedActivity.value === "챌린지") {
    createChallengePost(
      {
        fee: fee.value,
        fee_info: feeInfo.value,
        category: category.value,
        title: title.value,
        description: description.value,
        images: imageUrl,
        max_people: maxPeople.value,
        start_date: startDate.value,
        end_date: endDate.value,
        times_per_week: tpw.value,
      },
      userId,
    );
  }
};

const handleReset = () => {
  reset(); // 단계와 상태 초기화
  selectedActivity.value = ""; // 선택 초기화
  socialingType.value = "";
  isFee.value = null;
  fee.value = null;
  feeInfo.value = [];
  category.value = "";
  isOffline.value = null;
  place.value = "";
  maxPeople.value = 0;
  gender.value = null;
  age.value = 0;
  meetDate.value = null;
  startDate.value = null;
  endDate.value = null;
  tpw.value = 0;
  selectedImage.value = null;
  title.value = "";
  description.value = "";
};
</script>

<template>
  <div>
    <Funnel :steps="state.steps || steps" :currentStep="currentStep">
      <!-- 활동 선택 단계 -->
      <template #활동선택>
        <div>
          <h2>어떤 활동을 선택하시겠어요?</h2>
          <button
            class="border"
            :class="{ 'bg-blue-500 text-white': selectedActivity === '소셜링' }"
            @click="selectActivity('소셜링')"
          >
            소셜링
          </button>
          <button
            class="border"
            :class="{ 'bg-blue-500 text-white': selectedActivity === '클럽' }"
            @click="selectActivity('클럽')"
          >
            클럽
          </button>
          <button
            class="border"
            :class="{ 'bg-blue-500 text-white': selectedActivity === '챌린지' }"
            @click="selectActivity('챌린지')"
          >
            챌린지
          </button>
        </div>
        <button class="border" :disabled="!isNextEnabled" @click="nextStep">다음</button>
      </template>

      <!-- 타입 선택 단계 (소셜링에서만 사용) -->
      <template #타입선택>
        <div>
          <h2>어떤 소셜링을 열어볼까요?</h2>
          <button
            class="border"
            :class="{ 'bg-blue-500 text-white': socialingType === '일반' }"
            @click="socialingType = '일반'"
          >
            일반
          </button>
          <button
            class="border"
            :class="{ 'bg-blue-500 text-white': socialingType === '클럽' }"
            @click="socialingType = '클럽'"
          >
            클럽
          </button>
          <button @click="prevStep">이전</button>
          <button :disabled="!isNextEnabled" @click="nextStep">다음</button>
        </div>
      </template>

      <!-- 참가비 단계 -->
      <template #참가비>
        <div>
          <h2>참가비를 활용해 보시겠어요?</h2>
          <button class="border" :class="{ 'bg-blue-500 text-white': isFee === true }" @click="isFee = true">
            있음
          </button>
          <button class="border" :class="{ 'bg-blue-500 text-white': isFee === false }" @click="isFee = false">
            없음
          </button>
          <div v-if="isFee" class="flex flex-col">
            <label for="fee">참가비</label>
            <input v-model="fee" type="number" id="fee" class="border" />

            <div class="mt-4">
              <p>참가비 정보</p>
              <div>
                <p>운영비</p>
                <input
                  type="checkbox"
                  id="contentFee"
                  :checked="feeInfo.includes('contentFee')"
                  @change="toggleFeeSelection('contentFee')"
                />
                <label for="contentFee">콘텐츠 제작비</label>
                <input
                  type="checkbox"
                  id="hostFee"
                  :checked="feeInfo.includes('hostFee')"
                  @change="toggleFeeSelection('hostFee')"
                />
                <label for="hostFee">호스트 수고비</label>
              </div>
              <div class="mt-2">
                <p>모임비</p>
                <input
                  type="checkbox"
                  id="noshowFee"
                  :checked="feeInfo.includes('noshowFee')"
                  @change="toggleFeeSelection('noshowFee')"
                />
                <label for="noshowFee">노쇼 방지비</label>
                <input
                  type="checkbox"
                  id="rentalbox"
                  :checked="feeInfo.includes('rentalbox')"
                  @change="toggleFeeSelection('rentalbox')"
                />
                <label for="rentalbox">대관료</label>
                <input
                  type="checkbox"
                  id="materialFee"
                  :checked="feeInfo.includes('materialFee')"
                  @change="toggleFeeSelection('materialFee')"
                />
                <label for="materialFee">재료비</label>
                <input
                  type="checkbox"
                  id="dessertFee"
                  :checked="feeInfo.includes('dessertFee')"
                  @change="toggleFeeSelection('dessertFee')"
                />
                <label for="dessertFee">다과비</label>
              </div>
            </div>
          </div>
          <button @click="prevStep">이전</button>
          <button :disabled="!isNextEnabled" @click="nextStep">다음</button>
        </div>
      </template>

      <!-- 주제 선택 단계 -->
      <template #주제>
        <div>
          <h2>{{ selectedActivity }} 주제를 선택해볼까요?</h2>
          <input v-model="category" type="text" class="border" />
          <button @click="prevStep">이전</button>
          <button :disabled="!isNextEnabled" @click="nextStep">다음</button>
        </div>
      </template>

      <!-- 장소 선택 단계 -->
      <template #장소>
        <div>
          <h2>어디서 만날까요?</h2>
          <button class="border" :class="{ 'bg-blue-500 text-white': isOffline === true }" @click="isOffline = true">
            오프라인
          </button>
          <button class="border" :class="{ 'bg-blue-500 text-white': isOffline === false }" @click="isOffline = false">
            온라인
          </button>
          <div v-if="isOffline" class="flex flex-col">
            <input v-model="place" type="text" placeholder="장소를 입력해주세요." />
          </div>
          <button @click="prevStep">이전</button>
          <button :disabled="!isNextEnabled" @click="nextStep">다음</button>
        </div>
      </template>

      <!-- 멤버 선택 단계 -->
      <template #멤버>
        <div>
          <h2>어떻게 멤버를 모을까요?</h2>
          <div>
            <p>신청 방식 선착순</p>
          </div>
          <div>
            <p>참여 인원 최대 {{ maxPeople }}명</p>
            <input v-model="maxPeople" type="number" />
          </div>
          <div>
            <p>성별</p>
            <button class="border" :class="{ 'bg-blue-500 text-white': gender === 'all' }" @click="gender = 'all'">
              아무나
            </button>
            <button class="border" :class="{ 'bg-blue-500 text-white': gender === 'male' }" @click="gender = 'male'">
              남자만
            </button>
            <button
              class="border"
              :class="{ 'bg-blue-500 text-white': gender === 'female' }"
              @click="gender = 'female'"
            >
              여자만
            </button>
          </div>
          <div>
            <p>나이</p>
            <input v-model="age" type="number" />
          </div>
          <button @click="prevStep">이전</button>
          <button :disabled="!isNextEnabled" @click="nextStep">다음</button>
        </div>
      </template>

      <!-- 시간/주차 선택 단계 -->
      <template #시간>
        <div>
          <h2>언제 만날까요?</h2>
          <input v-model="meetDate" type="date" />
          <div>시간</div>
          <!-- 시간추가 -->
          <button @click="prevStep">이전</button>
          <button :disabled="!isNextEnabled" @click="nextStep">다음</button>
        </div>
      </template>

      <!-- 시작/종료 시간 선택 단계 -->
      <template #시작종료>
        <div>
          <h2>시작/종료 시간을 선택하세요</h2>
          <div>
            <input v-model="startDate" type="date" />
            <input v-model="endDate" type="date" />
          </div>
          <button @click="prevStep">이전</button>
          <button :disabled="!isNextEnabled" @click="nextStep">다음</button>
        </div>
      </template>

      <!-- 주몇회 선택 단계 -->
      <template #주몇회>
        <div>
          <h2>활동 주기를 선택하세요</h2>
          <input v-model="tpw" type="number" />
          <button @click="prevStep">이전</button>
          <button :disabled="!isNextEnabled" @click="nextStep">다음</button>
        </div>
      </template>

      <!-- 소개 단계 -->
      <template #소개>
        <div>
          <h2 v-if="['소셜링', '클럽'].includes(selectedActivity)">{{ selectedActivity }}을 소개해볼까요?</h2>
          <h2 v-else>{{ selectedActivity }}를 소개해볼까요?</h2>
          <div>
            <input type="file" @change="handleFileChange" />
            <input v-model="title" type="text" placeholder="제목을 입력해 주세요.(최소 5글자)" />
            <input v-model="description" type="text" placeholder="소개글을 입력해 주세요.(선택)" />
          </div>
          <button @click="prevStep">이전 단계로</button>
          <button :disabled="!isNextEnabled" @click="finish">완료</button>
        </div>
      </template>
    </Funnel>

    <!-- 리셋 버튼 -->
    <button class="border" @click="handleReset">리셋</button>
  </div>
</template>
