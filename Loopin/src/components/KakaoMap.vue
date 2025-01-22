<script setup>
import { onMounted, ref, defineEmits } from "vue";

const emits = defineEmits(["getPlace"]);

const isModalOpen = ref(false);

const keyword = ref(""); // 키워드 입력 상태
const places = ref([]); // 장소 검색 결과
const pagination = ref({ last: 0, current: 0 }); // 페이지네이션 정보
let ps = null; // 카카오 지도 검색 객체 (초기화 필요)

const selectedPlace = ref({});

// 장소 검색 함수
const searchPlaces = () => {
  if (!keyword.value.trim()) {
    alert("키워드를 입력해주세요!");
    return;
  }

  // 카카오 API를 사용해 장소 검색
  ps.keywordSearch(keyword.value, placesSearchCB);
};

// 장소 검색 콜백 함수
const placesSearchCB = (data, status, paginationObj) => {
  if (status === window.kakao.maps.services.Status.OK) {
    places.value = data; // 검색 결과 저장
    pagination.value = {
      last: paginationObj.last,
      current: paginationObj.current,
      gotoPage: paginationObj.gotoPage,
    };
  } else if (status === window.kakao.maps.services.Status.ZERO_RESULT) {
    alert("검색 결과가 존재하지 않습니다.");
  } else if (status === window.kakao.maps.services.Status.ERROR) {
    alert("검색 중 오류가 발생했습니다.");
  }
};

// 페이지 이동 함수
const goToPage = (page) => {
  pagination.value.gotoPage(page);
};

const handlePlaceClick = (place) => {
  emits("getPlace", place);
  selectedPlace.value = place;
  isModalOpen.value = false;
};

// 컴포넌트가 마운트되었을 때 카카오 API 초기화
onMounted(() => {
  if (window.kakao && window.kakao.maps) {
    ps = new window.kakao.maps.services.Places();
  } else {
    alert("카카오 지도 API가 로드되지 않았습니다.");
  }
});
</script>

<template>
  <div class="mt-[15px]">
    <button class="flex items-center w-full border-b text-left py-3" @click="isModalOpen = true">
      <img src="@/assets/images/location.svg" alt="location" class="mr-2" />
      <span v-if="Object.keys(selectedPlace).length === 0">장소를 입력해 주세요.</span>
      <span else>{{ selectedPlace.place_name }}</span>
      <img
        v-if="Object.keys(selectedPlace).length !== 0"
        src="@/assets/images/delete.svg"
        class="opacity-40 absolute right-5"
        alt="delete"
        @click.stop="selectedPlace = {}"
      />
    </button>
  </div>
  <!-- 모달 -->
  <div
    v-if="isModalOpen"
    class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-end z-50"
    @click="isModalOpen = false"
  >
    <div
      class="p-4 bg-white border-t rounded-t-3xl w-[600px] h-[500px] overflow-auto container transform transition-transform duration-300"
      :class="{ 'translate-y-0': isModalOpen, 'translate-y-full': !isModalOpen }"
      @click.stop
    >
      <!-- 헤더 -->
      <div class="flex flex-col items-center bg-white mb-4">
        <div class="flex items-center mb-4">
          <h2 class="text-lg font-bold">장소 선택</h2>
          <button @click="isModalOpen = false" class="absolute right-4 text-2xl">&times;</button>
        </div>
        <input
          type="text"
          v-model="keyword"
          @keyup.enter="searchPlaces"
          placeholder="어디에서 만나나요?"
          class="w-full border border-[#999996] h-[40px] rounded-[16px] px-3"
        />
      </div>

      <!-- 리스트 -->
      <div class="location-list-wrap h-[365px] overflow-y-auto">
        <ul id="placesList" class="divide-y">
          <li v-for="(place, index) in places" :key="index">
            <div class="info py-2" @click="handlePlaceClick(place)">
              <p class="font-bold">{{ place.place_name }}</p>
              <span class="text-[#999996]" v-if="place.road_address_name">{{ place.road_address_name }}</span>
              <span class="text-[#999996]" v-else>{{ place.address_name }}</span>
            </div>
          </li>
        </ul>
        <div id="pagination">
          <a
            v-for="page in Array.from({ length: pagination.last }, (_, i) => i + 1)"
            :key="page"
            href="#"
            :class="{ on: page === pagination.current }"
            @click.prevent="goToPage(page)"
          >
            {{ page }}
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped></style>
