<script setup>
import Funnel from "@/components/Funnel.vue";
import supabase from "@/config/supabase";
import { usePostStore } from "@/stores/postStore";
import { useFunnel } from "@/utils/useFunnel";
import { ref, computed, reactive } from "vue";

import { VueScrollPicker } from "vue-scroll-picker";

import VueSlider from "vue-slider-component";
import "vue-slider-component/theme/default.css";

import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import { useRouter } from "vue-router";

const router = useRouter();
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
// const private = ref(null);
const isFee = ref(null);
const fee = ref(0);
const feeInfo = ref([]);
const category = ref("");
const isOffline = ref(null);
const place = ref("");
const maxPeople = ref(3);
const gender = ref("all");
// const age = ref(0); range로 대체
const meetDate = ref(null);
const meetTime = reactive({ hours: 0, minutes: 0, seconds: 0 });
const startDate = ref(null);
const endDate = ref(null);
const tpw = ref("주 1회");
const selectedImage = ref(null);
const title = ref("");
const description = ref("");

const fileInput = ref(null);
const fileCount = ref(0);
const previewImage = ref(null);

const activeIndex = ref(null);

const categoryList = ref([
  {
    name: "푸드·드링크",
    description: "맛집투어·카페·티저트·티룸·와인·비건",
    list: [
      "맛집투어",
      "카페",
      "베이킹",
      "와인",
      "요리",
      "전통주",
      "칵테일",
      "디저트",
      "위스키",
      "맥주",
      "파인다이닝",
      "페어링",
      "커피",
      "비건",
      "티룸",
    ],
  },
  {
    name: "자기계발",
    description: "독서·스터디·커리어·스피치",
    list: ["독서", "스터디", "대화", "스피치", "사이드프로젝트", "커리어", "브랜딩", "창작"],
  },
  {
    name: "취미",
    description: "사진·공예·드로잉·뷰티·댄스·글쓰기",
    list: [
      "사진",
      "드로잉",
      "공예",
      "노래",
      "글쓰기",
      "댄스",
      "뷰티",
      "봉사활동",
      "스타일링",
      "향수",
      "악기연주",
      "음악감상",
      "만화",
      "명상",
      "반려동물",
      "캘리그라피",
      "쇼핑",
    ],
  },
  {
    name: "파티·게임",
    description: "컨셉파티·생일파티·보드게임·방탈출",
    list: [
      "컨셉파티",
      "포틀럭파티",
      "내향인파티",
      "푸드파티",
      "와인파티",
      "홈파티",
      "뮤직파티",
      "생일파티",
      "보드게임",
      "추리게임",
      "컨셉게임",
      "방탕출",
      "온라인게임",
      "운동회",
      "액팅게임",
    ],
  },
  {
    name: "문화·예술",
    description: "전시·영화·페스티벌·연극·뮤지컬·공연",
    list: ["전시", "영화", "뮤지컬", "공연", "연극", "페스티벌", "팝업", "연주회"],
  },
  {
    name: "연애·사랑",
    description: "소개팅·미팅·연애탐구",
    list: ["로테이션소개팅", "컨셉소개팅", "대화형소개팅", "연애탐구생활", "콘텐츠소개팅", "와인미팅"],
  },
  {
    name: "동네·또래",
    description: "취향친구·동네친구·또래친구",
    list: ["또래친구", "동네친구", "취향친구"],
  },
]);

const getCheckboxImage = (fee) => {
  if (feeInfo.value.includes(fee)) {
    if (selectedActivity.value === "소셜링") {
      return "/src/assets/images/check-active-social.svg";
    } else if (selectedActivity.value === "클럽") {
      return "/src/assets/images/check-active-club.svg";
    } else {
      return "/src/assets/images/check-active-challenge.svg";
    }
  } else {
    return "/src/assets/images/check.svg";
  }
};

//나이 슬라이더
const range = ref([20, 50]); // 기본 선택 범위
const minValue = 20; // 최소값
const maxValue = 50; // 최대값
const interval = 5; // 간격
const marks = {
  20: "20",
  25: "25",
  30: "30",
  35: "35",
  40: "40",
  45: "45",
  50: "50",
};
const railStyle = {
  backgroundColor: "#999996", // 트랙 배경 색상
};
// 슬라이더 프로세스 색상
// const processStyle = {
//   backgroundColor: "#F43630", // 선택된 범위 색상
// };
const processStyle = computed(() => {
  const colors = {
    소셜링: "#F43630",
    클럽: "#1C8A6A",
    챌린지: "#3498D0",
  };
  return {
    backgroundColor: colors[selectedActivity.value] || "#F43630",
  };
});
// 슬라이더 핸들 색상
const handleStyle = computed(() => {
  const colors = {
    소셜링: "#F43630",
    클럽: "#1C8A6A",
    챌린지: "#3498D0",
  };
  return {
    backgroundColor: colors[selectedActivity.value] || "#F43630", // 핸들 색상
    borderColor: colors[selectedActivity.value] || "#F43630", // 핸들 테두리 색상
  };
});

//인원 옵션
const options = [3, 4, 5, 6, 7, 8, 9, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
const tpwOptions = ["주 1회", "주 2회", "주 3회", "주 4회", "주 5회", "주 6회", "매일"];

const filterRange = () => {
  const [start, end] = range.value;

  if (start === minValue && end === maxValue) {
    return "누구나"; // 전체 범위
  } else if (start === minValue) {
    return `${end}세 이하`; // 최소값은 고정, 끝 값만 기준
  } else if (end === maxValue) {
    return `${start}세 이상`; // 끝값은 고정, 시작 값만 기준
  } else {
    return `${start} ~ ${end}세`; // 두 값 모두 지정된 경우
  }
};

const convertGender = () => {
  if (gender.value === "all") {
    return "아무나"; // 전체
  } else if (gender.value === "male") {
    return "남자만"; // 남자만
  } else if (gender.value === "female") {
    return "여자만"; // 여자만
  } else {
    return "잘못된 값"; // 잘못된 값 처리
  }
};
//datepicker format
const format = (date) => {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return `${year}/${month}/${day}`;
};

const triggerFileInput = () => {
  fileInput.value.click();
};

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
    return maxPeople.value !== 0 && gender.value !== null;
  } else if (currentStep.value === "시간") {
    return meetDate.value !== null && meetTime.value !== null;
  } else if (currentStep.value === "시작종료") {
    return startDate.value !== null && endDate.value !== null;
  } else if (currentStep.value === "주몇회") {
    return tpw.value !== "";
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

const handleOnlineClick = () => {
  place.value = "온라인";
  isOffline.value = false;
};
const handleOfflineClick = () => {
  if (isOffline.value === false) place.value = "";
  isOffline.value = true;
};

//소개 이미지 선택
const handleFileChange = (event) => {
  const files = event.target.files;
  if (files) {
    fileCount.value = files.length;
    selectedImage.value = files;
    //여러개로 수정필요
    const file = files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      previewImage.value = e.target.result; // 파일 읽은 후 미리보기 이미지 URL 설정
    };
    reader.readAsDataURL(file);
  } else {
    selectedImage.value = null;
  }
};

// 완료 버튼 액션
const finish = async () => {
  await handlePostSubmit();
  // handleReset();
};

const handlePostSubmit = async () => {
  let imageUrl = null;
  if (selectedImage.value) {
    const fileName = `${Date.now()}-${selectedImage.value[0].name}`;
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
        images: [imageUrl],
        max_people: maxPeople.value,
        age_limit: range.value,
        gender: gender.value,
        place: place.value,
        type: socialingType.value,
        date: meetDate.value,
        time: meetTime,
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
        images: [imageUrl],
        max_people: maxPeople.value,
        age_limit: range.value,
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
        images: [imageUrl],
        max_people: maxPeople.value,
        start_date: startDate.value,
        end_date: endDate.value,
        times_per_week: tpw.value,
      },
      userId,
    );
  }
  window.alert("포스팅 완료!");
  router.push("/");
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
  range.value = [20, 50];
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
  <div class="relative px-[15px]">
    <div class="h-[80px] flex">
      <button @click="prevStep"><img src="@/assets/images/arrow-left.svg" alt="" /></button>
    </div>
    <Funnel :steps="state.steps || steps" :currentStep="currentStep">
      <!-- 활동 선택 단계 -->
      <template #활동선택>
        <div>
          <h2 class="text-[30px] mb-[43px]">멤버들과 함께 어떤 활동을 하고싶나요?</h2>
          <div class="flex flex-col gap-[15px]">
            <button
              class="border flex items-center w-full h-[80px] rounded-[16px]"
              :class="{ 'bg-[#F43630] text-white': selectedActivity === '소셜링' }"
              @click="selectActivity('소셜링')"
            >
              <div class="px-[27px]">
                <img v-if="selectedActivity === '소셜링'" src="@/assets/images/socialing-active.svg" alt="" />
                <img v-else src="@/assets/images/Socialing.svg" alt="" />
              </div>
              <div class="flex flex-col text-left">
                <p>소셜링</p>
                <p :class="{ 'text-[#999996]': selectedActivity !== '소셜링' }">
                  일회성 모임으로 번개처럼 가볍게 만나요
                </p>
              </div>
            </button>

            <button
              class="border flex items-center w-full h-[80px] rounded-[16px]"
              :class="{ 'bg-[#1C8A6A] text-white': selectedActivity === '클럽' }"
              @click="selectActivity('클럽')"
            >
              <div class="px-[27px]">
                <img v-if="selectedActivity === '클럽'" src="@/assets/images/club-active.svg" alt="" />
                <img v-else src="@/assets/images/club.svg" alt="" />
              </div>
              <div class="flex flex-col text-left">
                <p>클럽</p>
                <p :class="{ 'text-[#999996]': selectedActivity !== '클럽' }">지속형 모임으로 계속해서 친하게 지내요</p>
              </div>
            </button>

            <button
              class="border flex items-center w-full h-[80px] rounded-[16px]"
              :class="{ 'bg-[#3498D0] text-white': selectedActivity === '챌린지' }"
              @click="selectActivity('챌린지')"
            >
              <div class="px-[27px]">
                <img v-if="selectedActivity === '챌린지'" src="@/assets/images/challenge-active.svg" alt="" />
                <img v-else src="@/assets/images/challenge.svg" alt="" />
              </div>
              <div class="flex flex-col text-left">
                <p>챌린지</p>
                <p :class="{ 'text-[#999996]': selectedActivity !== '챌린지' }">
                  같은 목표를 가진 멤버들과 함께 도전해요
                </p>
              </div>
            </button>
          </div>
        </div>
      </template>

      <!-- 타입 선택 단계 (소셜링에서만 사용) -->
      <template #타입선택>
        <div>
          <h2 class="text-[30px] mb-[43px]">어떤 소셜링을 열어볼까요?</h2>
          <div class="flex flex-col gap-[15px]">
            <button
              class="border flex items-center w-full h-[80px] rounded-[16px]"
              :class="{ 'bg-[#F43630] text-white': socialingType === '일반' }"
              @click="socialingType = '일반'"
            >
              <div class="px-[27px]">
                <img v-if="socialingType === '일반'" src="@/assets/images/socialing-active.svg" alt="" />
                <img v-else src="@/assets/images/Socialing.svg" alt="" />
              </div>
              <div class="flex flex-col text-left">
                <p>일반 소셜링</p>
                <p :class="{ 'text-[#999996]': socialingType !== '일반' }">
                  누구나 자유롭게 참여할 수 있는 소셜링을 열어요
                </p>
              </div>
            </button>
            <button
              class="border flex items-center w-full h-[80px] rounded-[16px]"
              :class="{ 'bg-[#F43630] text-white': socialingType === '클럽' }"
              @click="socialingType = '클럽'"
            >
              <div class="px-[27px]">
                <img v-if="socialingType === '클럽'" src="@/assets/images/club-socialing-active.svg" alt="" />
                <img v-else src="@/assets/images/club-socialing.svg" alt="" />
              </div>
              <div class="flex flex-col text-left">
                <p>클럽 소셜링</p>
                <p :class="{ 'text-[#999996]': socialingType !== '클럽' }">
                  가입하거나 운영하는 클럽에서 소셜링을 열어요
                </p>
              </div>
            </button>
          </div>
        </div>
      </template>

      <!-- 참가비 단계 -->
      <template #참가비>
        <div>
          <h2 class="text-[30px] mb-[43px]">참가비를 활용해 보시겠어요?</h2>
          <div class="flex gap-[20px]">
            <button
              class="border flex items-center w-[50%] h-[60px] rounded-[16px] justify-center"
              :class="{
                'bg-[#F43630] text-white': isFee === true && selectedActivity === '소셜링',
                'bg-[#1C8A6A] text-white': isFee === true && selectedActivity === '클럽',
                'bg-[#3498D0] text-white': isFee === true && selectedActivity === '챌린지',
              }"
              @click="isFee = true"
            >
              <p>있음</p>
            </button>

            <button
              class="border flex items-center w-[50%] h-[60px] rounded-[16px] justify-center"
              :class="{
                'bg-[#F43630] text-white': isFee === false && selectedActivity === '소셜링',
                'bg-[#1C8A6A] text-white': isFee === false && selectedActivity === '클럽',
                'bg-[#3498D0] text-white': isFee === false && selectedActivity === '챌린지',
              }"
              @click="isFee = false"
            >
              <p>없음</p>
            </button>
          </div>

          <div v-if="isFee" class="flex flex-col">
            <label for="fee">참가비</label>
            <input v-model="fee" type="number" id="fee" class="h-[50px] border rounded-[16px] px-3" />

            <div class="mt-4">
              <p>참가비 정보</p>
              <div>
                <p>운영비</p>
                <div class="flex">
                  <input
                    type="checkbox"
                    id="contentFee"
                    class="appearance-none"
                    :checked="feeInfo.includes('contentFee')"
                    @change="toggleFeeSelection('contentFee')"
                  />
                  <label for="contentFee" class="flex">
                    <img :src="getCheckboxImage('contentFee')" alt="content fee" />
                    <span>콘텐츠 제작비</span></label
                  >
                  <input
                    type="checkbox"
                    id="hostFee"
                    class="appearance-none"
                    :checked="feeInfo.includes('hostFee')"
                    @change="toggleFeeSelection('hostFee')"
                  />
                  <label for="hostFee" class="flex">
                    <img :src="getCheckboxImage('hostFee')" alt="host fee" />
                    <span>호스트 수고비</span></label
                  >
                </div>
              </div>

              <div class="mt-2">
                <p>모임비</p>
                <div class="flex">
                  <input
                    type="checkbox"
                    id="noshowFee"
                    class="appearance-none"
                    :checked="feeInfo.includes('noshowFee')"
                    @change="toggleFeeSelection('noshowFee')"
                  />
                  <label for="noshowFee" class="flex">
                    <img :src="getCheckboxImage('noshowFee')" alt="noshow fee" />
                    <span>노쇼 방지비</span></label
                  >

                  <input
                    type="checkbox"
                    id="rentalFee"
                    class="appearance-none"
                    :checked="feeInfo.includes('rentalFee')"
                    @change="toggleFeeSelection('rentalFee')"
                  />
                  <label for="rentalFee" class="flex">
                    <img :src="getCheckboxImage('rentalFee')" alt="rental fee" />
                    <span>대관료</span></label
                  >

                  <input
                    type="checkbox"
                    id="materialFee"
                    class="appearance-none"
                    :checked="feeInfo.includes('materialFee')"
                    @change="toggleFeeSelection('materialFee')"
                  />
                  <label for="materialFee" class="flex">
                    <img :src="getCheckboxImage('materialFee')" alt="material fee" />
                    <span>재료비</span></label
                  >

                  <input
                    type="checkbox"
                    id="dessertFee"
                    class="appearance-none"
                    :checked="feeInfo.includes('dessertFee')"
                    @change="toggleFeeSelection('dessertFee')"
                  />
                  <label for="dessertFee" class="flex">
                    <img :src="getCheckboxImage('dessertFee')" alt="dessert fee" />
                    <span>다과비</span></label
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>

      <!-- 주제 선택 단계 -->
      <template #주제>
        <div>
          <h2 class="text-[30px] mb-[43px]">{{ selectedActivity }} 주제를 선택해볼까요?</h2>
          <div
            v-for="(subject, index) in categoryList"
            class="border p-[15px] rounded-[16px] mb-[15px]"
            :class="activeIndex === index ? '' : 'h-[80px]'"
            @click="activeIndex === index ? (activeIndex = null) : (activeIndex = index)"
            :key="index"
          >
            <div class="flex justify-between items-center mb-[24px]">
              <div class="flex">
                <div class="w-[50px] h-[50px] border flex items-center justify-center rounded-full mr-[10px]">
                  <img src="@/assets/images/star.svg" alt="" />
                </div>
                <div>
                  <p>{{ subject.name }}</p>
                  <p class="text-[#999996]">{{ subject.description }}</p>
                </div>
              </div>
              <div>
                <img v-if="activeIndex === index" src="@/assets/images/arrow-up-circle.svg" alt="" />
                <img v-else src="@/assets/images/arrow-down-circle.svg" alt="" />
              </div>
            </div>
            <div v-if="activeIndex === index" class="grid grid-cols-5 gap-[15px]">
              <div
                v-for="(cate, index) in subject.list"
                class="flex justify-center items-center w-[96px] h-[47px] rounded-[16px] border text-[13px]"
                :class="{
                  'border-black text-black': category === cate,
                  'border-[#999996] text-[#666666]': category !== cate,
                }"
                @click.stop="category = cate"
                :key="index"
              >
                {{ cate }}
              </div>
            </div>
          </div>
          <div class="h-[120px]"></div>
        </div>
      </template>

      <!-- 장소 선택 단계 -->
      <template #장소>
        <div>
          <h2 class="text-[30px] mb-[43px]">어디서 만날까요?</h2>
          <div class="flex gap-[20px]">
            <button
              class="border flex items-center w-[50%] h-[60px] rounded-[16px] justify-center"
              :class="{
                'bg-[#F43630] text-white': isOffline === true && selectedActivity === '소셜링',
                'bg-[#1C8A6A] text-white': isOffline === true && selectedActivity === '클럽',
                'bg-[#3498D0] text-white': isOffline === true && selectedActivity === '챌린지',
              }"
              @click="handleOfflineClick"
            >
              <p>오프라인</p>
            </button>

            <button
              class="border flex items-center w-[50%] h-[60px] rounded-[16px] justify-center"
              :class="{
                'bg-[#F43630] text-white': isOffline === false && selectedActivity === '소셜링',
                'bg-[#1C8A6A] text-white': isOffline === false && selectedActivity === '클럽',
                'bg-[#3498D0] text-white': isOffline === false && selectedActivity === '챌린지',
              }"
              @click="handleOnlineClick"
            >
              <p>온라인</p>
            </button>
          </div>
          <div v-if="isOffline" class="flex flex-col">
            <input v-model="place" type="text" placeholder="장소를 입력해주세요." />
          </div>
        </div>
      </template>

      <!-- 멤버 선택 단계 -->
      <template #멤버>
        <div>
          <h2 class="text-[30px] mb-[43px]">어떻게 멤버를 모을까요?</h2>
          <div>
            <p>신청 방식 선착순</p>
          </div>
          <div>
            <p>참여 인원 최대 {{ maxPeople }}명</p>
            <VueScrollPicker v-model="maxPeople" :options="options" />
          </div>
          <div>
            <div class="flex">
              <p>성별</p>
              <p>{{ convertGender() }}</p>
            </div>
            <div class="flex gap-[20px]">
              <button
                class="border flex items-center w-[34%] h-[60px] rounded-[16px] justify-center"
                :class="{
                  'bg-[#F43630] text-white': gender === 'all' && selectedActivity === '소셜링',
                  'bg-[#1C8A6A] text-white': gender === 'all' && selectedActivity === '클럽',
                  'bg-[#3498D0] text-white': gender === 'all' && selectedActivity === '챌린지',
                }"
                @click="gender = 'all'"
              >
                <p>아무나</p>
              </button>

              <button
                class="border flex items-center w-[34%] h-[60px] rounded-[16px] justify-center"
                :class="{
                  'bg-[#F43630] text-white': gender === 'male' && selectedActivity === '소셜링',
                  'bg-[#1C8A6A] text-white': gender === 'male' && selectedActivity === '클럽',
                  'bg-[#3498D0] text-white': gender === 'male' && selectedActivity === '챌린지',
                }"
                @click="gender = 'male'"
              >
                <p>남자만</p>
              </button>
              <button
                class="border flex items-center w-[34%] h-[60px] rounded-[16px] justify-center"
                :class="{
                  'bg-[#F43630] text-white': gender === 'female' && selectedActivity === '소셜링',
                  'bg-[#1C8A6A] text-white': gender === 'female' && selectedActivity === '클럽',
                  'bg-[#3498D0] text-white': gender === 'female' && selectedActivity === '챌린지',
                }"
                @click="gender = 'female'"
              >
                <p>여자만</p>
              </button>
            </div>
          </div>
          <div>
            <div class="flex">
              <p>나이</p>
              <p>{{ filterRange() }}</p>
            </div>
            <vue-slider
              v-model="range"
              :min="minValue"
              :max="maxValue"
              :interval="interval"
              :marks="marks"
              :railStyle="railStyle"
              :processStyle="processStyle"
              :handleStyle="handleStyle"
              :tooltip="'none'"
            />
          </div>
        </div>
      </template>

      <!-- 시간/주차 선택 단계 -->
      <template #시간>
        <div>
          <h2 class="text-[30px] mb-[43px]">언제 만날까요?</h2>
          <div class="flex justify-between">
            <div>
              <VueDatePicker
                v-model="meetDate"
                :enable-time-picker="false"
                :format="format"
                :inline="{ input: true }"
                auto-apply
                class="datepicker-input"
              />
            </div>
            <div>
              <VueDatePicker
                v-model="meetTime"
                :enable-time-picker="true"
                :enable-date-picker="false"
                :time-picker="true"
                :inline="{ input: true }"
                auto-apply
                class="timepicker-input"
              />
            </div>
          </div>
        </div>
      </template>

      <!-- 시작/종료 시간 선택 단계 -->
      <template #시작종료>
        <div>
          <h2 class="text-[30px] mb-[43px]">시작/종료 시간을 선택하세요</h2>
          <div>
            <div class="flex justify-between">
              <div>
                <h2>시작 날짜</h2>
                <VueDatePicker
                  v-model="startDate"
                  :enable-time-picker="false"
                  :format="format"
                  :inline="{ input: true }"
                  auto-apply
                  class="datepicker-input"
                />
              </div>
              <div>
                <h2>종료 날짜</h2>
                <VueDatePicker
                  v-model="endDate"
                  :enable-time-picker="false"
                  :format="format"
                  :inline="{ input: true }"
                  auto-apply
                  class="datepicker-input"
                />
              </div>
            </div>
          </div>
        </div>
      </template>

      <!-- 주몇회 선택 단계 -->
      <template #주몇회>
        <div>
          <h2 class="text-[30px] mb-[43px]">인증은 일주일에 몇 회씩 할까요?</h2>
          <VueScrollPicker v-model="tpw" :options="tpwOptions" />
        </div>
      </template>

      <!-- 소개 단계 -->
      <template #소개>
        <div>
          <h2 v-if="['소셜링', '클럽'].includes(selectedActivity)" class="text-[30px] mb-[43px]">
            {{ selectedActivity }}을 소개해볼까요?
          </h2>
          <h2 v-else class="text-[30px] mb-[43px]">{{ selectedActivity }}를 소개해볼까요?</h2>
          <div class="flex flex-col gap-[15px]">
            <div class="flex gap-2">
              <div class="border rounded-lg flex flex-col items-center justify-center w-32 h-32">
                <img
                  src="@/assets/images/addImages.svg"
                  alt="addImage"
                  class="w-16 h-16 ml-4 mt-2 cursor-pointer"
                  @click="triggerFileInput"
                />
                <input
                  type="file"
                  id="file"
                  accept="image/*"
                  class="hidden"
                  ref="fileInput"
                  @change="handleFileChange"
                />
                <div class="text-sm text-gray-500">{{ fileCount }}/10</div>
              </div>
              <div v-if="previewImage">
                <img :src="previewImage" alt="Preview" class="w-32 h-32 rounded-lg object-cover" />
              </div>
            </div>
            <input
              v-model="title"
              type="text"
              class="border border-[#999996] h-[50px] rounded-[16px] px-3"
              placeholder="제목을 입력해 주세요.(최소 5글자)"
            />
            <textarea
              v-model="description"
              class="post-textarea border border-[#999996] h-[400px] rounded-[16px] p-3 resize-none"
              placeholder="소개글을 입력해 주세요.(선택)"
            ></textarea>
          </div>
        </div>
      </template>
    </Funnel>
    <button
      v-if="currentStep === '소개'"
      class="w-full max-w-[570px] border py-5 rounded-full fixed bottom-5 text-[white] disabled:bg-[#BBBBBB] disabled:text-[#666]"
      :class="{
        'bg-[#F43630]': selectedActivity === '소셜링',
        'bg-[#1C8A6A]': selectedActivity === '클럽',
        'bg-[#3498D0]': selectedActivity === '챌린지',
      }"
      :disabled="!isNextEnabled"
      @click="finish"
    >
      완료
    </button>
    <button
      v-else
      class="w-full max-w-[570px] border py-5 rounded-full fixed bottom-5 text-[white] disabled:bg-[#BBBBBB] disabled:text-[#666]"
      :class="{
        'bg-[#F43630]': selectedActivity === '소셜링',
        'bg-[#1C8A6A]': selectedActivity === '클럽',
        'bg-[#3498D0]': selectedActivity === '챌린지',
      }"
      :disabled="!isNextEnabled"
      @click="nextStep"
    >
      다음
    </button>
  </div>
</template>
<style src="vue-scroll-picker/lib/style.css"></style>
