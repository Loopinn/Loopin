import { ref, computed } from "vue";
import { useRouter } from "vue-router";

export function useFunnel(initialSteps, handleReset) {
  const router = useRouter();

  const steps = ref(initialSteps); // 단계 배열
  const currentStepIndex = ref(0); // 현재 단계 인덱스
  const state = ref({}); // 추가 상태

  const currentStep = computed(() => steps.value[currentStepIndex.value]); // 현재 단계

  const setState = (updater) => {
    state.value = typeof updater === "function" ? updater(state.value) : updater;
  };

  const nextStep = () => {
    if (currentStepIndex.value < steps.value.length - 1) {
      currentStepIndex.value++;
    }
  };

  const prevStep = () => {
    if (currentStepIndex.value === 0) {
      router.go(-1);
    } else if (currentStepIndex.value === 1) {
      if (state.value.selectedActivity === "소셜링") {
        console.log(state.value);
        const confirm = window.confirm("소셜링을 다음에 여시겠어요?");
        if (confirm) {
          localStorage.setItem(`${state.value.selectedActivity}`, JSON.stringify(state.value));
          handleReset();
          console.log(state.value);
          reset();
        }
      } else if (state.value.selectedActivity === "클럽") {
        const confirm = window.confirm("클럽을 다음에 여시겠어요?");
        if (confirm) {
          localStorage.setItem(`${state.value.selectedActivity}`, JSON.stringify(state.value));
          handleReset();
          console.log(state.value);
          reset();
        }
      } else if (state.value.selectedActivity === "챌린지") {
        const confirm = window.confirm("챌린지를 다음에 여시겠어요?");
        if (confirm) {
          localStorage.setItem(`${state.value.selectedActivity}`, JSON.stringify(state.value));
          handleReset();
          console.log(state.value);
          reset();
        }
      }
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
  };
}
