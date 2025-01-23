<script setup>
import Funnel from "@/components/Funnel.vue";
import supabase from "@/config/supabase";
import { usePostStore } from "@/stores/postStore";
import { useFunnel } from "@/utils/useFunnel";
import { ref, computed, reactive, watch } from "vue";

import { VueScrollPicker } from "vue-scroll-picker";

import VueSlider from "vue-slider-component";
import "vue-slider-component/theme/default.css";

import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import { useRouter } from "vue-router";
import KakaoMap from "@/components/KakaoMap.vue";

const router = useRouter();
const postStore = usePostStore();
const { createSocialPost, createClubPost, createChallengePost } = postStore;

// 활동 선택에 따른 단계 배열
const socialSteps = ["활동선택", "타입선택", "참가비", "주제", "장소", "멤버", "시간", "소개"]; // 소셜링
const clubSteps = ["활동선택", "참가비", "주제", "장소", "멤버", "소개"]; // 클럽
const challengeSteps = ["활동선택", "참가비", "주제", "시작종료", "주몇회", "멤버", "소개"]; // 챌린지

// 기본 첫 단계 정의
const steps = ["활동선택"];

const handleReset = () => {
  stateFields.selectedActivity = "";
  stateFields.socialingType = "";
  stateFields.isFee = null;
  stateFields.fee = 0;
  stateFields.feeInfo = [];
  stateFields.subject = "";
  stateFields.category = "";
  stateFields.isOffline = null;
  stateFields.place = {};
  stateFields.maxPeople = "-";
  stateFields.gender = "all";
  stateFields.range = [20, 50];
  stateFields.meetDate = null;
  stateFields.meetTime = { hours: 0, minutes: 0, seconds: 0 };
  stateFields.startDate = null;
  stateFields.endDate = null;
  stateFields.tpw = "-";
  stateFields.title = "";
  stateFields.description = "";
  stateFields.activeIndex = null;

  selectedImage.value = [];
  fileCount.value = 0;
  previewImages.value = [];
};

// Funnel 상태 관리
const { currentStep, nextStep, prevStep, reset, setState, state, updateSteps } = useFunnel(steps, handleReset);

// 선택한 활동 상태 관리
const stateFields = reactive({
  selectedActivity: "",
  socialingType: "",
  isFee: null,
  fee: 0,
  feeInfo: [],
  subject: "",
  category: "",
  isOffline: null,
  place: {},
  maxPeople: "-",
  gender: "all",
  range: [20, 50],
  meetDate: null,
  meetTime: { hours: 0, minutes: 0, seconds: 0 },
  startDate: null,
  endDate: null,
  tpw: "-",
  title: "",
  description: "",
  activeIndex: null,
});

// const private = ref(null);

const fileInput = ref(null);
const selectedImage = ref([]);
const fileCount = ref(0);
const previewImages = ref([]);

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

watch(
  () => state.value,
  () => {
    for (const key in stateFields) {
      if (key in state.value) {
        stateFields[key] = state.value[key];
      }
    }
  },
);

const handleCategoryClick = (subjectName, cate, index) => {
  stateFields.category = cate;
  stateFields.subject = subjectName;

  setState({
    ...state.value,
    category: stateFields.category,
    subject: stateFields.subject,
    activeIndex: stateFields.activeIndex,
  });
};

const getCheckboxImage = (fee) => {
  if (stateFields.feeInfo.includes(fee)) {
    if (stateFields.selectedActivity === "소셜링") {
      return "/src/assets/images/check-active-social.svg";
    } else if (stateFields.selectedActivity === "클럽") {
      return "/src/assets/images/check-active-club.svg";
    } else {
      return "/src/assets/images/check-active-challenge.svg";
    }
  } else {
    return "/src/assets/images/check.svg";
  }
};
//kakaomap emits
const getPlaceInfo = (placeInfo) => {
  stateFields.place = placeInfo;
  setState({ ...state.value, place: stateFields.place });
};

watch(
  () => stateFields.socialingType,
  (newValue) => {
    if (newValue !== "") setState({ ...state.value, socialingType: newValue });
  },
);

watch(
  () => stateFields.isFee,
  (newValue) => {
    if (newValue !== null) setState({ ...state.value, isFee: newValue });
  },
);

watch(
  () => [stateFields.maxPeople, stateFields.gender, stateFields.range],
  ([newMaxPeople, newGender, newRange]) => {
    if (newMaxPeople !== "-") setState({ ...state.value, maxPeople: newMaxPeople, gender: newGender, range: newRange });
  },
);

watch(
  () => [stateFields.meetDate, stateFields.meetTime],
  ([newMeetDate, newMeetTime]) => {
    if (newMeetDate !== null) setState({ ...state.value, meetDate: newMeetDate, meetTime: newMeetTime });
  },
);

watch(
  () => stateFields.startDate,
  (newValue) => {
    if (newValue !== null) setState({ ...state.value, startDate: newValue });
  },
);

watch(
  () => stateFields.endDate,
  (newValue) => {
    if (newValue !== null) setState({ ...state.value, endDate: newValue });
  },
);

watch(
  () => stateFields.tpw,
  (newValue) => {
    if (newValue !== "-") setState({ ...state.value, tpw: newValue });
  },
);

watch(
  () => stateFields.title,
  (newValue) => {
    if (newValue !== "") setState({ ...state.value, title: newValue });
  },
);

watch(
  () => stateFields.description,
  (newValue) => {
    if (newValue !== "") setState({ ...state.value, description: newValue });
  },
);
//나이 슬라이더
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
const processStyle = computed(() => {
  const colors = {
    소셜링: "#F43630",
    클럽: "#1C8A6A",
    챌린지: "#3498D0",
  };
  return {
    backgroundColor: colors[stateFields.selectedActivity] || "#F43630",
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
    backgroundColor: colors[stateFields.selectedActivity] || "#F43630", // 핸들 색상
    borderColor: colors[stateFields.selectedActivity] || "#F43630", // 핸들 테두리 색상
  };
});

//인원 옵션
const options = ["-", 3, 4, 5, 6, 7, 8, 9, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
const tpwOptions = ["-", "주 1회", "주 2회", "주 3회", "주 4회", "주 5회", "주 6회", "매일"];

const filterRange = () => {
  const [start, end] = stateFields.range;

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
  if (stateFields.gender === "all") {
    return "아무나"; // 전체
  } else if (stateFields.gender === "male") {
    return "남자만"; // 남자만
  } else if (stateFields.gender === "female") {
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
    return stateFields.selectedActivity !== ""; // 타입 선택 단계에서는 socialingType이 비어있지 않은지 확인
  } else if (currentStep.value === "타입선택") {
    return stateFields.socialingType !== ""; // 타입 선택 단계에서는 socialingType이 비어있지 않은지 확인
  } else if (currentStep.value === "참가비") {
    if (stateFields.isFee === true) {
      return stateFields.fee > 0 && stateFields.feeInfo.length > 0; // 참가비 입력 및 최소 체크박스 1개 확인
    }
    return stateFields.isFee === false; // 참가비 없음을 선택한 경우 활성화
  } else if (currentStep.value === "주제") {
    return stateFields.category !== ""; // 주제 선택 단계에서는 category 비어있지 않은지 확인
  } else if (currentStep.value === "장소") {
    if (stateFields.isOffline === true) {
      return Object.keys(stateFields.place).length !== 0;
    }
    return stateFields.isOffline === false; // 온라인을 선택한 경우 활성화
  } else if (currentStep.value === "멤버") {
    return stateFields.maxPeople !== "-" && stateFields.gender !== null;
  } else if (currentStep.value === "시간") {
    return stateFields.meetDate !== null && stateFields.meetTime !== null;
  } else if (currentStep.value === "시작종료") {
    return (
      stateFields.startDate !== null && stateFields.endDate !== null && stateFields.startDate < stateFields.endDate
    );
  } else if (currentStep.value === "주몇회") {
    return stateFields.tpw !== "-";
  } else if (currentStep.value === "소개") {
    return selectedImage.value.length > 0 && stateFields.title.length >= 5;
  }
});

// 활동 선택 로직
const selectActivity = (activity) => {
  stateFields.selectedActivity = activity;

  if (activity === "소셜링") {
    setState({ ...state.value, selectedActivity: "소셜링" });
    updateSteps(socialSteps);
  } else if (activity === "클럽") {
    setState({ ...state.value, selectedActivity: "클럽" });
    updateSteps(clubSteps);
  } else if (activity === "챌린지") {
    setState({ ...state.value, selectedActivity: "챌린지" });
    updateSteps(challengeSteps);
  }
};

//fee input change
const handleFeeChange = () => {
  setState({ ...state.value, fee: stateFields.fee });
};

// 체크박스 상태 업데이트
const toggleFeeSelection = (feeType) => {
  if (stateFields.feeInfo.includes(feeType)) {
    stateFields.feeInfo = stateFields.feeInfo.filter((type) => type !== feeType);
  } else {
    stateFields.feeInfo.push(feeType);
  }
  setState({ ...state.value, feeInfo: stateFields.feeInfo });
};

const handleOnlineClick = () => {
  stateFields.place = "온라인";
  stateFields.isOffline = false;
  setState({ ...state.value, place: stateFields.place, isOffline: stateFields.isOffline });
};
const handleOfflineClick = () => {
  if (stateFields.isOffline === false) stateFields.place = {};
  stateFields.isOffline = true;
  setState({ ...state.value, place: stateFields.place, isOffline: stateFields.isOffline });
};

//소개 이미지 선택
const handleFileChange = (event) => {
  const files = event.target.files;
  if (files) {
    fileCount.value += files.length;
    selectedImage.value = [...selectedImage.value, ...Array.from(files)];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      reader.onload = (e) => {
        previewImages.value.push(e.target.result); // 미리보기 URL 배열에 추가
      };
      reader.readAsDataURL(file);
    }
  }
  // else {
  //   selectedImage.value = [];
  // }
  event.target.value = "";
};
//이미지 제거
const removeImage = (index) => {
  previewImages.value.splice(index, 1); // 해당 인덱스의 이미지를 배열에서 제거
  selectedImage.value.splice(index, 1);
  fileCount.value = selectedImage.value.length;
};

// 완료 버튼 액션
const finish = async () => {
  await handlePostSubmit();
  // handleReset();
};

const handlePostSubmit = async () => {
  const imageUrls = [];
  if (selectedImage.value.length > 0) {
    for (let i = 0; i < selectedImage.value.length; i++) {
      const file = selectedImage.value[i];
      const fileName = `${Date.now()}-${file.name}`;

      // 이미지 파일을 Supabase에 업로드
      const { data, error } = await supabase.storage.from("post-images").upload(`images/${fileName}`, file);

      if (error) {
        console.error("Image upload failed:", error.message);
        return; // 오류 발생 시 함수 종료
      }

      // 업로드된 이미지의 public URL 가져오기
      const { data: publicUrlData, error: urlError } = supabase.storage
        .from("post-images")
        .getPublicUrl(`images/${fileName}`);

      if (urlError) {
        console.error("Error getting public URL:", urlError.message);
        return;
      }

      // 이미지 URL 배열에 추가
      imageUrls.push(publicUrlData.publicUrl);
    }
  }

  //post 생성
  const { data: sessionData } = await supabase.auth.getSession();
  const userId = sessionData?.session?.user?.id;

  if (stateFields.selectedActivity === "소셜링") {
    createSocialPost(
      {
        fee: stateFields.fee,
        fee_info: stateFields.feeInfo,
        subject: stateFields.subject,
        category: stateFields.category,
        title: stateFields.title,
        description: stateFields.description,
        images: imageUrls,
        max_people: stateFields.maxPeople,
        age_limit: stateFields.range,
        gender: stateFields.gender,
        place: stateFields.place,
        type: stateFields.socialingType,
        date: stateFields.meetDate,
        time: stateFields.meetTime,
      },
      userId,
    );
  } else if (stateFields.selectedActivity === "클럽") {
    createClubPost(
      {
        fee: stateFields.fee,
        fee_info: stateFields.feeInfo,
        subject: stateFields.subject,
        category: stateFields.category,
        title: stateFields.title,
        description: stateFields.description,
        images: imageUrls,
        max_people: stateFields.maxPeople,
        age_limit: stateFields.range,
        gender: stateFields.gender,
        place: stateFields.place,
      },
      userId,
    );
  } else if (stateFields.selectedActivity === "챌린지") {
    createChallengePost(
      {
        fee: stateFields.fee,
        fee_info: stateFields.feeInfo,
        subject: stateFields.subject,
        category: stateFields.category,
        title: stateFields.title,
        description: stateFields.description,
        images: imageUrls,
        max_people: stateFields.maxPeople,
        start_date: stateFields.startDate,
        end_date: stateFields.endDate,
        times_per_week: stateFields.tpw,
      },
      userId,
    );
  }
  window.alert("포스팅 완료!");
  router.push("/");
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
              :class="{ 'bg-[#F43630] text-white': stateFields.selectedActivity === '소셜링' }"
              @click="selectActivity('소셜링')"
            >
              <div class="px-[27px]">
                <img
                  v-if="stateFields.selectedActivity === '소셜링'"
                  src="@/assets/images/socialing-active.svg"
                  alt=""
                />
                <img v-else src="@/assets/images/Socialing.svg" alt="" />
              </div>
              <div class="flex flex-col text-left">
                <p>소셜링</p>
                <p :class="{ 'text-[#999996]': stateFields.selectedActivity !== '소셜링' }">
                  일회성 모임으로 번개처럼 가볍게 만나요
                </p>
              </div>
            </button>

            <button
              class="border flex items-center w-full h-[80px] rounded-[16px]"
              :class="{ 'bg-[#1C8A6A] text-white': stateFields.selectedActivity === '클럽' }"
              @click="selectActivity('클럽')"
            >
              <div class="px-[27px]">
                <img v-if="stateFields.selectedActivity === '클럽'" src="@/assets/images/club-active.svg" alt="" />
                <img v-else src="@/assets/images/club.svg" alt="" />
              </div>
              <div class="flex flex-col text-left">
                <p>클럽</p>
                <p :class="{ 'text-[#999996]': stateFields.selectedActivity !== '클럽' }">
                  지속형 모임으로 계속해서 친하게 지내요
                </p>
              </div>
            </button>

            <button
              class="border flex items-center w-full h-[80px] rounded-[16px]"
              :class="{ 'bg-[#3498D0] text-white': stateFields.selectedActivity === '챌린지' }"
              @click="selectActivity('챌린지')"
            >
              <div class="px-[27px]">
                <img
                  v-if="stateFields.selectedActivity === '챌린지'"
                  src="@/assets/images/challenge-active.svg"
                  alt=""
                />
                <img v-else src="@/assets/images/challenge.svg" alt="" />
              </div>
              <div class="flex flex-col text-left">
                <p>챌린지</p>
                <p :class="{ 'text-[#999996]': stateFields.selectedActivity !== '챌린지' }">
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
              :class="{ 'bg-[#F43630] text-white': stateFields.socialingType === '일반' }"
              @click="stateFields.socialingType = '일반'"
            >
              <div class="px-[27px]">
                <img v-if="stateFields.socialingType === '일반'" src="@/assets/images/socialing-active.svg" alt="" />
                <img v-else src="@/assets/images/Socialing.svg" alt="" />
              </div>
              <div class="flex flex-col text-left">
                <p>일반 소셜링</p>
                <p :class="{ 'text-[#999996]': stateFields.socialingType !== '일반' }">
                  누구나 자유롭게 참여할 수 있는 소셜링을 열어요
                </p>
              </div>
            </button>
            <button
              class="border flex items-center w-full h-[80px] rounded-[16px]"
              :class="{ 'bg-[#F43630] text-white': stateFields.socialingType === '클럽' }"
              @click="stateFields.socialingType = '클럽'"
            >
              <div class="px-[27px]">
                <img
                  v-if="stateFields.socialingType === '클럽'"
                  src="@/assets/images/club-socialing-active.svg"
                  alt=""
                />
                <img v-else src="@/assets/images/club-socialing.svg" alt="" />
              </div>
              <div class="flex flex-col text-left">
                <p>클럽 소셜링</p>
                <p :class="{ 'text-[#999996]': stateFields.socialingType !== '클럽' }">
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
                'bg-[#F43630] text-white': stateFields.isFee === true && stateFields.selectedActivity === '소셜링',
                'bg-[#1C8A6A] text-white': stateFields.isFee === true && stateFields.selectedActivity === '클럽',
                'bg-[#3498D0] text-white': stateFields.isFee === true && stateFields.selectedActivity === '챌린지',
              }"
              @click="stateFields.isFee = true"
            >
              <p>있음</p>
            </button>

            <button
              class="border flex items-center w-[50%] h-[60px] rounded-[16px] justify-center"
              :class="{
                'bg-[#F43630] text-white': stateFields.isFee === false && stateFields.selectedActivity === '소셜링',
                'bg-[#1C8A6A] text-white': stateFields.isFee === false && stateFields.selectedActivity === '클럽',
                'bg-[#3498D0] text-white': stateFields.isFee === false && stateFields.selectedActivity === '챌린지',
              }"
              @click="stateFields.isFee = false"
            >
              <p>없음</p>
            </button>
          </div>

          <div v-if="stateFields.isFee" class="flex flex-col mt-[35px]">
            <label for="fee" class="mb-[15px]">참가비</label>
            <input
              v-model="stateFields.fee"
              type="number"
              id="fee"
              class="h-[50px] border border-[#999996] rounded-[16px] px-3"
              @input="handleFeeChange"
            />

            <div class="mt-[50px]">
              <p>참가비 정보</p>
              <div class="my-[35px]">
                <p>운영비</p>
                <div class="flex gap-[15px]">
                  <div>
                    <input
                      type="checkbox"
                      id="contentFee"
                      class="appearance-none"
                      :checked="stateFields.feeInfo.includes('contentFee')"
                      @change="toggleFeeSelection('contentFee')"
                    />
                    <label for="contentFee" class="flex">
                      <img :src="getCheckboxImage('contentFee')" alt="content fee" />
                      <span class="ml-[13px]">콘텐츠 제작비</span></label
                    >
                  </div>
                  <div>
                    <input
                      type="checkbox"
                      id="hostFee"
                      class="appearance-none"
                      :checked="stateFields.feeInfo.includes('hostFee')"
                      @change="toggleFeeSelection('hostFee')"
                    />
                    <label for="hostFee" class="flex">
                      <img :src="getCheckboxImage('hostFee')" alt="host fee" />
                      <span class="ml-[13px]">호스트 수고비</span></label
                    >
                  </div>
                </div>
              </div>

              <div class="mt-2">
                <p>모임비</p>
                <div class="flex gap-[15px]">
                  <div>
                    <input
                      type="checkbox"
                      id="noshowFee"
                      class="appearance-none"
                      :checked="stateFields.feeInfo.includes('noshowFee')"
                      @change="toggleFeeSelection('noshowFee')"
                    />
                    <label for="noshowFee" class="flex">
                      <img :src="getCheckboxImage('noshowFee')" alt="noshow fee" />
                      <span class="ml-[13px]">노쇼 방지비</span></label
                    >
                  </div>

                  <div>
                    <input
                      type="checkbox"
                      id="rentalFee"
                      class="appearance-none"
                      :checked="stateFields.feeInfo.includes('rentalFee')"
                      @change="toggleFeeSelection('rentalFee')"
                    />
                    <label for="rentalFee" class="flex">
                      <img :src="getCheckboxImage('rentalFee')" alt="rental fee" />
                      <span class="ml-[13px]">대관료</span></label
                    >
                  </div>

                  <div>
                    <input
                      type="checkbox"
                      id="materialFee"
                      class="appearance-none"
                      :checked="stateFields.feeInfo.includes('materialFee')"
                      @change="toggleFeeSelection('materialFee')"
                    />
                    <label for="materialFee" class="flex">
                      <img :src="getCheckboxImage('materialFee')" alt="material fee" />
                      <span class="ml-[13px]">재료비</span></label
                    >
                  </div>

                  <div>
                    <input
                      type="checkbox"
                      id="dessertFee"
                      class="appearance-none"
                      :checked="stateFields.feeInfo.includes('dessertFee')"
                      @change="toggleFeeSelection('dessertFee')"
                    />
                    <label for="dessertFee" class="flex">
                      <img :src="getCheckboxImage('dessertFee')" alt="dessert fee" />
                      <span class="ml-[13px]">다과비</span></label
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>

      <!-- 주제 선택 단계 -->
      <template #주제>
        <div>
          <h2 class="text-[30px] mb-[43px]">{{ stateFields.selectedActivity }} 주제를 선택해볼까요?</h2>
          <div
            v-for="(subject, index) in categoryList"
            class="border p-[15px] rounded-[16px] mb-[15px]"
            :class="stateFields.activeIndex === index ? 'bg-[#f9f9f9]' : 'h-[80px]'"
            @click="
              stateFields.activeIndex === index ? (stateFields.activeIndex = null) : (stateFields.activeIndex = index)
            "
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
                <img v-if="stateFields.activeIndex === index" src="@/assets/images/arrow-up-circle.svg" alt="" />
                <img v-else src="@/assets/images/arrow-down-circle.svg" alt="" />
              </div>
            </div>
            <div v-if="stateFields.activeIndex === index" class="grid grid-cols-5 gap-[15px]">
              <div
                v-for="(cate, subindex) in subject.list"
                class="flex justify-center items-center w-[96px] h-[47px] rounded-[16px] text-[13px]"
                :class="{
                  'bg-[#F43630] text-white': stateFields.selectedActivity === '소셜링' && stateFields.category === cate,
                  'bg-[#1C8A6A] text-white': stateFields.selectedActivity === '클럽' && stateFields.category === cate,
                  'bg-[#3498D0] text-white': stateFields.selectedActivity === '챌린지' && stateFields.category === cate,
                  'border border-[#999996] text-[#666666]': stateFields.category !== cate,
                }"
                @click.stop="handleCategoryClick(subject.name, cate, index)"
                :key="subindex"
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
                'bg-[#F43630] text-white': stateFields.isOffline === true && stateFields.selectedActivity === '소셜링',
                'bg-[#1C8A6A] text-white': stateFields.isOffline === true && stateFields.selectedActivity === '클럽',
                'bg-[#3498D0] text-white': stateFields.isOffline === true && stateFields.selectedActivity === '챌린지',
              }"
              @click="handleOfflineClick"
            >
              <p>오프라인</p>
            </button>

            <button
              class="border flex items-center w-[50%] h-[60px] rounded-[16px] justify-center"
              :class="{
                'bg-[#F43630] text-white': stateFields.isOffline === false && stateFields.selectedActivity === '소셜링',
                'bg-[#1C8A6A] text-white': stateFields.isOffline === false && stateFields.selectedActivity === '클럽',
                'bg-[#3498D0] text-white': stateFields.isOffline === false && stateFields.selectedActivity === '챌린지',
              }"
              @click="handleOnlineClick"
            >
              <p>온라인</p>
            </button>
          </div>
          <div v-if="stateFields.isOffline">
            <KakaoMap @get-place="getPlaceInfo" :selected-place="stateFields.place" />
          </div>
        </div>
      </template>

      <!-- 멤버 선택 단계 -->
      <template #멤버>
        <div>
          <h2 class="text-[30px] mb-[43px]">어떻게 멤버를 모을까요?</h2>
          <div class="flex justify-between mb-[15px]">
            <p>신청 방식</p>
            <p>선착순</p>
          </div>
          <div>
            <div class="flex justify-between">
              <p>참여 인원</p>
              <p>최대 {{ stateFields.maxPeople }}명</p>
            </div>
            <VueScrollPicker
              v-model="stateFields.maxPeople"
              :options="options"
              :class="`number-picker number-picker-${stateFields.selectedActivity}`"
            />
          </div>
          <div class="mb-[40px]">
            <div class="flex justify-between mb-[15px]">
              <p>성별</p>
              <p>{{ convertGender() }}</p>
            </div>
            <div class="flex gap-[20px]">
              <button
                class="border flex items-center w-[34%] h-[60px] rounded-[16px] justify-center"
                :class="{
                  'bg-[#F43630] text-white': stateFields.gender === 'all' && stateFields.selectedActivity === '소셜링',
                  'bg-[#1C8A6A] text-white': stateFields.gender === 'all' && stateFields.selectedActivity === '클럽',
                  'bg-[#3498D0] text-white': stateFields.gender === 'all' && stateFields.selectedActivity === '챌린지',
                }"
                @click="stateFields.gender = 'all'"
              >
                <p>아무나</p>
              </button>

              <button
                class="border flex items-center w-[34%] h-[60px] rounded-[16px] justify-center"
                :class="{
                  'bg-[#F43630] text-white': stateFields.gender === 'male' && stateFields.selectedActivity === '소셜링',
                  'bg-[#1C8A6A] text-white': stateFields.gender === 'male' && stateFields.selectedActivity === '클럽',
                  'bg-[#3498D0] text-white': stateFields.gender === 'male' && stateFields.selectedActivity === '챌린지',
                }"
                @click="stateFields.gender = 'male'"
              >
                <p>남자만</p>
              </button>
              <button
                class="border flex items-center w-[34%] h-[60px] rounded-[16px] justify-center"
                :class="{
                  'bg-[#F43630] text-white':
                    stateFields.gender === 'female' && stateFields.selectedActivity === '소셜링',
                  'bg-[#1C8A6A] text-white': stateFields.gender === 'female' && stateFields.selectedActivity === '클럽',
                  'bg-[#3498D0] text-white':
                    stateFields.gender === 'female' && stateFields.selectedActivity === '챌린지',
                }"
                @click="stateFields.gender = 'female'"
              >
                <p>여자만</p>
              </button>
            </div>
          </div>
          <div>
            <div class="flex justify-between mb-[15px]">
              <p>나이</p>
              <p>{{ filterRange() }}</p>
            </div>
            <vue-slider
              v-model="stateFields.range"
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
                v-model="stateFields.meetDate"
                :min-date="new Date().toLocaleDateString('ko-KR')"
                :enable-time-picker="false"
                :format="format"
                locale="ko"
                :inline="{ input: true }"
                auto-apply
                class="datepicker-input"
                :class="`datepicker-${stateFields.selectedActivity}`"
              />
            </div>
            <div>
              <VueDatePicker
                v-model="stateFields.meetTime"
                :enable-time-picker="true"
                :enable-date-picker="false"
                :time-picker="true"
                :inline="{ input: true }"
                auto-apply
                :class="`timepicker-input timepicker-input-${stateFields.selectedActivity}`"
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
                  v-model="stateFields.startDate"
                  :min-date="new Date().toLocaleDateString('ko-KR')"
                  :enable-time-picker="false"
                  :format="format"
                  locale="ko"
                  :inline="{ input: true }"
                  auto-apply
                  class="datepicker-input"
                  :class="`datepicker-${stateFields.selectedActivity}`"
                />
              </div>
              <div>
                <h2>종료 날짜</h2>
                <VueDatePicker
                  v-model="stateFields.endDate"
                  :min-date="new Date().toLocaleDateString('ko-KR')"
                  :enable-time-picker="false"
                  :format="format"
                  locale="ko"
                  :inline="{ input: true }"
                  auto-apply
                  class="datepicker-input"
                  :class="`datepicker-${stateFields.selectedActivity}`"
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
          <VueScrollPicker v-model="stateFields.tpw" :options="tpwOptions" />
        </div>
      </template>

      <!-- 소개 단계 -->
      <template #소개>
        <div>
          <h2 v-if="['소셜링', '클럽'].includes(stateFields.selectedActivity)" class="text-[30px] mb-[43px]">
            {{ stateFields.selectedActivity }}을 소개해볼까요?
          </h2>
          <h2 v-else class="text-[30px] mb-[43px]">{{ stateFields.selectedActivity }}를 소개해볼까요?</h2>
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
                  multiple
                  @change="handleFileChange"
                />
                <div class="text-sm text-gray-500">{{ fileCount }}/10</div>
              </div>
              <div v-if="previewImages.length > 0" class="flex gap-2 relative">
                <div v-for="(image, index) in previewImages" :key="index" class="relative">
                  <!-- 미리보기 이미지 -->
                  <img :src="image" alt="Preview-image" class="w-32 h-32 rounded-lg object-cover" />
                  <!-- 삭제 버튼 -->
                  <img
                    src="@/assets/images/delete.svg"
                    alt="delete"
                    class="absolute top-2 right-2 opacity-50 cursor-pointer"
                    @click="removeImage(index)"
                  />
                </div>
              </div>
            </div>
            <input
              v-model="stateFields.title"
              type="text"
              class="border border-[#999996] h-[50px] rounded-[16px] px-3"
              placeholder="제목을 입력해 주세요.(최소 5글자)"
            />
            <textarea
              v-model="stateFields.description"
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
        'bg-[#F43630]': stateFields.selectedActivity === '소셜링',
        'bg-[#1C8A6A]': stateFields.selectedActivity === '클럽',
        'bg-[#3498D0]': stateFields.selectedActivity === '챌린지',
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
        'bg-[#F43630]': stateFields.selectedActivity === '소셜링',
        'bg-[#1C8A6A]': stateFields.selectedActivity === '클럽',
        'bg-[#3498D0]': stateFields.selectedActivity === '챌린지',
      }"
      :disabled="!isNextEnabled"
      @click="nextStep"
    >
      다음
    </button>
  </div>
</template>
<style src="vue-scroll-picker/lib/style.css"></style>
