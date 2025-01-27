import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";

export function useFunnel(initialSteps, handleReset) {
  const router = useRouter();
  const route = useRoute();

  const steps = ref(initialSteps); // 단계 배열
  const currentStepIndex = ref(0); // 현재 단계 인덱스
  const state = ref({}); // 추가 상태

  const currentStep = computed(() => steps.value[currentStepIndex.value]); // 현재 단계

  const setState = (updater) => {
    state.value = typeof updater === "function" ? updater(state.value) : updater;
  };

  //모달
  const modalType = ref("");
  const isModalOpen = ref(false);
  const modalMessage = ref("");
  const buttonMessage = ref("");
  const openModal = (type) => {
    modalType.value = type;
    if (type === "save") {
      buttonMessage.value = "다음에 열기";
      modalMessage.value = `<b style='font-size: 22px; color: #000;'>${state.value.selectedActivity} 다음에 여시겠습니까?</b><br/><b style='font-size: 16px; color: #666;'>작성한 정보는 임시 저장돼요.</b>`;
    } else if (type === "load") {
      buttonMessage.value = "불러오기";
      modalMessage.value = `<b style='font-size: 22px; color: #000;'>임시 저장된 ${state.value.selectedActivity} 정보를 불러올까요?</b>`;
    }
    isModalOpen.value = true;
  };
  const closeModal = () => {
    isModalOpen.value = false;
  };
  const handleConfirm = () => {
    if (modalType.value === "save") {
      // 데이터 저장
      localStorage.setItem(`${state.value.selectedActivity}`, JSON.stringify(state.value));
      handleReset();
      reset();
    } else if (modalType.value === "load") {
      // 데이터 불러오기
      const savedData = localStorage.getItem(`${state.value.selectedActivity}`);
      if (savedData) {
        console.log("불러온 데이터:", JSON.parse(savedData));
        setState(JSON.parse(savedData));
      }
    }
    isModalOpen.value = false;
  };

  const nextStep = () => {
    if (currentStepIndex.value === 0 && route.path === "/write") {
      if (localStorage.getItem(`${state.value.selectedActivity}`)) {
        openModal("load");
      }
    }
    if (currentStepIndex.value < steps.value.length - 1) {
      currentStepIndex.value++;
    }
  };

  const prevStep = () => {
    if (currentStepIndex.value === 0) {
      router.go(-1);
    } else if (currentStepIndex.value === 1 && route.path === "/write") {
      openModal("save");
    } else {
      currentStepIndex.value--;
    }
  };

  const reset = () => {
    currentStepIndex.value = 0;
    steps.value = initialSteps; // 초기 단계로 복원
    state.value = {}; // 상태 초기화
  };

  const updateSteps = (newSteps) => {
    steps.value = newSteps;
    currentStepIndex.value = 0; // 새 단계 배열로 초기화
  };

  return {
    currentStep,
    state,
    setState,
    nextStep,
    prevStep,
    reset,
    updateSteps,
    isModalOpen,
    openModal,
    closeModal,
    handleConfirm,
    modalMessage,
    buttonMessage,
  };
}
